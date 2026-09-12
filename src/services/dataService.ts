import type {
  Alert,
  DailyActivity,
  GameSession,
  MemoryEntry,
  Patient,
  Reminder,
} from '@/types';
import {
  mockAlerts,
  mockDailyActivity,
  mockGameSessions,
  mockMemories,
  mockPatients,
  mockReminders,
} from '@/data/mockData';

export function getPatients(): Patient[] {
  return mockPatients;
}

export function getPatientById(id: string): Patient | undefined {
  return mockPatients.find((p) => p.id === id);
}

export function getGameSessionsByPatient(patientId: string): GameSession[] {
  return mockGameSessions.filter((s) => s.patientId === patientId);
}

export function getRemindersByPatient(patientId: string): Reminder[] {
  return mockReminders.filter((r) => r.patientId === patientId);
}

export function getMemoriesByPatient(patientId: string): MemoryEntry[] {
  return mockMemories.filter((m) => m.patientId === patientId);
}

export function getAlerts(): Alert[] {
  return mockAlerts;
}

export function getPatientsNeedingAttention(): Patient[] {
  return mockPatients.filter((patient) => patient.status !== 'stable');
}

export function getTodayGameSessions(): GameSession[] {
  return mockGameSessions.filter((session) => session.completedAt.startsWith('2026-09-08'));
}

export function getTodayReminders(): Reminder[] {
  return mockReminders.filter((reminder) => reminder.scheduledFor.startsWith('2026-09-08'));
}

export function getDailyActivity(): DailyActivity[] {
  return mockDailyActivity;
}

export function getLatestGameSession(patientId: string): GameSession | undefined {
  return mockGameSessions
    .filter((session) => session.patientId === patientId)
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];
}

export function getPendingRemindersByPatient(patientId: string): Reminder[] {
  return mockReminders.filter((reminder) => reminder.patientId === patientId && !reminder.completed);
}

export function getPatientReminderStatus(patientId: string): 'all_done' | 'pending' | 'none' {
  const patientReminders = mockReminders.filter((reminder) => reminder.patientId === patientId);
  if (patientReminders.length === 0) return 'none';
  return patientReminders.some((reminder) => !reminder.completed) ? 'pending' : 'all_done';
}

export function getAlertsByPatient(patientId: string): Alert[] {
  return mockAlerts.filter((alert) => alert.patientId === patientId);
}

export function getUniqueGamesByPatient(patientId: string): string[] {
  const sessions = mockGameSessions.filter((session) => session.patientId === patientId);
  return [...new Set(sessions.map((session) => session.gameName))];
}

export const NEURONERD_GAMES = ['Memory Match', 'Object Recall', 'Pattern Sequence'] as const;

export interface GameAnalytics {
  gameName: string;
  sessionsPlayed: number;
  sessionsCompleted: number;
  averageAccuracy: number;
  totalAttempts: number;
  averageCompletionTime: number;
  recentScore: number;
  recentActivity: string;
  trend: 'improved' | 'stable' | 'changed';
  trendDescription: string;
  sessions: GameSession[];
}

export function getGameAnalyticsByPatient(patientId: string): GameAnalytics[] {
  return NEURONERD_GAMES.map((gameName) => {
    const sessions = mockGameSessions
      .filter((s) => s.patientId === patientId && s.gameName === gameName)
      .sort((a, b) => a.completedAt.localeCompare(b.completedAt));

    const sessionsPlayed = sessions.length;
    const sessionsCompleted = sessions.filter((s) => s.completed).length;
    const averageAccuracy = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.accuracy, 0) / sessions.length)
      : 0;
    const totalAttempts = sessions.reduce((sum, s) => sum + s.attempts, 0);
    const averageCompletionTime = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + s.durationMinutes, 0) / sessions.length)
      : 0;
    const recentSession = sessions[sessions.length - 1];
    const recentScore = recentSession?.score ?? 0;
    const recentActivity = recentSession
      ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(new Date(recentSession.completedAt))
      : 'No activity';

    let trend: GameAnalytics['trend'] = 'stable';
    let trendDescription = 'Not enough data to determine a trend';
    if (sessions.length >= 2) {
      const recent = sessions.slice(-2);
      const accuracyDiff = recent[1].accuracy - recent[0].accuracy;
      if (accuracyDiff > 5) {
        trend = 'improved';
        trendDescription = 'Game accuracy improved during this period';
      } else if (accuracyDiff < -5) {
        trend = 'changed';
        trendDescription = 'Game accuracy decreased during this period';
      } else {
        trend = 'stable';
        trendDescription = 'Game accuracy remained stable during this period';
      }
    }

    return {
      gameName,
      sessionsPlayed,
      sessionsCompleted,
      averageAccuracy,
      totalAttempts,
      averageCompletionTime,
      recentScore,
      recentActivity,
      trend,
      trendDescription,
      sessions,
    };
  });
}
