"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { calculators, type CalculatorCategory, type CalculatorConfig } from "@/lib/calculators";
import {
  CALCULATOR_GROUP_META,
  getCalculatorGroup,
  getCalculatorsByGroup,
  getFeaturedCalculators,
  getRecentCalculators,
  type CalculatorGroup
} from "@/lib/calculator-directory";

type Props = {
  initialCategory?: "전체" | CalculatorCategory;
  initialGroup?: CalculatorGroup | "all";
  compact?: boolean;
};

function getInitialCategory(initialCategory: Props["initialCategory"]) {
  if (typeof window === "undefined") return initialCategory ?? "전체";
  const nextCategory = new URLSearchParams(window.location.search).get("category");
  return isCalculatorCategory(nextCategory) ? nextCategory : (initialCategory ?? "전체");
}

function getInitialGroup(initialGroup: Props["initialGroup"]) {
  if (typeof window === "undefined") return initialGroup ?? "all";
  const nextGroup = new URLSearchParams(window.location.search).get("group");
  return nextGroup && nextGroup in CALCULATOR_GROUP_META ? (nextGroup as CalculatorGroup) : (initialGroup ?? "all");
}

function getInitialQuery() {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("q") || "";
}

export function CalculatorDirectoryClient({
  initialCategory = "전체",
  initialGroup = "all",
  compact = false
}: Props) {
  const [query, setQuery] = useState(() => getInitialQuery());
  const [category, setCategory] = useState<"전체" | CalculatorCategory>(() => getInitialCategory(initialCategory));
  const [group, setGroup] = useState<CalculatorGroup | "all">(() => getInitialGroup(initialGroup));
  const [sort, setSort] = useState<"recommended" | "name" | "group">("recommended");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (!mobileFilterOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileFilterOpen]);

  const featured = useMemo(() => getFeaturedCalculators(), []);
  const recent = useMemo(() => getRecentCalculators(), []);
  const filtered = useMemo(() => {
    let list = calculators.slice();

    if (category !== "전체") {
      list = list.filter((item) => item.category === category);
    }

    if (group !== "all") {
      list = list.filter((item) => getCalculatorGroup(item.slug) === group);
    }

    const needle = query.trim().toLowerCase();
    if (needle) {
      list = list.filter((calculator) =>
        [
          calculator.title,
          calculator.description,
          calculator.audience,
          calculator.badge,
          calculator.category,
          ...calculator.keywords
        ]
          .join(" ")
          .toLowerCase()
          .includes(needle)
      );
    }

    if (sort === "name") {
      list = list.slice().sort((a, b) => a.title.localeCompare(b.title, "ko"));
    } else if (sort === "group") {
      list = list
        .slice()
        .sort((a, b) =>
          `${CALCULATOR_GROUP_META[getCalculatorGroup(a.slug)].label} ${a.title}`.localeCompare(
            `${CALCULATOR_GROUP_META[getCalculatorGroup(b.slug)].label} ${b.title}`,
            "ko"
          )
        );
    }

    return list;
  }, [category, group, query, sort]);

  const visible = compact ? filtered.slice(0, 9) : filtered;

  return (
    <section className="rounded-[28px] border border-line bg-white p-6 shadow-panel">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-extrabold text-brand">계산기 디렉토리</p>
          <h2 className="mt-2 text-2xl font-extrabold text-ink md:text-3xl">
            {compact ? "원하는 계산기를 빠르게 찾으세요." : "전체 계산기를 카테고리별로 찾을 수 있습니다."}
          </h2>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-7 text-slate-600">
            검색어, 분야, 그룹 기준으로 계산기를 좁혀서 바로 들어갈 수 있습니다.
          </p>
        </div>
        {compact && (
          <Link href="/calculators" className="text-sm font-extrabold text-brand">
            전체 계산기 보기 ↗
          </Link>
        )}
      </div>

      <div className="mt-6 grid gap-3 xl:grid-cols-[1.2fr_repeat(3,minmax(0,0.65fr))]">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="예: 실업급여, 취득세, 환율, 부가세"
          className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand focus:bg-white"
        />
        <div className="md:hidden">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex h-12 w-full items-center justify-between rounded-2xl border border-line bg-paper px-4 font-bold text-ink transition hover:border-brand hover:bg-white"
          >
            <span>필터 열기</span>
            <span className="text-sm text-slate-500">
              {[category !== "전체" ? category : null, group !== "all" ? CALCULATOR_GROUP_META[group].label : null, sort !== "recommended" ? "정렬" : null]
                .filter(Boolean)
                .length || "기본"}
            </span>
          </button>
        </div>
        <div className="hidden md:contents">
          <FilterControls
            category={category}
            group={group}
            sort={sort}
            setCategory={setCategory}
            setGroup={setGroup}
            setSort={setSort}
          />
        </div>
      </div>

      <div className="mt-5 hidden flex-wrap gap-2 md:flex">
        <FilterButton active={group === "all"} label="전체" onClick={() => setGroup("all")} />
        {Object.entries(CALCULATOR_GROUP_META).map(([key, meta]) => (
          <FilterButton
            key={key}
            active={group === key}
            label={meta.label}
            onClick={() => setGroup(key as CalculatorGroup)}
          />
        ))}
      </div>

      {!compact && (
        <div className="mt-6 hidden gap-3 lg:grid-cols-3 xl:grid">
          {Object.entries(CALCULATOR_GROUP_META).map(([key, meta]) => {
            const groupItems = getCalculatorsByGroup(key as CalculatorGroup);
            return (
              <button
                key={key}
                type="button"
              onClick={() => setGroup(key as CalculatorGroup)}
              className="rounded-[22px] border border-line bg-paper p-5 text-left transition hover:border-brand hover:bg-white"
            >
                <p className="text-sm font-extrabold text-brand">{meta.label}</p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{meta.description}</p>
                <p className="mt-4 text-lg font-extrabold text-ink">{groupItems.length}개 계산기</p>
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-xl font-extrabold text-ink">
            {query.trim() || category !== "전체" || group !== "all" ? `검색 결과 ${filtered.length}개` : `전체 계산기 ${filtered.length}개`}
          </h3>
          {!compact && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("전체");
                setGroup("all");
                setSort("recommended");
              }}
              className="text-sm font-extrabold text-slate-500 transition hover:text-brand"
            >
              필터 초기화
            </button>
          )}
        </div>

        {!compact && !query.trim() && category === "전체" && group === "all" && (
          <div className="mb-8 grid gap-6 xl:grid-cols-2">
            <DirectoryHighlight title="운영 추천 계산기" items={featured} />
            <DirectoryHighlight title="최근 추가된 계산기" items={recent} />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((calculator) => (
            <CalculatorCard key={calculator.slug} calculator={calculator} />
          ))}
        </div>

        {compact && filtered.length > visible.length && (
          <div className="mt-5">
            <Link
              href="/calculators"
              className="inline-flex rounded-full border border-brand px-5 py-3 text-sm font-extrabold text-brand transition hover:bg-brand hover:text-white"
            >
              나머지 계산기 더 보기
            </Link>
          </div>
        )}
      </div>

      <MobileFilterSheet
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
        category={category}
        group={group}
        sort={sort}
        setCategory={setCategory}
        setGroup={setGroup}
        setSort={setSort}
        onReset={() => {
          setQuery("");
          setCategory("전체");
          setGroup("all");
          setSort("recommended");
        }}
      />
    </section>
  );
}

function FilterControls({
  category,
  group,
  sort,
  setCategory,
  setGroup,
  setSort
}: {
  category: "전체" | CalculatorCategory;
  group: CalculatorGroup | "all";
  sort: "recommended" | "name" | "group";
  setCategory: (value: "전체" | CalculatorCategory) => void;
  setGroup: (value: CalculatorGroup | "all") => void;
  setSort: (value: "recommended" | "name" | "group") => void;
}) {
  return (
    <>
      <select
        value={category}
        onChange={(event) => setCategory(event.target.value as "전체" | CalculatorCategory)}
        className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand focus:bg-white"
      >
        <option value="전체">전체 분야</option>
        <option value="노무">노무</option>
        <option value="금융">금융</option>
        <option value="생활">생활</option>
        <option value="수학">수학</option>
      </select>
      <select
        value={group}
        onChange={(event) => setGroup(event.target.value as CalculatorGroup | "all")}
        className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand focus:bg-white"
      >
        <option value="all">전체 그룹</option>
        {Object.entries(CALCULATOR_GROUP_META).map(([key, meta]) => (
          <option key={key} value={key}>
            {meta.label}
          </option>
        ))}
      </select>
      <select
        value={sort}
        onChange={(event) => setSort(event.target.value as "recommended" | "name" | "group")}
        className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand focus:bg-white"
      >
        <option value="recommended">추천순</option>
        <option value="name">이름순</option>
        <option value="group">그룹순</option>
      </select>
    </>
  );
}

function MobileFilterSheet({
  open,
  onClose,
  category,
  group,
  sort,
  setCategory,
  setGroup,
  setSort,
  onReset
}: {
  open: boolean;
  onClose: () => void;
  category: "전체" | CalculatorCategory;
  group: CalculatorGroup | "all";
  sort: "recommended" | "name" | "group";
  setCategory: (value: "전체" | CalculatorCategory) => void;
  setGroup: (value: CalculatorGroup | "all") => void;
  setSort: (value: "recommended" | "name" | "group") => void;
  onReset: () => void;
}) {
  return (
    <div className={`fixed inset-0 z-[70] md:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
        style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
        onClick={onClose}
      />
      <div
        className={`absolute inset-x-0 bottom-0 rounded-t-[28px] bg-white p-5 shadow-2xl transition-transform duration-300 ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-slate-200" />
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-extrabold text-ink">필터</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">분야, 그룹, 정렬 기준을 조정합니다.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600"
          >
            닫기
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          <FilterControls
            category={category}
            group={group}
            sort={sort}
            setCategory={setCategory}
            setGroup={setGroup}
            setSort={setSort}
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <FilterButton active={group === "all"} label="전체" onClick={() => setGroup("all")} />
          {Object.entries(CALCULATOR_GROUP_META).map(([key, meta]) => (
            <FilterButton
              key={key}
              active={group === key}
              label={meta.label}
              onClick={() => setGroup(key as CalculatorGroup)}
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => {
              onReset();
            }}
            className="h-12 rounded-2xl border border-line bg-paper text-sm font-extrabold text-slate-700"
          >
            초기화
          </button>
          <button
            type="button"
            onClick={onClose}
            className="h-12 rounded-2xl bg-ink text-sm font-extrabold text-white"
          >
            적용
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterButton({
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
        active ? "bg-ink text-white" : "border border-line bg-white text-slate-600 hover:border-brand hover:text-brand"
      }`}
    >
      {label}
    </button>
  );
}

function CalculatorCard({ calculator }: { calculator: CalculatorConfig }) {
  const groupMeta = CALCULATOR_GROUP_META[getCalculatorGroup(calculator.slug)];
  return (
    <Link
      href={`/calculators/${calculator.slug}`}
      className="rounded-[20px] border border-line bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-brand hover:shadow-float"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-extrabold text-brand">{calculator.category}</span>
          <span className="rounded-full bg-paper px-3 py-1 text-xs font-extrabold text-slate-500">{groupMeta.label}</span>
        </div>
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl ${groupMeta.softClass} ${groupMeta.accentClass}`}>
          {groupMeta.icon}
        </span>
      </div>
      <h3 className="mt-4 text-lg font-extrabold text-ink">{calculator.title}</h3>
      <p className="mt-3 min-h-20 text-sm font-medium leading-6 text-slate-600">{calculator.description}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="text-xs font-bold text-slate-400">{calculator.audience}</p>
        <span className={`text-[11px] font-extrabold ${groupMeta.accentClass}`}>{calculator.badge}</span>
      </div>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-brand">
        계산하기 <span>↗</span>
      </span>
    </Link>
  );
}

function DirectoryHighlight({
  title,
  items
}: {
  title: string;
  items: CalculatorConfig[];
}) {
  return (
    <div className="rounded-[24px] border border-line bg-paper p-5">
      <h3 className="text-lg font-extrabold text-ink">{title}</h3>
      <div className="mt-4 grid gap-2">
        {items.map((calculator) => (
          <Link
            key={calculator.slug}
            href={`/calculators/${calculator.slug}`}
            className="flex items-center justify-between rounded-2xl bg-white px-4 py-3 transition hover:border-brand hover:text-brand"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl text-base ${CALCULATOR_GROUP_META[getCalculatorGroup(calculator.slug)].softClass} ${CALCULATOR_GROUP_META[getCalculatorGroup(calculator.slug)].accentClass}`}>
                {CALCULATOR_GROUP_META[getCalculatorGroup(calculator.slug)].icon}
              </span>
              <span className="block truncate text-sm font-extrabold text-ink">{calculator.title}</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">{CALCULATOR_GROUP_META[getCalculatorGroup(calculator.slug)].label}</span>
            </span>
            <span className="ml-3 text-sm font-extrabold text-brand">↗</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function isCalculatorCategory(value: string | null): value is CalculatorCategory {
  return value === "노무" || value === "금융" || value === "생활" || value === "수학";
}
