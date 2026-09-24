import {
  clearAdminSessionCookie,
  createAdminSessionCookie,
  error,
  getExpectedAdminSessionValue,
  hasValidAdminSession,
  isValidAdminSecret,
  json,
  readJson
} from "../../_lib/http.js";

export async function onRequestGet(context) {
  const authenticated = await hasValidAdminSession(context.request, context.env);
  return json({ authenticated });
}

export async function onRequestPost(context) {
  const body = await readJson(context.request);
  const password = String(body?.password || "").trim();

  if (!password) {
    return error("비밀번호를 입력하세요.", 400);
  }

  const valid = await isValidAdminSecret(password, context.env);
  if (!valid) {
    return error("비밀번호가 올바르지 않습니다.", 401);
  }

  const sessionValue = await getExpectedAdminSessionValue(context.env);
  if (!sessionValue) {
    return error("관리자 인증 설정이 비어 있습니다.", 503);
  }

  return json(
    { ok: true, authenticated: true },
    {
      headers: {
        "set-cookie": createAdminSessionCookie(sessionValue)
      }
    }
  );
}

export async function onRequestDelete() {
  return json(
    { ok: true, authenticated: false },
    {
      headers: {
        "set-cookie": clearAdminSessionCookie()
      }
    }
  );
}
