"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type InquiryItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  published_at: string | null;
  author_name: string | null;
  view_count: number;
};

type Props = {
  fallbackItems?: InquiryItem[];
};

export function InquiryBoardClient({ fallbackItems = [] }: Props) {
  const [items, setItems] = useState<InquiryItem[]>(fallbackItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function run() {
      try {
        const response = await fetch("/api/contact", {
          headers: {
            accept: "application/json",
            "x-inquiry-token": getInquiryToken()
          }
        });
        if (!response.ok) throw new Error(`Request failed: ${response.status}`);
        const data = await response.json();
        if (!active) return;
        setItems(Array.isArray(data.items) ? data.items : []);
        setError(null);
      } catch {
        if (!active) return;
        setError("문의 게시판 연결이 없어 기본 목록만 표시합니다.");
      } finally {
        if (active) setLoading(false);
      }
    }

    run();
    return () => {
      active = false;
    };
  }, []);

  async function handleSubmit() {
    const trimmedAuthor = authorName.trim();
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedAuthor || !trimmedTitle || !trimmedBody) {
      setNotice("이름, 제목, 문의 내용을 모두 입력하세요.");
      return;
    }

    setSubmitting(true);
    setNotice(null);

    try {
      const inquiryToken = getOrCreateInquiryToken();
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-inquiry-token": inquiryToken
        },
        body: JSON.stringify({
          author_name: trimmedAuthor,
          title: trimmedTitle,
          body: trimmedBody
        })
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      const refresh = await fetch("/api/contact", {
        headers: {
          accept: "application/json",
          "x-inquiry-token": inquiryToken
        }
      });
      if (refresh.ok) {
        const data = await refresh.json();
        setItems(Array.isArray(data.items) ? data.items : []);
      }

      setAuthorName("");
      setTitle("");
      setBody("");
      setNotice("문의가 등록되었습니다.");
    } catch {
      setNotice("문의 등록에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-panel">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-brand">문의 게시판</p>
            {loading && <p className="mt-2 text-sm font-semibold text-slate-500">문의 목록을 불러오는 중입니다.</p>}
            {!loading && error && <p className="mt-2 text-sm font-semibold text-amber-600">{error}</p>}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-dashed border-line bg-paper p-10 text-center text-sm font-semibold text-slate-500">
            아직 등록된 문의가 없습니다.
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {items.map((item) => (
              <Link
                key={item.slug}
                href={`/contact/post?slug=${encodeURIComponent(item.slug)}`}
                className="rounded-[24px] border border-line bg-white p-6 shadow-panel transition hover:-translate-y-1 hover:border-brand hover:shadow-float"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm font-extrabold">
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">문의</span>
                  {item.published_at && <span className="rounded-full bg-paper px-3 py-1 text-slate-500">{formatDate(item.published_at)}</span>}
                  {item.author_name && <span className="rounded-full bg-paper px-3 py-1 text-slate-500">{item.author_name}</span>}
                </div>
                <h2 className="mt-4 text-xl font-extrabold text-ink sm:text-2xl">{item.title}</h2>
                <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{item.excerpt || ""}</p>
                <div className="mt-4 flex gap-4 text-sm font-bold text-slate-500">
                  <span>조회 {item.view_count}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <aside className="rounded-[28px] border border-line bg-white p-6 shadow-panel">
        <p className="text-sm font-extrabold text-brand">문의 등록</p>
          <h2 className="mt-2 text-xl font-extrabold text-ink sm:text-2xl">게시판에 바로 남기기</h2>
        <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
          계산 기준 오류, 기능 요청, 제휴 문의를 게시판 형태로 등록할 수 있습니다.
        </p>

          <div className="mt-6 grid gap-3">
          <input
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            maxLength={50}
            placeholder="이름"
            className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand"
          />
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            placeholder="문의 제목"
            className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand"
          />
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={5000}
            rows={8}
            placeholder="문의 내용을 입력하세요."
            className="rounded-2xl border border-line bg-paper px-4 py-3 font-medium text-ink outline-none transition focus:border-brand"
          />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-semibold text-slate-500">등록한 문의는 같은 브라우저의 작성자와 관리자만 볼 수 있습니다.</p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b72] disabled:opacity-60 sm:w-auto"
            >
              {submitting ? "등록 중..." : "문의 등록"}
            </button>
          </div>
          {notice && <p className="text-sm font-semibold text-slate-600">{notice}</p>}
        </div>
      </aside>
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ko-KR");
}

function getInquiryToken() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("calcrule:inquiry-token") || "";
}

function getOrCreateInquiryToken() {
  if (typeof window === "undefined") return "";
  const current = getInquiryToken();
  if (current) return current;

  const next =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `inq-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  window.localStorage.setItem("calcrule:inquiry-token", next);
  return next;
}
