import { error, getD1Binding, json, readJson, isMissingTableError, serviceUnavailable } from "../../_lib/http.js";

export async function onRequestPost(context) {
  const payload = await readJson(context.request);
  const postId = Number(payload?.post_id);
  const fingerprint = String(payload?.fingerprint || "").trim().slice(0, 120);

  if (!Number.isFinite(postId) || !fingerprint) {
    return error("post_id and fingerprint are required", 400);
  }

  const db = getD1Binding(context.env);
  try {
    if (!db) throw new Error("D1 binding is unavailable");
    const existing = await db.prepare(`
      SELECT id
      FROM reactions
      WHERE post_id = ? AND fingerprint = ? AND type = 'like'
      LIMIT 1
    `).bind(postId, fingerprint).first();

    if (existing) {
      await db.batch([
        db.prepare(`DELETE FROM reactions WHERE id = ?`).bind(existing.id),
        db.prepare(`
          UPDATE posts
          SET like_count = CASE WHEN like_count > 0 THEN like_count - 1 ELSE 0 END,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).bind(postId)
      ]);

      return json({ ok: true, liked: false });
    }

    await db.batch([
      db.prepare(`
        INSERT INTO reactions (post_id, fingerprint, type)
        VALUES (?, ?, 'like')
      `).bind(postId, fingerprint),
      db.prepare(`
        UPDATE posts
        SET like_count = like_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(postId)
    ]);

    return json({ ok: true, liked: true });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Likes are unavailable until D1 migrations are applied.");
  }
}
