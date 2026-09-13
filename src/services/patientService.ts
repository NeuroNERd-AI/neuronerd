import type { Patient } from '@/types';
import { supabase } from '@/lib/supabase';

interface PatientProfileRow {
  id: string;
  display_name: string | null;
  locale: string | null;
  deleted_at: string | null;
}

interface RelationshipRow {
  caregiver_id: string;
  patient_id: string;
  is_active: boolean;
}

interface PatientRow {
  id: string;
  profile_id: string;
  care_level_preference: string | null;
  risk_notes: string | null;
  deleted_at: string | null;
  profile: PatientProfileRow | null;
}

export interface PatientServiceResult<T> {
  data: T;
  error: string | null;
}

function mapPatient(row: PatientRow, caregiverId: string): Patient {
  return {
    id: row.id,
    name: row.profile?.display_name || 'Unnamed patient',
    status: 'stable',
    caregiverId,
    preferredLanguage: row.profile?.locale ?? undefined,
    notes: row.risk_notes ?? undefined,
  };
}

async function queryPatients(patientId?: string): Promise<PatientServiceResult<Patient[]>> {
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) return { data: [], error: authError.message };
  if (!authData.user) return { data: [], error: 'You must be signed in to access patients.' };

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('auth_user_id', authData.user.id)
    .is('deleted_at', null)
    .maybeSingle();
  if (profileError) return { data: [], error: `Profile lookup failed: ${profileError.message}` };
  if (!profile) return { data: [], error: 'Your caregiver profile could not be found.' };

  const { data: caregiver, error: caregiverError } = await supabase
    .from('caregivers')
    .select('id')
    .eq('profile_id', profile.id)
    .is('deleted_at', null)
    .maybeSingle();
  if (caregiverError) return { data: [], error: `Caregiver lookup failed: ${caregiverError.message}` };
  if (!caregiver) return { data: [], error: 'Your caregiver record could not be found.' };

  let relationshipQuery = supabase
    .from('caregiver_patient_relationships')
    .select('caregiver_id, patient_id, is_active')
    .eq('caregiver_id', caregiver.id)
    .eq('is_active', true);

  if (patientId) relationshipQuery = relationshipQuery.eq('patient_id', patientId);

  const { data: relationships, error: relationshipError } = await relationshipQuery;
  if (relationshipError) return { data: [], error: `Relationship lookup failed: ${relationshipError.message}` };

  const relationshipRows = relationships as RelationshipRow[];
  const patientIds = relationshipRows.map((relationship) => relationship.patient_id);
  if (patientIds.length === 0) return { data: [], error: null };

  const { data, error } = await supabase
    .from('patients')
    .select('id, profile_id, care_level_preference, risk_notes, deleted_at, profile:profiles!inner(id, display_name, locale, deleted_at)')
    .is('deleted_at', null)
    .is('profile.deleted_at', null)
    .in('id', patientIds);
  if (error) return { data: [], error: `Patient lookup failed: ${error.message}` };

  return { data: (data as unknown as PatientRow[]).map((row) => mapPatient(row, caregiver.id)), error: null };
}

export function getPatients(): Promise<PatientServiceResult<Patient[]>> {
  return queryPatients();
}

export async function getPatientById(patientId: string): Promise<PatientServiceResult<Patient | null>> {
  const result = await queryPatients(patientId);
  return { data: result.data[0] ?? null, error: result.error };
}