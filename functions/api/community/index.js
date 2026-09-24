import { json, getPagination, getD1Binding, isMissingTableError } from "../../_lib/http.js";
import { fallbackCommunityItems } from "../../_lib/fallback-content.js";
import { listPosts } from "../../_lib/posts.js";

export async function onRequestGet(context) {
  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const url = new URL(context.request.url);
    const { page, limit, offset } = getPagination(context.request.url, 10, 30);
    const board = url.searchParams.get("board") || undefined;
    const sort = url.searchParams.get("sort") || "latest";

    const result = await listPosts(db, {
      type: "community",
      board,
      excludeSlugPrefix: "contact-",
      sort,
      page,
      limit,
      offset
    });

    return json(result);
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return json({
      items: fallbackCommunityItems,
      total: fallbackCommunityItems.length,
      page: 1,
      limit: fallbackCommunityItems.length,
      source: "fallback",
      warning: "D1 schema is not ready; returning bundled fallback content."
    });
  }
}
