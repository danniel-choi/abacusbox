import { json, getPagination, getD1Binding, isMissingTableError } from "../../_lib/http.js";
import { fallbackBlogItems } from "../../_lib/fallback-content.js";
import { listPosts } from "../../_lib/posts.js";

export async function onRequestGet(context) {
  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const { page, limit, offset } = getPagination(context.request.url, 10, 30);
    const result = await listPosts(db, {
      type: "blog",
      page,
      limit,
      offset
    });

    return json(result);
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return json({
      items: fallbackBlogItems,
      total: fallbackBlogItems.length,
      page: 1,
      limit: fallbackBlogItems.length,
      source: "fallback",
      warning: "D1 schema is not ready; returning bundled fallback content."
    });
  }
}
