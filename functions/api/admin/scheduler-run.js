import { error, getD1Binding, json, requireAdmin, isMissingTableError, serviceUnavailable } from "../../_lib/http.js";
import { executeSchedulerRun } from "../../_lib/scheduler.js";

export async function onRequestGet(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    const result = await db.prepare(`
      SELECT
        id,
        trigger_source,
        executed_at,
        published_count,
        draft_created,
        draft_slug,
        error_message,
        created_at
      FROM scheduler_runs
      ORDER BY id DESC
      LIMIT 20
    `).all();

    return json({ items: result.results || [] });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Scheduler logs are unavailable until D1 migrations are applied.");
  }
}

export async function onRequestPost(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const result = await executeSchedulerRun(db, {
      triggerSource: "manual",
      now: new Date()
    });
    return json({ ok: true, result });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) {
      return error(String(cause?.message || cause || "Scheduler run failed"), 500);
    }
    return serviceUnavailable("Scheduler run is unavailable until D1 migrations are applied.");
  }
}
