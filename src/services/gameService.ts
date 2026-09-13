import type { ActivityType, GameSession } from '@/types';
import { supabase } from '@/lib/supabase';

interface GameRow {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean | null;
}

interface GameResultRow {
  id: string;
  game_session_id: string;
  score: number | null;
  accuracy: number | null;
  attempts_count: number | null;
  max_score: number | null;
  created_at: string;
  updated_at: string;
}

interface GameSessionRow {
  id: string;
  patient_id: string;
  game_id: string;
  difficulty_profile_id: string | null;
  status: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, unknown> | null;
  app_version: string | null;
  game: GameRow | null;
  game_results: GameResultRow[] | GameResultRow | null;
}

export interface GameServiceResult<T> {
  data: T;
  error: string | null;
}

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

export const NEURONERD_GAMES = ['Memory Match', 'Object Recall', 'Pattern Sequence'] as const;

export function resolveGameType(name?: string, metadataType?: unknown): ActivityType {
  if (typeof metadataType === 'string' && metadataType) {
    const validTypes: ActivityType[] = [
      'memory_game',
      'puzzle',
      'trivia',
      'recall',
      'breathing',
      'memory_match',
      'object_recall',
      'pattern_sequence',
    ];
    if (validTypes.includes(metadataType as ActivityType)) {
      return metadataType as ActivityType;
    }
  }

  if (!name) return 'memory_match';
  const lower = name.toLowerCase();
  if (lower.includes('match') || lower.includes('pair')) return 'memory_match';
  if (lower.includes('recall') || lower.includes('object')) return 'object_recall';
  if (lower.includes('sequence') || lower.includes('pattern')) return 'pattern_sequence';
  if (lower.includes('puzzle')) return 'puzzle';
  if (lower.includes('trivia')) return 'trivia';
  if (lower.includes('breathing')) return 'breathing';
  return 'memory_match';
}

export function calculateDurationMinutes(startedAt: string | null, completedAt: string | null): number {
  if (!startedAt || !completedAt) return 1;
  const start = new Date(startedAt).getTime();
  const end = new Date(completedAt).getTime();
  const diffMs = end - start;
  if (isNaN(diffMs) || diffMs <= 0) return 1;
  return Math.max(1, Math.round(diffMs / (1000 * 60)));
}

export function mapGameSession(row: GameSessionRow): GameSession {
  const result = Array.isArray(row.game_results)
    ? row.game_results[0] ?? null
    : row.game_results;

  const gameName = row.game?.name || 'Cognitive Game';
  const metadataGameType =
    row.metadata && typeof row.metadata === 'object'
      ? (row.metadata as Record<string, unknown>).game_type
      : undefined;
  const gameType = resolveGameType(gameName, metadataGameType);

  const completed = row.status === 'completed' || !!row.completed_at;
  const durationMinutes = calculateDurationMinutes(row.started_at, row.completed_at);
  const completedAt = row.completed_at || row.created_at || new Date().toISOString();

  // DB stores accuracy as a 0–1 decimal (enforced by CHECK constraint).
  // All UI consumers (chart domain [0,100], table/card "{n}%" label) expect a 0–100 percentage.
  const rawAccuracy = result?.accuracy ?? 0;
  const accuracyPercent = Math.round(rawAccuracy * 100);

  return {
    id: row.id,
    patientId: row.patient_id,
    gameType,
    gameName,
    score: result?.score ?? 0,
    accuracy: accuracyPercent,
    durationMinutes,
    completedAt,
    attempts: result?.attempts_count ?? 1,
    completed,
  };
}

export async function getGameSessionsByPatient(
  patientId: string
): Promise<GameServiceResult<GameSession[]>> {
  if (!patientId || !patientId.trim()) {
    return { data: [], error: 'Patient ID is required.' };
  }

  const { data, error } = await supabase
    .from('game_sessions')
    .select(`
      id,
      patient_id,
      game_id,
      difficulty_profile_id,
      status,
      started_at,
      completed_at,
      created_at,
      updated_at,
      metadata,
      app_version,
      game:games(id, name, description, is_active),
      game_results(id, game_session_id, score, accuracy, attempts_count, max_score, created_at, updated_at)
    `)
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false });

  if (error) {
    return { data: [], error: `Game sessions lookup failed: ${error.message}` };
  }

  const rows = (data as unknown as GameSessionRow[]) || [];
  return { data: rows.map(mapGameSession), error: null };
}

export function calculateGameAnalytics(sessions: GameSession[]): GameAnalytics[] {
  const sessionGameNames = [...new Set(sessions.map((s) => s.gameName))];
  const allGameNames = [...new Set([...NEURONERD_GAMES, ...sessionGameNames])];

  return allGameNames.map((gameName) => {
    const gameSessions = sessions
      .filter((s) => s.gameName === gameName)
      .sort((a, b) => a.completedAt.localeCompare(b.completedAt));

    const sessionsPlayed = gameSessions.length;
    const sessionsCompleted = gameSessions.filter((s) => s.completed).length;
    const averageAccuracy =
      sessionsPlayed > 0
        ? Math.round(gameSessions.reduce((sum, s) => sum + s.accuracy, 0) / sessionsPlayed)
        : 0;
    const totalAttempts = gameSessions.reduce((sum, s) => sum + s.attempts, 0);
    const averageCompletionTime =
      sessionsPlayed > 0
        ? Math.round(gameSessions.reduce((sum, s) => sum + s.durationMinutes, 0) / sessionsPlayed)
        : 0;
    const recentSession = gameSessions[gameSessions.length - 1];
    const recentScore = recentSession?.score ?? 0;
    const recentActivity = recentSession
      ? new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short' }).format(
          new Date(recentSession.completedAt)
        )
      : 'No activity';

    let trend: GameAnalytics['trend'] = 'stable';
    let trendDescription = 'Not enough data to determine a trend';
    if (gameSessions.length >= 2) {
      const recent = gameSessions.slice(-2);
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
      sessions: gameSessions,
    };
  });
}

export async function getGameAnalyticsByPatient(
  patientId: string
): Promise<GameServiceResult<GameAnalytics[]>> {
  const { data: sessions, error } = await getGameSessionsByPatient(patientId);
  if (error) {
    return { data: [], error };
  }
  return { data: calculateGameAnalytics(sessions), error: null };
}

export async function getUniqueGamesByPatient(
  patientId: string
): Promise<GameServiceResult<string[]>> {
  const { data: sessions, error } = await getGameSessionsByPatient(patientId);
  if (error) {
    return { data: [], error };
  }
  const uniqueGames = [...new Set(sessions.map((s) => s.gameName))];
  return { data: uniqueGames, error: null };
}
