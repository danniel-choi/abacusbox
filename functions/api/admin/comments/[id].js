import { error, getD1Binding, json, readJson, requireAdmin, isMissingTableError, serviceUnavailable } from "../../../_lib/http.js";

export async function onRequestPatch(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const commentId = Number(context.params.id);
  const payload = await readJson(context.request);
  const nextStatus = String(payload?.status || "");

  if (!Number.isFinite(commentId)) {
    return error("Invalid comment id", 400);
  }

  if (!["approved", "rejected", "spam", "pending"].includes(nextStatus)) {
    return error("Invalid status", 400);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const current = await db.prepare(`
      SELECT id, post_id, status
      FROM comments
      WHERE id = ?
      LIMIT 1
    `).bind(commentId).first();

    if (!current) {
      return error("Comment not found", 404);
    }

    await db.prepare(`
      UPDATE comments
      SET status = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(nextStatus, commentId).run();

    const shouldIncrease = current.status !== "approved" && nextStatus === "approved";
    const shouldDecrease = current.status === "approved" && nextStatus !== "approved";

    if (shouldIncrease || shouldDecrease) {
      await db.prepare(`
        UPDATE posts
        SET comment_count = CASE
          WHEN ? = 1 THEN comment_count + 1
          WHEN ? = 1 AND comment_count > 0 THEN comment_count - 1
          ELSE comment_count
        END,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(shouldIncrease ? 1 : 0, shouldDecrease ? 1 : 0, current.post_id).run();
    }

    return json({
      ok: true,
      id: commentId,
      status: nextStatus
    });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Comment moderation is unavailable until D1 migrations are applied.");
  }
}
