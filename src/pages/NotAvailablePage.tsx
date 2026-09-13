import { Link, useNavigate } from 'react-router-dom';
import { Brain, LogOut, ShieldAlert, ShieldCheck, Stethoscope, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';

interface NotAvailablePageProps {
  targetRole?: UserRole;
}

interface RoleCardInfo {
  title: string;
  badge: string;
  badgeClasses: string;
  description: string;
  icon: typeof User;
}

const roleCardConfig: Record<UserRole, RoleCardInfo> = {
  patient: {
    title: 'Patient Portal Under Development',
    badge: 'Patient Account',
    badgeClasses: 'bg-amber-100 text-amber-800 border-amber-200',
    description:
      'You are signed in with a Patient account. The patient cognitive gaming and memory assistance experience is currently under development for mobile and tablet devices. The current web portal is reserved exclusively for caregivers.',
    icon: User,
  },
  healthcare_worker: {
    title: 'Healthcare Worker Portal Under Development',
    badge: 'Healthcare Worker',
    badgeClasses: 'bg-teal-100 text-teal-800 border-teal-200',
    description:
      'You are signed in with a Healthcare Worker account. The clinical dashboard, cross-patient monitoring, and care coordination tools are currently under development. The current web portal is reserved exclusively for caregivers.',
    icon: Stethoscope,
  },
  admin: {
    title: 'Admin Portal Under Development',
    badge: 'Administrator',
    badgeClasses: 'bg-purple-100 text-purple-800 border-purple-200',
    description:
      'You are signed in with an Administrator account. System-wide management and administrative configuration tools are currently under development. The current web portal is reserved exclusively for caregivers.',
    icon: ShieldCheck,
  },
  caregiver: {
    title: 'Caregiver Portal',
    badge: 'Caregiver Account',
    badgeClasses: 'bg-blue-100 text-blue-800 border-blue-200',
    description:
      'You are signed in as an authorized caregiver. You have full access to the caregiver dashboard, patient circle, and memory assistance features.',
    icon: User,
  },
};

export function NotAvailablePage({ targetRole }: NotAvailablePageProps) {
  const navigate = useNavigate();
  const { user, profile, role, signOut } = useAuth();

  const effectiveRole = targetRole || role;
  const config = (effectiveRole && roleCardConfig[effectiveRole]) || {
    title: 'Access Restricted',
    badge: 'Restricted Access',
    badgeClasses: 'bg-slate-100 text-slate-800 border-slate-200',
    description:
      'Your account does not have access to the caregiver portal. The current web application is reserved for authorized caregivers.',
    icon: ShieldAlert,
  };

  const Icon = config.icon;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-sm">
            <Brain className="h-6 w-6 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">NeuroNERd</h1>
          <p className="mt-1 text-sm text-slate-500">Cognitive & Memory Assistance Platform</p>
        </div>

        <div className="card overflow-hidden p-6 sm:p-8">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-700">
              <Icon className="h-7 w-7" aria-hidden="true" />
            </div>

            <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${config.badgeClasses}`}>
              {config.badge}
            </span>

            <h2 className="mt-3 text-xl font-bold text-slate-900">{config.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{config.description}</p>
          </div>

          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
            <p className="font-semibold text-slate-700">Account Details</p>
            <div className="mt-2 flex flex-col gap-1">
              <p>
                <span className="text-slate-400">Email: </span>
                <span className="font-medium text-slate-800">{user?.email || 'N/A'}</span>
              </p>
              {profile?.displayName && (
                <p>
                  <span className="text-slate-400">Name: </span>
                  <span className="font-medium text-slate-800">{profile.displayName}</span>
                </p>
              )}
              <p>
                <span className="text-slate-400">Assigned Role: </span>
                <span className="font-medium capitalize text-slate-800">
                  {role ? role.replace('_', ' ') : 'None'}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            {role === 'caregiver' ? (
              <Link to="/dashboard" className="btn-primary flex-1 text-center">
                Go to Caregiver Dashboard
              </Link>
            ) : null}
            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
