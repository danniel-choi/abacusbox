"use client";

import { useEffect, useState } from "react";

type VisitorStats = {
  activeVisitors: number;
  todayVisitors: number;
  totalVisitors: number;
  activeWindowMinutes: number;
};

const HEARTBEAT_INTERVAL_MS = 30_000;
const VISITOR_STORAGE_KEY = "calcrule-visitor-id";

function createVisitorId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `visitor-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function getVisitorId() {
  const saved = window.localStorage.getItem(VISITOR_STORAGE_KEY);
  if (saved) return saved;

  const visitorId = createVisitorId();
  window.localStorage.setItem(VISITOR_STORAGE_KEY, visitorId);
  return visitorId;
}

function formatCount(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

export function VisitorCounter() {
  const [stats, setStats] = useState<VisitorStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;

    const sync = async () => {
      try {
        const response = await fetch("/api/visitors", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json"
          },
          body: JSON.stringify({
            visitorId: getVisitorId(),
            path: window.location.pathname
          })
        });

        if (!response.ok) {
          return;
        }

        const next = (await response.json()) as VisitorStats;
        if (!cancelled) {
          setStats(next);
        }
      } catch {
        // Ignore footer stats failures.
      }
    };

    void sync();
    timer = window.setInterval(() => {
      void sync();
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  if (!stats) {
    return (
      <div className="rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm font-semibold text-white/80">
        방문 통계를 불러오는 중입니다.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-white/8 px-4 py-4 text-sm text-white/92">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="font-extrabold text-white">실시간 방문자</span>
        <span className="font-semibold text-white/90">현재 {formatCount(stats.activeVisitors)}명</span>
        <span className="font-semibold text-white/90">오늘 {formatCount(stats.todayVisitors)}명</span>
        <span className="font-semibold text-white/90">누적 {formatCount(stats.totalVisitors)}명</span>
      </div>
      <p className="mt-2 text-xs font-medium text-white/68">
        최근 {stats.activeWindowMinutes}분 내 활동 기준으로 집계합니다.
      </p>
    </div>
  );
}
