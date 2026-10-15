import { buildHourlyAutoBlogDraft } from "./blog-auto.js";
import { upsertAutoPublishedPost } from "./auto-blog-posts.js";
import { buildCalculatorIdeaSpec } from "../api/admin/calculator-ideas.js";

const AUTO_CALCULATOR_IDEA_GROUPS = [
  {
    seed: "마케팅 성과 개선",
    ideas: [
      { title: "광고 예산 배분 계산기", slug: "ad-budget-allocation-calculator", category: "금융", keyword: "광고 예산 배분" },
      { title: "CAC 회수 기간 계산기", slug: "cac-payback-period-calculator", category: "금융", keyword: "CAC 회수 기간" },
      { title: "LTV CAC 비율 계산기", slug: "ltv-cac-ratio-calculator", category: "금융", keyword: "LTV CAC" }
    ]
  },
  {
    seed: "이커머스 운영",
    ideas: [
      { title: "무료배송 손익분기점 계산기", slug: "free-shipping-break-even-calculator", category: "금융", keyword: "무료배송 손익분기점" },
      { title: "쿠폰 할인 마진 계산기", slug: "coupon-discount-margin-calculator", category: "금융", keyword: "쿠폰 할인 마진" },
      { title: "반품률 손실 계산기", slug: "return-rate-loss-calculator", category: "금융", keyword: "반품률 손실" }
    ]
  },
  {
    seed: "사주·생활 검색 확장",
    ideas: [
      { title: "생일 별 행운 숫자 계산기", slug: "birthday-lucky-number-calculator", category: "사주", keyword: "행운 숫자" },
      { title: "궁합 점수 비교 계산기", slug: "compatibility-score-comparison-calculator", category: "사주", keyword: "궁합 점수" },
      { title: "음력 기념일 D-Day 계산기", slug: "lunar-anniversary-dday-calculator", category: "생활", keyword: "음력 기념일" }
    ]
  },
  {
    seed: "금융·투자 확장",
    ideas: [
      { title: "배당 재투자 계산기", slug: "dividend-reinvestment-calculator", category: "금융", keyword: "배당 재투자" },
      { title: "목표 수익률 필요 금액 계산기", slug: "target-return-required-capital-calculator", category: "금융", keyword: "목표 수익률" },
      { title: "월 배당 생활비 계산기", slug: "monthly-dividend-income-calculator", category: "금융", keyword: "월 배당" }
    ]
  },
  {
    seed: "자동차·생활 비용",
    ideas: [
      { title: "전기차 충전비 계산기", slug: "ev-charging-cost-calculator", category: "생활", keyword: "전기차 충전비" },
      { title: "장거리 여행 경비 계산기", slug: "road-trip-cost-calculator", category: "생활", keyword: "여행 경비" },
      { title: "차량 감가상각 계산기", slug: "car-depreciation-calculator", category: "금융", keyword: "차량 감가상각" }
    ]
  }
];

function hashText(value) {
  let hash = 5381;
  for (const char of String(value || "")) {
    hash = ((hash << 5) + hash) + char.charCodeAt(0);
    hash >>>= 0;
  }
  return hash.toString(36).slice(0, 7);
}

function selectAutoCalculatorIdeaGroup(now) {
  const dayKey = Math.floor(now.getTime() / 86400000);
  return AUTO_CALCULATOR_IDEA_GROUPS[dayKey % AUTO_CALCULATOR_IDEA_GROUPS.length];
}

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

async function createAutomaticCalculatorIdeas(db, now = new Date()) {
  const group = selectAutoCalculatorIdeaGroup(now);
  let created = 0;

  try {
    for (const [index, idea] of group.ideas.entries()) {
      const existing = await db.prepare(`
        SELECT id
        FROM calculator_ideas
        WHERE slug = ?
        LIMIT 1
      `).bind(idea.slug).first();

      if (existing?.id) continue;

      const priority = Math.max(50, 86 - index * 7);
      const reason = [
        `자동 업데이트 큐 '${group.seed}'에서 생성`,
        `검색 확장 키워드 '${idea.keyword}'`,
        "관리자 검증 후 실제 계산기로 반영"
      ].join(" · ");
      const spec = buildCalculatorIdeaSpec(idea.title, idea.category, idea.slug, {
        seed: group.seed,
        keyword: idea.keyword,
        source: "scheduler",
        stage: "candidate"
      });

      await db.prepare(`
        INSERT INTO calculator_ideas (
          title,
          slug,
          category,
          seed_keyword,
          source_url,
          reason,
          priority,
          status,
          generated_spec_json,
          updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, 'candidate', ?, CURRENT_TIMESTAMP)
      `).bind(
        idea.title,
        idea.slug,
        idea.category,
        idea.keyword,
        null,
        reason,
        priority,
        JSON.stringify(spec)
      ).run();

      created += 1;
    }
  } catch {
    return {
      seed: group.seed,
      created: 0,
      queueId: hashText(`${group.seed}:${now.toISOString().slice(0, 10)}`)
    };
  }

  return {
    seed: group.seed,
    created,
    queueId: hashText(`${group.seed}:${now.toISOString().slice(0, 10)}`)
  };
}

async function planAutomaticCalculatorIdeas(db, now = new Date()) {
  let planned = 0;

  try {
    const result = await db.prepare(`
      SELECT id, title, slug, category, seed_keyword, generated_spec_json
      FROM calculator_ideas
      WHERE status = 'candidate'
      ORDER BY priority DESC, datetime(updated_at) ASC, id ASC
      LIMIT 2
    `).all();

    for (const idea of result.results || []) {
      let existingSpec = null;
      try {
        existingSpec = idea.generated_spec_json ? JSON.parse(idea.generated_spec_json) : null;
      } catch {
        existingSpec = null;
      }

      if (existingSpec?.automation?.stage === "ready_for_build") continue;

      const spec = buildCalculatorIdeaSpec(String(idea.title), String(idea.category), String(idea.slug), {
        seed: existingSpec?.automation?.seed || String(idea.seed_keyword || ""),
        keyword: String(idea.seed_keyword || idea.title || ""),
        source: "scheduler",
        stage: "ready_for_build",
        plannedAt: now.toISOString()
      });

      await db.prepare(`
        UPDATE calculator_ideas
        SET generated_spec_json = ?,
            status = 'planned',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(JSON.stringify(spec), idea.id).run();

      planned += 1;
    }
  } catch {
    return 0;
  }

  return planned;
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
        calculator_ideas_created,
        calculator_ideas_planned,
        calculator_idea_seed,
        error_message
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      result.triggerSource,
      result.executedAt,
      result.publishedCount,
      result.draftCreated ? 1 : 0,
      result.draftSlug || null,
      result.calculatorIdeasCreated || 0,
      result.calculatorIdeasPlanned || 0,
      result.calculatorIdeaSeed || null,
      result.errorMessage || null
    ).run();
  } catch {
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
}

export async function executeSchedulerRun(db, options = {}) {
  const triggerSource = String(options.triggerSource || "cron");
  const now = options.now instanceof Date ? options.now : new Date();
  const executedAt = now.toISOString();

  try {
    const publishedCount = await publishScheduledDrafts(db);
    const draftResult = await createHourlyDraft(db, now);
    const calculatorIdeaResult = await createAutomaticCalculatorIdeas(db, now);
    const calculatorIdeasPlanned = await planAutomaticCalculatorIdeas(db, now);
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
      calculatorIdeasCreated: calculatorIdeaResult.created,
      calculatorIdeasPlanned,
      calculatorIdeaSeed: calculatorIdeaResult.seed,
      calculatorIdeaQueueId: calculatorIdeaResult.queueId,
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
      calculatorIdeasCreated: 0,
      calculatorIdeasPlanned: 0,
      calculatorIdeaSeed: null,
      calculatorIdeaQueueId: null,
      errorMessage: String(cause?.message || cause || "Unknown scheduler error")
    };
    await recordSchedulerRun(db, result);
    throw cause;
  }
}
