import { error, getD1Binding, json, readJson, requireAdmin, isMissingTableError, serviceUnavailable } from "../../_lib/http.js";
import { buildAutoBlogDraft, getAutoBlogOptions } from "../../_lib/blog-auto.js";
import { upsertAutoPublishedPost } from "../../_lib/auto-blog-posts.js";

async function ensureAuthor(db) {
  const existing = await db.prepare(`
    SELECT id
    FROM authors
    WHERE slug = 'operations'
    LIMIT 1
  `).first();

  if (existing?.id) {
    return existing.id;
  }

  const created = await db.prepare(`
    INSERT INTO authors (slug, name, role, bio)
    VALUES ('operations', '계산의정석 운영팀', 'admin', '자동 생성 블로그 초안을 검수하고 발행합니다.')
  `).run();

  return created.meta?.last_row_id || null;
}

export async function onRequestGet(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  return json(getAutoBlogOptions());
}

export async function onRequestPost(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  const payload = await readJson(context.request);
  const calculatorSlug = String(payload?.calculatorSlug || "");
  const templateKey = String(payload?.templateKey || "guide");
  const customTitle = payload?.title ? String(payload.title) : undefined;
  const customTags = String(payload?.tags || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (!calculatorSlug) {
    return error("calculatorSlug is required", 400);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");

    const draft = buildAutoBlogDraft(calculatorSlug, templateKey, {
      title: customTitle,
      tags: customTags
    });
    const authorId = await ensureAuthor(db);
    const publishedAt = new Date().toISOString();
    const result = await upsertAutoPublishedPost(db, draft, {
      authorId,
      publishedAt
    });

    return json({
      ok: true,
      item: {
        id: result.postId,
        slug: result.slug,
        title: result.title,
        status: result.status,
        published_at: publishedAt
      },
      action: result.action,
      duplicateReason: result.duplicateReason
    }, { status: 201 });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Auto blog generation is unavailable until D1 migrations are applied.");
  }
}
