import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { CaregiverRecord, UserProfile, UserRole } from '@/types';

interface AuthContextValue {
  user: SupabaseUser | null;
  profile: UserProfile | null;
  caregiver: CaregiverRecord | null;
  loading: boolean;
  profileLoading: boolean;
  profileError: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [caregiver, setCaregiver] = useState<CaregiverRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const fetchIdRef = useRef(0);
  const currentAuthUserIdRef = useRef<string | null>(null);

  const fetchProfile = useCallback(async (authUserId: string) => {
    const currentFetchId = ++fetchIdRef.current;
    setProfileLoading(true);
    setProfileError(null);

    try {
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('id, auth_user_id, display_name, locale, role')
        .eq('auth_user_id', authUserId)
        .is('deleted_at', null)
        .maybeSingle();

      if (fetchIdRef.current !== currentFetchId) return;

      if (profileErr) {
        setProfile(null);
        setCaregiver(null);
        setProfileError(profileErr.message);
        setProfileLoading(false);
        return;
      }

      if (!profileData) {
        setProfile(null);
        setCaregiver(null);
        setProfileError('Caregiver profile not found.');
        setProfileLoading(false);
        return;
      }

      const resolvedProfile: UserProfile = {
        id: profileData.id,
        authUserId: profileData.auth_user_id,
        displayName: profileData.display_name || 'Caregiver',
        locale: profileData.locale,
        role: (profileData.role as UserRole) || 'caregiver',
      };

      setProfile(resolvedProfile);

      const { data: caregiverData, error: caregiverErr } = await supabase
        .from('caregivers')
        .select('id, profile_id')
        .eq('profile_id', profileData.id)
        .is('deleted_at', null)
        .maybeSingle();

      if (fetchIdRef.current !== currentFetchId) return;

      if (caregiverErr) {
        console.warn('Caregiver record lookup error:', caregiverErr.message);
      }

      setCaregiver(
        caregiverData
          ? {
              id: caregiverData.id,
              profileId: caregiverData.profile_id,
            }
          : null
      );
      setProfileLoading(false);
    } catch (err: unknown) {
      if (fetchIdRef.current !== currentFetchId) return;
      const message = err instanceof Error ? err.message : 'Unknown profile error';
      setProfile(null);
      setCaregiver(null);
      setProfileError(message);
      setProfileLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [fetchProfile, user]);

  useEffect(() => {
    let mounted = true;

    const handleSessionUser = async (sessionUser: SupabaseUser | null) => {
      if (!mounted) return;
      setUser(sessionUser);
      setLoading(false);

      const nextUserId = sessionUser?.id ?? null;
      if (!nextUserId) {
        currentAuthUserIdRef.current = null;
        fetchIdRef.current++;
        setProfile(null);
        setCaregiver(null);
        setProfileLoading(false);
        setProfileError(null);
        return;
      }

      if (currentAuthUserIdRef.current === nextUserId) {
        return;
      }

      currentAuthUserIdRef.current = nextUserId;
      await fetchProfile(nextUserId);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      handleSessionUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session: Session | null) => {
      if (!mounted) return;
      handleSessionUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    currentAuthUserIdRef.current = null;
    fetchIdRef.current++;
    setProfile(null);
    setCaregiver(null);
    setProfileLoading(false);
    setProfileError(null);
    const { error } = await supabase.auth.signOut();
    return { error: error?.message ?? null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        caregiver,
        loading,
        profileLoading,
        profileError,
        signIn,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}