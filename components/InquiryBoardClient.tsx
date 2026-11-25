"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { trackAnalyticsEvent } from "@/lib/analytics";

type InquiryItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  published_at: string | null;
  author_name: string | null;
  view_count: number;
  visibility?: "public" | "private";
};

type Props = {
  fallbackItems?: InquiryItem[];
};

export function InquiryBoardClient({ fallbackItems = [] }: Props) {
  const { locale, t } = useLanguage();
  const [items, setItems] = useState<InquiryItem[]>(fallbackItems);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [leadTopic, setLeadTopic] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const topic = new URLSearchParams(window.location.search).get("topic");
      const subjectByTopic: Record<string, string> = {
        widget: "계산기 위젯·맞춤 도구 문의",
        template: "사업자용 계산 템플릿 문의",
        partnership: "콘텐츠·제휴 검토 문의"
      };
      const initialTitle = topic ? subjectByTopic[topic] : undefined;
      if (!initialTitle) return;
      setLeadTopic(topic);
      setTitle((current) => current || initialTitle);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

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
        setError(t("contact.connectionError"));
      } finally {
        if (active) setLoading(false);
      }
    }

    run();
    return () => {
      active = false;
    };
  }, [t]);

  async function handleSubmit() {
    const trimmedAuthor = authorName.trim();
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedAuthor || !trimmedTitle || !trimmedBody) {
      setNotice(t("contact.required"));
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
          body: trimmedBody,
          visibility,
          lead_topic: leadTopic
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

      if (leadTopic) trackAnalyticsEvent("business_lead_submit", { lead_topic: leadTopic });

      setAuthorName("");
      setTitle("");
      setBody("");
      setVisibility("public");
      setNotice(t("contact.success"));
    } catch {
      setNotice(t("contact.failure"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <div className="rounded-[28px] border border-line bg-white p-6 shadow-panel">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-brand">{t("contact.board")}</p>
            {loading && <p className="mt-2 text-sm font-semibold text-slate-500">{t("contact.listLoading")}</p>}
            {!loading && error && <p className="mt-2 text-sm font-semibold text-amber-600">{error}</p>}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="mt-6 rounded-[24px] border border-dashed border-line bg-paper p-10 text-center text-sm font-semibold text-slate-500">
            {t("contact.empty")}
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
                  <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">{t("contact.register")}</span>
                  {item.published_at && <span className="rounded-full bg-paper px-3 py-1 text-slate-500">{formatDate(item.published_at, locale)}</span>}
                  {item.author_name && <span className="rounded-full bg-paper px-3 py-1 text-slate-500">{item.author_name}</span>}
                  {item.visibility === "private" && <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">관리자만 열람</span>}
                </div>
                <h2 className="mt-4 text-xl font-extrabold text-ink sm:text-2xl">{item.title}</h2>
                <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{item.excerpt || ""}</p>
                <div className="mt-4 flex gap-4 text-sm font-bold text-slate-500">
                  <span>{t("content.views")} {item.view_count}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <aside className="rounded-[28px] border border-line bg-white p-6 shadow-panel">
        <p className="text-sm font-extrabold text-brand">{t("contact.register")}</p>
          <h2 className="mt-2 text-xl font-extrabold text-ink sm:text-2xl">{t("contact.registerTitle")}</h2>
        <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
          {t("contact.registerDescription")}
        </p>

          <div className="mt-6 grid gap-3">
          <input
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            maxLength={50}
            placeholder={t("contact.name")}
            className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand"
          />
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={120}
            placeholder={t("contact.subject")}
            className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand"
          />
          <textarea
            value={body}
            onChange={(event) => setBody(event.target.value)}
            maxLength={5000}
            rows={8}
            placeholder={t("contact.bodyPlaceholder")}
            className="rounded-2xl border border-line bg-paper px-4 py-3 font-medium text-ink outline-none transition focus:border-brand"
          />
          <div className="grid gap-3 rounded-2xl border border-line bg-paper p-4">
            <p className="text-xs font-semibold text-slate-500">{t("contact.visibility")}</p>
            <div className="flex flex-wrap gap-2">
              <label className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-extrabold transition ${visibility === "public" ? "border-brand bg-brand/10 text-brand" : "border-line bg-white text-slate-600"}`}>
                <input type="radio" name="contact-visibility" value="public" checked={visibility === "public"} onChange={() => setVisibility("public")} className="sr-only" />
                {t("contact.public")}
              </label>
              <label className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-extrabold transition ${visibility === "private" ? "border-amber-500 bg-amber-50 text-amber-700" : "border-line bg-white text-slate-600"}`}>
                <input type="radio" name="contact-visibility" value="private" checked={visibility === "private"} onChange={() => setVisibility("private")} className="sr-only" />
                {t("contact.private")}
              </label>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b72] disabled:opacity-60 sm:w-auto"
            >
              {submitting ? t("contact.submitting") : t("contact.submit")}
            </button>
          </div>
          {notice && <p className="text-sm font-semibold text-slate-600">{notice}</p>}
        </div>
      </aside>
    </section>
  );
}

function formatDate(value: string, locale: string = "ko") {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(locale === "ja" ? "ja-JP" : locale === "en" ? "en-US" : "ko-KR");
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
