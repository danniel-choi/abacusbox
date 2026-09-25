"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

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
