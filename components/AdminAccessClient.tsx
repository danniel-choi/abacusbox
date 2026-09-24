"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

function getInitialNextPath() {
  if (typeof window === "undefined") return "/admin/moderation";
  const params = new URLSearchParams(window.location.search);
  const next = params.get("next");
  return next && next.startsWith("/") ? next : "/admin/moderation";
}

export function AdminAccessClient() {
  const router = useRouter();
  const [nextPath] = useState(getInitialNextPath);

  const [password, setPassword] = useState("");
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function checkSession() {
      try {
        const response = await fetch("/api/admin/session", {
          credentials: "same-origin",
          headers: { accept: "application/json" }
        });
        const data = await response.json();
        if (!active) return;
        if (data?.authenticated) {
          router.replace(nextPath);
          return;
        }
      } catch {
        if (active) {
          setNotice("관리자 세션 확인에 실패했습니다.");
        }
      } finally {
        if (active) {
          setChecking(false);
        }
      }
    }

    void checkSession();
    return () => {
      active = false;
    };
  }, [nextPath, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setNotice(null);

    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "content-type": "application/json",
          accept: "application/json"
        },
        body: JSON.stringify({ password })
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || "로그인에 실패했습니다.");
      }
      router.replace(nextPath);
      router.refresh();
    } catch (cause) {
      setNotice(cause instanceof Error ? cause.message : "로그인에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center px-4 py-10">
      <section className="mx-auto grid w-full max-w-5xl gap-6 rounded-[28px] border border-line bg-white p-6 shadow-panel lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
        <div className="rounded-[24px] bg-ink px-6 py-8 text-white">
          <p className="text-sm font-extrabold text-brand">ADMIN</p>
          <h1 className="mt-3 text-3xl font-extrabold">관리자 전용 페이지</h1>
          <p className="mt-4 text-sm font-semibold leading-7 text-white/72">
            운영 콘텐츠, 댓글, 태그, 자동 발행 설정은 인증된 관리자만 접근할 수 있습니다.
          </p>
          <div className="mt-6 grid gap-3">
            <InfoRow label="접근 방식" value="비밀번호 인증 + HttpOnly 세션 쿠키" />
            <InfoRow label="직접 이동" value="/admin/moderation" />
            <InfoRow label="보호 범위" value="관리자 전용 API 및 운영 화면" />
          </div>
        </div>

        <div className="rounded-[24px] border border-line bg-paper p-6">
          <div>
            <h2 className="text-2xl font-extrabold text-ink">관리자 로그인</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              비밀번호 입력 후 관리자 대시보드로 이동합니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <label className="grid gap-2">
              <span className="text-sm font-extrabold text-ink">비밀번호</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="관리자 비밀번호 입력"
                autoComplete="current-password"
                disabled={checking || submitting}
                className="h-12 rounded-2xl border border-line bg-white px-4 font-bold text-ink outline-none transition focus:border-brand"
              />
            </label>
            <button
              type="submit"
              disabled={checking || submitting || !password.trim()}
              className="h-12 rounded-full bg-brand px-5 text-sm font-extrabold text-white transition hover:bg-[#029b72] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {checking ? "세션 확인 중..." : submitting ? "로그인 중..." : "관리자 페이지 들어가기"}
            </button>
          </form>

          {notice && <p className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#b42318]">{notice}</p>}

          <div className="mt-6">
            <Link href="/" className="text-sm font-extrabold text-brand">
              메인으로 돌아가기 ↗
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-xs font-extrabold text-white/48">{label}</p>
      <p className="mt-1 text-sm font-bold text-white">{value}</p>
    </div>
  );
}
