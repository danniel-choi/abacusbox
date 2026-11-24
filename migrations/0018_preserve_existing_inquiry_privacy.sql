UPDATE posts
SET visibility = 'private'
WHERE type = 'community'
  AND board = 'qna'
  AND slug LIKE 'contact-%'
  AND COALESCE(visibility, 'public') = 'public';
