import { error, getD1Binding, json, readJson, requireAdmin, isMissingTableError, serviceUnavailable } from "../../../_lib/http.js";

async function attachTags(db, postId, tagText) {
  const tagNames = String(tagText || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  await db.prepare(`
    DELETE FROM post_tags
    WHERE post_id = ?
  `).bind(postId).run();

  for (const tagName of tagNames) {
    const slug = tagName.toLowerCase().replace(/\s+/g, "-");

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

export async function onRequestGet(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const postId = Number(context.params?.id);
  if (!Number.isFinite(postId)) {
    return error("id is required", 400);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    const post = await db.prepare(`
      SELECT
        p.id,
        p.type,
        p.board,
        p.slug,
        p.title,
        p.excerpt,
        p.body_md,
        p.status,
        p.published_at,
        p.featured,
        p.view_count,
        p.comment_count,
        p.like_count,
        a.name AS author_name
      FROM posts p
      LEFT JOIN authors a ON a.id = p.author_id
      WHERE p.id = ?
      LIMIT 1
    `).bind(postId).first();

    if (!post) {
      return error("Post not found", 404);
    }

    const tags = await db.prepare(`
      SELECT t.slug, t.name
      FROM post_tags pt
      JOIN tags t ON t.id = pt.tag_id
      WHERE pt.post_id = ?
      ORDER BY t.name ASC
    `).bind(postId).all();

    return json({
      ...post,
      tags: tags.results || []
    });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Post detail is unavailable until D1 migrations are applied.");
  }
}

export async function onRequestPatch(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const postId = Number(context.params?.id);
  if (!Number.isFinite(postId)) {
    return error("id is required", 400);
  }

  const payload = await readJson(context.request);
  if (!payload?.title || !payload?.body_md) {
    return error("title and body_md are required", 400);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    await db.prepare(`
      UPDATE posts
      SET title = ?,
          excerpt = ?,
          body_md = ?,
          status = ?,
          published_at = ?,
          featured = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      String(payload.title),
      payload.excerpt ? String(payload.excerpt) : null,
      String(payload.body_md),
      payload.status ? String(payload.status) : "draft",
      payload.published_at ? String(payload.published_at) : null,
      payload.featured ? 1 : 0,
      postId
    ).run();

    await attachTags(db, postId, payload.tags);

    return json({ ok: true, id: postId });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Post update is unavailable until D1 migrations are applied.");
  }
}
