import { error, getD1Binding, json, readJson, requireAdmin } from "../_lib/http.js";

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

function getKstDayKey() {
  return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

async function readRollupVisitorStats(db) {
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

  return {
    activeVisitors: Number(activeRow?.results?.[0]?.count || 0),
    todayVisitors: Number(stats.get(todayKey) || 0),
    totalVisitors: Number(stats.get("total_visitors") || 0),
    activeWindowMinutes: ACTIVE_WINDOW_MINUTES,
    source: "live"
  };
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

async function readVisitorStats(db) {
  try {
    return await readRollupVisitorStats(db);
  } catch (cause) {
    if (!isMissingRollupTableError(cause)) throw cause;
    return readLegacyVisitorStats(db);
  }
}

function isMissingRollupTableError(cause) {
  const text = String(cause?.message || cause || "");
  return text.includes("no such table") || text.includes("site_stats");
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

async function recordVisitorHeartbeat(db, visitorId, path) {
  try {
    const updateResult = await db.prepare(`
      UPDATE site_visitors
      SET last_seen_at = CURRENT_TIMESTAMP,
          last_path = ?
      WHERE visitor_id = ?
    `).bind(path || "/", visitorId).run();

    const isNewVisitor = Number(updateResult?.meta?.changes || 0) === 0;
    if (isNewVisitor) {
      try {
        await db.prepare(`
          INSERT INTO site_visitors (visitor_id, first_seen_at, last_seen_at, last_path)
          VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, ?)
        `).bind(visitorId, path || "/").run();
        await incrementStat(db, "total_visitors");
      } catch {
        await db.prepare(`
          UPDATE site_visitors
          SET last_seen_at = CURRENT_TIMESTAMP,
              last_path = ?
          WHERE visitor_id = ?
        `).bind(path || "/", visitorId).run();
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
  } catch {
    // Heartbeat writes are best-effort; stats reads should keep working.
  }
}

export async function onRequestGet(context) {
  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    return json(await readVisitorStats(db));
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
