import { error, getD1Binding, json, isMissingTableError } from "../../_lib/http.js";
import { findFallbackPost } from "../../_lib/fallback-content.js";
import { getPostBySlug } from "../../_lib/posts.js";

export async function onRequestGet(context) {
  const slug = String(context.params.slug);
  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const post = await getPostBySlug(db, slug, "blog");

    if (!post) {
      return error("Blog post not found", 404);
    }

    return json(post);
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    const fallback = findFallbackPost("blog", slug);
    if (!fallback) return error("Blog post not found", 404);
    return json({ ...fallback, source: "fallback", warning: "D1 schema is not ready; returning bundled fallback content." });
  }
}
