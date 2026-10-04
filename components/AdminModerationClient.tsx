"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type AdminComment = {
  id: number;
  post_id: number;
  parent_id: number | null;
  author_name: string;
  body: string;
  status: string;
  created_at: string;
  post_slug: string;
  post_title: string;
};

type AdminPost = {
  id: number;
  type: string;
  board: string | null;
  slug: string;
  title: string;
  status: string;
  published_at: string | null;
  featured: number;
  view_count: number;
  comment_count: number;
  like_count: number;
  author_name: string | null;
};

type AdminPostDetail = AdminPost & {
  excerpt: string | null;
  body_md: string;
  tags?: { slug: string; name: string }[];
};

type AutoBlogOption = {
  slug: string;
  title: string;
  category: string;
};

type AutoBlogTemplate = {
  key: string;
  label: string;
};

type EditDraft = {
  title: string;
  excerpt: string;
  body: string;
  tags: string;
  status: string;
  publishedAt: string;
  featured: boolean;
};

type EditSnapshot = EditDraft & {
  savedAt: string;
};

type TagSuggestion = {
  slug: string;
  name: string;
  post_count?: number;
};

type SchedulerRun = {
  id: number;
  trigger_source: string;
  executed_at: string;
  published_count: number;
  draft_created: number;
  draft_slug: string | null;
  error_message: string | null;
  created_at: string;
};

type CalculatorIdea = {
  id: number;
  title: string;
  slug: string;
  category: string;
  seed_keyword: string | null;
  source_url: string | null;
  reason: string | null;
  priority: number;
  status: string;
  generated_spec_json: string | null;
  created_at: string;
  updated_at: string;
};

type VisitorStats = {
  activeVisitors: number;
  todayVisitors: number;
  totalVisitors: number;
  activeWindowMinutes: number;
  source?: string;
  topPages?: PageVisitStats[];
};

type PageVisitStats = {
  path: string;
  totalViews: number;
  totalVisitors: number;
  todayViews: number;
  todayVisitors: number;
  lastSeenAt: string | null;
};

type AdminPostListResponse = {
  items: AdminPost[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type AdminCommentListResponse = {
  items: AdminComment[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

type AdminView = "content" | "editor" | "comments" | "automation" | "calculatorIdeas" | "tags";
type PostFilters = {
  type: string;
  status: string;
  schedule: string;
  query: string;
  sort: string;
};

const EDIT_DRAFT_STORAGE_KEY = "calcrule:admin-edit-draft";
const EDIT_HISTORY_STORAGE_KEY = "calcrule:admin-edit-history";
const EDIT_HISTORY_LIMIT = 5;

export function AdminModerationClient() {
  const router = useRouter();
  const [token] = useState("");
  const [commentStatus, setCommentStatus] = useState("pending");
  const [activeView, setActiveView] = useState<AdminView>("content");
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [commentPage, setCommentPage] = useState(1);
  const [commentLimit] = useState(12);
  const [commentTotal, setCommentTotal] = useState(0);
  const [commentTotalPages, setCommentTotalPages] = useState(1);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [contentPage, setContentPage] = useState(1);
  const [contentLimit] = useState(12);
  const [contentTotal, setContentTotal] = useState(0);
  const [contentTotalPages, setContentTotalPages] = useState(1);
  const [contentType, setContentType] = useState("");
  const [contentStatus, setContentStatus] = useState("");
  const [contentSchedule, setContentSchedule] = useState("");
  const [contentQuery, setContentQuery] = useState("");
  const [contentSort, setContentSort] = useState("latest");
  const [autoBlogOptions, setAutoBlogOptions] = useState<AutoBlogOption[]>([]);
  const [autoBlogTemplates, setAutoBlogTemplates] = useState<AutoBlogTemplate[]>([]);
  const [autoBlogCalculator, setAutoBlogCalculator] = useState("");
  const [autoBlogTemplate, setAutoBlogTemplate] = useState("guide");
  const [autoBlogTitle, setAutoBlogTitle] = useState("");
  const [autoBlogTags, setAutoBlogTags] = useState("");
  const [autoBlogTagSuggestions, setAutoBlogTagSuggestions] = useState<TagSuggestion[]>([]);
  const [scheduleAt, setScheduleAt] = useState("");
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editBody, setEditBody] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editTagSuggestions, setEditTagSuggestions] = useState<TagSuggestion[]>([]);
  const [tagLibrary, setTagLibrary] = useState<TagSuggestion[]>([]);
  const [tagLibraryQuery, setTagLibraryQuery] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [editStatus, setEditStatus] = useState("draft");
  const [editPublishedAt, setEditPublishedAt] = useState("");
  const [editFeatured, setEditFeatured] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [editHistory, setEditHistory] = useState<EditSnapshot[]>([]);
  const [schedulerRuns, setSchedulerRuns] = useState<SchedulerRun[]>([]);
  const [visitorStats, setVisitorStats] = useState<VisitorStats | null>(null);
  const [calculatorIdeas, setCalculatorIdeas] = useState<CalculatorIdea[]>([]);
  const [ideaSeedKeyword, setIdeaSeedKeyword] = useState("");
  const [ideaSourceUrl, setIdeaSourceUrl] = useState("");
  const [ideaMemoText, setIdeaMemoText] = useState("");
  const [ideaStatusFilter, setIdeaStatusFilter] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadingAutoBlogOptions, setLoadingAutoBlogOptions] = useState(false);
  const [creatingAutoBlog, setCreatingAutoBlog] = useState(false);
  const [creatingQuickPost, setCreatingQuickPost] = useState(false);
  const [runningScheduler, setRunningScheduler] = useState(false);
  const [loadingSchedulerRuns, setLoadingSchedulerRuns] = useState(false);
  const [loadingVisitorStats, setLoadingVisitorStats] = useState(false);
  const [loadingCalculatorIdeas, setLoadingCalculatorIdeas] = useState(false);
  const [generatingCalculatorIdeas, setGeneratingCalculatorIdeas] = useState(false);
  const [clearingTestVisitors, setClearingTestVisitors] = useState(false);
  const [loadingEditPost, setLoadingEditPost] = useState(false);
  const [savingEditPost, setSavingEditPost] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const isReady = true;
  const previewBlocks = useMemo(() => buildPreviewBlocks(editBody), [editBody]);

  function applyEditDraftState(draft: EditDraft) {
    setEditTitle(draft.title ?? "");
    setEditExcerpt(draft.excerpt ?? "");
    setEditBody(draft.body ?? "");
    setEditTags(draft.tags ?? "");
    setEditStatus(draft.status ?? "draft");
    setEditPublishedAt(draft.publishedAt ?? "");
    setEditFeatured(Boolean(draft.featured));
  }

  function updateContentFilters(updates: Partial<PostFilters>) {
    if (Object.prototype.hasOwnProperty.call(updates, "type")) setContentType(updates.type ?? "");
    if (Object.prototype.hasOwnProperty.call(updates, "status")) setContentStatus(updates.status ?? "");
    if (Object.prototype.hasOwnProperty.call(updates, "schedule")) setContentSchedule(updates.schedule ?? "");
    if (Object.prototype.hasOwnProperty.call(updates, "query")) setContentQuery(updates.query ?? "");
    if (Object.prototype.hasOwnProperty.call(updates, "sort")) setContentSort(updates.sort ?? "latest");
    setContentPage(1);
  }

  async function fetchComments(nextStatus = commentStatus, nextPage = commentPage) {
    if (!isReady) {
      setNotice("관리자 로그인이 필요합니다.");
      return;
    }

    setLoadingComments(true);
    try {
      const params = new URLSearchParams();
      params.set("status", nextStatus);
      params.set("page", String(nextPage));
      params.set("limit", String(commentLimit));
      const response = await fetch(`/api/admin/comments?${params.toString()}`, {
        credentials: "same-origin",
        headers: adminHeaders(token)
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data: AdminCommentListResponse = await response.json();
      setComments(Array.isArray(data.items) ? data.items : []);
      setCommentPage(Number(data.page || nextPage || 1));
      setCommentTotal(Number(data.total || 0));
      setCommentTotalPages(Math.max(1, Number(data.totalPages || 1)));
      setNotice(null);
    } catch {
      setNotice("댓글 목록을 불러오지 못했습니다. 관리자 세션과 Functions 연결을 확인하세요.");
    } finally {
      setLoadingComments(false);
    }
  }

  async function fetchPosts(nextPage = contentPage, overrides: Partial<PostFilters> = {}) {
    if (!isReady) {
      setNotice("관리자 로그인이 필요합니다.");
      return;
    }

    const nextType = overrides.type ?? contentType;
    const nextStatus = overrides.status ?? contentStatus;
    const nextSchedule = overrides.schedule ?? contentSchedule;
    const nextQuery = overrides.query ?? contentQuery;
    const nextSort = overrides.sort ?? contentSort;

    setLoadingPosts(true);
    try {
      const params = new URLSearchParams();
      if (nextType) params.set("type", nextType);
      if (nextStatus) params.set("status", nextStatus);
      if (nextSchedule) params.set("schedule", nextSchedule);
      if (nextQuery.trim()) params.set("q", nextQuery.trim());
      if (nextSort) params.set("sort", nextSort);
      params.set("page", String(nextPage));
      params.set("limit", String(contentLimit));
      const response = await fetch(`/api/admin/content${params.toString() ? `?${params.toString()}` : ""}`, {
        credentials: "same-origin",
        headers: adminHeaders(token)
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data: AdminPostListResponse = await response.json();
      updateContentFilters({
        type: nextType,
        status: nextStatus,
        schedule: nextSchedule,
        query: nextQuery,
        sort: nextSort
      });
      setPosts(Array.isArray(data.items) ? data.items : []);
      setContentPage(Number(data.page || nextPage || 1));
      setContentTotal(Number(data.total || 0));
      setContentTotalPages(Math.max(1, Number(data.totalPages || 1)));
      setNotice(null);
    } catch {
      setNotice("게시글 목록을 불러오지 못했습니다.");
    } finally {
      setLoadingPosts(false);
    }
  }

  async function updateCommentStatus(commentId: number, status: "approved" | "rejected" | "spam") {
    if (!isReady) {
      setNotice("관리자 로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch(`/api/admin/comments/${commentId}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: adminHeaders(token, true),
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setComments((current) => current.filter((item) => item.id !== commentId));
      setCommentTotal((current) => Math.max(0, current - 1));
      setNotice(`댓글 #${commentId} 상태를 ${status}로 변경했습니다.`);
    } catch {
      setNotice(`댓글 #${commentId} 처리에 실패했습니다.`);
    }
  }

  async function fetchAutoBlogOptions() {
    if (!isReady) {
      setNotice("관리자 로그인이 필요합니다.");
      return;
    }

    setLoadingAutoBlogOptions(true);
    try {
      const response = await fetch("/api/admin/blog-auto", {
        credentials: "same-origin",
        headers: adminHeaders(token)
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      const calculators = Array.isArray(data.calculators) ? data.calculators : [];
      const templates = Array.isArray(data.templates) ? data.templates : [];
      setAutoBlogOptions(calculators);
      setAutoBlogTemplates(templates);
      setAutoBlogCalculator((current) => current || calculators[0]?.slug || "");
      setAutoBlogTemplate((current) => current || templates[0]?.key || "guide");
      setNotice(null);
    } catch {
      setNotice("자동 글 생성 옵션을 불러오지 못했습니다.");
    } finally {
      setLoadingAutoBlogOptions(false);
    }
  }

  async function createAutoBlogDraft() {
    if (!isReady) {
      setNotice("관리자 로그인이 필요합니다.");
      return;
    }

    if (!autoBlogCalculator) {
      setNotice("자동 생성할 계산기 주제를 선택하세요.");
      return;
    }

    setCreatingAutoBlog(true);
    try {
      const response = await fetch("/api/admin/blog-auto", {
        method: "POST",
        credentials: "same-origin",
        headers: adminHeaders(token, true),
        body: JSON.stringify({
          calculatorSlug: autoBlogCalculator,
          templateKey: autoBlogTemplate,
          title: autoBlogTitle.trim(),
          tags: autoBlogTags.trim()
        })
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      const action = data?.action;
      const title = data?.item?.title || "새 블로그 글";
      if (action === "republished") {
        setNotice(`중복 글 재발행 완료: ${title}`);
      } else if (action === "discarded") {
        setNotice(`중복 글 감지로 새 발행 생략: ${title}`);
      } else {
        setNotice(`자동 발행 완료: ${title}`);
      }
      await fetchPosts();
    } catch {
      setNotice("자동 블로그 초안 생성에 실패했습니다.");
    } finally {
      setCreatingAutoBlog(false);
    }
  }

  async function fetchSchedulerRuns() {
    if (!isReady) {
      setNotice("관리자 로그인이 필요합니다.");
      return;
    }

    setLoadingSchedulerRuns(true);
    try {
      const response = await fetch("/api/admin/scheduler-run", {
        credentials: "same-origin",
        headers: adminHeaders(token)
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      setSchedulerRuns(Array.isArray(data.items) ? data.items : []);
      setNotice(null);
    } catch {
      setNotice("스케줄러 실행 로그를 불러오지 못했습니다.");
    } finally {
      setLoadingSchedulerRuns(false);
    }
  }

  async function runSchedulerNow() {
    if (!isReady) {
      setNotice("관리자 로그인이 필요합니다.");
      return;
    }

    setRunningScheduler(true);
    try {
      const response = await fetch("/api/admin/scheduler-run", {
        method: "POST",
        credentials: "same-origin",
        headers: adminHeaders(token)
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      const result = data?.result;
      const actionLabel =
        result?.autoPostAction === "republished"
          ? "기존 글 재발행"
          : result?.autoPostAction === "discarded"
            ? "중복 폐기"
            : result?.autoPostAction === "created"
              ? "신규 발행"
              : "처리 없음";
      setNotice(
        `cron 수동 실행 완료 · 예약 발행 ${result?.publishedCount ?? 0}건 · 자동 글 ${actionLabel}${result?.draftSlug ? ` · ${result.draftSlug}` : ""}`
      );
      await Promise.all([fetchPosts(), fetchSchedulerRuns()]);
    } catch {
      setNotice("cron 수동 실행에 실패했습니다.");
    } finally {
      setRunningScheduler(false);
    }
  }

  async function fetchVisitorStats() {
    setLoadingVisitorStats(true);
    try {
      const response = await fetch("/api/visitors", {
        credentials: "same-origin",
        headers: adminHeaders(token)
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data: VisitorStats = await response.json();
      setVisitorStats(data);
      setNotice(null);
    } catch {
      setNotice("방문자 통계를 불러오지 못했습니다.");
    } finally {
      setLoadingVisitorStats(false);
    }
  }

  async function clearTestVisitors() {
    if (!isReady) {
      setNotice("관리자 로그인이 필요합니다.");
      return;
    }

    const confirmed = window.confirm("검증용 테스트 방문자만 삭제합니다. 계속할까요?");
    if (!confirmed) return;

    setClearingTestVisitors(true);
    try {
      const response = await fetch("/api/visitors", {
        method: "DELETE",
        credentials: "same-origin",
        headers: adminHeaders(token)
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      setVisitorStats(data?.stats || null);
      setNotice(`테스트 방문자 ${Number(data?.deletedCount || 0)}건을 정리했습니다.`);
    } catch {
      setNotice("테스트 방문자 정리에 실패했습니다.");
    } finally {
      setClearingTestVisitors(false);
    }
  }

  async function fetchCalculatorIdeas(status = ideaStatusFilter) {
    setLoadingCalculatorIdeas(true);
    try {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      const response = await fetch(`/api/admin/calculator-ideas${params.toString() ? `?${params.toString()}` : ""}`, {
        credentials: "same-origin",
        headers: adminHeaders(token)
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      setCalculatorIdeas(Array.isArray(data.items) ? data.items : []);
      setNotice(null);
    } catch {
      setNotice("계산기 후보를 불러오지 못했습니다.");
    } finally {
      setLoadingCalculatorIdeas(false);
    }
  }

  async function generateCalculatorIdeas() {
    if (!ideaSeedKeyword.trim() && !ideaSourceUrl.trim() && !ideaMemoText.trim()) {
      setNotice("검색어, 참고 URL, 메모 중 하나는 입력해야 합니다.");
      return;
    }

    setGeneratingCalculatorIdeas(true);
    try {
      const response = await fetch("/api/admin/calculator-ideas", {
        method: "POST",
        credentials: "same-origin",
        headers: adminHeaders(token, true),
        body: JSON.stringify({
          seedKeyword: ideaSeedKeyword,
          sourceUrl: ideaSourceUrl,
          memoText: ideaMemoText
        })
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      setCalculatorIdeas(Array.isArray(data.items) ? data.items : []);
      setNotice(`계산기 후보 ${Number(data.items?.length || 0)}개를 생성했습니다.`);
      void fetchCalculatorIdeas();
    } catch {
      setNotice("계산기 후보 생성에 실패했습니다.");
    } finally {
      setGeneratingCalculatorIdeas(false);
    }
  }

  async function updateCalculatorIdeaStatus(id: number, status: string) {
    try {
      const response = await fetch("/api/admin/calculator-ideas", {
        method: "PATCH",
        credentials: "same-origin",
        headers: adminHeaders(token, true),
        body: JSON.stringify({ id, status })
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setCalculatorIdeas((items) => items.map((item) => item.id === id ? { ...item, status } : item));
      setNotice("계산기 후보 상태를 변경했습니다.");
    } catch {
      setNotice("계산기 후보 상태 변경에 실패했습니다.");
    }
  }

  async function generateCalculatorIdeaDraft(id: number) {
    try {
      const response = await fetch("/api/admin/calculator-ideas", {
        method: "PATCH",
        credentials: "same-origin",
        headers: adminHeaders(token, true),
        body: JSON.stringify({ id, action: "generateDraft" })
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      if (data.item) {
        setCalculatorIdeas((items) => items.map((item) => item.id === id ? data.item : item));
      }
      setNotice("계산기 구현 초안을 생성했습니다.");
    } catch {
      setNotice("계산기 구현 초안 생성에 실패했습니다.");
    }
  }

  async function copyCalculatorIdeaCode(idea: CalculatorIdea) {
    const code = getCalculatorIdeaCode(idea);
    if (!code) {
      setNotice("복사할 구현 코드가 없습니다. 먼저 구현 초안을 생성하세요.");
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      setNotice("계산기 구현 코드를 복사했습니다.");
    } catch {
      setNotice("브라우저 클립보드 복사에 실패했습니다.");
    }
  }

  async function createQuickSamplePost() {
    if (!isReady) {
      setNotice("관리자 로그인이 필요합니다.");
      return;
    }

    setCreatingQuickPost(true);
    try {
      const date = new Date();
      const dateCode = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
        String(date.getHours()).padStart(2, "0"),
        String(date.getMinutes()).padStart(2, "0"),
        String(date.getSeconds()).padStart(2, "0")
      ].join("");
      const title = `운영 테스트용 새 글 ${dateCode}`;
      const slug = `quick-post-${dateCode}`;
      const body = [
        `# ${title}`,
        "",
        "이 글은 관리자 화면에서 새 글 자동 등록 버튼으로 생성한 샘플 초안입니다.",
        "",
        "## 포함한 내용",
        "- 관리자 기능 동작 확인",
        "- 블로그 목록 반영 확인",
        "- 수정 및 발행 흐름 점검",
        "",
        "## 다음 작업",
        "운영자는 이 초안을 열어서 제목, 요약, 본문, 태그를 실제 내용으로 교체한 뒤 발행하면 됩니다."
      ].join("\n");

      const response = await fetch("/api/admin/posts", {
        method: "POST",
        credentials: "same-origin",
        headers: adminHeaders(token, true),
        body: JSON.stringify({
          type: "blog",
          board: "blog",
          slug,
          title,
          excerpt: "관리자 화면에서 자동 등록한 샘플 블로그 초안입니다.",
          body_md: body,
          status: "draft",
          featured: false
        })
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      const nextFilters = { type: "blog", status: "draft" };
      updateContentFilters(nextFilters);
      setNotice(`새 글 자동 등록 완료: ${title}${data?.id ? ` (#${data.id})` : ""}`);
      await fetchPosts(1, nextFilters);
      if (typeof data?.id === "number") {
        await openEditPost(data.id);
      }
    } catch {
      setNotice("새 글 자동 등록에 실패했습니다.");
    } finally {
      setCreatingQuickPost(false);
    }
  }

  async function publishPost(postId: number) {
    if (!isReady) {
      setNotice("관리자 로그인이 필요합니다.");
      return;
    }

    try {
      const response = await fetch("/api/admin/publish", {
        method: "POST",
        credentials: "same-origin",
        headers: adminHeaders(token, true),
        body: JSON.stringify({ post_id: postId })
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setNotice(`게시글 #${postId}를 발행했습니다.`);
      await fetchPosts();
    } catch {
      setNotice(`게시글 #${postId} 발행에 실패했습니다.`);
    }
  }

  async function schedulePost(postId: number) {
    if (!isReady) {
      setNotice("관리자 로그인이 필요합니다.");
      return;
    }

    if (!scheduleAt) {
      setNotice("예약 발행 시각을 먼저 입력하세요.");
      return;
    }

    try {
      const target = new Date(scheduleAt);
      const response = await fetch("/api/admin/schedule", {
        method: "POST",
        credentials: "same-origin",
        headers: adminHeaders(token, true),
        body: JSON.stringify({
          post_id: postId,
          published_at: target.toISOString()
        })
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setNotice(`게시글 #${postId} 예약 발행 시각을 저장했습니다.`);
      await fetchPosts();
    } catch {
      setNotice(`게시글 #${postId} 예약 발행 설정에 실패했습니다.`);
    }
  }

  async function openEditPost(postId: number) {
    if (!isReady) {
      setNotice("관리자 로그인이 필요합니다.");
      return;
    }

    setLoadingEditPost(true);
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        credentials: "same-origin",
        headers: adminHeaders(token)
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data: AdminPostDetail = await response.json();
      const savedDraft = readEditDraft(postId);
      setEditingPostId(postId);
      setEditHistory(readEditHistory(postId));
      if (savedDraft) {
        applyEditDraftState(savedDraft);
        setDraftRestored(true);
      } else {
        applyEditDraftState({
          title: data.title || "",
          excerpt: data.excerpt || "",
          body: data.body_md || "",
          tags: Array.isArray(data.tags) ? data.tags.map((item) => item.name).join(", ") : "",
          status: data.status || "draft",
          publishedAt: data.published_at ? toDateTimeLocalValue(data.published_at) : "",
          featured: Boolean(data.featured)
        });
        setDraftRestored(false);
      }
      setNotice(null);
    } catch {
      setNotice(`게시글 #${postId} 상세 정보를 불러오지 못했습니다.`);
    } finally {
      setLoadingEditPost(false);
    }
  }

  async function savePostEdit() {
    if (!isReady || !editingPostId) {
      setNotice("수정할 게시글을 먼저 선택하세요.");
      return;
    }

    setSavingEditPost(true);
    try {
      const response = await fetch(`/api/admin/posts/${editingPostId}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: adminHeaders(token, true),
        body: JSON.stringify({
          title: editTitle.trim(),
          excerpt: editExcerpt.trim(),
          body_md: editBody,
          tags: editTags,
          status: editStatus,
          published_at: editPublishedAt ? new Date(editPublishedAt).toISOString() : null,
          featured: editFeatured
        })
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setNotice(`게시글 #${editingPostId} 수정 내용을 저장했습니다.`);
      clearEditDraft(editingPostId);
      pushEditHistory(editingPostId, {
        title: editTitle,
        excerpt: editExcerpt,
        body: editBody,
        tags: editTags,
        status: editStatus,
        publishedAt: editPublishedAt,
        featured: editFeatured,
        savedAt: new Date().toISOString()
      });
      setEditHistory(readEditHistory(editingPostId));
      setDraftRestored(false);
      await fetchPosts();
    } catch {
      setNotice(`게시글 #${editingPostId} 저장에 실패했습니다.`);
    } finally {
      setSavingEditPost(false);
    }
  }

  useEffect(() => {
    if (typeof window === "undefined" || !editingPostId || loadingEditPost) return;

    writeEditDraft(editingPostId, {
      title: editTitle,
      excerpt: editExcerpt,
      body: editBody,
      tags: editTags,
      status: editStatus,
      publishedAt: editPublishedAt,
      featured: editFeatured
    });
  }, [editingPostId, loadingEditPost, editTitle, editExcerpt, editBody, editTags, editStatus, editPublishedAt, editFeatured]);

  useEffect(() => {
    void fetchTagSuggestions(autoBlogTags, setAutoBlogTagSuggestions, isReady ? token : "");
  }, [autoBlogTags, isReady, token]);

  useEffect(() => {
    void fetchTagSuggestions(editTags, setEditTagSuggestions, isReady ? token : "");
  }, [editTags, isReady, token]);

  useEffect(() => {
    void fetchTagLibrary(tagLibraryQuery, setTagLibrary, isReady ? token : "");
  }, [tagLibraryQuery, isReady, token]);

  async function createTag() {
    if (!isReady) {
      setNotice("관리자 로그인이 필요합니다.");
      return;
    }

    if (!newTagName.trim()) {
      setNotice("새 태그 이름을 입력하세요.");
      return;
    }

    try {
      const response = await fetch("/api/admin/tags", {
        method: "POST",
        credentials: "same-origin",
        headers: adminHeaders(token, true),
        body: JSON.stringify({ name: newTagName.trim() })
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setNotice(`태그 생성 완료: ${newTagName.trim()}`);
      setNewTagName("");
      await fetchTagLibrary(tagLibraryQuery, setTagLibrary, token);
    } catch {
      setNotice("태그 생성에 실패했습니다.");
    }
  }

  async function deleteTag(tag: TagSuggestion) {
    if (!isReady) {
      setNotice("관리자 로그인이 필요합니다.");
      return;
    }

    const countLabel = typeof tag.post_count === "number" ? `${tag.post_count}개 게시글` : "연결 게시글";
    const confirmed = window.confirm(`태그 "${tag.name}"을 삭제합니다. ${countLabel}의 연결도 함께 제거됩니다.`);
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/tags?slug=${encodeURIComponent(tag.slug)}`, {
        method: "DELETE",
        credentials: "same-origin",
        headers: adminHeaders(token)
      });
      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      setNotice(`태그 삭제 완료: ${tag.name}`);
      setAutoBlogTagSuggestions((current) => current.filter((item) => item.slug !== tag.slug));
      setEditTagSuggestions((current) => current.filter((item) => item.slug !== tag.slug));
      setTagLibrary((current) => current.filter((item) => item.slug !== tag.slug));
      await fetchTagLibrary(tagLibraryQuery, setTagLibrary, token);
    } catch {
      setNotice(`태그 삭제에 실패했습니다: ${tag.name}`);
    }
  }

  function restoreSnapshot(snapshot: EditSnapshot) {
    applyEditDraftState(snapshot);
    setDraftRestored(false);
    setNotice(`저장 이력 ${formatDateTime(snapshot.savedAt)} 상태로 복구했습니다.`);
  }

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 xl:px-8">
      <section className="rounded-[28px] bg-ink px-6 py-10 text-white shadow-panel">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-extrabold text-brand">운영 도구</p>
            <h1 className="mt-2 text-4xl font-extrabold">관리자 운영 대시보드</h1>
            <p className="mt-4 max-w-4xl text-base font-medium leading-7 text-white/70">
              댓글, 콘텐츠, 자동화, 태그, 편집 기능을 카테고리별로 나눠서 한 화면에서 관리합니다.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard label="댓글 대기" value={String(comments.length)} hint={`${commentStatus} 기준`} />
            <SummaryCard label="조회 게시글" value={String(posts.length)} hint={contentType || "전체 타입"} />
            <SummaryCard label="편집 대상" value={editingPostId ? `#${editingPostId}` : "-"} hint={editingPostId ? editStatus : "선택 없음"} />
            <SummaryCard label="cron 로그" value={String(schedulerRuns.length)} hint="최근 실행 이력" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={async () => {
                await fetch("/api/admin/session", { method: "DELETE", credentials: "same-origin" });
                router.replace("/admin");
                router.refresh();
              }}
              className="rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-extrabold text-white transition hover:border-white hover:bg-white hover:text-ink"
            >
              관리자 로그아웃
            </button>
          </div>
        </div>
      </section>

      {notice && <p className="mt-6 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-panel">{notice}</p>}

      <section className="mt-6 rounded-[24px] border border-line bg-white p-4 shadow-panel">
        <div className="flex flex-wrap gap-2">
          <AdminViewButton active={activeView === "content"} label="콘텐츠" onClick={() => setActiveView("content")} />
          <AdminViewButton active={activeView === "editor"} label="편집기" onClick={() => setActiveView("editor")} />
          <AdminViewButton active={activeView === "comments"} label="댓글" onClick={() => setActiveView("comments")} />
          <AdminViewButton
            active={activeView === "automation"}
            label="자동화"
            onClick={() => {
              setActiveView("automation");
              void fetchVisitorStats();
            }}
          />
          <AdminViewButton
            active={activeView === "calculatorIdeas"}
            label="계산기 발굴"
            onClick={() => {
              setActiveView("calculatorIdeas");
              void fetchCalculatorIdeas();
            }}
          />
          <AdminViewButton active={activeView === "tags"} label="태그" onClick={() => setActiveView("tags")} />
        </div>
      </section>

      {activeView === "comments" && (
        <section className="mt-6 rounded-[24px] border border-line bg-white p-6 shadow-panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-ink">댓글 승인</h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">pending 댓글을 검토하고 승인·거절·스팸 처리합니다.</p>
            </div>
              <button type="button" onClick={() => fetchComments(commentStatus, 1)} className="rounded-full border border-brand px-4 py-2 text-sm font-extrabold text-brand transition hover:bg-brand hover:text-white">
                새로고침
              </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {["pending", "approved", "rejected", "spam"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => {
                  setCommentStatus(status);
                  fetchComments(status, 1);
                }}
                className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
                  commentStatus === status ? "bg-ink text-white" : "border border-line bg-white text-slate-600 hover:border-ink hover:text-ink"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3">
            <p className="text-sm font-semibold text-slate-600">
              총 {commentTotal}개 · {commentPage} / {commentTotalPages} 페이지
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fetchComments(commentStatus, 1)}
                disabled={loadingComments || commentPage <= 1}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                처음
              </button>
              <button
                type="button"
                onClick={() => fetchComments(commentStatus, commentPage - 1)}
                disabled={loadingComments || commentPage <= 1}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                이전
              </button>
              <PaginationButtons
                page={commentPage}
                totalPages={commentTotalPages}
                onSelect={(page) => fetchComments(commentStatus, page)}
                disabled={loadingComments}
              />
              <button
                type="button"
                onClick={() => fetchComments(commentStatus, commentPage + 1)}
                disabled={loadingComments || commentPage >= commentTotalPages}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                다음
              </button>
              <button
                type="button"
                onClick={() => fetchComments(commentStatus, commentTotalPages)}
                disabled={loadingComments || commentPage >= commentTotalPages}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                마지막
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3">
            {loadingComments && <p className="text-sm font-semibold text-slate-500">댓글 목록을 불러오는 중입니다.</p>}
            {!loadingComments && comments.length === 0 && <EmptyState message="해당 상태의 댓글이 없습니다." />}
            {!loadingComments &&
              comments.map((comment) => (
                <div key={comment.id} className="rounded-2xl bg-paper p-4">
                  <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-500">
                    <span className="text-ink">{comment.author_name}</span>
                    <span>#{comment.id}</span>
                    <span>{formatDateTime(comment.created_at)}</span>
                  </div>
                  <p className="mt-2 text-sm font-extrabold text-ink">{comment.post_title}</p>
                  <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-7 text-slate-700">{comment.body}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <ActionButton label="승인" onClick={() => updateCommentStatus(comment.id, "approved")} tone="brand" />
                    <ActionButton label="거절" onClick={() => updateCommentStatus(comment.id, "rejected")} tone="muted" />
                    <ActionButton label="스팸" onClick={() => updateCommentStatus(comment.id, "spam")} tone="danger" />
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {activeView === "automation" && (
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-ink">블로그 자동 초안 생성</h2>
                <p className="mt-2 text-sm font-semibold text-slate-500">계산기 주제 기반 자동 초안과 샘플 글 생성을 관리합니다.</p>
              </div>
              <button type="button" onClick={fetchAutoBlogOptions} className="rounded-full border border-brand px-4 py-2 text-sm font-extrabold text-brand transition hover:bg-brand hover:text-white">
                옵션 불러오기
              </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <select value={autoBlogCalculator} onChange={(event) => setAutoBlogCalculator(event.target.value)} className="h-12 rounded-2xl border border-line bg-white px-4 font-bold text-ink outline-none transition focus:border-brand">
                <option value="">계산기 선택</option>
                {autoBlogOptions.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.category} · {item.title}
                  </option>
                ))}
              </select>
              <select value={autoBlogTemplate} onChange={(event) => setAutoBlogTemplate(event.target.value)} className="h-12 rounded-2xl border border-line bg-white px-4 font-bold text-ink outline-none transition focus:border-brand">
                {autoBlogTemplates.length === 0 && <option value="guide">기초 가이드</option>}
                {autoBlogTemplates.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-3 grid gap-3">
              <input type="text" value={autoBlogTitle} onChange={(event) => setAutoBlogTitle(event.target.value)} placeholder="제목 직접 입력(선택)" className="h-12 rounded-2xl border border-line bg-white px-4 font-bold text-ink outline-none transition focus:border-brand" />
              <input type="text" value={autoBlogTags} onChange={(event) => setAutoBlogTags(event.target.value)} placeholder="태그 직접 입력(쉼표로 구분, 선택)" className="h-12 rounded-2xl border border-line bg-white px-4 font-bold text-ink outline-none transition focus:border-brand" />
              {autoBlogTagSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {autoBlogTagSuggestions.map((item) => (
                    <button key={item.slug} type="button" onClick={() => setAutoBlogTags((current) => applyTagSuggestion(current, item.name))} className="rounded-full border border-line bg-paper px-3 py-1 text-xs font-extrabold text-slate-700 transition hover:border-brand hover:text-brand">
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button type="button" onClick={createAutoBlogDraft} disabled={creatingAutoBlog || loadingAutoBlogOptions} className="rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60">
                {creatingAutoBlog ? "초안 생성 중..." : "초안 생성"}
              </button>
              <button type="button" onClick={createQuickSamplePost} disabled={creatingQuickPost} className="rounded-full border border-ink bg-white px-4 py-2 text-sm font-extrabold text-ink transition hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-60">
                {creatingQuickPost ? "새 글 등록 중..." : "새 글 자동 등록"}
              </button>
              {loadingAutoBlogOptions && <p className="text-sm font-semibold text-slate-500">옵션을 불러오는 중입니다.</p>}
            </div>
          </div>

          <div className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-ink">cron 실행 확인</h2>
                <p className="mt-2 text-sm font-semibold text-slate-500">매시간 자동 글 생성과 예약 발행 실행 로그를 확인합니다.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={fetchSchedulerRuns} className="rounded-full border border-brand px-4 py-2 text-sm font-extrabold text-brand transition hover:bg-brand hover:text-white">
                  로그 조회
                </button>
                <button type="button" onClick={runSchedulerNow} disabled={runningScheduler} className="rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60">
                  {runningScheduler ? "cron 실행 중..." : "cron 지금 실행"}
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {loadingSchedulerRuns && <p className="text-sm font-semibold text-slate-500">스케줄러 로그를 불러오는 중입니다.</p>}
              {!loadingSchedulerRuns && schedulerRuns.length === 0 && <EmptyState message="아직 확인된 실행 로그가 없습니다." compact />}
              {!loadingSchedulerRuns &&
                schedulerRuns.map((item) => (
                  <div key={item.id} className="rounded-2xl border border-line bg-paper p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
                      <span className="rounded-full bg-ink px-3 py-1 text-white">{item.trigger_source}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-slate-600">{formatDateTime(item.executed_at)}</span>
                      <span className="rounded-full bg-white px-3 py-1 text-slate-600">발행 {item.published_count}</span>
                      <span className={`rounded-full px-3 py-1 ${item.draft_created ? "bg-brand/10 text-brand" : "bg-white text-slate-600"}`}>{item.draft_created ? "초안 생성" : "초안 건너뜀"}</span>
                    </div>
                    <p className="mt-3 text-sm font-bold text-ink">{item.draft_slug || "생성된 초안 slug 없음"}</p>
                    {item.error_message ? <p className="mt-2 text-sm font-semibold text-[#b42318]">{item.error_message}</p> : <p className="mt-2 text-sm font-semibold text-slate-500">오류 없음</p>}
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-ink">방문자 통계 관리</h2>
                <p className="mt-2 text-sm font-semibold text-slate-500">실시간 방문자 현황을 확인하고 검증용 테스트 방문자만 정리합니다.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={fetchVisitorStats} className="rounded-full border border-brand px-4 py-2 text-sm font-extrabold text-brand transition hover:bg-brand hover:text-white">
                  {loadingVisitorStats ? "불러오는 중..." : "통계 새로고침"}
                </button>
                <button type="button" onClick={clearTestVisitors} disabled={clearingTestVisitors} className="rounded-full bg-[#b42318] px-4 py-2 text-sm font-extrabold text-white transition hover:bg-[#912018] disabled:cursor-not-allowed disabled:opacity-60">
                  {clearingTestVisitors ? "정리 중..." : "테스트 방문자 정리"}
                </button>
              </div>
            </div>

            {visitorStats ? (
              <>
                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-paper px-4 py-4">
                    <p className="text-xs font-extrabold text-slate-500">현재 방문</p>
                    <p className="mt-2 text-2xl font-extrabold text-ink">{visitorStats.activeVisitors}</p>
                  </div>
                  <div className="rounded-2xl bg-paper px-4 py-4">
                    <p className="text-xs font-extrabold text-slate-500">오늘 방문</p>
                    <p className="mt-2 text-2xl font-extrabold text-ink">{visitorStats.todayVisitors}</p>
                  </div>
                  <div className="rounded-2xl bg-paper px-4 py-4">
                    <p className="text-xs font-extrabold text-slate-500">누적 방문</p>
                    <p className="mt-2 text-2xl font-extrabold text-ink">{visitorStats.totalVisitors}</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-line">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-4 py-3">
                    <div>
                      <h3 className="text-base font-extrabold text-ink">인기 접속 페이지</h3>
                      <p className="mt-1 text-xs font-semibold text-slate-500">방문자 1명이 하루에 같은 페이지를 여러 번 열어도 1회로 집계합니다.</p>
                    </div>
                    <span className="rounded-full bg-paper px-3 py-1 text-xs font-extrabold text-slate-600">상위 {visitorStats.topPages?.length || 0}개</span>
                  </div>

                  {visitorStats.topPages && visitorStats.topPages.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead className="bg-paper text-xs font-extrabold uppercase text-slate-500">
                          <tr>
                            <th className="px-4 py-3">페이지</th>
                            <th className="px-4 py-3 text-right">오늘</th>
                            <th className="px-4 py-3 text-right">누적</th>
                            <th className="px-4 py-3">최근 집계</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-line">
                          {visitorStats.topPages.map((page) => (
                            <tr key={page.path}>
                              <td className="max-w-[360px] px-4 py-3">
                                <a href={page.path} target="_blank" rel="noreferrer" className="break-all font-extrabold text-brand hover:underline">
                                  {page.path}
                                </a>
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-ink">{formatNumber(page.todayVisitors || page.todayViews)}</td>
                              <td className="px-4 py-3 text-right font-bold text-ink">{formatNumber(page.totalVisitors || page.totalViews)}</td>
                              <td className="px-4 py-3 text-xs font-semibold text-slate-500">{formatDateTime(page.lastSeenAt)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <EmptyState message="아직 페이지별 접속 통계가 없습니다. 새 방문부터 집계됩니다." compact />
                  )}
                </div>
              </>
            ) : (
              <EmptyState message="방문자 통계를 아직 불러오지 않았습니다." compact />
            )}

            <p className="mt-4 text-xs font-semibold text-slate-500">
              정리 대상: `verify-`, `local-check-` 접두어로 생성된 검증용 방문자만 삭제합니다.
            </p>
          </div>
        </section>
      )}

      {activeView === "calculatorIdeas" && (
        <section className="mt-6 grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
            <div>
              <h2 className="text-2xl font-extrabold text-ink">계산기 자동 발굴</h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">검색어와 참고 URL에서 계산기 후보를 뽑고, 기존 기능과 겹치는지 1차로 분류합니다.</p>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-ink">검색어</span>
                <input value={ideaSeedKeyword} onChange={(event) => setIdeaSeedKeyword(event.target.value)} placeholder="예: 해외주식 양도소득세, 전세대출 갈아타기" className="rounded-2xl border border-line px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-ink">참고 URL</span>
                <input value={ideaSourceUrl} onChange={(event) => setIdeaSourceUrl(event.target.value)} placeholder="https://..." className="rounded-2xl border border-line px-4 py-3 text-sm font-semibold outline-none transition focus:border-brand" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-extrabold text-ink">검색 메모</span>
                <textarea value={ideaMemoText} onChange={(event) => setIdeaMemoText(event.target.value)} placeholder="검색 결과에서 자주 보인 표현, 커뮤니티 질문, 경쟁 사이트 메뉴 등을 붙여넣으세요." rows={6} className="rounded-2xl border border-line px-4 py-3 text-sm font-semibold leading-6 outline-none transition focus:border-brand" />
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={generateCalculatorIdeas} disabled={generatingCalculatorIdeas} className="rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b72] disabled:cursor-not-allowed disabled:opacity-60">
                {generatingCalculatorIdeas ? "후보 생성 중..." : "후보 자동 생성"}
              </button>
              <button type="button" onClick={() => fetchCalculatorIdeas()} className="rounded-full border border-brand px-5 py-3 text-sm font-extrabold text-brand transition hover:bg-brand hover:text-white">
                {loadingCalculatorIdeas ? "불러오는 중..." : "저장 후보 새로고침"}
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-paper px-4 py-4 text-sm font-semibold leading-6 text-slate-600">
              자동 생성 결과는 바로 배포되는 계산기가 아니라 후보 초안입니다. 계산식 출처와 법률·세무 기준 검증 후 실제 계산기로 반영하는 흐름으로 관리합니다.
            </div>
          </div>

          <div className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-ink">계산기 후보 목록</h2>
                <p className="mt-2 text-sm font-semibold text-slate-500">우선순위가 높은 후보부터 검토하고 상태를 바꿔 개발 대기열로 넘깁니다.</p>
              </div>
              <select
                value={ideaStatusFilter}
                onChange={(event) => {
                  setIdeaStatusFilter(event.target.value);
                  void fetchCalculatorIdeas(event.target.value);
                }}
                className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-ink outline-none focus:border-brand"
              >
                <option value="">전체</option>
                <option value="candidate">후보</option>
                <option value="planned">계획</option>
                <option value="building">제작중</option>
                <option value="launched">출시</option>
                <option value="rejected">보류</option>
              </select>
            </div>

            <div className="mt-5 grid gap-3">
              {calculatorIdeas.length > 0 ? (
                calculatorIdeas.map((idea) => (
                  <div key={idea.id} className="rounded-2xl border border-line bg-paper p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-extrabold text-ink">{idea.title}</h3>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-600">{idea.category}</span>
                          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-extrabold text-brand">우선순위 {idea.priority}</span>
                        </div>
                        <p className="mt-2 text-xs font-bold text-slate-500">/{idea.slug}</p>
                      </div>
                      <select value={idea.status} onChange={(event) => updateCalculatorIdeaStatus(idea.id, event.target.value)} className="rounded-full border border-line bg-white px-3 py-2 text-xs font-extrabold text-ink outline-none focus:border-brand">
                        <option value="candidate">후보</option>
                        <option value="planned">계획</option>
                        <option value="building">제작중</option>
                        <option value="launched">출시</option>
                        <option value="rejected">보류</option>
                      </select>
                    </div>
                    {idea.reason && <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{idea.reason}</p>}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold text-slate-500">
                      {idea.seed_keyword && <span className="rounded-full bg-white px-3 py-1">검색어 {idea.seed_keyword}</span>}
                      {idea.source_url && <a href={idea.source_url} target="_blank" rel="noreferrer" className="rounded-full bg-white px-3 py-1 text-brand hover:underline">참고 URL</a>}
                      <span className="rounded-full bg-white px-3 py-1">업데이트 {formatDateTime(idea.updated_at)}</span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" onClick={() => generateCalculatorIdeaDraft(idea.id)} className="rounded-full bg-ink px-3 py-2 text-xs font-extrabold text-white transition hover:bg-brand">
                        구현 초안 생성
                      </button>
                      <button type="button" onClick={() => copyCalculatorIdeaCode(idea)} className="rounded-full border border-brand bg-white px-3 py-2 text-xs font-extrabold text-brand transition hover:bg-brand hover:text-white">
                        코드 복사
                      </button>
                    </div>
                    {idea.generated_spec_json && (
                      <details className="mt-3">
                        <summary className="cursor-pointer text-xs font-extrabold text-brand">계산기 구현 초안 보기</summary>
                        {renderCalculatorIdeaDraft(idea)}
                      </details>
                    )}
                  </div>
                ))
              ) : (
                <EmptyState message="저장된 계산기 후보가 없습니다. 검색어 또는 참고 URL로 후보를 생성해 보세요." compact />
              )}
            </div>
          </div>
        </section>
      )}

      {activeView === "content" && (
        <section className="mt-6 rounded-[24px] border border-line bg-white p-6 shadow-panel">
          <div>
            <h2 className="text-2xl font-extrabold text-ink">콘텐츠 목록</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">게시글 검색, 상태 확인, 발행/예약 발행 작업을 처리합니다.</p>
          </div>

          <div className="mt-5 grid gap-3 xl:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))_auto]">
            <input
              type="text"
              value={contentQuery}
              onChange={(event) => updateContentFilters({ query: event.target.value })}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void fetchPosts(1);
                }
              }}
              placeholder="제목 또는 slug 검색"
              className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand focus:bg-white"
            />
            <select value={contentType} onChange={(event) => updateContentFilters({ type: event.target.value })} className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand focus:bg-white">
              <option value="">전체 타입</option>
              <option value="blog">blog</option>
              <option value="community">community</option>
              <option value="notice">notice</option>
            </select>
            <select value={contentStatus} onChange={(event) => updateContentFilters({ status: event.target.value })} className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand focus:bg-white">
              <option value="">전체 상태</option>
              <option value="published">published</option>
              <option value="draft">draft</option>
              <option value="archived">archived</option>
            </select>
            <select value={contentSchedule} onChange={(event) => updateContentFilters({ schedule: event.target.value })} className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand focus:bg-white">
              <option value="">예약 구분 전체</option>
              <option value="scheduled">예약 발행만</option>
              <option value="unscheduled">일반 글만</option>
            </select>
            <select value={contentSort} onChange={(event) => updateContentFilters({ sort: event.target.value })} className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand focus:bg-white">
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
              <option value="title">제목순</option>
            </select>
            <input type="datetime-local" value={scheduleAt} onChange={(event) => setScheduleAt(event.target.value)} className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand focus:bg-white" />
            <button type="button" onClick={() => fetchPosts(1)} className="rounded-full border border-brand px-5 py-2 text-sm font-extrabold text-brand transition hover:bg-brand hover:text-white">
              게시글 조회
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3">
            <p className="text-sm font-semibold text-slate-600">
              총 {contentTotal}개 · {contentPage} / {contentTotalPages} 페이지
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fetchPosts(1)}
                disabled={loadingPosts || contentPage <= 1}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                처음
              </button>
              <button
                type="button"
                onClick={() => fetchPosts(contentPage - 1)}
                disabled={loadingPosts || contentPage <= 1}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                이전
              </button>
              <PaginationButtons
                page={contentPage}
                totalPages={contentTotalPages}
                onSelect={(page) => fetchPosts(page)}
                disabled={loadingPosts}
              />
              <button
                type="button"
                onClick={() => fetchPosts(contentPage + 1)}
                disabled={loadingPosts || contentPage >= contentTotalPages}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                다음
              </button>
              <button
                type="button"
                onClick={() => fetchPosts(contentTotalPages)}
                disabled={loadingPosts || contentPage >= contentTotalPages}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                마지막
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
            {loadingPosts && <p className="text-sm font-semibold text-slate-500">게시글 목록을 불러오는 중입니다.</p>}
            {!loadingPosts && posts.length === 0 && <EmptyState message="조회된 게시글이 없습니다." className="xl:col-span-2 2xl:col-span-3" />}
            {!loadingPosts &&
              posts.map((post) => (
                <div key={post.id} className={`rounded-2xl p-4 ${post.status === "draft" && post.published_at ? "border border-amber-200 bg-amber-50/70" : "bg-paper"}`}>
                  <div className="flex flex-wrap items-center gap-2 text-xs font-extrabold">
                    <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">{post.type}</span>
                    {post.board && <span className="rounded-full bg-white px-3 py-1 text-slate-500">{post.board}</span>}
                    <span className={`rounded-full px-3 py-1 ${post.status === "draft" && post.published_at ? "bg-amber-100 text-amber-800" : "bg-white text-slate-500"}`}>
                      {post.status === "draft" && post.published_at ? "예약 발행" : post.status}
                    </span>
                  </div>
                  <p className="mt-3 text-lg font-extrabold text-ink">{post.title}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-500">{post.slug} · {post.author_name || "작성자 없음"}</p>
                  {post.published_at && <p className={`mt-2 text-sm font-semibold ${post.status === "draft" ? "text-amber-700" : "text-slate-500"}`}>{post.status === "draft" ? "예약 시각 " : "발행 시각 "}{formatDateTime(post.published_at)}</p>}
                  <div className="mt-3 flex flex-wrap gap-3 text-sm font-bold text-slate-500">
                    <span>조회 {post.view_count}</span>
                    <span>댓글 {post.comment_count}</span>
                    <span>좋아요 {post.like_count}</span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <ActionButton label="수정" onClick={() => { setActiveView("editor"); openEditPost(post.id); }} tone="muted" />
                    {post.status === "draft" && post.type === "blog" && (
                      <>
                        <ActionButton label="발행" onClick={() => publishPost(post.id)} tone="brand" />
                        <ActionButton label="예약 발행" onClick={() => schedulePost(post.id)} tone="muted" />
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {activeView === "editor" && (
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-extrabold text-ink">게시글 편집기</h2>
                <p className="mt-2 text-sm font-semibold text-slate-500">콘텐츠 탭에서 글을 선택하면 여기서 전체 수정할 수 있습니다.</p>
              </div>
              {loadingEditPost && <p className="text-sm font-semibold text-slate-500">불러오는 중입니다.</p>}
            </div>

            {!editingPostId ? (
              <EmptyState message="콘텐츠 탭에서 수정할 게시글을 선택하세요." compact />
            ) : (
              <div className="mt-4 grid gap-3">
                <input type="text" value={editTitle} onChange={(event) => setEditTitle(event.target.value)} placeholder="제목" className="h-12 rounded-2xl border border-line bg-white px-4 font-bold text-ink outline-none transition focus:border-brand" />
                <input type="text" value={editExcerpt} onChange={(event) => setEditExcerpt(event.target.value)} placeholder="요약" className="h-12 rounded-2xl border border-line bg-white px-4 font-bold text-ink outline-none transition focus:border-brand" />
                <input type="text" value={editTags} onChange={(event) => setEditTags(event.target.value)} placeholder="태그(쉼표 구분)" className="h-12 rounded-2xl border border-line bg-white px-4 font-bold text-ink outline-none transition focus:border-brand" />
                {editTagSuggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editTagSuggestions.map((item) => (
                      <button key={item.slug} type="button" onClick={() => setEditTags((current) => applyTagSuggestion(current, item.name))} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-extrabold text-slate-700 transition hover:border-brand hover:text-brand">
                        {item.name}
                      </button>
                    ))}
                  </div>
                )}
                <div className="grid gap-3 sm:grid-cols-3">
                  <select value={editStatus} onChange={(event) => setEditStatus(event.target.value)} className="h-12 rounded-2xl border border-line bg-white px-4 font-bold text-ink outline-none transition focus:border-brand">
                    <option value="draft">draft</option>
                    <option value="published">published</option>
                    <option value="archived">archived</option>
                  </select>
                  <input type="datetime-local" value={editPublishedAt} onChange={(event) => setEditPublishedAt(event.target.value)} className="h-12 rounded-2xl border border-line bg-white px-4 font-bold text-ink outline-none transition focus:border-brand" />
                  <label className="flex h-12 items-center gap-3 rounded-2xl border border-line bg-white px-4 font-bold text-ink">
                    <input type="checkbox" checked={editFeatured} onChange={(event) => setEditFeatured(event.target.checked)} />
                    대표글 표시
                  </label>
                </div>
                <textarea value={editBody} onChange={(event) => setEditBody(event.target.value)} placeholder="본문" rows={18} className="rounded-2xl border border-line bg-white px-4 py-3 font-medium leading-7 text-ink outline-none transition focus:border-brand" />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={savePostEdit} disabled={savingEditPost} className="rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60">
                    {savingEditPost ? "저장 중..." : "수정 저장"}
                  </button>
                  <button type="button" onClick={() => setEditingPostId(null)} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-ink hover:text-ink">
                    닫기
                  </button>
                </div>
                {draftRestored && <p className="text-sm font-semibold text-amber-700">브라우저에 임시 저장된 편집 초안을 복구했습니다. 저장 완료 시 임시 초안은 자동 삭제됩니다.</p>}
              </div>
            )}
          </div>

          <div className="grid gap-6">
            <div className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
              <h3 className="text-lg font-extrabold text-ink">저장 이력</h3>
              <p className="mt-1 text-sm font-semibold text-slate-500">최근 저장본 5개를 브라우저에 보관하고 필요 시 복구합니다.</p>
              <div className="mt-4 grid gap-2">
                {editHistory.length === 0 ? (
                  <p className="text-sm font-semibold text-slate-500">아직 저장 이력이 없습니다.</p>
                ) : (
                  editHistory.map((snapshot, index) => (
                    <button key={`${snapshot.savedAt}-${index}`} type="button" onClick={() => restoreSnapshot(snapshot)} className="flex items-center justify-between rounded-2xl border border-line bg-paper px-4 py-3 text-left transition hover:border-brand">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-extrabold text-ink">{snapshot.title || "제목 없음"}</span>
                        <span className="mt-1 block text-xs font-semibold text-slate-500">{formatDateTime(snapshot.savedAt)} · {snapshot.status}</span>
                      </span>
                      <span className="ml-4 text-xs font-extrabold text-brand">복구</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
              <h3 className="text-lg font-extrabold text-ink">본문 미리보기</h3>
              <div className="mt-4 grid gap-3">
                {previewBlocks.length === 0 ? (
                  <p className="text-sm font-semibold text-slate-500">본문을 입력하면 여기에서 미리보기를 확인할 수 있습니다.</p>
                ) : (
                  previewBlocks.map((block, index) => {
                    if (block.type === "h1") {
                      return <h1 key={index} className="text-2xl font-extrabold text-ink">{block.text}</h1>;
                    }
                    if (block.type === "h2") {
                      return <h2 key={index} className="text-xl font-extrabold text-ink">{block.text}</h2>;
                    }
                    if (block.type === "li") {
                      return <p key={index} className="text-sm font-medium leading-7 text-slate-700">• {block.text}</p>;
                    }
                    return <p key={index} className="text-sm font-medium leading-7 text-slate-700">{block.text}</p>;
                  })
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {activeView === "tags" && (
        <section className="mt-6 rounded-[24px] border border-line bg-white p-6 shadow-panel">
          <div>
            <h2 className="text-2xl font-extrabold text-ink">태그 관리</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">태그 검색, 생성, 삭제를 한 화면에서 처리합니다.</p>
          </div>
          <div className="mt-5 grid gap-3 xl:grid-cols-[1.2fr_0.8fr_auto]">
            <input type="text" value={tagLibraryQuery} onChange={(event) => setTagLibraryQuery(event.target.value)} placeholder="태그 검색" className="h-12 rounded-2xl border border-line bg-white px-4 font-bold text-ink outline-none transition focus:border-brand" />
            <input type="text" value={newTagName} onChange={(event) => setNewTagName(event.target.value)} placeholder="새 태그명" className="h-12 rounded-2xl border border-line bg-white px-4 font-bold text-ink outline-none transition focus:border-brand" />
            <button type="button" onClick={createTag} className="rounded-full bg-ink px-4 py-2 text-sm font-extrabold text-white transition hover:bg-black">
              태그 추가
            </button>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {tagLibrary.length === 0 ? (
              <p className="text-sm font-semibold text-slate-500">표시할 태그가 없습니다.</p>
            ) : (
              tagLibrary.map((item) => (
                <div key={item.slug} className="flex items-center gap-2 rounded-full border border-line bg-paper px-3 py-2">
                  <button type="button" onClick={() => { setActiveView("editor"); setEditTags((current) => applyTagSuggestion(current, item.name)); }} className="text-xs font-extrabold text-slate-700 transition hover:text-brand">
                    {item.name}
                    {typeof item.post_count === "number" ? ` · ${item.post_count}` : ""}
                  </button>
                  <button type="button" onClick={() => deleteTag(item)} className="text-[11px] font-extrabold text-[#b42318] transition hover:opacity-70" aria-label={`${item.name} 태그 삭제`}>
                    삭제
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </main>
  );
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function formatDateTime(value: string | null) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ko-KR");
}

function formatJsonPreview(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

function parseCalculatorIdeaSpec(idea: CalculatorIdea) {
  if (!idea.generated_spec_json) return null;
  try {
    return JSON.parse(idea.generated_spec_json) as {
      implementation?: {
        codeSnippet?: string;
        insertionChecklist?: string[];
        validationChecklist?: string[];
      };
    };
  } catch {
    return null;
  }
}

function getCalculatorIdeaCode(idea: CalculatorIdea) {
  return parseCalculatorIdeaSpec(idea)?.implementation?.codeSnippet || "";
}

function renderCalculatorIdeaDraft(idea: CalculatorIdea) {
  const spec = parseCalculatorIdeaSpec(idea);
  const implementation = spec?.implementation;

  if (!implementation?.codeSnippet) {
    return <pre className="mt-2 max-h-56 overflow-auto rounded-2xl bg-white p-3 text-xs leading-5 text-slate-700">{formatJsonPreview(idea.generated_spec_json || "")}</pre>;
  }

  return (
    <div className="mt-2 grid gap-3">
      <pre className="max-h-72 overflow-auto rounded-2xl bg-white p-3 text-xs leading-5 text-slate-700">{implementation.codeSnippet}</pre>
      {implementation.insertionChecklist && implementation.insertionChecklist.length > 0 && (
        <div className="rounded-2xl bg-white p-3">
          <p className="text-xs font-extrabold text-ink">반영 체크리스트</p>
          <ul className="mt-2 grid gap-1 text-xs font-semibold leading-5 text-slate-600">
            {implementation.insertionChecklist.map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </div>
      )}
      {implementation.validationChecklist && implementation.validationChecklist.length > 0 && (
        <div className="rounded-2xl bg-white p-3">
          <p className="text-xs font-extrabold text-ink">검증 체크리스트</p>
          <ul className="mt-2 grid gap-1 text-xs font-semibold leading-5 text-slate-600">
            {implementation.validationChecklist.map((item) => <li key={item}>- {item}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}

function toDateTimeLocalValue(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const pad = (input: number) => String(input).padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function writeEditDraft(
  postId: number,
  draft: EditDraft
) {
  if (typeof window === "undefined") return;
  const current = readAllEditDrafts();
  current[String(postId)] = draft;
  window.localStorage.setItem(EDIT_DRAFT_STORAGE_KEY, JSON.stringify(current));
}

function readEditDraft(postId: number) {
  const current = readAllEditDrafts();
  return current[String(postId)] || null;
}

function clearEditDraft(postId: number) {
  if (typeof window === "undefined") return;
  const current = readAllEditDrafts();
  delete current[String(postId)];
  window.localStorage.setItem(EDIT_DRAFT_STORAGE_KEY, JSON.stringify(current));
}

function pushEditHistory(postId: number, snapshot: EditSnapshot) {
  if (typeof window === "undefined") return;
  const current = readAllEditHistory();
  const key = String(postId);
  const next = [snapshot, ...(current[key] || [])].slice(0, EDIT_HISTORY_LIMIT);
  current[key] = next;
  window.localStorage.setItem(EDIT_HISTORY_STORAGE_KEY, JSON.stringify(current));
}

function readEditHistory(postId: number) {
  const current = readAllEditHistory();
  return current[String(postId)] || [];
}

function readAllEditHistory(): Record<string, EditSnapshot[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(EDIT_HISTORY_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, EditSnapshot[]>) : {};
  } catch {
    return {};
  }
}

function readAllEditDrafts(): Record<string, EditDraft> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(EDIT_DRAFT_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, EditDraft>) : {};
  } catch {
    return {};
  }
}

function buildPreviewBlocks(body: string) {
  return body
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      if (line.startsWith("# ")) {
        return { type: "h1", text: line.slice(2).trim() };
      }
      if (line.startsWith("## ")) {
        return { type: "h2", text: line.slice(3).trim() };
      }
      if (line.startsWith("- ")) {
        return { type: "li", text: line.slice(2).trim() };
      }
      if (/^\d+\.\s/.test(line)) {
        return { type: "li", text: line.replace(/^\d+\.\s/, "").trim() };
      }
      return { type: "p", text: line };
    });
}

async function fetchTagSuggestions(value: string, setSuggestions: (items: TagSuggestion[]) => void, token: string) {
  const query = currentTagQuery(value);
  if (query.length === 0) {
    setSuggestions([]);
    return;
  }

  try {
    const response = await fetch(`/api/admin/tags?q=${encodeURIComponent(query)}`, {
      credentials: "same-origin",
      headers: adminHeaders(token)
    });
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const data = await response.json();
    setSuggestions(Array.isArray(data.items) ? data.items : []);
  } catch {
    setSuggestions([]);
  }
}

async function fetchTagLibrary(value: string, setSuggestions: (items: TagSuggestion[]) => void, token: string) {
  try {
    const query = value.trim();
    const response = await fetch(`/api/admin/tags${query ? `?q=${encodeURIComponent(query)}` : ""}`, {
      credentials: "same-origin",
      headers: adminHeaders(token)
    });
    if (!response.ok) throw new Error(`Request failed: ${response.status}`);
    const data = await response.json();
    setSuggestions(Array.isArray(data.items) ? data.items : []);
  } catch {
    setSuggestions([]);
  }
}

function currentTagQuery(value: string) {
  const parts = value.split(",");
  return (parts[parts.length - 1] || "").trim();
}

function applyTagSuggestion(value: string, suggestion: string) {
  const parts = value.split(",");
  const head = parts.slice(0, -1).map((item) => item.trim()).filter(Boolean);
  const tail = suggestion.trim();
  return [...head, tail].join(", ");
}

function adminHeaders(token: string, withJson = false) {
  const headers: Record<string, string> = {
    accept: "application/json"
  };
  if (withJson) {
    headers["content-type"] = "application/json";
  }
  if (token.trim()) {
    headers["x-admin-token"] = token.trim();
  }
  return headers;
}

function ActionButton({
  label,
  onClick,
  tone
}: {
  label: string;
  onClick: () => void;
  tone: "brand" | "muted" | "danger";
}) {
  const style =
    tone === "brand"
      ? "bg-brand text-white hover:bg-[#029b72]"
      : tone === "danger"
        ? "bg-[#b42318] text-white hover:bg-[#912018]"
        : "border border-line bg-white text-slate-700 hover:border-ink hover:text-ink";

  return (
    <button type="button" onClick={onClick} className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${style}`}>
      {label}
    </button>
  );
}

function AdminViewButton({
  active,
  label,
  onClick
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
        active ? "bg-ink text-white" : "border border-line bg-white text-slate-600 hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function SummaryCard({
  label,
  value,
  hint
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-xs font-extrabold text-white/60">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
      <p className="mt-1 text-xs font-semibold text-white/55">{hint}</p>
    </div>
  );
}

function EmptyState({
  message,
  compact = false,
  className = ""
}: {
  message: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-line bg-paper px-4 text-center text-sm font-semibold text-slate-500 ${
        compact ? "py-10" : "py-8"
      } ${className}`.trim()}
    >
      {message}
    </div>
  );
}

function PaginationButtons({
  page,
  totalPages,
  onSelect,
  disabled = false
}: {
  page: number;
  totalPages: number;
  onSelect: (page: number) => void;
  disabled?: boolean;
}) {
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  const safeStart = Math.max(1, end - 4);
  const pages = Array.from({ length: end - safeStart + 1 }, (_, index) => safeStart + index);

  return (
    <>
      {pages.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onSelect(item)}
          disabled={disabled || item === page}
          className={`rounded-full px-4 py-2 text-sm font-extrabold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            item === page
              ? "bg-ink text-white"
              : "border border-line bg-white text-slate-700 hover:border-ink hover:text-ink"
          }`}
        >
          {item}
        </button>
      ))}
    </>
  );
}
