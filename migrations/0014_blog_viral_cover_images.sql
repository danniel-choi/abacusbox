UPDATE posts
SET cover_image_url = '/api/blog-image/' || slug || '.svg',
    updated_at = CURRENT_TIMESTAMP
WHERE type = 'blog'
  AND (cover_image_url IS NULL OR cover_image_url = '');
