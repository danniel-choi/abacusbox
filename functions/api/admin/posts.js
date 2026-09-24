import { error, json, readJson, requireAdmin, getD1Binding, isMissingTableError, serviceUnavailable } from "../../_lib/http.js";

export async function onRequestPost(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const payload = await readJson(context.request);
  if (!payload?.slug || !payload?.title || !payload?.body_md || !payload?.type) {
    return error("slug, title, body_md, type are required", 400);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    const result = await db.prepare(`
      INSERT INTO posts (
        type, board, slug, title, excerpt, body_md, status, author_id, published_at, featured
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      String(payload.type),
      payload.board ? String(payload.board) : null,
      String(payload.slug),
      String(payload.title),
      payload.excerpt ? String(payload.excerpt) : null,
      String(payload.body_md),
      payload.status ? String(payload.status) : "draft",
      payload.author_id ? Number(payload.author_id) : null,
      payload.published_at ? String(payload.published_at) : null,
      payload.featured ? 1 : 0
    ).run();

    return json({ ok: true, id: result.meta?.last_row_id || null }, { status: 201 });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Post creation is unavailable until D1 migrations are applied.");
  }
}
