import { hasValidAdminSession } from "./_lib/http.js";

const PROTECTED_PREFIXES = ["/admin/moderation"];

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Keep one canonical host so Google does not split signals between the apex
  // domain and the www domain. Preserve the path and query string.
  if (url.hostname === "abacusbox.com") {
    url.hostname = "www.abacusbox.com";
    return Response.redirect(url.toString(), 308);
  }

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
