"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { calculators } from "@/lib/calculators";
import { CALCULATOR_GROUP_META, getCalculatorGroup } from "@/lib/calculator-directory";

const navItems = [
  { href: "/calculators", label: "계산기" },
  { href: "/tax", label: "세금" },
  { href: "/stock", label: "주식" },
  { href: "/blog", label: "블로그" },
  { href: "/#sources", label: "출처" },
  { href: "/about", label: "소개" },
  { href: "/editorial-policy", label: "운영원칙" }
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/95 shadow-[0_12px_32px_rgba(4,7,19,0.32)] backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4">
          <Logo inverted />

          <CalculatorHeaderSearch className="hidden min-w-[240px] max-w-sm flex-1 lg:block" />

          <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 p-2 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-brand/50 bg-white px-5 py-2.5 text-sm font-extrabold text-ink shadow-[0_6px_18px_rgba(255,255,255,0.12)] transition hover:-translate-y-0.5 hover:border-brand hover:bg-brand hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label="메뉴 열기"
            aria-expanded={open}
            aria-controls="mobile-menu-drawer"
            onClick={() => setOpen(true)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/40 bg-white text-ink transition hover:border-brand hover:bg-brand hover:text-white md:hidden"
          >
            <span className="sr-only">메뉴 열기</span>
            <span aria-hidden="true" className="relative block h-5 w-6">
              <span className="absolute left-0 top-0 block h-[2px] w-full rounded-full bg-current" />
              <span className="absolute left-0 top-[8px] block h-[2px] w-full rounded-full bg-current" />
              <span className="absolute left-0 top-[16px] block h-[2px] w-full rounded-full bg-current" />
            </span>
          </button>
        </div>
      </header>

      <div
        id="mobile-menu-drawer"
        className={`fixed inset-0 z-[100] bg-[#040713] md:hidden ${open ? "block" : "hidden"}`}
      >
        <aside className="fixed inset-0 h-dvh w-full overflow-y-auto bg-[#040713]">
          <div className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-8 px-4 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <Logo inverted />

              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/40 bg-white px-0 py-0 text-sm font-extrabold text-ink shadow-[0_10px_24px_rgba(255,255,255,0.14)]"
              >
                <span aria-hidden="true" className="relative block h-5 w-6">
                  <span className="absolute left-0 top-2 block h-[2px] w-full rotate-45 rounded-full bg-current" />
                  <span className="absolute left-0 top-2 block h-[2px] w-full -rotate-45 rounded-full bg-current" />
                </span>
              </button>
            </div>

            <nav className="grid gap-3 pb-8">
              <CalculatorHeaderSearch
                autoFocus
                onSearch={() => setOpen(false)}
                className="mb-2"
              />
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-white/12 bg-white px-5 py-4 text-lg font-extrabold leading-tight text-ink shadow-[0_12px_28px_rgba(255,255,255,0.12)] transition hover:border-brand hover:bg-brand hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </>
  );
}

function CalculatorHeaderSearch({
  className = "",
  autoFocus = false,
  onSearch
}: {
  className?: string;
  autoFocus?: boolean;
  onSearch?: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const trimmed = query.trim();
  const suggestions = useMemo(() => {
    const needle = trimmed.toLowerCase();
    if (!needle) return calculators.slice(0, 5);

    return calculators
      .map((calculator) => {
        const haystack = [
          calculator.title,
          calculator.description,
          calculator.audience,
          calculator.category,
          calculator.badge,
          ...calculator.keywords
        ]
          .join(" ")
          .toLowerCase();
        const titleMatch = calculator.title.toLowerCase().includes(needle) ? 3 : 0;
        const keywordMatch = calculator.keywords.some((keyword) => keyword.toLowerCase().includes(needle)) ? 2 : 0;
        const bodyMatch = haystack.includes(needle) ? 1 : 0;
        return { calculator, score: titleMatch + keywordMatch + bodyMatch };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || a.calculator.title.localeCompare(b.calculator.title, "ko"))
      .slice(0, 6)
      .map((item) => item.calculator);
  }, [trimmed]);

  const submitSearch = () => {
    if (!trimmed) {
      router.push("/calculators");
    } else {
      router.push(`/calculators?q=${encodeURIComponent(trimmed)}`);
    }
    setFocused(false);
    onSearch?.();
  };

  return (
    <div className={`relative ${className}`}>
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          submitSearch();
        }}
        className="flex h-11 items-center gap-2 rounded-2xl border border-white/12 bg-white px-3 shadow-[0_8px_24px_rgba(255,255,255,0.1)]"
      >
        <span aria-hidden="true" className="text-sm font-extrabold text-brand">
          검색
        </span>
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="계산기 검색"
          className="min-w-0 flex-1 bg-transparent text-sm font-bold text-ink outline-none placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-ink px-3 py-1.5 text-xs font-extrabold text-white transition hover:bg-brand"
        >
          이동
        </button>
      </form>

      {focused && suggestions.length > 0 && (
        <div
          className="absolute left-0 right-0 top-12 z-[120] overflow-hidden rounded-2xl border border-line bg-white shadow-float"
          onMouseDown={(event) => event.preventDefault()}
        >
          {suggestions.map((calculator) => {
            const groupMeta = CALCULATOR_GROUP_META[getCalculatorGroup(calculator.slug)];
            return (
              <Link
                key={calculator.slug}
                href={`/calculators/${calculator.slug}`}
                onClick={() => {
                  setFocused(false);
                  onSearch?.();
                }}
                className="flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0 hover:bg-paper"
              >
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm ${groupMeta.softClass} ${groupMeta.accentClass}`}>
                  {groupMeta.icon}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-extrabold text-ink">{calculator.title}</span>
                  <span className="mt-0.5 block truncate text-xs font-semibold text-slate-500">{groupMeta.label} · {calculator.category}</span>
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
