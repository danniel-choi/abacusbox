"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";

const navItems = [
  { href: "/calculators", label: "계산기" },
  { href: "/blog", label: "블로그" },
  { href: "/#sources", label: "출처" },
  { href: "/about", label: "소개" }
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
    if (!open) {
      return;
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/95 shadow-[0_12px_32px_rgba(4,7,19,0.32)] backdrop-blur">
      <div className={`mx-auto flex max-w-6xl items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4 ${open ? "hidden md:flex" : "flex"}`}>
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
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={open}
          aria-controls="mobile-menu-drawer"
          onClick={() => setOpen((current) => !current)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/40 bg-white text-ink transition hover:border-brand hover:bg-brand hover:text-white md:hidden"
        >
          <span className="sr-only">{open ? "닫기" : "메뉴 열기"}</span>
          <span
            aria-hidden="true"
            className={`relative block h-5 w-6 ${open ? "rotate-180" : ""}`}
          >
            <span
              className={`absolute left-0 top-0 block h-[2px] w-full rounded-full bg-current transition-all duration-200 ${open ? "top-2 rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-[8px] block h-[2px] w-full rounded-full bg-current transition-all duration-150 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 top-[16px] block h-[2px] w-full rounded-full bg-current transition-all duration-200 ${open ? "top-2 -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu-drawer"
        className={`fixed inset-0 z-60 md:hidden transition-opacity duration-250 ${open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div
          className="absolute inset-0 bg-black/25"
          style={{
            WebkitBackdropFilter: "blur(14px)",
            backdropFilter: "blur(14px)"
          }}
          onClick={() => setOpen(false)}
        />

        <aside
          className={`fixed right-0 top-0 h-full w-[78vw] max-w-[320px] bg-ink/95 shadow-2xl ring-1 ring-white/10 transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex h-full flex-col gap-4 px-4 py-5">
            <div className="flex justify-between">
              <span className="text-sm font-bold text-white/80">메뉴</span>

              <button
                type="button"
                aria-label="메뉴 닫기"
                onClick={() => setOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/40 bg-white px-0 py-0 text-sm font-extrabold text-ink shadow-[0_10px_24px_rgba(255,255,255,0.14)]"
              >
                <span aria-hidden="true" className="relative block h-5 w-6">
                  <span className="absolute left-0 top-2 block h-[2px] w-full rounded-full bg-current rotate-45" />
                  <span className="absolute left-0 top-2 block h-[2px] w-full rounded-full bg-current -rotate-45" />
                </span>
              </button>
            </div>

            <nav className="grid gap-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-brand/40 bg-white px-4 py-3.5 text-base font-extrabold leading-tight text-ink shadow-[0_12px_28px_rgba(255,255,255,0.12)] transition hover:border-brand hover:bg-brand hover:text-white"
                  style={{ transitionDelay: `${open ? 55 + index * 35 : 0}ms` }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </header>
  );
}
