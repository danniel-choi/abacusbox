import { error, getD1Binding, isMissingTableError, json, readJson, requireAdmin } from "../_lib/http.js";

const ACTIVE_WINDOW_MINUTES = 5;
const TEST_VISITOR_PREFIXES = ["verify-", "local-check-"];

function fallbackStats() {
  return {
    activeVisitors: 0,
    todayVisitors: 0,
    totalVisitors: 0,
    activeWindowMinutes: ACTIVE_WINDOW_MINUTES,
    source: "fallback"
  };
}

async function readVisitorStats(db) {
  const [activeRow, todayRow, totalRow] = await db.batch([
    db.prepare(`
      SELECT COUNT(*) AS count
      FROM site_visitors
      WHERE datetime(last_seen_at) >= datetime('now', ?)
    `).bind(`-${ACTIVE_WINDOW_MINUTES} minutes`),
    db.prepare(`
      SELECT COUNT(*) AS count
      FROM site_visitors
      WHERE date(last_seen_at, 'localtime') = date('now', 'localtime')
    `),
    db.prepare(`
      SELECT COUNT(*) AS count
      FROM site_visitors
    `)
  ]);

  return {
    activeVisitors: Number(activeRow?.results?.[0]?.count || 0),
    todayVisitors: Number(todayRow?.results?.[0]?.count || 0),
    totalVisitors: Number(totalRow?.results?.[0]?.count || 0),
    activeWindowMinutes: ACTIVE_WINDOW_MINUTES,
    source: "live"
  };
}

export async function onRequestGet(context) {
  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    return json(await readVisitorStats(db));
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return json(fallbackStats());
  }
}

export async function onRequestPost(context) {
  const payload = await readJson(context.request);
  const visitorId = String(payload?.visitorId || "").trim().slice(0, 120);
  const path = String(payload?.path || "").trim().slice(0, 200);

  if (!visitorId) {
    return error("visitorId is required", 400);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    await db.prepare(`
      INSERT INTO site_visitors (visitor_id, first_seen_at, last_seen_at, last_path)
      VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
      ON CONFLICT(visitor_id) DO UPDATE SET
        last_seen_at = CURRENT_TIMESTAMP,
        last_path = excluded.last_path
    `).bind(visitorId, path || "/").run();

    return json(await readVisitorStats(db));
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return json(fallbackStats());
  }
}

export async function onRequestDelete(context) {
  const isAdmin = await requireAdmin(context.request, context.env);
  if (!isAdmin) {
    return error("admin authorization required", 401);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    const matches = await db.prepare(`
      SELECT visitor_id
      FROM site_visitors
      WHERE visitor_id LIKE 'verify-%'
         OR visitor_id LIKE 'local-check-%'
    `).all();

    const visitorIds = Array.isArray(matches?.results)
      ? matches.results.map((item) => String(item.visitor_id || "")).filter(Boolean)
      : [];

    if (visitorIds.length > 0) {
      await db.batch(
        visitorIds.map((visitorId) =>
          db.prepare(`DELETE FROM site_visitors WHERE visitor_id = ?`).bind(visitorId)
        )
      );
    }

    return json({
      ok: true,
      deletedCount: visitorIds.length,
      deletedVisitorIds: visitorIds,
      testPrefixes: TEST_VISITOR_PREFIXES,
      stats: await readVisitorStats(db)
    });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return json({
      ok: false,
      deletedCount: 0,
      deletedVisitorIds: [],
      testPrefixes: TEST_VISITOR_PREFIXES,
      stats: fallbackStats()
    });
  }
}
