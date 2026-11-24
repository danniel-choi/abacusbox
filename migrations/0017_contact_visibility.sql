ALTER TABLE posts ADD COLUMN visibility TEXT NOT NULL DEFAULT 'public';

-- Existing inquiries were owner/admin-only before visibility was introduced.
UPDATE posts
SET visibility = 'private'
WHERE type = 'community'
  AND board = 'qna'
  AND slug LIKE 'contact-%';

CREATE INDEX idx_posts_visibility_type_status
  ON posts(visibility, type, status, published_at DESC);
