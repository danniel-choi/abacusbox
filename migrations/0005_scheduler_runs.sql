CREATE TABLE IF NOT EXISTS scheduler_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trigger_source TEXT NOT NULL,
  executed_at TEXT NOT NULL,
  published_count INTEGER NOT NULL DEFAULT 0,
  draft_created INTEGER NOT NULL DEFAULT 0,
  draft_slug TEXT,
  error_message TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scheduler_runs_executed_at
  ON scheduler_runs(executed_at DESC, id DESC);
