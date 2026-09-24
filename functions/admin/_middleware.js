import { hasValidAdminSession } from "../_lib/http.js";

export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (url.pathname === "/admin") {
    return next();
  }

  if (await hasValidAdminSession(request, env)) {
    return next();
  }

  const loginUrl = new URL("/admin", url.origin);
  loginUrl.searchParams.set("next", url.pathname + url.search);
  return Response.redirect(loginUrl.toString(), 302);
}
