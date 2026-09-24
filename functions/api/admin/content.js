import { error, getD1Binding, getPagination, json, requireAdmin, isMissingTableError, serviceUnavailable } from "../../_lib/http.js";

export async function onRequestGet(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const url = new URL(context.request.url);
  const type = url.searchParams.get("type");
  const status = url.searchParams.get("status");
  const schedule = url.searchParams.get("schedule");
  const query = (url.searchParams.get("q") || "").trim();
  const sort = url.searchParams.get("sort") || "latest";
  const { page, limit, offset } = getPagination(context.request.url, 12, 100);
  const clauses = ["1 = 1"];
  const params = [];

  if (type) {
    clauses.push("p.type = ?");
    params.push(type);
  }

  if (status) {
    clauses.push("p.status = ?");
    params.push(status);
  }

  if (schedule === "scheduled") {
    clauses.push("p.status = 'draft'");
    clauses.push("p.published_at IS NOT NULL");
    clauses.push("datetime(p.published_at) > datetime('now')");
  } else if (schedule === "unscheduled") {
    clauses.push("(p.published_at IS NULL OR datetime(p.published_at) <= datetime('now'))");
  }

  if (query) {
    clauses.push("(p.title LIKE ? OR p.slug LIKE ?)");
    params.push(`%${query}%`, `%${query}%`);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const orderBy =
      sort === "oldest"
        ? "datetime(COALESCE(p.published_at, p.created_at)) ASC, p.id ASC"
        : sort === "title"
          ? "p.title COLLATE NOCASE ASC, p.id DESC"
          : "datetime(COALESCE(p.published_at, p.created_at)) DESC, p.id DESC";
    const whereClause = clauses.join(" AND ");
    const totalRow = await db.prepare(`
      SELECT COUNT(*) AS count
      FROM posts p
      WHERE ${whereClause}
    `).bind(...params).first();

    const result = await db.prepare(`
      SELECT
        p.id,
        p.type,
        p.board,
        p.slug,
        p.title,
        p.status,
        p.published_at,
        p.featured,
        p.view_count,
        p.comment_count,
        p.like_count,
        a.name AS author_name
      FROM posts p
      LEFT JOIN authors a ON a.id = p.author_id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
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
    return serviceUnavailable("Content admin API is unavailable until D1 migrations are applied.");
  }
}
