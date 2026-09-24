import { error, json, readJson, requireAdmin, getD1Binding, isMissingTableError, serviceUnavailable } from "../../_lib/http.js";

export async function onRequestPost(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const payload = await readJson(context.request);
  const postId = Number(payload?.post_id);

  if (!Number.isFinite(postId)) {
    return error("post_id is required", 400);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    await db.prepare(`
      UPDATE posts
      SET status = 'published',
          published_at = COALESCE(published_at, CURRENT_TIMESTAMP),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(postId).run();

    return json({ ok: true, post_id: postId });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Publishing is unavailable until D1 migrations are applied.");
  }
}
