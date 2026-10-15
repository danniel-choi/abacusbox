"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useLanguage } from "@/components/LanguageProvider";
import { getLocalizedBlogPresentation } from "@/lib/blog-i18n";

export type ContentListItem = {
  id: number;
  type: string;
  board: string | null;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url?: string | null;
  published_at: string | null;
  featured: number;
  view_count: number;
  comment_count: number;
  like_count: number;
  author_name: string | null;
};

type Props = {
  apiPath: string;
  detailBasePath: string;
  fallbackItems: ContentListItem[];
  badge?: string;
  meta?: "blog" | "community";
  pageSize?: number;
  detailMode?: "query" | "path";
};

export function ContentListClient({ apiPath, detailBasePath, fallbackItems, badge, meta = "blog", pageSize, detailMode = "query" }: Props) {
  const { locale, t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const page = Math.max(Number(searchParams.get("page") || 1), 1);
  const paginationEnabled = typeof pageSize === "number" && pageSize > 0;
  const fallbackSlice = useMemo(() => {
    if (!paginationEnabled) return fallbackItems;
    const start = (page - 1) * pageSize;
    return fallbackItems.slice(start, start + pageSize);
  }, [fallbackItems, page, pageSize, paginationEnabled]);
  const [items, setItems] = useState<ContentListItem[]>(fallbackSlice);
  const [total, setTotal] = useState(paginationEnabled ? fallbackItems.length : fallbackSlice.length);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const board = searchParams.get("board") || "";
  const sort = searchParams.get("sort") || "latest";
  const requestPath = useMemo(() => {
    const params = new URLSearchParams();
    if (paginationEnabled) {
      params.set("page", String(page));
      params.set("limit", String(pageSize));
    }
    if (meta === "community" && board) params.set("board", board);
    if (meta === "community" && sort && sort !== "latest") params.set("sort", sort);
    const query = params.toString();
    return query ? `${apiPath}?${query}` : apiPath;
  }, [apiPath, board, meta, page, pageSize, paginationEnabled, sort]);

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        const response = await fetch(requestPath, { headers: { accept: "application/json" } });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const data = await response.json();
        if (!active) return;
        if (data?.source === "fallback") {
          setItems(fallbackSlice);
          setTotal(paginationEnabled ? fallbackItems.length : fallbackSlice.length);
          setError(null);
          return;
        }
        if (Array.isArray(data.items)) {
          setItems(data.items);
        }
        if (typeof data.total === "number") {
          setTotal(data.total);
        } else {
          setTotal(Array.isArray(data.items) ? data.items.length : 0);
        }
        setError(null);
      } catch {
        if (!active) return;
        setItems(fallbackSlice);
        setTotal(paginationEnabled ? fallbackItems.length : fallbackSlice.length);
        setError(null);
      } finally {
        if (active) setLoading(false);
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [fallbackItems, fallbackSlice, paginationEnabled, requestPath]);

  const totalPages = paginationEnabled ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const pageNumbers = useMemo(() => {
    if (!paginationEnabled) return [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    const adjustedStart = Math.max(1, end - 4);
    return Array.from({ length: end - adjustedStart + 1 }, (_, index) => adjustedStart + index);
  }, [page, paginationEnabled, totalPages]);

  const emptyMessage = useMemo(() => {
    return meta === "community"
      ? t("content.communityEmpty")
      : t("content.blogEmpty");
  }, [meta, t]);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          {badge ? <p className="text-sm font-extrabold text-brand">{badge}</p> : null}
          {loading && <p className="mt-2 text-sm font-semibold text-slate-500">{t("content.loading")}</p>}
          {!loading && error && <p className="mt-2 text-sm font-semibold text-amber-600">{error}</p>}
        </div>
      </div>

      {meta === "community" && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <FilterPill
            active={!board}
            onClick={() => updateQuery(router, pathname, searchParams, { board: "" })}
            label={t("content.all")}
          />
          <FilterPill
            active={board === "qna"}
            onClick={() => updateQuery(router, pathname, searchParams, { board: "qna" })}
            label={t("content.qna")}
          />
          <FilterPill
            active={board === "case"}
            onClick={() => updateQuery(router, pathname, searchParams, { board: "case" })}
            label={t("content.case")}
          />
          <FilterPill
            active={board === "notice"}
            onClick={() => updateQuery(router, pathname, searchParams, { board: "notice" })}
            label={t("content.notice")}
          />
          <div className="ml-0 flex flex-wrap gap-2 sm:ml-auto">
            <SortPill
              active={sort === "latest"}
              onClick={() => updateQuery(router, pathname, searchParams, { sort: "latest" })}
              label={t("content.latest")}
            />
            <SortPill
              active={sort === "popular"}
              onClick={() => updateQuery(router, pathname, searchParams, { sort: "popular" })}
              label={t("content.popular")}
            />
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="mt-6 rounded-[24px] border border-dashed border-line bg-white p-10 text-center text-sm font-semibold text-slate-500 shadow-panel">
          {emptyMessage}
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4">
            {items.map((item) => (
              (() => {
                const presentation = meta === "blog"
                  ? getLocalizedBlogPresentation({ slug: item.slug, title: item.title, excerpt: item.excerpt || "", category: "운영", tags: [] }, locale)
                  : null;
                return (
              <Link
                key={item.slug}
                href={detailMode === "path" ? `${detailBasePath}/${encodeURIComponent(item.slug)}` : `${detailBasePath}?slug=${encodeURIComponent(item.slug)}`}
                className="readable-content w-full max-w-full min-w-0 overflow-hidden rounded-[24px] border border-line bg-white p-6 shadow-panel transition hover:-translate-y-1 hover:border-brand hover:shadow-float"
              >
                <div className={meta === "blog" ? "grid gap-5 md:grid-cols-[220px_1fr]" : ""}>
                  {meta === "blog" && (
                    <div
                      aria-hidden="true"
                      className="aspect-[1200/630] overflow-hidden rounded-[18px] border border-line bg-paper bg-cover bg-center"
                      style={{ backgroundImage: `url("${item.cover_image_url || `/api/blog-image/${encodeURIComponent(item.slug)}.svg`}")` }}
                    />
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-extrabold">
                      <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">{presentation?.category || labelForItem(item, meta, locale)}</span>
                      {item.published_at && <span className="rounded-full bg-paper px-3 py-1 text-slate-500">{formatDate(item.published_at, locale)}</span>}
                      {item.author_name && <span className="rounded-full bg-paper px-3 py-1 text-slate-500">{item.author_name}</span>}
                    </div>
                    <h2 className="mt-4 break-words text-xl font-extrabold text-ink [word-break:normal] sm:text-2xl">{presentation?.title || item.title}</h2>
                    <p className="mt-3 break-words text-sm font-medium leading-7 text-slate-600 [word-break:normal]">{presentation?.excerpt || item.excerpt || ""}</p>
                    {meta === "community" && (
                      <div className="mt-4 flex gap-4 text-sm font-bold text-slate-500">
                        <span>{t("content.comments")} {item.comment_count}</span>
                        <span>{t("content.likes")} {item.like_count}</span>
                        <span>{t("content.views")} {item.view_count}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
                );
              })()
            ))}
          </div>

          {paginationEnabled && totalPages > 1 ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              <PaginationButton
                disabled={page <= 1}
                onClick={() => updateQuery(router, pathname, searchParams, { page: String(page - 1) })}
              >
                {t("content.previous")}
              </PaginationButton>
              {pageNumbers.map((pageNumber) => (
                <PaginationButton
                  key={pageNumber}
                  active={pageNumber === page}
                  onClick={() => updateQuery(router, pathname, searchParams, { page: String(pageNumber) })}
                >
                  {pageNumber}
                </PaginationButton>
              ))}
              <PaginationButton
                disabled={page >= totalPages}
                onClick={() => updateQuery(router, pathname, searchParams, { page: String(page + 1) })}
              >
                {t("content.next")}
              </PaginationButton>
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}

function updateQuery(
  router: ReturnType<typeof useRouter>,
  pathname: string,
  current: ReturnType<typeof useSearchParams>,
  updates: Record<string, string>
) {
  const next = new URLSearchParams(current.toString());
  for (const [key, value] of Object.entries(updates)) {
    if (value) next.set(key, value);
    else next.delete(key);
  }
  const query = next.toString();
  router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
}

function FilterPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-full px-4 py-2 text-sm font-extrabold transition ${
        active ? "bg-brand text-white" : "border border-line bg-white text-slate-600 hover:border-brand hover:text-brand"
      }`}
    >
      {label}
    </button>
  );
}

function SortPill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-10 rounded-full px-4 py-2 text-sm font-extrabold transition ${
        active ? "bg-ink text-white" : "border border-line bg-white text-slate-600 hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}

function PaginationButton({
  active = false,
  disabled = false,
  onClick,
  children
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-h-10 min-w-10 rounded-full px-4 py-2 text-sm font-extrabold transition ${
        active
          ? "bg-ink text-white"
          : "border border-line bg-white text-slate-600 hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-45"
      }`}
    >
      {children}
    </button>
  );
}

function labelForItem(item: ContentListItem, meta: "blog" | "community", locale: "ko" | "en" | "ja") {
  if (meta === "blog") {
    return item.board === "guide" ? (locale === "en" ? "Guide" : locale === "ja" ? "ガイド" : "가이드") : item.type;
  }

  switch (item.board) {
    case "qna":
      return locale === "en" ? "Q&A" : locale === "ja" ? "Q&A" : "질문답변";
    case "case":
      return locale === "en" ? "Case study" : locale === "ja" ? "事例共有" : "사례공유";
    case "notice":
      return locale === "en" ? "Notice" : locale === "ja" ? "お知らせ" : "공지";
    default:
      return locale === "en" ? "Community" : locale === "ja" ? "コミュニティ" : "커뮤니티";
  }
}

function formatDate(value: string, locale: string = "ko") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(locale === "ja" ? "ja-JP" : locale === "en" ? "en-US" : "ko-KR");
}
