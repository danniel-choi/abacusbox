CREATE TABLE IF NOT EXISTS site_page_stats (
  page_path TEXT NOT NULL,
  day TEXT NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (page_path, day)
);

CREATE TABLE IF NOT EXISTS site_page_visitor_days (
  day TEXT NOT NULL,
  page_path TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  first_seen_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (day, page_path, visitor_id)
);

CREATE INDEX IF NOT EXISTS idx_site_page_stats_day_views
  ON site_page_stats(day, views DESC);

CREATE INDEX IF NOT EXISTS idx_site_page_stats_path
  ON site_page_stats(page_path);
