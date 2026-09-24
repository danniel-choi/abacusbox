CREATE TABLE IF NOT EXISTS site_visitors (
  visitor_id TEXT PRIMARY KEY,
  first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_path TEXT
);

CREATE INDEX IF NOT EXISTS idx_site_visitors_last_seen_at
  ON site_visitors(last_seen_at DESC);
