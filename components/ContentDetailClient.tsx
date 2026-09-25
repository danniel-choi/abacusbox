"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type Tag = {
  slug: string;
  name: string;
};

type DetailItem = {
  id: number;
  type: string;
  board: string | null;
  slug: string;
  title: string;
  excerpt: string | null;
  body_md: string;
  published_at: string | null;
  featured: number;
  view_count: number;
  comment_count: number;
  like_count: number;
  author_name: string | null;
  tags?: Tag[];
  calculators?: string[];
};

type CommentItem = {
  id: number;
  post_id: number;
  parent_id: number | null;
  author_name: string;
  body: string;
  status: string;
  created_at: string;
};

type Props = {
  apiBasePath: string;
  listPath: string;
  fallbackItems: DetailItem[];
  mode: "blog" | "community" | "inquiry";
};

export function ContentDetailClient({ apiBasePath, listPath, fallbackItems, mode }: Props) {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") || "";
  const [item, setItem] = useState<DetailItem | null>(findFallback(fallbackItems, slug));
  const [loading, setLoading] = useState(Boolean(slug));
  const [error, setError] = useState<string | null>(slug ? null : "slug 파라미터가 없습니다.");
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentNotice, setCommentNotice] = useState<string | null>(null);
  const [likedOverride, setLikedOverride] = useState<{ postId: number; value: boolean } | null>(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const commentsEnabled = mode === "blog" || mode === "community";
  const commentPostId = commentsEnabled ? item?.id ?? null : null;
  const communityPostId = mode === "community" ? item?.id ?? null : null;

  useEffect(() => {
    let active = true;

    async function run() {
      if (!slug) {
        setItem(null);
        setLoading(false);
        setError("slug 파라미터가 없습니다.");
        return;
      }

      try {
        const response = await fetch(`${apiBasePath}/${encodeURIComponent(slug)}`, {
          headers: buildContentHeaders(mode)
        });
        if (response.status === 403) throw new Error("forbidden");
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const data = await response.json();
        if (!active) return;
        const fallback = findFallback(fallbackItems, slug);
        setItem(preferCompleteFallback(data, fallback));
        setError(null);
      } catch (cause) {
        if (!active) return;
        if (mode === "inquiry" && String(cause).includes("forbidden")) {
          setItem(null);
          setError("이 문의는 등록한 브라우저 또는 관리자만 볼 수 있습니다.");
          return;
        }
        const fallback = findFallback(fallbackItems, slug);
        if (fallback) {
          setItem(fallback);
          setError("실시간 데이터 연결이 없어서 기본 콘텐츠를 표시합니다.");
        } else {
          setItem(null);
          setError("콘텐츠를 찾을 수 없습니다.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [apiBasePath, fallbackItems, mode, slug]);

  useEffect(() => {
    if (!commentPostId) {
      return;
    }

    let active = true;

    async function run() {
      setCommentsLoading(true);
      try {
        const response = await fetch(`/api/comments/${commentPostId}`, {
          headers: { accept: "application/json" }
        });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const data = await response.json();
        if (!active) return;
        setComments(Array.isArray(data.items) ? data.items : []);
        setCommentsError(null);
      } catch {
        if (!active) return;
        setComments([]);
        setCommentsError("댓글 API 연결 전이라 목록을 표시하지 못했습니다.");
      } finally {
        if (active) setCommentsLoading(false);
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [commentPostId]);

  const title = useMemo(() => {
    if (mode === "blog") return "블로그";
    if (mode === "community") return "커뮤니티";
    return "문의";
  }, [mode]);
  const liked = useMemo(() => {
    if (likedOverride !== null && likedOverride.postId === communityPostId) return likedOverride.value;
    if (!communityPostId || typeof window === "undefined") return false;

    const fingerprint = getFingerprint();
    if (!fingerprint) return false;

    return window.localStorage.getItem(`calcrule:liked:${communityPostId}:${fingerprint}`) === "1";
  }, [communityPostId, likedOverride]);

  async function handleSubmitComment() {
    if (!item?.id || !commentsEnabled) return;

    const trimmedName = authorName.trim();
    const trimmedBody = commentBody.trim();

    if (!trimmedName || !trimmedBody) {
      setCommentNotice("이름과 댓글 내용을 입력하세요.");
      return;
    }

    setCommentSubmitting(true);
    setCommentNotice(null);

    try {
      const response = await fetch(`/api/comments/${item.id}`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          author_name: trimmedName,
          body: trimmedBody
        })
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      setCommentBody("");
      setCommentNotice("댓글이 접수되었습니다. 승인 후 노출됩니다.");
      setItem((current) => (current ? { ...current, comment_count: current.comment_count + 1 } : current));
    } catch {
      setCommentNotice("댓글 등록에 실패했습니다.");
    } finally {
      setCommentSubmitting(false);
    }
  }

  async function handleToggleLike() {
    if (!item?.id || mode !== "community" || likeLoading) return;

    const fingerprint = getOrCreateFingerprint();
    if (!fingerprint) return;

    setLikeLoading(true);
    try {
      const response = await fetch("/api/reactions/toggle", {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          post_id: item.id,
          fingerprint
        })
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);
      const data = await response.json();
      const nextLiked = Boolean(data.liked);

      window.localStorage.setItem(`calcrule:liked:${item.id}:${fingerprint}`, nextLiked ? "1" : "0");
      setLikedOverride({ postId: item.id, value: nextLiked });
      setItem((current) =>
        current
          ? {
              ...current,
              like_count: Math.max(0, current.like_count + (nextLiked ? 1 : -1))
            }
          : current
      );
    } catch {
      setCommentNotice("좋아요 처리에 실패했습니다.");
    } finally {
      setLikeLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl min-w-0 px-4 py-8 sm:py-12">
      <article className="readable-content w-full max-w-full min-w-0 overflow-hidden rounded-[28px] border border-line bg-white p-5 shadow-panel sm:p-7">
        <Link href={listPath} className="text-sm font-extrabold text-brand">
          ← {title} 목록
        </Link>

        {loading && <p className="mt-6 text-sm font-semibold text-slate-500">콘텐츠를 불러오는 중입니다.</p>}
        {!loading && error && <p className="mt-6 text-sm font-semibold text-amber-600">{error}</p>}

        {!loading && item && (
          <>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-extrabold">
              <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">{badgeLabel(item, mode)}</span>
              {item.published_at && <span className="rounded-full bg-paper px-3 py-1 text-slate-500">{formatDate(item.published_at)}</span>}
              {item.author_name && <span className="rounded-full bg-paper px-3 py-1 text-slate-500">{item.author_name}</span>}
            </div>

            <h1 className="mt-5 break-words text-3xl font-extrabold leading-tight text-ink [word-break:normal] sm:text-4xl">{item.title}</h1>
            {item.excerpt && <p className="mt-4 break-words text-base font-medium leading-7 text-slate-600 [word-break:normal]">{item.excerpt}</p>}

            {mode === "community" && (
              <>
                <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500">
                  <span>댓글 {item.comment_count}</span>
                  <span>좋아요 {item.like_count}</span>
                  <span>조회 {item.view_count}</span>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleToggleLike}
                    disabled={likeLoading}
                    className={`w-full rounded-full px-5 py-3 text-sm font-extrabold transition sm:w-auto ${
                      liked ? "bg-brand text-white" : "border border-brand text-brand hover:bg-brand hover:text-white"
                    } ${likeLoading ? "opacity-60" : ""}`}
                  >
                    {likeLoading ? "처리 중..." : liked ? "좋아요 취소" : "좋아요"}
                  </button>
                  <Link
                    href="#comments"
                    className="w-full rounded-full border border-line px-5 py-3 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand sm:w-auto"
                  >
                    댓글 보기
                  </Link>
                </div>
              </>
            )}

            {mode === "blog" && (
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm font-bold text-slate-500">
                <span>댓글 {item.comment_count}</span>
                <span>조회 {item.view_count}</span>
                <Link href="#comments" className="text-brand transition hover:text-ink">
                  댓글 쓰기
                </Link>
              </div>
            )}

            <div className="mt-8 grid min-w-0 gap-5 break-words text-base font-medium leading-8 text-slate-700 [word-break:normal]">
              {markdownToParagraphs(item.body_md).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            {item.tags && item.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span key={tag.slug} className="rounded-full border border-line px-3 py-1 text-xs font-bold text-slate-500">
                    #{tag.name}
                  </span>
                ))}
              </div>
            )}

            {item.calculators && item.calculators.length > 0 && (
              <div className="mt-8 rounded-2xl bg-paper p-5">
                <p className="text-sm font-extrabold text-ink">연결 계산기</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.calculators.map((slugItem) => (
                    <Link
                      key={slugItem}
                      href={`/calculators/${slugItem}`}
                      className="rounded-full bg-white px-4 py-2 text-sm font-extrabold text-brand shadow-sm"
                    >
                      {slugItem}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {commentsEnabled && (
              <section id="comments" className="mt-8 rounded-[24px] border border-line bg-paper p-5">
                <h2 className="text-2xl font-extrabold text-ink">댓글</h2>
                <p className="mt-2 text-sm font-semibold text-slate-500">초기 운영 단계라 승인 후 노출 방식으로 처리합니다.</p>

                <div className="mt-5 grid gap-3">
                  <input
                    value={authorName}
                    onChange={(event) => setAuthorName(event.target.value)}
                    maxLength={50}
                    placeholder="이름"
                    className="h-12 rounded-2xl border border-line bg-white px-4 font-bold text-ink outline-none transition focus:border-brand"
                  />
                  <textarea
                    value={commentBody}
                    onChange={(event) => setCommentBody(event.target.value)}
                    maxLength={5000}
                    rows={5}
                    placeholder="댓글 내용을 입력하세요."
                    className="rounded-2xl border border-line bg-white px-4 py-3 font-medium text-ink outline-none transition focus:border-brand"
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs font-semibold text-slate-500">이름과 댓글 내용만 저장합니다.</p>
                    <button
                      type="button"
                      onClick={handleSubmitComment}
                      disabled={commentSubmitting}
                      className="w-full rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b72] disabled:opacity-60 sm:w-auto"
                    >
                      {commentSubmitting ? "등록 중..." : "댓글 등록"}
                    </button>
                  </div>
                  {commentNotice && <p className="text-sm font-semibold text-slate-600">{commentNotice}</p>}
                </div>

                <div className="mt-8">
                  {commentsLoading && <p className="text-sm font-semibold text-slate-500">댓글을 불러오는 중입니다.</p>}
                  {!commentsLoading && commentsError && <p className="text-sm font-semibold text-amber-600">{commentsError}</p>}
                  {!commentsLoading && !commentsError && comments.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-line bg-white px-5 py-8 text-center text-sm font-semibold text-slate-500">
                      아직 승인된 댓글이 없습니다.
                    </div>
                  )}
                  {!commentsLoading && comments.length > 0 && (
                    <div className="grid gap-3">
                      {comments.map((comment) => (
                        <div key={comment.id} className="rounded-2xl bg-white px-5 py-4 shadow-sm">
                          <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="font-extrabold text-ink">{comment.author_name}</span>
                            <span className="font-semibold text-slate-400">{formatDateTime(comment.created_at)}</span>
                          </div>
                          <p className="mt-3 whitespace-pre-wrap text-sm font-medium leading-7 text-slate-700">{comment.body}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </article>
    </main>
  );
}

function findFallback(items: DetailItem[], slug: string) {
  return items.find((item) => item.slug === slug) || null;
}

function preferCompleteFallback(item: DetailItem & { source?: string }, fallback: DetailItem | null) {
  if (item.source !== "fallback" || !fallback) return item;
  return fallback.body_md.length >= item.body_md.length ? fallback : item;
}

function markdownToParagraphs(markdown: string) {
  return markdown
    .split(/\n\s*\n/g)
    .map((item) => item.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

function badgeLabel(item: DetailItem, mode: "blog" | "community" | "inquiry") {
  if (mode === "blog") return item.board === "guide" ? "가이드" : "블로그";
  if (mode === "inquiry") return "문의";
  switch (item.board) {
    case "qna":
      return "질문답변";
    case "case":
      return "사례공유";
    case "notice":
      return "공지";
    default:
      return "커뮤니티";
  }
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ko-KR");
}

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("ko-KR");
}

function getFingerprint() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("calcrule:fingerprint") || "";
}

function getOrCreateFingerprint() {
  if (typeof window === "undefined") return "";
  const existing = getFingerprint();
  if (existing) return existing;

  const next =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `fp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem("calcrule:fingerprint", next);
  return next;
}

function buildContentHeaders(mode: "blog" | "community" | "inquiry") {
  const headers: Record<string, string> = { accept: "application/json" };

  if (mode === "inquiry" && typeof window !== "undefined") {
    const inquiryToken = window.localStorage.getItem("calcrule:inquiry-token") || "";
    if (inquiryToken) {
      headers["x-inquiry-token"] = inquiryToken;
    }
  }

  return headers;
}
