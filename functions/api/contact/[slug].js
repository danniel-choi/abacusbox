import { error, json, getD1Binding, isMissingTableError, requireAdmin } from "../../_lib/http.js";
import { getPostBySlug } from "../../_lib/posts.js";

export async function onRequestGet(context) {
  const slug = context.params.slug;

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    const isAdmin = await requireAdmin(context.request, context.env);
    if (!isAdmin) {
      const access = await db.prepare(`
        SELECT p.id
        FROM posts p
        WHERE p.slug = ?
          AND p.status = 'published'
          AND p.type = 'community'
          AND p.board = 'qna'
          AND p.slug LIKE 'contact-%'
          AND COALESCE(p.visibility, 'public') = 'public'
        LIMIT 1
      `).bind(slug).first();

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
