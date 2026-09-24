async function attachTags(db, postId, tags) {
  for (const tagName of tags) {
    const slug = String(tagName).trim().toLowerCase().replace(/\s+/g, "-");
    await db.prepare(`
      INSERT OR IGNORE INTO tags (slug, name)
      VALUES (?, ?)
    `).bind(slug, tagName).run();

    const tag = await db.prepare(`
      SELECT id
      FROM tags
      WHERE slug = ?
      LIMIT 1
    `).bind(slug).first();

    if (tag?.id) {
      await db.prepare(`
        INSERT OR IGNORE INTO post_tags (post_id, tag_id)
        VALUES (?, ?)
      `).bind(postId, tag.id).run();
    }
  }
}

async function attachCalculator(db, postId, calculatorSlug) {
  await db.prepare(`
    INSERT OR IGNORE INTO post_calculators (post_id, calculator_slug)
    VALUES (?, ?)
  `).bind(postId, calculatorSlug).run();
}

async function deletePostRelations(db, postId) {
  await db.prepare(`
    DELETE FROM post_tags
    WHERE post_id = ?
  `).bind(postId).run();

  await db.prepare(`
    DELETE FROM post_calculators
    WHERE post_id = ?
  `).bind(postId).run();
}

function normalizeComparableText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/[#>*_[\]()!,.:%/\\?&+=-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeComparableText(value) {
  return normalizeComparableText(value)
    .split(" ")
    .map((item) => item.trim())
    .filter((item) => item.length >= 2);
}

function jaccardSimilarity(left, right) {
  const leftSet = new Set(tokenizeComparableText(left));
  const rightSet = new Set(tokenizeComparableText(right));
  if (leftSet.size === 0 || rightSet.size === 0) return 0;

  let intersection = 0;
  for (const token of leftSet) {
    if (rightSet.has(token)) {
      intersection += 1;
    }
  }

  const union = new Set([...leftSet, ...rightSet]).size;
  return union === 0 ? 0 : intersection / union;
}

function findBestSimilarityReason(draft, post) {
  const normalizedDraftTitle = normalizeComparableText(draft.title);
  const normalizedPostTitle = normalizeComparableText(post.title);
  const normalizedDraftBody = normalizeComparableText(draft.body_md);
  const normalizedPostBody = normalizeComparableText(post.body_md);
  const sameCalculator = post.calculator_slug === draft.calculatorSlug;

  if (draft.slug === post.slug) return "slug";
  if (normalizedDraftTitle === normalizedPostTitle) return "title";
  if (normalizedDraftBody === normalizedPostBody) return "body";

  const titleSimilarity = jaccardSimilarity(draft.title, post.title);
  if (
    titleSimilarity >= (sameCalculator ? 0.68 : 0.84) ||
    normalizedDraftTitle.includes(normalizedPostTitle) ||
    normalizedPostTitle.includes(normalizedDraftTitle)
  ) {
    return "similar_title";
  }

  const bodySimilarity = jaccardSimilarity(draft.body_md, post.body_md);
  if (sameCalculator && bodySimilarity >= 0.78) {
    return "similar_body";
  }

  return null;
}

async function findSimilarAutoBlogPosts(db, draft) {
  const candidates = await db.prepare(`
    SELECT
      p.id,
      p.slug,
      p.title,
      p.status,
      p.published_at,
      p.body_md,
      MIN(pc.calculator_slug) AS calculator_slug
    FROM posts p
    LEFT JOIN post_calculators pc ON pc.post_id = p.id
    WHERE p.type = 'blog'
    GROUP BY p.id, p.slug, p.title, p.status, p.published_at, p.body_md, p.created_at
    ORDER BY
      CASE p.status
        WHEN 'published' THEN 0
        WHEN 'draft' THEN 1
        ELSE 2
      END,
      datetime(COALESCE(p.published_at, p.created_at)) DESC,
      p.id DESC
    LIMIT 120
  `).all();

  return (candidates?.results || [])
    .map((post) => ({
      ...post,
      duplicate_reason: findBestSimilarityReason(draft, post)
    }))
    .filter((post) => Boolean(post.duplicate_reason));
}

export async function upsertAutoPublishedPost(db, draft, options) {
  const authorId = options?.authorId ?? null;
  const publishedAt = String(options?.publishedAt || new Date().toISOString());
  const duplicates = await findSimilarAutoBlogPosts(db, draft);

  if (duplicates.length > 0) {
    for (const duplicate of duplicates) {
      await deletePostRelations(db, duplicate.id);
      await db.prepare(`
        DELETE FROM posts
        WHERE id = ?
      `).bind(duplicate.id).run();
    }
  }

  const created = await db.prepare(`
    INSERT INTO posts (
      type, board, slug, title, excerpt, body_md, status, author_id, published_at, featured
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    draft.type,
    draft.board,
    draft.slug,
    draft.title,
    draft.excerpt,
    draft.body_md,
    draft.status,
    authorId,
    publishedAt,
    draft.featured
  ).run();

  const postId = created.meta?.last_row_id || null;

  if (postId) {
    await attachCalculator(db, postId, draft.calculatorSlug);
    await attachTags(db, postId, draft.tags);
  }

  return {
    action: duplicates.length > 0 ? "republished" : "created",
    created: true,
    postId,
    slug: draft.slug,
    title: draft.title,
    status: draft.status,
    duplicateReason: duplicates[0]?.duplicate_reason || null
  };
}
