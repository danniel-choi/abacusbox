CREATE TABLE inquiry_access (
  post_id INTEGER PRIMARY KEY,
  owner_token_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX idx_inquiry_access_owner_token_hash
  ON inquiry_access(owner_token_hash, post_id);
