import { error, json, getD1Binding, isMissingTableError, requireAdmin, sha256Hex } from "../../_lib/http.js";
import { getPostBySlug } from "../../_lib/posts.js";

export async function onRequestGet(context) {
  const slug = context.params.slug;

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    const isAdmin = await requireAdmin(context.request, context.env);
    const ownerToken = context.request.headers.get("x-inquiry-token");

    if (!isAdmin) {
      if (!ownerToken) return error("Forbidden", 403);

      const ownerTokenHash = await sha256Hex(ownerToken);
      const access = await db.prepare(`
        SELECT p.id
        FROM posts p
        JOIN inquiry_access ia ON ia.post_id = p.id
        WHERE p.slug = ?
          AND p.status = 'published'
          AND p.type = 'community'
          AND p.board = 'qna'
          AND p.slug LIKE 'contact-%'
          AND ia.owner_token_hash = ?
        LIMIT 1
      `).bind(slug, ownerTokenHash).first();

      if (!access) return error("Forbidden", 403);
    }

    const post = await getPostBySlug(db, slug, "community", { includeSlugPrefix: "contact-" });
    if (!post) return error("Not found", 404);

    return json(post);
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return error("Not found", 404);
  }
}
