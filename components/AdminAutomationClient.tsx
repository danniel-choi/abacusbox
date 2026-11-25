"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type SchedulerRun = {
  id: number;
  trigger_source: string;
  executed_at: string;
  published_count: number;
  draft_created: number;
  draft_slug: string | null;
  calculator_ideas_created?: number;
  calculator_ideas_planned?: number;
  calculator_idea_seed?: string | null;
  error_message: string | null;
};

type AdminPost = {
  id: number;
  slug: string;
  title: string;
  status: string;
  published_at: string | null;
  view_count: number;
};

type BusinessLeadSummary = {
  key: string;
  label: string;
  count: number;
  latest_at: string | null;
};

const nodes = [
  { id: "trigger", eyebrow: "01 · Trigger", title: "예약 실행 / 수동 실행", detail: "외부 Cron, 관리자 수동 실행, 예약 발행 요청", icon: "⚡" },
  { id: "generate", eyebrow: "02 · Generate", title: "자동 블로그 생성", detail: "계산기 주제와 글 유형을 선택해 제목·본문·태그 생성", icon: "✦" },
  { id: "quality", eyebrow: "03 · Quality", title: "중복·품질 검사", detail: "슬러그, 제목, 본문 유사도를 비교해 중복 콘텐츠를 정리", icon: "✓" },
  { id: "publish", eyebrow: "04 · Publish", title: "D1 공개 저장", detail: "published 상태로 저장하고 계산기·태그를 연결", icon: "↗" },
  { id: "discover", eyebrow: "05 · Discover", title: "사이트맵·검색 노출", detail: "공개 글을 사이트맵과 블로그 목록에 반영", icon: "◎" },
  { id: "deploy", eyebrow: "06 · Deploy", title: "GitHub · Cloudflare", detail: "코드 변경 시 품질 검사 후 운영 배포", icon: "◈" }
];

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function statusLabel(run: SchedulerRun | undefined) {
  if (!run) return { label: "대기", className: "bg-slate-100 text-slate-500" };
  if (run.error_message) return { label: "오류", className: "bg-red-50 text-red-700" };
  if (run.draft_created) return { label: "정상", className: "bg-brand/10 text-brand" };
  return { label: "실행됨", className: "bg-amber-50 text-amber-700" };
}

export function AdminAutomationClient() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [runs, setRuns] = useState<SchedulerRun[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [leadSummary, setLeadSummary] = useState<BusinessLeadSummary[]>([]);
  const [leadTotal, setLeadTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const latestRun = runs[0];
  const runStatus = statusLabel(latestRun);
  const successfulRuns = useMemo(() => runs.filter((run) => !run.error_message).length, [runs]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [sessionResponse, runsResponse, postsResponse, leadResponse] = await Promise.all([
        fetch("/api/admin/session", { credentials: "same-origin", cache: "no-store", headers: { accept: "application/json" } }),
        fetch("/api/admin/scheduler-run", { credentials: "same-origin", headers: { accept: "application/json" } }),
        fetch("/api/admin/content?type=blog&status=published&sort=latest&page=1&limit=6", { credentials: "same-origin", headers: { accept: "application/json" } }),
        fetch("/api/admin/lead-summary", { credentials: "same-origin", headers: { accept: "application/json" } })
      ]);

      const session = await sessionResponse.json().catch(() => null);
      if (!session?.authenticated) {
        setAuthenticated(false);
        router.replace(`/admin?next=${encodeURIComponent("/admin/automation")}`);
        return;
      }

      if (!runsResponse.ok || !postsResponse.ok || !leadResponse.ok) throw new Error("dashboard request failed");
      const runsData = await runsResponse.json();
      const postsData = await postsResponse.json();
      const leadData = await leadResponse.json();
      setAuthenticated(true);
      setRuns(Array.isArray(runsData.items) ? runsData.items : []);
      setPosts(Array.isArray(postsData.items) ? postsData.items : []);
      setLeadSummary(Array.isArray(leadData.items) ? leadData.items : []);
      setLeadTotal(Number(leadData.total || 0));
      setNotice(null);
    } catch {
      setNotice("자동화 상태를 불러오지 못했습니다. 관리자 세션과 Functions 연결을 확인하세요.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  async function runScheduler() {
    setRunning(true);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/scheduler-run", {
        method: "POST",
        credentials: "same-origin",
        headers: { accept: "application/json" }
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "scheduler failed");
      setNotice(`자동화 실행 완료 · ${data?.result?.draftSlug || "생성된 글 없음"}`);
      await loadDashboard();
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "자동화 실행에 실패했습니다.");
    } finally {
      setRunning(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE", credentials: "same-origin" });
    router.replace("/admin");
    router.refresh();
  }

  if (authenticated === false) return null;

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 xl:px-8">
      <section className="rounded-[28px] bg-ink px-6 py-9 text-white shadow-panel sm:px-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-extrabold text-brand">ADMIN · AUTOMATION CANVAS</p>
            <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">블로그 자동화 캔버스</h1>
            <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/70">
              n8n처럼 자동 생성부터 공개, 검색 노출, 운영 배포까지의 흐름과 최근 실행 결과를 한 화면에서 확인합니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void loadDashboard()} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-extrabold text-white transition hover:border-white hover:bg-white hover:text-ink">새로고침</button>
            <button type="button" onClick={runScheduler} disabled={running || loading} className="rounded-full bg-brand px-4 py-2 text-sm font-extrabold text-white transition hover:bg-[#029b72] disabled:cursor-not-allowed disabled:opacity-60">{running ? "실행 중..." : "자동화 지금 실행"}</button>
            <button type="button" onClick={logout} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-extrabold text-white transition hover:border-white hover:bg-white hover:text-ink">로그아웃</button>
          </div>
        </div>
      </section>

      {notice && <p className="mt-5 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-panel">{notice}</p>}

      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="최근 실행" value={formatDate(latestRun?.executed_at)} hint={runStatus.label} />
        <Metric label="최근 자동 글" value={latestRun?.draft_slug || "없음"} hint={latestRun?.draft_created ? "공개 처리" : "생성 기록 없음"} compact />
        <Metric label="최근 로그" value={`${runs.length}건`} hint={`정상 ${successfulRuns}건`} />
        <Metric label="공개 블로그" value={`${posts.length}건`} hint="최근 목록 기준" />
      </section>

      <section className="mt-6 rounded-[28px] border border-line bg-white p-5 shadow-panel sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-brand">BUSINESS LEADS</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">수익화 문의 현황</h2>
          </div>
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-extrabold text-brand">누적 {leadTotal}건</span>
        </div>
        <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">사업 문의 유형별 접수 건수만 집계합니다. 문의 본문·작성자 정보는 이 화면에 표시하지 않습니다.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {leadSummary.map((lead) => (
            <div key={lead.key} className="rounded-2xl border border-line bg-paper p-4">
              <p className="text-sm font-extrabold text-ink">{lead.label}</p>
              <p className="mt-3 text-3xl font-extrabold text-brand">{lead.count}<span className="ml-1 text-sm text-slate-500">건</span></p>
              <p className="mt-2 text-xs font-semibold text-slate-500">최근 접수 {formatDate(lead.latest_at)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-[28px] border border-line bg-white p-5 shadow-panel sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-brand">WORKFLOW</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">자동화 실행 흐름</h2>
          </div>
          <span className="rounded-full bg-paper px-3 py-1 text-xs font-extrabold text-slate-500">실행 데이터 기반 상태</span>
        </div>

        <div className="mt-7 grid gap-3 lg:grid-cols-6">
          {nodes.map((node, index) => (
            <div key={node.id} className="relative">
              <div className={`h-full rounded-[22px] border p-4 ${index === 0 || index === 1 || index === 3 ? "border-brand/35 bg-[#f0fffa]" : "border-line bg-paper"}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-lg text-white">{node.icon}</span>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">{node.eyebrow}</span>
                </div>
                <h3 className="mt-4 text-sm font-extrabold leading-5 text-ink">{node.title}</h3>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{node.detail}</p>
                {index === 0 && <p className="mt-3 text-[11px] font-extrabold text-brand">{latestRun ? `마지막: ${latestRun.trigger_source}` : "실행 기록 대기"}</p>}
                {index === 3 && <p className="mt-3 text-[11px] font-extrabold text-brand">{latestRun?.draft_created ? "최근 실행 성공" : "최근 실행 확인 필요"}</p>}
              </div>
              {index < nodes.length - 1 && <span aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 text-xl font-bold text-brand lg:block">›</span>}
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-semibold leading-5 text-amber-800">
          사이트맵 반영은 공개 데이터와 정적 빌드 경로를 기준으로 표시합니다. 외부 Cron이 실제로 연결되어 있는지는 실행 로그의 trigger_source와 마지막 실행 시각으로 확인하세요.
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[28px] border border-line bg-white p-5 shadow-panel sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <div><p className="text-sm font-extrabold text-brand">RUN HISTORY</p><h2 className="mt-1 text-2xl font-extrabold text-ink">최근 실행 로그</h2></div>
            <span className={`rounded-full px-3 py-1 text-xs font-extrabold ${runStatus.className}`}>{runStatus.label}</span>
          </div>
          <div className="mt-5 grid gap-3">
            {loading && <p className="text-sm font-semibold text-slate-500">로그를 불러오는 중입니다.</p>}
            {!loading && runs.length === 0 && <p className="rounded-2xl bg-paper px-4 py-5 text-sm font-semibold text-slate-500">아직 실행 로그가 없습니다.</p>}
            {!loading && runs.map((run) => (
              <div key={run.id} className="rounded-2xl border border-line bg-paper p-4">
                <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
                  <span className="rounded-full bg-ink px-3 py-1 text-white">{run.trigger_source}</span>
                  <span className="rounded-full bg-white px-3 py-1 text-slate-600">{formatDate(run.executed_at)}</span>
                  <span className={`rounded-full px-3 py-1 ${run.error_message ? "bg-red-50 text-red-700" : "bg-brand/10 text-brand"}`}>{run.error_message ? "오류" : "정상"}</span>
                </div>
                <p className="mt-3 break-all text-sm font-extrabold text-ink">{run.draft_slug || "자동 글 생성 없음"}</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold text-slate-500">
                  <span>예약 발행 {run.published_count}건</span><span>계산기 후보 {run.calculator_ideas_created || 0}건</span><span>계획 보강 {run.calculator_ideas_planned || 0}건</span>
                </div>
                {run.error_message && <p className="mt-2 text-xs font-semibold text-red-700">{run.error_message}</p>}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-line bg-white p-5 shadow-panel sm:p-7">
          <div><p className="text-sm font-extrabold text-brand">PUBLISHED CONTENT</p><h2 className="mt-1 text-2xl font-extrabold text-ink">최근 공개 블로그</h2></div>
          <div className="mt-5 grid gap-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} target="_blank" className="rounded-2xl border border-line bg-paper p-4 transition hover:border-brand hover:bg-[#f0fffa]">
                <p className="text-xs font-extrabold text-brand">{formatDate(post.published_at)}</p>
                <h3 className="mt-2 text-sm font-extrabold leading-5 text-ink">{post.title}</h3>
                <p className="mt-2 break-all text-xs font-semibold text-slate-500">/blog/{post.slug}</p>
              </Link>
            ))}
            {!loading && posts.length === 0 && <p className="rounded-2xl bg-paper px-4 py-5 text-sm font-semibold text-slate-500">공개 블로그가 없습니다.</p>}
          </div>
        </section>
      </section>

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-extrabold">
        <Link href="/admin/moderation" className="rounded-full border border-line bg-white px-4 py-2 text-ink transition hover:border-brand hover:text-brand">기존 관리자 대시보드</Link>
        <Link href="/blog" target="_blank" className="rounded-full border border-line bg-white px-4 py-2 text-ink transition hover:border-brand hover:text-brand">블로그 공개 화면 ↗</Link>
      </div>
    </main>
  );
}

function Metric({ label, value, hint, compact = false }: { label: string; value: string; hint: string; compact?: boolean }) {
  return <div className="rounded-[22px] border border-line bg-white p-5 shadow-panel"><p className="text-xs font-extrabold text-slate-500">{label}</p><p className={`mt-2 truncate font-extrabold text-ink ${compact ? "text-sm" : "text-xl"}`}>{value}</p><p className="mt-2 text-xs font-semibold text-slate-500">{hint}</p></div>;
}
