import { error, getD1Binding, json, isMissingTableError } from "../../_lib/http.js";
import { findFallbackPost } from "../../_lib/fallback-content.js";
import { getPostBySlug } from "../../_lib/posts.js";

export async function onRequestGet(context) {
  const db = getD1Binding(context.env);
  const slug = String(context.params.slug);
  try {
    if (!db) throw new Error("D1 binding is unavailable");
    const post = await getPostBySlug(db, slug, "community", { excludeSlugPrefix: "contact-" });

    if (!post) {
      return error("Community post not found", 404);
    }

    context.waitUntil(
      db.prepare(`
        UPDATE posts
        SET view_count = view_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(post.id).run()
    );

    return json(post);
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    const fallback = findFallbackPost("community", slug);
    if (!fallback) return error("Community post not found", 404);
    return json({ ...fallback, source: "fallback", warning: "D1 schema is not ready; returning bundled fallback content." });
  }
}
