import { error, json, requireAdmin } from "../../_lib/http.js";

export async function onRequestGet(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const provided = context.request.headers.get("x-admin-token") || "";
  const configured = context.env.ADMIN_API_TOKEN || "";

  return json({
    hasConfiguredToken: configured.length > 0,
    hasConfiguredHash: Boolean(context.env.ADMIN_API_TOKEN_SHA256),
    configuredLength: configured.length,
    providedLength: provided.length,
    authorized: await requireAdmin(context.request, context.env)
  });
}
