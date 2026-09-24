import { error, getD1Binding, getPagination, json, requireAdmin, isMissingTableError, serviceUnavailable } from "../../_lib/http.js";

export async function onRequestGet(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const url = new URL(context.request.url);
  const status = url.searchParams.get("status") || "pending";
  const postId = url.searchParams.get("post_id");
  const { page, limit, offset } = getPagination(context.request.url, 12, 100);
  const clauses = ["c.status = ?"];
  const params = [status];

  if (postId) {
    clauses.push("c.post_id = ?");
    params.push(Number(postId));
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const whereClause = clauses.join(" AND ");
    const totalRow = await db.prepare(`
      SELECT COUNT(*) AS count
      FROM comments c
      WHERE ${whereClause}
    `).bind(...params).first();

    const result = await db.prepare(`
      SELECT
        c.id,
        c.post_id,
        c.parent_id,
        c.author_name,
        c.body,
        c.status,
        c.created_at,
        p.slug AS post_slug,
        p.title AS post_title
      FROM comments c
      JOIN posts p ON p.id = c.post_id
      WHERE ${whereClause}
      ORDER BY datetime(c.created_at) DESC, c.id DESC
      LIMIT ?
      OFFSET ?
    `).bind(...params, limit, offset).all();

    const total = Number(totalRow?.count || 0);

    return json({
      items: result.results || [],
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit))
    });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Comment admin API is unavailable until D1 migrations are applied.");
  }
}
