export type UserRole = 'caregiver' | 'healthcare_worker' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface UserProfile {
  id: string;
  authUserId: string;
  displayName: string;
  locale: string | null;
  role: UserRole;
}

export interface CaregiverRecord {
  id: string;
  profileId: string;
}

export type PatientStatus = 'stable' | 'needs_attention' | 'critical';

export interface Patient {
  id: string;
  name: string;
  age?: number;
  photoUrl?: string;
  status: PatientStatus;
  caregiverId?: string;
  caregiverName?: string;
  healthcareWorkerId?: string;
  healthcareWorkerName?: string;
  lastActiveAt?: string;
  preferredLanguage?: string;
  notes?: string;
}

export type ActivityType = 'memory_game' | 'puzzle' | 'trivia' | 'recall' | 'breathing' | 'memory_match' | 'object_recall' | 'pattern_sequence';

export interface GameSession {
  id: string;
  patientId: string;
  gameType: ActivityType;
  gameName: string;
  score: number;
  accuracy: number;
  durationMinutes: number;
  completedAt: string;
  attempts: number;
  completed: boolean;
}

export type ReminderType = 'medication' | 'hydration' | 'daily_activity' | 'appointment' | 'custom';

export interface Reminder {
  id: string;
  patientId: string;
  type: ReminderType;
  title: string;
  description?: string;
  scheduledFor: string;
  completed: boolean;
  enabled: boolean;
}

export type MemoryCategory = 'person' | 'place' | 'object' | 'memory' | 'routine';

export interface MemoryEntry {
  id: string;
  patientId: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: MemoryCategory;
  context?: string;
  recordedAt: string;
  lastReviewedAt?: string;
  active: boolean;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export type AlertType = 'missed_reminder' | 'unusual_inactivity' | 'failed_sync' | 'incomplete_session' | 'system_notification';

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  action?: {
    label: string;
    href: string;
  };
}

export interface DailyActivity {
  date: string;
  label: string;
  sessions: number;
  completionRate: number;
  avgAccuracy: number;
  avgDurationMinutes: number;
}
