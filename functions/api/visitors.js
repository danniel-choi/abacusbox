import { error, getD1Binding, json, readJson, requireAdmin } from "../_lib/http.js";

const ACTIVE_WINDOW_MINUTES = 5;
const TEST_VISITOR_PREFIXES = ["verify-", "local-check-"];

function fallbackStats() {
  return {
    activeVisitors: 0,
    todayVisitors: 0,
    totalVisitors: 0,
    activeWindowMinutes: ACTIVE_WINDOW_MINUTES,
    source: "fallback",
    topPages: []
  };
}

function getKstDayKey() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

function normalizePath(path) {
  const cleanPath = String(path || "/").trim().slice(0, 200);
  if (!cleanPath || !cleanPath.startsWith("/")) return "/";
  return cleanPath.split("?")[0].split("#")[0] || "/";
}

async function readTopPageStats(db, limit = 12) {
  const dayKey = getKstDayKey();
  const rows = await db.prepare(`
    SELECT
      page_path AS path,
      SUM(views) AS totalViews,
      SUM(unique_visitors) AS totalVisitors,
      SUM(CASE WHEN day = ? THEN views ELSE 0 END) AS todayViews,
      SUM(CASE WHEN day = ? THEN unique_visitors ELSE 0 END) AS todayVisitors,
      MAX(updated_at) AS lastSeenAt
    FROM site_page_stats
    GROUP BY page_path
    ORDER BY totalViews DESC, todayViews DESC, page_path ASC
    LIMIT ?
  `).bind(dayKey, dayKey, limit).all();

  return (rows?.results || []).map((item) => ({
    path: String(item.path || "/"),
    totalViews: Number(item.totalViews || 0),
    totalVisitors: Number(item.totalVisitors || 0),
    todayViews: Number(item.todayViews || 0),
    todayVisitors: Number(item.todayVisitors || 0),
    lastSeenAt: item.lastSeenAt ? String(item.lastSeenAt) : null
  }));
}

async function readRollupVisitorStats(db, options = {}) {
  const dayKey = getKstDayKey();
  const todayKey = `today:${dayKey}`;
  const [activeRow, statRows] = await db.batch([
    db.prepare(`
      SELECT COUNT(*) AS count
      FROM site_visitors
      WHERE datetime(last_seen_at) >= datetime('now', ?)
    `).bind(`-${ACTIVE_WINDOW_MINUTES} minutes`),
    db.prepare(`
      SELECT key, value
      FROM site_stats
      WHERE key IN ('total_visitors', ?)
    `).bind(todayKey)
  ]);

  const stats = new Map(
    (statRows?.results || []).map((item) => [String(item.key), Number(item.value || 0)])
  );

  const statsPayload = {
    activeVisitors: Number(activeRow?.results?.[0]?.count || 0),
    todayVisitors: Number(stats.get(todayKey) || 0),
    totalVisitors: Number(stats.get("total_visitors") || 0),
    activeWindowMinutes: ACTIVE_WINDOW_MINUTES,
    source: "live"
  };

  if (options.includeTopPages) {
    try {
      statsPayload.topPages = await readTopPageStats(db);
    } catch (cause) {
      if (!isMissingPageStatsTableError(cause)) throw cause;
      statsPayload.topPages = [];
    }
  }

  return statsPayload;
}

async function readLegacyVisitorStats(db) {
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

async function readVisitorStats(db, options = {}) {
  try {
    return await readRollupVisitorStats(db, options);
  } catch (cause) {
    if (!isMissingRollupTableError(cause)) throw cause;
    return readLegacyVisitorStats(db);
  }
}

function isMissingRollupTableError(cause) {
  const text = String(cause?.message || cause || "");
  return text.includes("no such table") || text.includes("site_stats");
}

function isMissingPageStatsTableError(cause) {
  const text = String(cause?.message || cause || "");
  return text.includes("no such table") || text.includes("site_page_stats") || text.includes("site_page_visitor_days");
}

async function incrementStat(db, key, amount = 1) {
  await db.prepare(`
    INSERT OR IGNORE INTO site_stats (key, value, updated_at)
    VALUES (?, 0, CURRENT_TIMESTAMP)
  `).bind(key).run();
  await db.prepare(`
    UPDATE site_stats
    SET value = value + ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE key = ?
  `).bind(amount, key).run();
}

async function recordPageVisit(db, visitorId, path) {
  const pagePath = normalizePath(path);
  const dayKey = getKstDayKey();
  const uniqueResult = await db.prepare(`
    INSERT OR IGNORE INTO site_page_visitor_days (day, page_path, visitor_id, first_seen_at)
    VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(dayKey, pagePath, visitorId).run();

  if (Number(uniqueResult?.meta?.changes || 0) <= 0) return;

  await db.prepare(`
    INSERT INTO site_page_stats (page_path, day, views, unique_visitors, updated_at)
    VALUES (?, ?, 1, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(page_path, day) DO UPDATE SET
      views = views + 1,
      unique_visitors = unique_visitors + 1,
      updated_at = CURRENT_TIMESTAMP
  `).bind(pagePath, dayKey).run();
}

async function recordVisitorHeartbeat(db, visitorId, path) {
  try {
    const pagePath = normalizePath(path);
    const updateResult = await db.prepare(`
      UPDATE site_visitors
      SET last_seen_at = CURRENT_TIMESTAMP,
          last_path = ?
      WHERE visitor_id = ?
    `).bind(pagePath, visitorId).run();

    const isNewVisitor = Number(updateResult?.meta?.changes || 0) === 0;
    if (isNewVisitor) {
      try {
        await db.prepare(`
          INSERT INTO site_visitors (visitor_id, first_seen_at, last_seen_at, last_path)
          VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
        `).bind(visitorId, pagePath).run();
        await incrementStat(db, "total_visitors");
      } catch {
        await db.prepare(`
          UPDATE site_visitors
          SET last_seen_at = CURRENT_TIMESTAMP,
              last_path = ?
          WHERE visitor_id = ?
        `).bind(pagePath, visitorId).run();
      }
    }

    const dayKey = getKstDayKey();
    const dailyResult = await db.prepare(`
      INSERT OR IGNORE INTO site_visitor_days (day, visitor_id, first_seen_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
    `).bind(dayKey, visitorId).run();
    if (Number(dailyResult?.meta?.changes || 0) > 0) {
      await incrementStat(db, `today:${dayKey}`);
    }

    try {
      await recordPageVisit(db, visitorId, pagePath);
    } catch (cause) {
      if (!isMissingPageStatsTableError(cause)) throw cause;
    }
  } catch {
    // Heartbeat writes are best-effort; stats reads should keep working.
  }
}

export async function onRequestGet(context) {
  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const isAdmin = await requireAdmin(context.request, context.env);
    return json(await readVisitorStats(db, { includeTopPages: isAdmin }));
  } catch {
    return json(fallbackStats());
  }
}

export async function onRequestPost(context) {
  try {
    const payload = await readJson(context.request);
    const visitorId = String(payload?.visitorId || "").trim().slice(0, 120);
    const path = String(payload?.path || "").trim().slice(0, 200);

    if (!visitorId) {
      return error("visitorId is required", 400);
    }

    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const stats = await readVisitorStats(db);

    context.waitUntil?.(recordVisitorHeartbeat(db, visitorId, path));

    return json(stats);
  } catch {
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
