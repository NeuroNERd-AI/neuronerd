-- NeuroNERd Milestone 6B
-- Controlled demo seed for real Supabase game analytics.
-- Safe to re-run: game_key and client_event_id are unique.
-- Does NOT modify schema, RLS, authentication, or unrelated data.

BEGIN;

-- ============================================================
-- 1. GAME CATALOG
-- ============================================================

INSERT INTO public.games (game_key, name, description, is_active)
VALUES
  (
    'memory-match',
    'Memory Match',
    'A visual matching game that exercises short-term memory and concentration.',
    true
  ),
  (
    'object-recall',
    'Object Recall',
    'A simple recall activity using familiar objects to exercise recognition and memory.',
    true
  ),
  (
    'pattern-sequence',
    'Pattern Sequence',
    'A pattern-completion activity that exercises attention and sequential reasoning.',
    true
  )
ON CONFLICT (game_key) DO NOTHING;


-- ============================================================
-- 2. CONTROLLED DEMO GAME SESSIONS
-- ============================================================
-- Test Patient:
-- 8f221126-d461-4c97-9ac5-cf1d59b157c7
--
-- We intentionally leave difficulty_profile_id NULL.
-- The schema allows NULL and difficulty_profiles has restrictive
-- uniqueness constraints.
--
-- Accuracy is stored as 0-1 because of the database constraint.
-- The frontend gameService converts it to 0-100 percentage.

INSERT INTO public.game_sessions (
  client_event_id,
  patient_id,
  game_id,
  difficulty_profile_id,
  status,
  started_at,
  completed_at,
  client_created_at,
  client_updated_at,
  app_version,
  metadata
)
SELECT
  seed.client_event_id,
  '8f221126-d461-4c97-9ac5-cf1d59b157c7'::uuid,
  g.id,
  NULL,
  'completed'::game_session_status,
  now() - seed.elapsed_interval,
  now() - seed.elapsed_interval + seed.duration,
  now() - seed.elapsed_interval,
  now() - seed.elapsed_interval + seed.duration,
  '0.6.0-demo',
  jsonb_build_object(
    'seed', 'milestone_6b',
    'demo_session_key', seed.session_key,
    'game_type', seed.game_type,
    'demo_data', true
  )
FROM (
  VALUES
    ('neuronerd-6b-memory-01',   'memory-match-1',   'memory_match',    interval '12 days', interval '8 minutes'),
    ('neuronerd-6b-memory-02',   'memory-match-2',   'memory_match',    interval '9 days',  interval '7 minutes'),
    ('neuronerd-6b-memory-03',   'memory-match-3',   'memory_match',    interval '5 days',  interval '6 minutes'),
    ('neuronerd-6b-memory-04',   'memory-match-4',   'memory_match',    interval '2 days',  interval '5 minutes'),

    ('neuronerd-6b-recall-01',   'object-recall-1',   'object_recall',   interval '11 days', interval '7 minutes'),
    ('neuronerd-6b-recall-02',   'object-recall-2',   'object_recall',   interval '8 days',  interval '7 minutes'),
    ('neuronerd-6b-recall-03',   'object-recall-3',   'object_recall',   interval '4 days',  interval '6 minutes'),
    ('neuronerd-6b-recall-04',   'object-recall-4',   'object_recall',   interval '1 day',   interval '5 minutes'),

    ('neuronerd-6b-pattern-01',  'pattern-sequence-1','pattern_sequence',interval '10 days', interval '9 minutes'),
    ('neuronerd-6b-pattern-02',  'pattern-sequence-2','pattern_sequence',interval '7 days',  interval '8 minutes'),
    ('neuronerd-6b-pattern-03',  'pattern-sequence-3','pattern_sequence',interval '3 days',  interval '7 minutes'),
    ('neuronerd-6b-pattern-04',  'pattern-sequence-4','pattern_sequence',interval '12 hours',interval '6 minutes')
) AS seed(client_event_id, session_key, game_type, elapsed_interval, duration)
JOIN public.games g
  ON g.game_key = CASE seed.game_type
    WHEN 'memory_match' THEN 'memory-match'
    WHEN 'object_recall' THEN 'object-recall'
    WHEN 'pattern_sequence' THEN 'pattern-sequence'
  END
ON CONFLICT (client_event_id) DO NOTHING;


-- ============================================================
-- 3. ONE RESULT PER DEMO SESSION
-- ============================================================
-- Scores deliberately improve over time to make the existing
-- analytics/trend UI meaningful.
--
-- accuracy values remain 0-1 in the database.

INSERT INTO public.game_results (
  game_session_id,
  source,
  observed_at,
  score,
  max_score,
  accuracy,
  response_time_ms,
  attempts_count,
  successful_rounds,
  failed_rounds,
  qualitative_observation,
  parameters
)
SELECT
  gs.id,
  'client'::result_source,
  gs.completed_at,
  seed.score,
  100,
  seed.accuracy,
  seed.response_time_ms,
  seed.attempts_count,
  seed.successful_rounds,
  seed.failed_rounds,
  seed.observation,
  jsonb_build_object(
    'seed', 'milestone_6b',
    'demo_data', true
  )
FROM (
  VALUES
    ('neuronerd-6b-memory-01',  62::numeric, 0.62::numeric, 4800, 15,  9, 6, 'Synthetic demo observation: initial Memory Match performance.'),
    ('neuronerd-6b-memory-02',  68::numeric, 0.68::numeric, 4300, 14, 10, 4, 'Synthetic demo observation: improving Memory Match performance.'),
    ('neuronerd-6b-memory-03',  76::numeric, 0.76::numeric, 3900, 13, 11, 2, 'Synthetic demo observation: continued Memory Match improvement.'),
    ('neuronerd-6b-memory-04',  84::numeric, 0.84::numeric, 3500, 12, 11, 1, 'Synthetic demo observation: strong recent Memory Match performance.'),

    ('neuronerd-6b-recall-01',  58::numeric, 0.58::numeric, 5100, 16,  9, 7, 'Synthetic demo observation: initial Object Recall performance.'),
    ('neuronerd-6b-recall-02',  64::numeric, 0.64::numeric, 4700, 15, 10, 5, 'Synthetic demo observation: improving Object Recall performance.'),
    ('neuronerd-6b-recall-03',  66::numeric, 0.66::numeric, 4500, 15, 10, 5, 'Synthetic demo observation: stable Object Recall performance.'),
    ('neuronerd-6b-recall-04',  69::numeric, 0.69::numeric, 4200, 14, 10, 4, 'Synthetic demo observation: modest recent Object Recall improvement.'),

    ('neuronerd-6b-pattern-01', 48::numeric, 0.48::numeric, 5600, 18,  9, 9, 'Synthetic demo observation: initial Pattern Sequence performance.'),
    ('neuronerd-6b-pattern-02', 57::numeric, 0.57::numeric, 5100, 17, 10, 7, 'Synthetic demo observation: improving Pattern Sequence performance.'),
    ('neuronerd-6b-pattern-03', 67::numeric, 0.67::numeric, 4600, 16, 11, 5, 'Synthetic demo observation: continued Pattern Sequence improvement.'),
    ('neuronerd-6b-pattern-04', 78::numeric, 0.78::numeric, 4000, 14, 11, 3, 'Synthetic demo observation: strong recent Pattern Sequence performance.')
) AS seed(
  session_key,
  score,
  accuracy,
  response_time_ms,
  attempts_count,
  successful_rounds,
  failed_rounds,
  observation
)
JOIN public.game_sessions gs
  ON gs.metadata->>'demo_session_key' = seed.session_key
 AND gs.metadata->>'seed' = 'milestone_6b'
ON CONFLICT (game_session_id) DO NOTHING;


-- ============================================================
-- 4. VERIFICATION
-- ============================================================

SELECT
  g.game_key,
  g.name,
  g.is_active
FROM public.games g
WHERE g.game_key IN (
  'memory-match',
  'object-recall',
  'pattern-sequence'
)
ORDER BY g.game_key;


SELECT
  gs.id,
  gs.client_event_id,
  g.name AS game_name,
  gs.status,
  gs.started_at,
  gs.completed_at,
  gr.score,
  gr.max_score,
  gr.accuracy,
  gr.attempts_count
FROM public.game_sessions gs
JOIN public.games g
  ON g.id = gs.game_id
LEFT JOIN public.game_results gr
  ON gr.game_session_id = gs.id
WHERE gs.patient_id = '8f221126-d461-4c97-9ac5-cf1d59b157c7'::uuid
  AND gs.metadata->>'seed' = 'milestone_6b'
ORDER BY gs.completed_at ASC;


SELECT
  COUNT(*) AS demo_sessions,
  COUNT(gr.id) AS demo_results,
  COUNT(*) FILTER (WHERE gs.status = 'completed') AS completed_sessions,
  COUNT(*) FILTER (WHERE gr.id IS NULL) AS sessions_without_results
FROM public.game_sessions gs
LEFT JOIN public.game_results gr
  ON gr.game_session_id = gs.id
WHERE gs.patient_id = '8f221126-d461-4c97-9ac5-cf1d59b157c7'::uuid
  AND gs.metadata->>'seed' = 'milestone_6b';


COMMIT;