import { error, getD1Binding, isMissingTableError, isValidAdminSecret, json, serviceUnavailable } from "../../_lib/http.js";
import { executeSchedulerRun } from "../../_lib/scheduler.js";

function getBearerToken(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || "";
}

async function isValidCronRequest(request, env) {
  const cronSecret = env.CRON_SECRET || "";
  const incomingCronSecret = request.headers.get("x-cron-secret") || "";

  if (cronSecret && incomingCronSecret && incomingCronSecret === cronSecret) {
    return true;
  }

  const bearerToken = getBearerToken(request);
  if (bearerToken && await isValidAdminSecret(bearerToken, env)) {
    return true;
  }

  return false;
}

async function runCronScheduler(context) {
  if (!(await isValidCronRequest(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    const result = await executeSchedulerRun(db, {
      triggerSource: "cron-http",
      now: new Date()
    });

    return json({ ok: true, result }, {
      headers: {
        "cache-control": "no-store"
      }
    });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) {
      return error(String(cause?.message || cause || "Scheduler run failed"), 500);
    }
    return serviceUnavailable("Scheduler run is unavailable until D1 migrations are applied.");
  }
}

export async function onRequestGet(context) {
  return runCronScheduler(context);
}

export async function onRequestPost(context) {
  return runCronScheduler(context);
}
