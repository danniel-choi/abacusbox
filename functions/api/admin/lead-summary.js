import { error, getD1Binding, isMissingTableError, json, requireAdmin, serviceUnavailable } from "../../../_lib/http.js";

const TOPICS = [
  { key: "widget", label: "계산기 위젯·맞춤 도구" },
  { key: "template", label: "사업자용 계산 템플릿" },
  { key: "partnership", label: "콘텐츠·제휴 검토" }
];

export async function onRequestGet(context) {
  if (!(await requireAdmin(context.request, context.env))) {
    return error("Unauthorized", 401);
  }

  try {
    const db = getD1Binding(context.env);
    if (!db) throw new Error("D1 binding is unavailable");
    const result = await db.prepare(`
      SELECT lead_topic, COUNT(*) AS count, MAX(created_at) AS latest_at
      FROM posts
      WHERE type = 'community'
        AND board = 'qna'
        AND slug LIKE 'contact-%'
        AND lead_topic IN ('widget', 'template', 'partnership')
      GROUP BY lead_topic
    `).all();

    const byTopic = new Map((result.results || []).map((row) => [row.lead_topic, row]));
    const items = TOPICS.map((topic) => {
      const row = byTopic.get(topic.key);
      return { ...topic, count: Number(row?.count || 0), latest_at: row?.latest_at || null };
    });
    return json({ total: items.reduce((sum, item) => sum + item.count, 0), items });
  } catch (cause) {
    if (!isMissingTableError(cause) && !String(cause?.message || cause).includes("D1 binding is unavailable")) throw cause;
    return serviceUnavailable("Business lead summary is unavailable until D1 migrations are applied.");
  }
}
