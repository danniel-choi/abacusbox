import { error, getD1Binding, json, readJson, isMissingTableError, serviceUnavailable } from "../../_lib/http.js";

export async function onRequestGet(context) {
  const postId = Number(context.params.postId);
  if (!Number.isFinite(postId)) {
    return error("Invalid post id", 400);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const result = await db.prepare(`
      SELECT id, post_id, parent_id, author_name, body, status, created_at
      FROM comments
      WHERE post_id = ? AND status = 'approved'
      ORDER BY datetime(created_at) ASC, id ASC
    `).bind(postId).all();

    return json({ items: result.results || [] });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return json({ items: [], source: "fallback", warning: "D1 schema is not ready; returning empty comments." });
  }
}

export async function onRequestPost(context) {
  const postId = Number(context.params.postId);
  const payload = await readJson(context.request);

  if (!Number.isFinite(postId)) {
    return error("Invalid post id", 400);
  }

  if (!payload?.author_name || !payload?.body) {
    return error("author_name and body are required", 400);
  }

  const authorName = String(payload.author_name).trim().slice(0, 50);
  const body = String(payload.body).trim().slice(0, 5000);
  const parentId = payload.parent_id ? Number(payload.parent_id) : null;

  if (!authorName || !body) {
    return error("Empty values are not allowed", 400);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const insertResult = await db.prepare(`
      INSERT INTO comments (post_id, parent_id, author_name, body, status)
      VALUES (?, ?, ?, ?, 'pending')
    `).bind(postId, parentId, authorName, body).run();

    return json(
      {
        ok: true,
        id: insertResult.meta?.last_row_id || null,
        status: "pending"
      },
      { status: 201 }
    );
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Comments are unavailable until D1 migrations are applied.");
  }
}
