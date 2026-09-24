import { error, getD1Binding, json, requireAdmin, isMissingTableError, serviceUnavailable } from "../../_lib/http.js";

export async function onRequestGet(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const url = new URL(context.request.url);
  const query = (url.searchParams.get("q") || "").trim();

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    const result = query
      ? await db.prepare(`
          SELECT
            t.slug,
            t.name,
            COUNT(pt.post_id) AS post_count
          FROM tags t
          LEFT JOIN post_tags pt ON pt.tag_id = t.id
          WHERE t.name LIKE ? OR t.slug LIKE ?
          GROUP BY t.id
          ORDER BY t.name ASC
          LIMIT 12
        `).bind(`%${query}%`, `%${query}%`).all()
      : await db.prepare(`
          SELECT
            t.slug,
            t.name,
            COUNT(pt.post_id) AS post_count
          FROM tags t
          LEFT JOIN post_tags pt ON pt.tag_id = t.id
          GROUP BY t.id
          ORDER BY t.name ASC
          LIMIT 30
        `).all();

    return json({ items: result.results || [] });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Tag autocomplete is unavailable until D1 migrations are applied.");
  }
}

export async function onRequestPost(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const payload = await context.request.json().catch(() => null);
  const name = String(payload?.name || "").trim();

  if (!name) {
    return error("name is required", 400);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    await db.prepare(`
      INSERT OR IGNORE INTO tags (slug, name)
      VALUES (?, ?)
    `).bind(slug, name).run();

    return json({ ok: true, slug, name }, { status: 201 });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Tag creation is unavailable until D1 migrations are applied.");
  }
}

export async function onRequestDelete(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const url = new URL(context.request.url);
  const slug = String(url.searchParams.get("slug") || "").trim();

  if (!slug) {
    return error("slug is required", 400);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    const tag = await db.prepare(`
      SELECT id, slug, name
      FROM tags
      WHERE slug = ?
      LIMIT 1
    `).bind(slug).first();

    if (!tag?.id) {
      return error("Tag not found", 404);
    }

    await db.prepare(`
      DELETE FROM post_tags
      WHERE tag_id = ?
    `).bind(tag.id).run();

    await db.prepare(`
      DELETE FROM tags
      WHERE id = ?
    `).bind(tag.id).run();

    return json({ ok: true, slug: tag.slug, name: tag.name });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Tag deletion is unavailable until D1 migrations are applied.");
  }
}
