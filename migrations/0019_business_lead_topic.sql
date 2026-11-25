ALTER TABLE posts ADD COLUMN lead_topic TEXT;

CREATE INDEX IF NOT EXISTS idx_posts_lead_topic_created
  ON posts(lead_topic, created_at DESC);
