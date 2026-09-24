import { buildHourlyAutoBlogDraft } from "./blog-auto.js";
import { upsertAutoPublishedPost } from "./auto-blog-posts.js";

async function ensureOperationsAuthor(db) {
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

async function publishScheduledDrafts(db) {
  const due = await db.prepare(`
    SELECT id
    FROM posts
    WHERE status = 'draft'
      AND published_at IS NOT NULL
      AND datetime(published_at) <= datetime('now')
    ORDER BY datetime(published_at) ASC, id ASC
    LIMIT 50
  `).all();

  const items = due.results || [];

  for (const item of items) {
    await db.prepare(`
      UPDATE posts
      SET status = 'published',
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(item.id).run();
  }

  return items.length;
}

async function createHourlyDraft(db, now = new Date()) {
  const draft = buildHourlyAutoBlogDraft(now);
  const authorId = await ensureOperationsAuthor(db);
  const publishedAt = now.toISOString();
  return upsertAutoPublishedPost(db, draft, {
    authorId,
    publishedAt
  });
}

async function recordSchedulerRun(db, result) {
  try {
    await db.prepare(`
      INSERT INTO scheduler_runs (
        trigger_source,
        executed_at,
        published_count,
        draft_created,
        draft_slug,
        error_message
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      result.triggerSource,
      result.executedAt,
      result.publishedCount,
      result.draftCreated ? 1 : 0,
      result.draftSlug || null,
      result.errorMessage || null
    ).run();
  } catch {
    // Ignore when migrations are not yet applied; the scheduler should still work.
  }
}

export async function executeSchedulerRun(db, options = {}) {
  const triggerSource = String(options.triggerSource || "cron");
  const now = options.now instanceof Date ? options.now : new Date();
  const executedAt = now.toISOString();

  try {
    const publishedCount = await publishScheduledDrafts(db);
    const draftResult = await createHourlyDraft(db, now);
    const result = {
      ok: true,
      triggerSource,
      executedAt,
      publishedCount,
      draftCreated: draftResult.action === "created" || draftResult.action === "republished",
      draftSlug: draftResult.slug,
      autoPostAction: draftResult.action,
      autoPostId: draftResult.postId,
      duplicateReason: draftResult.duplicateReason,
      errorMessage: null
    };
    await recordSchedulerRun(db, result);
    return result;
  } catch (cause) {
    const result = {
      ok: false,
      triggerSource,
      executedAt,
      publishedCount: 0,
      draftCreated: false,
      draftSlug: null,
      autoPostAction: null,
      autoPostId: null,
      duplicateReason: null,
      errorMessage: String(cause?.message || cause || "Unknown scheduler error")
    };
    await recordSchedulerRun(db, result);
    throw cause;
  }
}
