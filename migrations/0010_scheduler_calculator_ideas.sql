ALTER TABLE scheduler_runs
  ADD COLUMN calculator_ideas_created INTEGER NOT NULL DEFAULT 0;

ALTER TABLE scheduler_runs
  ADD COLUMN calculator_idea_seed TEXT;
