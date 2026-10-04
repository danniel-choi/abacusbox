CREATE TABLE IF NOT EXISTS calculator_ideas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT '생활',
  seed_keyword TEXT,
  source_url TEXT,
  reason TEXT,
  priority INTEGER NOT NULL DEFAULT 50,
  status TEXT NOT NULL DEFAULT 'candidate' CHECK (status IN ('candidate', 'planned', 'building', 'launched', 'rejected')),
  generated_spec_json TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_calculator_ideas_status_priority
  ON calculator_ideas(status, priority DESC, updated_at DESC);
