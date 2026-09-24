const PUBLIC_POST_FIELDS = `
  p.id,
  p.type,
  p.board,
  p.slug,
  p.title,
  p.excerpt,
  p.body_md,
  p.published_at,
  p.featured,
  p.view_count,
  p.comment_count,
  p.like_count,
  a.name AS author_name
`;

export async function listPosts(
  db,
  { type, board, sort = "latest", page, limit, offset, includeSlugPrefix, excludeSlugPrefix }
) {
  const clauses = [`p.status = 'published'`];
  const params = [];

  if (type) {
    clauses.push("p.type = ?");
    params.push(type);
  }

  if (board) {
    clauses.push("p.board = ?");
    params.push(board);
  }

  if (includeSlugPrefix) {
    clauses.push("p.slug LIKE ?");
    params.push(`${includeSlugPrefix}%`);
  }

  if (excludeSlugPrefix) {
    clauses.push("p.slug NOT LIKE ?");
    params.push(`${excludeSlugPrefix}%`);
  }

  const where = clauses.join(" AND ");
  const orderBy =
    sort === "popular"
      ? "p.like_count DESC, p.comment_count DESC, p.view_count DESC, datetime(p.published_at) DESC, p.id DESC"
      : "datetime(p.published_at) DESC, p.id DESC";

  const [itemsResult, countResult] = await Promise.all([
    db.prepare(`
      SELECT ${PUBLIC_POST_FIELDS}
      FROM posts p
      LEFT JOIN authors a ON a.id = p.author_id
      WHERE ${where}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `).bind(...params, limit, offset).all(),
    db.prepare(`
      SELECT COUNT(*) AS total
      FROM posts p
      WHERE ${where}
    `).bind(...params).first()
  ]);

  return {
    items: itemsResult.results || [],
    total: countResult?.total || 0,
    page,
    limit
  };
}

export async function getPostBySlug(db, slug, type, options = {}) {
  const clauses = [`p.slug = ?`, `p.status = 'published'`];
  const params = [slug];

  if (type) {
    clauses.push("p.type = ?");
    params.push(type);
  }

  if (options.includeSlugPrefix) {
    clauses.push("p.slug LIKE ?");
    params.push(`${options.includeSlugPrefix}%`);
  }

  if (options.excludeSlugPrefix) {
    clauses.push("p.slug NOT LIKE ?");
    params.push(`${options.excludeSlugPrefix}%`);
  }

  const post = await db.prepare(`
    SELECT ${PUBLIC_POST_FIELDS}
    FROM posts p
    LEFT JOIN authors a ON a.id = p.author_id
    WHERE ${clauses.join(" AND ")}
    LIMIT 1
  `).bind(...params).first();

  if (!post) {
    return null;
  }

  const [tagsResult, calculatorsResult] = await Promise.all([
    db.prepare(`
      SELECT t.slug, t.name
      FROM post_tags pt
      JOIN tags t ON t.id = pt.tag_id
      WHERE pt.post_id = ?
      ORDER BY t.name ASC
    `).bind(post.id).all(),
    db.prepare(`
      SELECT calculator_slug
      FROM post_calculators
      WHERE post_id = ?
      ORDER BY calculator_slug ASC
    `).bind(post.id).all()
  ]);

  return {
    ...post,
    tags: tagsResult.results || [],
    calculators: (calculatorsResult.results || []).map((item) => item.calculator_slug)
  };
}
