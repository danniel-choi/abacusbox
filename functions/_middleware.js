import { hasValidAdminSession } from "./_lib/http.js";

const PROTECTED_PREFIXES = ["/admin/moderation"];

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (!PROTECTED_PREFIXES.some((prefix) => url.pathname === prefix || url.pathname.startsWith(`${prefix}/`))) {
    return next();
  }

  if (await hasValidAdminSession(request, env)) {
    return next();
  }

  const loginUrl = new URL("/admin", url.origin);
  loginUrl.searchParams.set("next", url.pathname + url.search);
  return Response.redirect(loginUrl.toString(), 302);
}
