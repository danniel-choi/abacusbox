import { error, getD1Binding, json, readJson, requireAdmin, isMissingTableError, serviceUnavailable } from "../../_lib/http.js";

export async function onRequestPost(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const payload = await readJson(context.request);
  const postId = Number(payload?.post_id);
  const scheduleAt = String(payload?.published_at || "");

  if (!Number.isFinite(postId)) {
    return error("post_id is required", 400);
  }

  if (!scheduleAt) {
    return error("published_at is required", 400);
  }

  const target = new Date(scheduleAt);
  if (Number.isNaN(target.getTime())) {
    return error("published_at must be a valid date", 400);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    await db.prepare(`
      UPDATE posts
      SET status = 'draft',
          published_at = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(target.toISOString(), postId).run();

    return json({ ok: true, post_id: postId, published_at: target.toISOString() });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Scheduling is unavailable until D1 migrations are applied.");
  }
}
