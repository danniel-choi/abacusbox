export function json(data, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("content-type", "application/json; charset=utf-8");
  return new Response(JSON.stringify(data), { ...init, headers });
}

export function error(message, status = 400) {
  return json({ error: message }, { status });
}

export function serviceUnavailable(message = "D1 schema is not ready. Apply migrations and seed data first.") {
  return json({ error: message }, { status: 503 });
}

export function isMissingTableError(cause) {
  const text = String(cause?.message || cause || "");
  return text.includes("no such table") || text.includes("SQLITE_ERROR");
}

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export function getPagination(url, fallbackLimit = 10, maxLimit = 50) {
  const target = new URL(url);
  const page = Math.max(Number(target.searchParams.get("page") || 1), 1);
  const limit = Math.min(Math.max(Number(target.searchParams.get("limit") || fallbackLimit), 1), maxLimit);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

export const ADMIN_SESSION_COOKIE = "__Host-calcrule_admin_session";

export async function requireAdmin(request, env) {
  if (await hasValidAdminSession(request, env)) {
    return true;
  }

  const incoming = request.headers.get("x-admin-token");
  if (!incoming) return false;

  return isValidAdminSecret(incoming, env);
}

export function getD1Binding(env) {
  return env.CONTENT_DB || env.calcrule || null;
}

export async function isValidAdminSecret(value, env) {
  if (!value) return false;

  if (env.ADMIN_API_TOKEN && value === env.ADMIN_API_TOKEN) {
    return true;
  }

  if (env.ADMIN_API_TOKEN_SHA256) {
    const digest = await sha256Hex(value);
    return digest === env.ADMIN_API_TOKEN_SHA256;
  }

  return false;
}

export async function hasValidAdminSession(request, env) {
  const cookies = parseCookies(request.headers.get("cookie"));
  const incoming = cookies[ADMIN_SESSION_COOKIE];
  if (!incoming) return false;
  const expected = await getExpectedAdminSessionValue(env);
  return Boolean(expected) && incoming === expected;
}

export async function getExpectedAdminSessionValue(env) {
  let baseHash = env.ADMIN_API_TOKEN_SHA256 || "";
  if (!baseHash && env.ADMIN_API_TOKEN) {
    baseHash = await sha256Hex(env.ADMIN_API_TOKEN);
  }
  if (!baseHash) return "";
  return sha256Hex(`admin-session:${baseHash}`);
}

export function createAdminSessionCookie(value, maxAge = 60 * 60 * 8) {
  return serializeCookie(ADMIN_SESSION_COOKIE, value, {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge
  });
}

export function clearAdminSessionCookie() {
  return serializeCookie(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
    path: "/",
    maxAge: 0
  });
}

export function parseCookies(rawCookie) {
  if (!rawCookie) return {};
  return rawCookie
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((accumulator, part) => {
      const [name, ...rest] = part.split("=");
      if (!name) return accumulator;
      accumulator[name] = decodeURIComponent(rest.join("=") || "");
      return accumulator;
    }, {});
}

export function serializeCookie(name, value, options = {}) {
  const segments = [`${name}=${encodeURIComponent(value)}`];
  if (options.path) segments.push(`Path=${options.path}`);
  if (typeof options.maxAge === "number") segments.push(`Max-Age=${options.maxAge}`);
  if (options.httpOnly) segments.push("HttpOnly");
  if (options.secure) segments.push("Secure");
  if (options.sameSite) segments.push(`SameSite=${options.sameSite}`);
  return segments.join("; ");
}

export async function sha256Hex(value) {
  const encoded = new TextEncoder().encode(value);
  const buffer = await crypto.subtle.digest("SHA-256", encoded);
  const bytes = Array.from(new Uint8Array(buffer));
  return bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
}
