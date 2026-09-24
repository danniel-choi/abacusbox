import { error, json, getPagination, getD1Binding, isMissingTableError, readJson, requireAdmin, sha256Hex } from "../../_lib/http.js";
import { listPosts } from "../../_lib/posts.js";

export async function onRequestGet(context) {
  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const { page, limit, offset } = getPagination(context.request.url, 10, 30);
    const isAdmin = await requireAdmin(context.request, context.env);
    const ownerToken = context.request.headers.get("x-inquiry-token");

    if (!isAdmin && !ownerToken) {
      return json({ items: [], total: 0, page, limit });
    }

    let result;
    if (isAdmin) {
      result = await listPosts(db, {
        type: "community",
        board: "qna",
        includeSlugPrefix: "contact-",
        page,
        limit,
        offset
      });
    } else {
      const ownerTokenHash = await sha256Hex(ownerToken);
      const rows = await db.prepare(`
        SELECT
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
        FROM posts p
        JOIN inquiry_access ia ON ia.post_id = p.id
        LEFT JOIN authors a ON a.id = p.author_id
        WHERE p.status = 'published'
          AND p.type = 'community'
          AND p.board = 'qna'
          AND p.slug LIKE 'contact-%'
          AND ia.owner_token_hash = ?
        ORDER BY datetime(COALESCE(p.published_at, p.created_at)) DESC, p.id DESC
        LIMIT ? OFFSET ?
      `).bind(ownerTokenHash, limit, offset).all();

      const count = await db.prepare(`
        SELECT COUNT(*) AS total
        FROM posts p
        JOIN inquiry_access ia ON ia.post_id = p.id
        WHERE p.status = 'published'
          AND p.type = 'community'
          AND p.board = 'qna'
          AND p.slug LIKE 'contact-%'
          AND ia.owner_token_hash = ?
      `).bind(ownerTokenHash).first();

      result = {
        items: rows.results || [],
        total: count?.total || 0,
        page,
        limit
      };
    }

    return json(result);
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return json({
      items: [],
      total: 0,
      page: 1,
      limit: 10,
      source: "fallback",
      warning: "D1 schema is not ready; returning empty inquiry board."
    });
  }
}

export async function onRequestPost(context) {
  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    const payload = await readJson(context.request);
    const authorName = String(payload?.author_name || "").trim();
    const title = String(payload?.title || "").trim();
    const body = String(payload?.body || "").trim();

    if (!authorName || !title || !body) {
      return error("author_name, title, body are required", 400);
    }

    if (authorName.length > 50 || title.length > 120 || body.length > 5000) {
      return error("input is too long", 400);
    }

    const ownerToken = String(context.request.headers.get("x-inquiry-token") || "").trim();
    if (!ownerToken) {
      return error("x-inquiry-token is required", 400);
    }

    const slug = `contact-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const authorSlug = `guest-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
    const excerpt = body.slice(0, 140);
    const publishedAt = new Date().toISOString();
    const ownerTokenHash = await sha256Hex(ownerToken);

    const authorResult = await db.prepare(`
      INSERT INTO authors (slug, name, role)
      VALUES (?, ?, 'guest')
    `).bind(authorSlug, authorName).run();

    const authorId = authorResult.meta?.last_row_id || null;

    const postResult = await db.prepare(`
      INSERT INTO posts (
        type, board, slug, title, excerpt, body_md, status, author_id, published_at, featured
      )
      VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?, 0)
    `).bind(
      "community",
      "qna",
      slug,
      title,
      excerpt,
      body,
      authorId,
      publishedAt
    ).run();

    const postId = postResult.meta?.last_row_id || null;
    if (!postId) {
      return error("failed to create inquiry", 500);
    }

    await db.prepare(`
      INSERT INTO inquiry_access (post_id, owner_token_hash)
      VALUES (?, ?)
    `).bind(postId, ownerTokenHash).run();

    return json(
      {
        ok: true,
        id: postId,
        slug
      },
      { status: 201 }
    );
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return error("문의 게시판이 아직 초기화되지 않았습니다.", 503);
  }
}
