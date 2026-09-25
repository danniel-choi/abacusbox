"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { PointerEvent, ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import * as THREE from "three";
import { getCalculatorBySlug, type CalculatorResult, type CalculatorSlug, type ResultRow } from "@/lib/calculators";

type FormValues = Record<string, number>;

const RECENT_CALCULATORS_STORAGE_KEY = "calcrule:recent-calculators";
const WEB_CALCULATOR_HISTORY_STORAGE_KEY = "calcrule:web-calculator-history";
const WEB_CALCULATOR_MEMORY_STORAGE_KEY = "calcrule:web-calculator-memory";
const SCIENTIFIC_CALCULATOR_HISTORY_STORAGE_KEY = "calcrule:scientific-calculator-history";
const SCIENTIFIC_CALCULATOR_MEMORY_STORAGE_KEY = "calcrule:scientific-calculator-memory";
const FOUR_FUNCTION_HISTORY_STORAGE_KEY = "calcrule:four-function-calculator-history";
const MATH_NOTES_STORAGE_KEY = "calcrule:math-notes";
const MATRIX_CALCULATOR_STORAGE_KEY = "calcrule:matrix-calculator";

function formStorageKey(slug: CalculatorSlug) {
  return `calcrule:calculator-form:${slug}`;
}

export function CalculatorClient({ slug }: { slug: CalculatorSlug }) {
  const calculator = getCalculatorBySlug(slug);
  const router = useRouter();
  const searchParams = useSearchParams();
  const resultRef = useRef<HTMLDivElement>(null);
  const [resultNonce, setResultNonce] = useState(0);
  const defaults = useMemo(() => {
    return Object.fromEntries(
      calculator.fields.map((field) => {
        const raw = searchParams.get(field.name);
        const parsed = raw === null ? Number.NaN : Number(raw);
        return [field.name, Number.isFinite(parsed) ? parsed : field.defaultValue];
      })
    );
  }, [calculator, searchParams]);

  const { control, reset, setValue } = useForm<FormValues>({
    defaultValues: defaults,
    mode: "onChange"
  });
  const values = useWatch({ control });
  const activeCalculator = calculator;

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasQueryValues = calculator.fields.some((field) => searchParams.get(field.name) !== null);
    if (hasQueryValues) return;

    const raw = window.localStorage.getItem(formStorageKey(slug));
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw) as Record<string, number>;
      const nextValues = Object.fromEntries(
        calculator.fields.map((field) => {
          const candidate = parsed[field.name];
          return [field.name, Number.isFinite(candidate) ? candidate : field.defaultValue];
        })
      );

      reset(nextValues);
    } catch {
      window.localStorage.removeItem(formStorageKey(slug));
    }
  }, [calculator.fields, reset, searchParams, slug]);

  const result = useMemo(
    () => activeCalculator.calculate(values as FormValues, { refreshKey: resultNonce }),
    [activeCalculator, resultNonce, values]
  );
  const chartMax = Math.max(...result.chart.map((point) => point.value), 1);
  const highlightedRows = result.rows.filter((row) => row.tone === "strong");
  const inputSummary = activeCalculator.fields.map((field) => ({
    label: field.label,
    value: formatInputValue(field, Number(values[field.name] ?? field.defaultValue))
  }));

  useEffect(() => {
    const params = new URLSearchParams();
    activeCalculator.fields.forEach((field) => {
      const value = values[field.name];
      if (Number.isFinite(value) && value !== field.defaultValue) {
        params.set(field.name, String(value));
      }
    });

    const query = params.toString();
    router.replace(query ? `?${query}` : window.location.pathname, { scroll: false });
  }, [activeCalculator.fields, router, values]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const snapshot = Object.fromEntries(
      activeCalculator.fields.map((field) => {
        const value = Number(values[field.name] ?? field.defaultValue);
        return [field.name, Number.isFinite(value) ? value : field.defaultValue];
      })
    );

    window.localStorage.setItem(formStorageKey(slug), JSON.stringify(snapshot));
  }, [activeCalculator.fields, slug, values]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const raw = window.localStorage.getItem(RECENT_CALCULATORS_STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CalculatorSlug[]) : [];
    const next = [slug, ...parsed.filter((item) => item !== slug)].slice(0, 8);
    window.localStorage.setItem(RECENT_CALCULATORS_STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("calcrule:recent-calculators"));
  }, [slug]);

  function resetToDefaults() {
    reset(Object.fromEntries(activeCalculator.fields.map((field) => [field.name, field.defaultValue])));
  }

  if (activeCalculator.slug === "graphing-calculator") {
    return <GraphingCalculator title={activeCalculator.title} checkpoints={activeCalculator.checkpoints} />;
  }

  if (activeCalculator.slug === "scientific-calculator") {
    return (
      <ExpressionCalculator
        title={activeCalculator.title}
        checkpoints={activeCalculator.checkpoints}
        historyStorageKey={SCIENTIFIC_CALCULATOR_HISTORY_STORAGE_KEY}
        memoryStorageKey={SCIENTIFIC_CALCULATOR_MEMORY_STORAGE_KEY}
      />
    );
  }

  if (activeCalculator.slug === "four-function-calculator") {
    return <FourFunctionCalculator title={activeCalculator.title} checkpoints={activeCalculator.checkpoints} />;
  }

  if (activeCalculator.slug === "dday") {
    return <DdayCalculator title={activeCalculator.title} checkpoints={activeCalculator.checkpoints} />;
  }

  if (activeCalculator.slug === "date-add") {
    return <DateAddCalculator title={activeCalculator.title} checkpoints={activeCalculator.checkpoints} />;
  }

  if (activeCalculator.slug === "stopwatch") {
    return <StopwatchTool title={activeCalculator.title} checkpoints={activeCalculator.checkpoints} />;
  }

  if (activeCalculator.slug === "internet-speed-test") {
    return <InternetSpeedTest title={activeCalculator.title} checkpoints={activeCalculator.checkpoints} />;
  }

  if (activeCalculator.slug === "math-notes") {
    return <MathNotes title={activeCalculator.title} checkpoints={activeCalculator.checkpoints} />;
  }

  if (activeCalculator.slug === "matrix-calculator") {
    return <MatrixCalculator title={activeCalculator.title} checkpoints={activeCalculator.checkpoints} />;
  }

  if (activeCalculator.slug === "geometry-tool") {
    return <GeometryTool title={activeCalculator.title} checkpoints={activeCalculator.checkpoints} />;
  }

  if (activeCalculator.slug === "three-d-calculator") {
    return <ThreeDCalculator title={activeCalculator.title} checkpoints={activeCalculator.checkpoints} />;
  }

  if (activeCalculator.slug === "web-calculator") {
    return (
      <ExpressionCalculator
        title={activeCalculator.title}
        checkpoints={activeCalculator.checkpoints}
        historyStorageKey={WEB_CALCULATOR_HISTORY_STORAGE_KEY}
        memoryStorageKey={WEB_CALCULATOR_MEMORY_STORAGE_KEY}
      />
    );
  }

  if (activeCalculator.slug === "distance-calculator") {
    return <DistanceCalculator title={activeCalculator.title} checkpoints={activeCalculator.checkpoints} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <form className="min-w-0 overflow-hidden rounded-[20px] border border-line bg-white p-5 shadow-float sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-extrabold text-brand">입력값</p>
            <h2 className="mt-1 text-xl font-extrabold text-ink sm:text-2xl">조건을 입력하세요</h2>
          </div>
          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full bg-paper px-3 py-1 text-xs font-extrabold text-slate-500">자동 계산</span>
            <button
              type="button"
              onClick={resetToDefaults}
              className="rounded-full border border-line px-3 py-1 text-xs font-extrabold text-slate-500 transition hover:border-brand hover:text-brand"
            >
              기본값 복원
            </button>
          </div>
        </div>
        <div className="grid gap-5">
          {activeCalculator.fields.map((field) => (
            <label key={field.name} className="grid gap-2">
              <span className="flex items-center justify-between text-sm font-extrabold text-ink">
                {field.label}
                {field.unit && <span className="font-bold text-slate-400">{field.unit}</span>}
              </span>
              {field.type === "select" ? (
                <select
                  className="h-12 w-full min-w-0 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand focus:bg-white"
                  value={Number(values[field.name] ?? field.defaultValue)}
                  onChange={(event) => setValue(field.name, Number(event.target.value), { shouldDirty: true })}
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="grid gap-2">
                  <input
                    className="h-12 w-full min-w-0 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand focus:bg-white"
                    type="number"
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    value={Number(values[field.name] ?? field.defaultValue)}
                    onChange={(event) => setValue(field.name, Number(event.target.value), { shouldDirty: true })}
                  />
                  {field.max !== undefined && field.min !== undefined && (
                    <input
                      aria-label={`${field.label} 슬라이더`}
                      className="h-2 w-full min-w-0"
                      type="range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={Number(values[field.name] ?? field.defaultValue)}
                      onChange={(event) => setValue(field.name, Number(event.target.value), { shouldDirty: true })}
                    />
                  )}
                </div>
              )}
              {field.help && <span className="text-xs font-semibold text-slate-500">{field.help}</span>}
            </label>
          ))}
        </div>
        <div className="mt-6 rounded-[18px] border border-line bg-paper p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-ink">입력 요약</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">마지막 입력값은 이 기기에서 자동 저장됩니다.</p>
            </div>
            <button
              type="button"
              onClick={() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="w-full rounded-full bg-white px-4 py-3 text-xs font-extrabold text-brand shadow-sm transition hover:bg-brand hover:text-white sm:w-auto"
            >
              결과 보기
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {inputSummary.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
                <span className="text-sm font-bold text-slate-500">{item.label}</span>
                <span className="text-sm font-extrabold text-ink">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 sm:hidden">
            <button
              type="button"
              onClick={resetToDefaults}
              className="w-full rounded-full border border-line px-4 py-3 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand sm:w-auto"
            >
              기본값 복원
            </button>
          </div>
        </div>
      </form>

      <section ref={resultRef} className="min-w-0 overflow-hidden rounded-[20px] border border-line bg-white p-5 shadow-float sm:p-6">
        <div className="rounded-[18px] bg-ink p-5 text-white">
          <p className="text-sm font-extrabold text-brand">계산 결과</p>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">{result.headline}</h2>
          <p className="mt-3 text-sm font-semibold text-white/62">{result.subline}</p>
        </div>

        {highlightedRows.length > 0 && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {highlightedRows.map((row) => (
              <div key={row.label} className="rounded-[18px] border border-line bg-paper p-4">
                <p className="text-sm font-bold text-slate-500">{row.label}</p>
                <p className="mt-2 text-2xl font-extrabold text-ink">{row.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 overflow-hidden rounded-[18px] border border-line">
          {result.rows.map((row) => (
            <div key={row.label} className="grid grid-cols-1 gap-1 border-b border-line p-3 text-sm last:border-0 sm:grid-cols-[0.9fr_1.1fr] sm:gap-0">
              <div className="bg-paper px-4 py-4 font-extrabold text-slate-600">{row.label}</div>
              <div
                className={`min-w-0 px-4 py-4 text-left text-xs font-extrabold sm:text-right sm:text-sm ${row.tone === "strong" ? "text-brand" : "text-ink"}`}
              >
                <span className="break-words">{row.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[18px] border border-line bg-paper p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-ink">비교 차트</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">핵심 수치를 한 번에 비교합니다.</p>
            </div>
          </div>
          <div className="grid h-56 items-end gap-4" style={{ gridTemplateColumns: `repeat(${result.chart.length}, minmax(0, 1fr))` }}>
            {result.chart.map((point) => {
              const height = Math.max((point.value / chartMax) * 100, 4);
              return (
                <div key={point.name} className="flex h-full min-w-0 flex-col justify-end gap-3">
                  <div className="flex h-full items-end rounded-t-xl bg-white px-2">
                    <div className="w-full rounded-t-xl bg-brand" style={{ height: `${height}%` }} />
                  </div>
                  <div className="text-center">
                    <p className="truncate text-xs font-extrabold text-slate-600">{point.name}</p>
                    <p className="mt-1 truncate text-xs font-bold text-slate-400">{Math.round(point.value).toLocaleString("ko-KR")}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-[18px] border border-line bg-white p-5">
          <p className="text-sm font-extrabold text-ink">해석 포인트</p>
          <div className="mt-4 grid gap-3">
            {activeCalculator.checkpoints.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-paper px-4 py-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand" />
                <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {activeCalculator.actionLabel && (
            <button
              type="button"
              onClick={() => setResultNonce((current) => current + 1)}
              className="w-full rounded-full border border-line px-5 py-3 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand sm:w-auto"
            >
              {activeCalculator.actionLabel}
            </button>
          )}
          <ShareActions title={activeCalculator.title} result={result} fileName={`${activeCalculator.slug}-result.png`} />
        </div>
        <p className="mt-4 text-xs font-semibold leading-6 text-slate-500">
          계산 결과는 입력값과 현재 반영 기준에 따른 추정치입니다. 실제 심사·지급·대출 승인 결과는 기관 판단에 따라 달라질 수 있습니다.
        </p>
      </section>
    </div>
  );
}

type PlaceSearchResult = {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type?: string;
};

function ShareActions({
  title,
  result,
  fileName
}: {
  title: string;
  result: Pick<CalculatorResult, "headline" | "subline" | "rows">;
  fileName: string;
}) {
  const [notice, setNotice] = useState("");

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 1800);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    showNotice("링크를 복사했습니다.");
  }

  async function copyResultText() {
    await navigator.clipboard.writeText(buildShareText(title, result, window.location.href));
    showNotice("결과 요약을 복사했습니다.");
  }

  async function shareResult() {
    const text = buildShareText(title, result, window.location.href);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} 결과`,
          text,
          url: window.location.href
        });
        showNotice("공유창을 열었습니다.");
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard.writeText(text);
    showNotice("공유 문구를 복사했습니다.");
  }

  function downloadImage() {
    downloadResultCard({
      title,
      headline: result.headline,
      subline: result.subline,
      rows: result.rows,
      url: window.location.href,
      fileName
    });
    showNotice("결과 이미지를 저장했습니다.");
  }

  return (
    <>
      <button
        type="button"
        onClick={shareResult}
        className="w-full rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b72] sm:w-auto"
      >
        카카오/앱 공유
      </button>
      <button
        type="button"
        onClick={copyResultText}
        className="w-full rounded-full border border-brand px-5 py-3 text-sm font-extrabold text-brand transition hover:bg-brand hover:text-white sm:w-auto"
      >
        결과 문구 복사
      </button>
      <button
        type="button"
        onClick={copyLink}
        className="w-full rounded-full border border-line px-5 py-3 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand sm:w-auto"
      >
        링크 복사
      </button>
      <button
        type="button"
        onClick={downloadImage}
        className="w-full rounded-full border border-line px-5 py-3 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand sm:w-auto"
      >
        결과 카드 저장
      </button>
      {notice && <p className="w-full text-xs font-extrabold text-brand">{notice}</p>}
    </>
  );
}

function buildShareText(title: string, result: Pick<CalculatorResult, "headline" | "subline" | "rows">, url: string) {
  const rows = result.rows
    .slice(0, 5)
    .map((row) => `${row.label}: ${row.value}`)
    .join("\n");

  return [`[계산의정석] ${title}`, `결과: ${result.headline}`, result.subline, rows, url].filter(Boolean).join("\n");
}

function downloadResultCard({
  title,
  headline,
  subline,
  rows,
  url,
  fileName
}: {
  title: string;
  headline: string;
  subline: string;
  rows: ResultRow[];
  url: string;
  fileName: string;
}) {
  const canvas = document.createElement("canvas");
  const scale = 2;
  const width = 1080;
  const height = 1350;
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const context = canvas.getContext("2d");
  if (!context) return;
  context.scale(scale, scale);

  context.fillStyle = "#f7f9fb";
  context.fillRect(0, 0, width, height);
  drawRoundedRect(context, 54, 54, width - 108, height - 108, 38, "#ffffff");
  drawRoundedRect(context, 90, 90, width - 180, 310, 28, "#07111f");

  context.fillStyle = "#02b585";
  context.font = "800 34px sans-serif";
  context.fillText("계산의정석", 128, 150);
  context.fillStyle = "#ffffff";
  context.font = "800 54px sans-serif";
  wrapCanvasText(context, title, 128, 225, width - 256, 62, 2);

  context.fillStyle = "#02b585";
  context.font = "800 64px sans-serif";
  wrapCanvasText(context, headline, 128, 430, width - 256, 74, 2);

  context.fillStyle = "#52606d";
  context.font = "600 30px sans-serif";
  wrapCanvasText(context, subline, 128, 615, width - 256, 42, 2);

  const visibleRows = rows.slice(0, 6);
  visibleRows.forEach((row, index) => {
    const y = 735 + index * 86;
    drawRoundedRect(context, 128, y - 48, width - 256, 66, 18, row.tone === "strong" ? "#e6fbf5" : "#f3f6f9");
    context.fillStyle = "#52606d";
    context.font = "700 28px sans-serif";
    context.fillText(truncateCanvasText(context, row.label, 310), 158, y - 7);
    context.fillStyle = row.tone === "strong" ? "#008e6b" : "#17212b";
    context.font = "800 30px sans-serif";
    context.textAlign = "right";
    context.fillText(truncateCanvasText(context, row.value, 430), width - 158, y - 7);
    context.textAlign = "left";
  });

  context.fillStyle = "#17212b";
  context.font = "800 28px sans-serif";
  context.fillText("abacusbox.com", 128, 1216);
  context.fillStyle = "#7a8794";
  context.font = "600 22px sans-serif";
  wrapCanvasText(context, url, 128, 1254, width - 256, 30, 2);

  const link = document.createElement("a");
  link.download = fileName;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
  fillStyle: string
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
  context.fillStyle = fillStyle;
  context.fill();
}

function wrapCanvasText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number
) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;
    if (context.measureText(nextLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
      return;
    }
    line = nextLine;
  });
  if (line) lines.push(line);

  lines.slice(0, maxLines).forEach((item, index) => {
    const lineText = index === maxLines - 1 && lines.length > maxLines ? truncateCanvasText(context, item, maxWidth) : item;
    context.fillText(lineText, x, y + index * lineHeight);
  });
}

function truncateCanvasText(context: CanvasRenderingContext2D, text: string, maxWidth: number) {
  if (context.measureText(text).width <= maxWidth) return text;
  let next = text;
  while (next.length > 1 && context.measureText(`${next}...`).width > maxWidth) {
    next = next.slice(0, -1);
  }
  return `${next}...`;
}

function DistanceCalculator({ title, checkpoints }: { title: string; checkpoints: string[] }) {
  const [originLat, setOriginLat] = useState("");
  const [originLon, setOriginLon] = useState("");
  const [targetLat, setTargetLat] = useState("");
  const [targetLon, setTargetLon] = useState("");
  const [targetName, setTargetName] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PlaceSearchResult[]>([]);
  const [status, setStatus] = useState("");
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const origin = parseCoordinatePair(originLat, originLon);
  const target = parseCoordinatePair(targetLat, targetLon);
  const distance = origin && target ? haversineDistanceKm(origin.lat, origin.lon, target.lat, target.lon) : null;
  const bearing = origin && target ? bearingDegrees(origin.lat, origin.lon, target.lat, target.lon) : null;
  const direction = bearing === null ? "-" : bearingToKoreanDirection(bearing);

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setStatus("이 브라우저에서는 현재 위치를 가져올 수 없습니다.");
      return;
    }

    setIsLocating(true);
    setStatus("현재 위치를 확인하는 중입니다.");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setOriginLat(position.coords.latitude.toFixed(6));
        setOriginLon(position.coords.longitude.toFixed(6));
        setStatus("현재 위치를 기준점으로 설정했습니다.");
        setIsLocating(false);
      },
      () => {
        setStatus("현재 위치 권한이 거부되었거나 위치를 확인하지 못했습니다.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  async function searchPlace() {
    const trimmed = query.trim();
    if (!trimmed) {
      setStatus("찾을 장소명을 입력하세요.");
      return;
    }

    setIsSearching(true);
    setStatus("장소를 검색하는 중입니다.");
    setResults([]);

    try {
      const params = new URLSearchParams({
        q: trimmed,
        format: "jsonv2",
        limit: "5",
        addressdetails: "1",
        "accept-language": "ko"
      });
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
      if (!response.ok) throw new Error("장소 검색에 실패했습니다.");
      const nextResults = (await response.json()) as PlaceSearchResult[];
      setResults(nextResults);
      setStatus(nextResults.length ? "검색 결과에서 목적지를 선택하세요." : "검색 결과가 없습니다. 더 구체적인 장소명으로 다시 검색하세요.");
    } catch {
      setStatus("장소 검색 중 오류가 발생했습니다. 잠시 후 다시 시도하세요.");
    } finally {
      setIsSearching(false);
    }
  }

  function selectPlace(place: PlaceSearchResult) {
    setTargetName(place.display_name);
    setTargetLat(Number(place.lat).toFixed(6));
    setTargetLon(Number(place.lon).toFixed(6));
    setStatus("목적지를 설정했습니다.");
  }

  const distanceShareResult: Pick<CalculatorResult, "headline" | "subline" | "rows"> = {
    headline: distance === null ? "위치를 설정하세요" : formatDistanceKm(distance),
    subline: distance === null ? "현재 위치와 목적지 좌표가 모두 필요합니다." : `직선거리 기준 · 방향 ${direction}`,
    rows: [
      { label: "직선거리", value: distance === null ? "-" : formatDistanceKm(distance), tone: "strong" },
      { label: "방향", value: bearing === null ? "-" : `${direction} ${bearing.toFixed(0)}도` },
      { label: "현재 위치", value: origin ? `${origin.lat.toFixed(6)}, ${origin.lon.toFixed(6)}` : "-" },
      { label: "목적지", value: targetName || (target ? `${target.lat.toFixed(6)}, ${target.lon.toFixed(6)}` : "-") }
    ]
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="min-w-0 overflow-hidden rounded-[20px] border border-line bg-white p-5 shadow-float sm:p-6">
        <div className="mb-6">
          <p className="text-sm font-extrabold text-brand">위치 설정</p>
          <h2 className="mt-1 text-xl font-extrabold text-ink sm:text-2xl">{title}</h2>
        </div>

        <div className="grid gap-5">
          <div className="rounded-[18px] border border-line bg-paper p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-extrabold text-ink">현재 위치</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">브라우저 위치 권한을 허용하거나 좌표를 직접 입력하세요.</p>
              </div>
              <button
                type="button"
                onClick={useCurrentLocation}
                disabled={isLocating}
                className="rounded-full bg-brand px-4 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b72] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isLocating ? "확인 중" : "현재 위치 사용"}
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <CoordinateInput label="위도" value={originLat} onChange={setOriginLat} placeholder="37.566500" />
              <CoordinateInput label="경도" value={originLon} onChange={setOriginLon} placeholder="126.978000" />
            </div>
          </div>

          <div className="rounded-[18px] border border-line bg-white p-4">
            <p className="text-sm font-extrabold text-ink">목적지 검색</p>
            <form
              className="mt-3 flex flex-col gap-3 sm:flex-row"
              onSubmit={(event) => {
                event.preventDefault();
                void searchPlace();
              }}
            >
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="예: 서울역, 부산시청, 제주공항"
                className="h-12 min-w-0 flex-1 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand focus:bg-white"
              />
              <button
                type="submit"
                disabled={isSearching}
                className="h-12 rounded-2xl bg-ink px-5 text-sm font-extrabold text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSearching ? "검색 중" : "검색"}
              </button>
            </form>

            {results.length > 0 && (
              <div className="mt-4 grid gap-2">
                {results.map((place) => (
                  <button
                    key={place.place_id}
                    type="button"
                    onClick={() => selectPlace(place)}
                    className="rounded-2xl border border-line bg-paper px-4 py-3 text-left transition hover:border-brand hover:bg-white"
                  >
                    <span className="block text-sm font-extrabold text-ink">{place.display_name}</span>
                    <span className="mt-1 block text-xs font-semibold text-slate-500">
                      {Number(place.lat).toFixed(5)}, {Number(place.lon).toFixed(5)}
                    </span>
                  </button>
                ))}
              </div>
            )}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <CoordinateInput label="목적지 위도" value={targetLat} onChange={setTargetLat} placeholder="37.554700" />
              <CoordinateInput label="목적지 경도" value={targetLon} onChange={setTargetLon} placeholder="126.970600" />
            </div>
            {targetName && <p className="mt-3 text-xs font-semibold leading-5 text-slate-500">{targetName}</p>}
          </div>

          {status && <p className="rounded-2xl bg-paper px-4 py-3 text-sm font-bold text-slate-600">{status}</p>}
        </div>
      </section>

      <section className="min-w-0 overflow-hidden rounded-[20px] border border-line bg-white p-5 shadow-float sm:p-6">
        <div className="rounded-[18px] bg-ink p-5 text-white">
          <p className="text-sm font-extrabold text-brand">계산 결과</p>
          <h2 className="mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
            {distance === null ? "위치를 설정하세요" : formatDistanceKm(distance)}
          </h2>
          <p className="mt-3 text-sm font-semibold text-white/62">
            {distance === null ? "현재 위치와 목적지 좌표가 모두 필요합니다." : `직선거리 기준 · 방향 ${direction}`}
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <ResultTile label="직선거리" value={distance === null ? "-" : formatDistanceKm(distance)} />
          <ResultTile label="방향" value={bearing === null ? "-" : `${direction} ${bearing.toFixed(0)}도`} />
        </div>

        <div className="mt-5 overflow-hidden rounded-[18px] border border-line">
          <ResultLine label="현재 위치" value={origin ? `${origin.lat.toFixed(6)}, ${origin.lon.toFixed(6)}` : "-"} />
          <ResultLine label="목적지" value={target ? `${target.lat.toFixed(6)}, ${target.lon.toFixed(6)}` : "-"} />
          <ResultLine label="킬로미터" value={distance === null ? "-" : `${distance.toFixed(3)} km`} />
          <ResultLine label="미터" value={distance === null ? "-" : `${Math.round(distance * 1000).toLocaleString("ko-KR")} m`} />
        </div>

        {target && (
          <a
            href={`https://www.openstreetmap.org/?mlat=${target.lat}&mlon=${target.lon}#map=16/${target.lat}/${target.lon}`}
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex rounded-full border border-brand px-5 py-3 text-sm font-extrabold text-brand transition hover:bg-brand hover:text-white"
          >
            목적지 지도 열기
          </a>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <ShareActions title={title} result={distanceShareResult} fileName="distance-calculator-result.png" />
        </div>

        <div className="mt-5 rounded-[18px] border border-line bg-white p-5">
          <p className="text-sm font-extrabold text-ink">해석 포인트</p>
          <div className="mt-4 grid gap-3">
            {checkpoints.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-paper px-4 py-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand" />
                <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-xs font-semibold leading-6 text-slate-500">
          장소 검색은 OpenStreetMap Nominatim 데이터를 사용합니다. 결과는 직선거리 추정치이며 실제 이동 경로와 다를 수 있습니다.
        </p>
      </section>
    </div>
  );
}

function CoordinateInput({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-ink">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        inputMode="decimal"
        placeholder={placeholder}
        className="h-12 min-w-0 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none transition focus:border-brand focus:bg-white"
      />
    </label>
  );
}

function ResultTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-line bg-paper p-4">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-ink">{value}</p>
    </div>
  );
}

function ResultLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-line p-3 text-sm last:border-0 sm:grid-cols-[0.9fr_1.1fr] sm:gap-0">
      <div className="bg-paper px-4 py-4 font-extrabold text-slate-600">{label}</div>
      <div className="min-w-0 px-4 py-4 text-left text-xs font-extrabold text-ink sm:text-right sm:text-sm">
        <span className="break-words">{value}</span>
      </div>
    </div>
  );
}

function parseCoordinatePair(latValue: string, lonValue: string) {
  const lat = Number(latValue);
  const lon = Number(lonValue);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { lat, lon };
}

function haversineDistanceKm(fromLat: number, fromLon: number, toLat: number, toLon: number) {
  const earthRadiusKm = 6371.0088;
  const fromLatRad = toRadians(fromLat);
  const toLatRad = toRadians(toLat);
  const deltaLat = toRadians(toLat - fromLat);
  const deltaLon = toRadians(toLon - fromLon);
  const halfChord =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(fromLatRad) * Math.cos(toLatRad) * Math.sin(deltaLon / 2) ** 2;

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(halfChord), Math.sqrt(1 - halfChord));
}

function bearingDegrees(fromLat: number, fromLon: number, toLat: number, toLon: number) {
  const fromLatRad = toRadians(fromLat);
  const toLatRad = toRadians(toLat);
  const deltaLon = toRadians(toLon - fromLon);
  const y = Math.sin(deltaLon) * Math.cos(toLatRad);
  const x = Math.cos(fromLatRad) * Math.sin(toLatRad) - Math.sin(fromLatRad) * Math.cos(toLatRad) * Math.cos(deltaLon);
  return (toDegrees(Math.atan2(y, x)) + 360) % 360;
}

function toRadians(value: number) {
  return value * Math.PI / 180;
}

function toDegrees(value: number) {
  return value * 180 / Math.PI;
}

function formatDistanceKm(value: number) {
  if (value < 1) return `${Math.round(value * 1000).toLocaleString("ko-KR")} m`;
  return `${value.toLocaleString("ko-KR", { maximumFractionDigits: value < 10 ? 2 : 1 })} km`;
}

function bearingToKoreanDirection(value: number) {
  const directions = ["북", "북동", "동", "남동", "남", "남서", "서", "북서"];
  return directions[Math.round(value / 45) % directions.length];
}

function ExpressionCalculator({
  title,
  checkpoints,
  historyStorageKey,
  memoryStorageKey
}: {
  title: string;
  checkpoints: string[];
  historyStorageKey: string;
  memoryStorageKey: string;
}) {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("deg");
  const [ans, setAns] = useState(0);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<{ expression: string; result: string }[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedHistory = window.localStorage.getItem(historyStorageKey);
    const storedMemory = window.localStorage.getItem(memoryStorageKey);
    window.setTimeout(() => {
      if (storedHistory) {
        try {
          setHistory(JSON.parse(storedHistory) as { expression: string; result: string }[]);
        } catch {
          window.localStorage.removeItem(historyStorageKey);
        }
      }
      if (storedMemory !== null && Number.isFinite(Number(storedMemory))) setMemory(Number(storedMemory));
    }, 0);
  }, [historyStorageKey, memoryStorageKey]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter") {
        event.preventDefault();
        runCalculation();
      } else if (event.key === "Escape") {
        setExpression("");
        setError("");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function persistHistory(nextHistory: { expression: string; result: string }[]) {
    setHistory(nextHistory);
    window.localStorage.setItem(historyStorageKey, JSON.stringify(nextHistory));
  }

  function setMemoryValue(nextMemory: number) {
    setMemory(nextMemory);
    window.localStorage.setItem(memoryStorageKey, String(nextMemory));
  }

  function append(value: string) {
    setExpression((current) => `${current}${value}`);
    setError("");
  }

  function runCalculation(nextExpression = expression) {
    const trimmed = nextExpression.trim();
    if (!trimmed) return;
    try {
      const value = evaluateExpression(trimmed, { angleMode, ans, memory });
      if (!Number.isFinite(value)) throw new Error("계산 결과가 유효하지 않습니다.");
      const formatted = formatCalculatorResult(value);
      setResult(formatted);
      setAns(value);
      setExpression(formatted);
      setError("");
      persistHistory([{ expression: trimmed, result: formatted }, ...history.filter((item) => item.expression !== trimmed)].slice(0, 10));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "수식을 확인해 주세요.");
    }
  }

  const buttonGroups = [
    ["sin(", "cos(", "tan(", "asin(", "acos(", "atan("],
    ["log(", "ln(", "^2", "^3", "^", "root("],
    ["sqrt(", "cbrt(", "10^", "e^", "1/", "!("],
    ["abs(", "floor(", "ceil(", "round(", "pi", "e"],
    ["M+", "M-", "MR", "Ans", "(", ")"],
    ["7", "8", "9", "/", "%", "C"],
    ["4", "5", "6", "*", "±", "AC"],
    ["1", "2", "3", "-", ",", "="],
    ["0", ".", "+", ")", "⌫", "="]
  ];

  function handleButton(label: string) {
    if (label === "=") return runCalculation();
    if (label === "AC") {
      setExpression("");
      setResult("0");
      setError("");
      return;
    }
    if (label === "C" || label === "⌫") {
      setExpression((current) => current.slice(0, -1));
      setError("");
      return;
    }
    if (label === "M+") {
      setMemoryValue(memory + (Number(result) || 0));
      return;
    }
    if (label === "M-") {
      setMemoryValue(memory - (Number(result) || 0));
      return;
    }
    if (label === "MR") return append("M");
    if (label === "Ans") return append("Ans");
    if (label === "±") {
      setExpression((current) => (current.startsWith("-") ? current.slice(1) : `-${current}`));
      return;
    }
    if (label === "!(") return append("!");
    append(label);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.82fr]">
      <section className="min-w-0 overflow-hidden rounded-[20px] border border-line bg-white p-5 shadow-float sm:p-6">
        <div className="rounded-[18px] bg-ink p-5 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-brand">{title}</p>
              <h2 className="mt-2 break-words text-3xl font-extrabold leading-tight sm:text-4xl">{result}</h2>
            </div>
            <button
              type="button"
              onClick={() => setAngleMode((current) => (current === "deg" ? "rad" : "deg"))}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-extrabold text-white"
            >
              {angleMode === "deg" ? "Deg" : "Rad"}
            </button>
          </div>
          <p className="mt-3 text-sm font-semibold text-white/62">M {formatCalculatorResult(memory)} · Ans {formatCalculatorResult(ans)}</p>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-extrabold text-ink">수식</span>
          <input
            value={expression}
            onChange={(event) => {
              setExpression(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") runCalculation();
            }}
            className="mt-2 h-14 w-full rounded-2xl border border-line bg-paper px-4 text-lg font-extrabold text-ink outline-none transition focus:border-brand focus:bg-white"
            placeholder="예: sin(30)+sqrt(16)*2"
          />
        </label>
        {error && <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-extrabold text-red-600">{error}</p>}

        <div className="mt-5 grid gap-2">
          {buttonGroups.map((group, index) => (
            <div key={index} className="grid grid-cols-6 gap-2">
              {group.map((label) => (
                <button
                  key={`${index}-${label}`}
                  type="button"
                  onClick={() => handleButton(label)}
                  className={`h-12 rounded-2xl text-sm font-extrabold transition ${
                    label === "="
                      ? "bg-brand text-white hover:bg-[#029b72]"
                      : label === "AC" || label === "C" || label === "⌫"
                        ? "bg-ink text-white hover:bg-slate-700"
                        : "border border-line bg-paper text-ink hover:border-brand hover:bg-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>

      <aside className="grid gap-5">
        <div className="rounded-[20px] border border-line bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-ink">계산 기록</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">최근 10건까지 이 브라우저에 저장됩니다.</p>
            </div>
            <button
              type="button"
              onClick={() => persistHistory([])}
              className="rounded-full border border-line px-3 py-2 text-xs font-extrabold text-slate-500 hover:border-brand hover:text-brand"
            >
              지우기
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {history.length === 0 ? (
              <p className="rounded-2xl bg-paper px-4 py-4 text-sm font-semibold text-slate-500">계산 결과가 여기에 표시됩니다.</p>
            ) : (
              history.map((item) => (
                <button
                  key={`${item.expression}-${item.result}`}
                  type="button"
                  onClick={() => {
                    setExpression(item.expression);
                    setResult(item.result);
                  }}
                  className="rounded-2xl bg-paper px-4 py-3 text-left transition hover:bg-white hover:shadow-sm"
                >
                  <span className="block truncate text-xs font-bold text-slate-500">{item.expression}</span>
                  <span className="mt-1 block truncate text-sm font-extrabold text-ink">= {item.result}</span>
                </button>
              ))
            )}
          </div>
        </div>
        <div className="rounded-[20px] border border-line bg-white p-5 shadow-panel">
          <p className="text-sm font-extrabold text-ink">해석 포인트</p>
          <div className="mt-4 grid gap-3">
            {checkpoints.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-paper px-4 py-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand" />
                <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

type MathNoteKind = "expression" | "graph" | "text" | "slider" | "table" | "folder" | "button" | "image";

type MathNoteRow = {
  id: string;
  kind: MathNoteKind;
  content: string;
  title?: string;
  locked?: boolean;
  width?: "full" | "left" | "right";
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  collapsed?: boolean;
};

const mathNoteTemplates: { label: string; kind: MathNoteKind; content: string }[] = [
  { label: "텍스트", kind: "text", content: "풀이 메모" },
  { label: "수식", kind: "expression", content: "a=5" },
  { label: "그래프", kind: "graph", content: "y=x^2-3\ny=a*x+b" },
  { label: "슬라이더", kind: "slider", content: "a" },
  { label: "표", kind: "table", content: "0,0\n1,1\n2,4" },
  { label: "폴더", kind: "folder", content: "새 폴더" },
  { label: "버튼", kind: "button", content: "a=random(-5,5)" },
  { label: "이미지", kind: "image", content: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80" }
];

const defaultMathNoteRows: MathNoteRow[] = [
  { id: "n1", kind: "text", title: "h2", content: "이차함수 탐구" },
  { id: "n1b", kind: "text", title: "p", content: "현재 a={{a}}, b={{b}}일 때 꼭짓점은 {{vertex}}입니다." },
  { id: "n2", kind: "slider", content: "a", value: 1, min: -5, max: 5, step: 0.1 },
  { id: "n3", kind: "slider", content: "b", value: 0, min: -8, max: 8, step: 0.5 },
  { id: "n4", kind: "expression", content: "vertex=-b/(2a)", locked: false },
  { id: "n5", kind: "graph", content: "y=a*x^2+b*x-4\ny=vertex", width: "full" },
  { id: "n6", kind: "table", content: "-2,4\n-1,1\n0,0\n1,1\n2,4", width: "left" }
];

const conicMathNoteRows: MathNoteRow[] = [
  { id: "c1", kind: "text", title: "h2", content: "원의 방정식 활동지" },
  { id: "c2", kind: "text", title: "p", content: "중심이 ({{h}}, {{k}}), 반지름이 {{r}}인 원을 관찰합니다." },
  { id: "c3", kind: "slider", content: "h", value: 1, min: -5, max: 5, step: 0.5 },
  { id: "c4", kind: "slider", content: "k", value: -1, min: -5, max: 5, step: 0.5 },
  { id: "c5", kind: "slider", content: "r", value: 3, min: 0.5, max: 8, step: 0.5 },
  { id: "c6", kind: "expression", content: "area=pi*r^2", locked: false },
  { id: "c7", kind: "text", title: "callout", content: "원의 넓이는 {{area}}입니다. h, k, r을 바꾸며 그래프 변화를 확인하세요." },
  { id: "c8", kind: "graph", content: "y=k+sqrt(r^2-(x-h)^2)\ny=k-sqrt(r^2-(x-h)^2)", width: "full" },
  { id: "c9", kind: "table", content: "1,2\n4,-1\n-2,-1", width: "left" }
];

function MathNotes({ title, checkpoints }: { title: string; checkpoints: string[] }) {
  const [rows, setRows] = useState<MathNoteRow[]>(defaultMathNoteRows);
  const [notebookTitle, setNotebookTitle] = useState("새 수학 노트");
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("rad");
  const [selectedId, setSelectedId] = useState("n1");
  const [previewMode, setPreviewMode] = useState(false);
  const [history, setHistory] = useState<MathNoteRow[][]>([]);
  const [future, setFuture] = useState<MathNoteRow[][]>([]);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const importInputRef = useRef<HTMLInputElement>(null);
  const nextRowIdRef = useRef(7);
  const view = useMemo(() => normalizeGraphView(xMin, xMax, yMin, yMax), [xMin, xMax, yMin, yMax]);
  const evaluated = useMemo(() => evaluateMathNoteRows(rows, angleMode), [angleMode, rows]);
  const variables = useMemo(() => evaluated.variables, [evaluated.variables]);
  const graphRows = useMemo(
    () => rows
      .filter((row) => row.kind === "graph")
      .flatMap((row) => row.content.split(/\n+/).map((line) => line.trim()).filter(Boolean).map((expression, index) => ({
        id: `${row.id}-${index}`,
        expression,
        color: graphColors[index % graphColors.length]
      }))),
    [rows]
  );
  const tablePoints = useMemo(() => buildNotebookTablePoints(rows, view, angleMode, variables), [angleMode, rows, variables, view]);
  const graph = useMemo(() => buildGraph(graphRows, view, angleMode, 0, variables), [angleMode, graphRows, variables, view]);
  const visibleRows = useMemo(() => visibleNotebookRows(rows), [rows]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(MATH_NOTES_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as MathNoteRow[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        window.setTimeout(() => {
          const safeRows = parsed.filter((row) => ["expression", "graph", "text", "slider", "table", "folder", "button", "image"].includes(row.kind));
          setRows(safeRows);
          setSelectedId(safeRows[0]?.id ?? "n1");
          nextRowIdRef.current = safeRows.length + 1;
        }, 0);
      }
    } catch {
      window.localStorage.removeItem(MATH_NOTES_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(MATH_NOTES_STORAGE_KEY, JSON.stringify(rows));
  }, [rows]);

  function updateRow(id: string, next: Partial<MathNoteRow>) {
    commitRows(rows.map((row) => (row.id === id ? { ...row, ...next } : row)));
  }

  function commitRows(nextRows: MathNoteRow[]) {
    setHistory((current) => [rows, ...current].slice(0, 40));
    setFuture([]);
    setRows(nextRows);
  }

  function undoRows() {
    const previous = history[0];
    if (!previous) return;
    setFuture((current) => [rows, ...current].slice(0, 40));
    setRows(previous);
    setHistory((current) => current.slice(1));
    setSelectedId(previous[0]?.id ?? "");
  }

  function redoRows() {
    const next = future[0];
    if (!next) return;
    setHistory((current) => [rows, ...current].slice(0, 40));
    setRows(next);
    setFuture((current) => current.slice(1));
    setSelectedId(next[0]?.id ?? "");
  }

  function addRow(kind: MathNoteKind, content = "") {
    const next: MathNoteRow = {
      id: `note-${nextRowIdRef.current++}`,
      kind,
      content,
      title: kind === "text" ? "p" : undefined,
      locked: kind === "expression" ? false : undefined,
      width: "full",
      value: kind === "slider" ? 1 : undefined,
      min: kind === "slider" ? -10 : undefined,
      max: kind === "slider" ? 10 : undefined,
      step: kind === "slider" ? 0.1 : undefined,
      collapsed: false
    };
    commitRows([...rows, next]);
    setSelectedId(next.id);
  }

  function removeRow(id: string) {
    if (rows.length === 1) return;
    const next = rows.filter((row) => row.id !== id);
    commitRows(next);
    if (selectedId === id) setSelectedId(next[0]?.id ?? "");
  }

  function duplicateRow(id: string) {
    const index = rows.findIndex((row) => row.id === id);
    if (index < 0) return;
    const copy = { ...rows[index], id: `note-${nextRowIdRef.current++}` };
    commitRows([...rows.slice(0, index + 1), copy, ...rows.slice(index + 1)]);
    setSelectedId(copy.id);
  }

  function moveRow(id: string, direction: -1 | 1) {
    const index = rows.findIndex((row) => row.id === id);
    const nextIndex = index + direction;
    if (index < 0 || nextIndex < 0 || nextIndex >= rows.length) return;
    const next = [...rows];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    commitRows(next);
  }

  function resetRows() {
    loadNotebookRows(defaultMathNoteRows, "새 수학 노트");
  }

  function loadNotebookRows(nextRows: MathNoteRow[], nextTitle = notebookTitle) {
    commitRows(nextRows.map((row) => ({ ...row })));
    setNotebookTitle(nextTitle);
    setSelectedId(nextRows[0]?.id ?? "");
    nextRowIdRef.current = nextRows.length + 1;
  }

  function exportNotebook() {
    const payload = JSON.stringify({ title: notebookTitle, rows, angleMode, graphView: { xMin, xMax, yMin, yMax } }, null, 2);
    const url = URL.createObjectURL(new Blob([payload], { type: "application/json" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${notebookTitle.trim() || "math-notes"}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function importNotebook(file: File | null) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as { title?: string; rows?: MathNoteRow[]; angleMode?: "deg" | "rad"; graphView?: { xMin?: number; xMax?: number; yMin?: number; yMax?: number } };
        const safeRows = Array.isArray(parsed.rows)
          ? parsed.rows.filter((row) => ["expression", "graph", "text", "slider", "table", "folder", "button", "image"].includes(row.kind))
          : [];
        if (safeRows.length === 0) return;
        loadNotebookRows(safeRows, parsed.title ?? "불러온 노트");
        if (parsed.angleMode === "deg" || parsed.angleMode === "rad") setAngleMode(parsed.angleMode);
        if (parsed.graphView) {
          if (Number.isFinite(parsed.graphView.xMin)) setXMin(Number(parsed.graphView.xMin));
          if (Number.isFinite(parsed.graphView.xMax)) setXMax(Number(parsed.graphView.xMax));
          if (Number.isFinite(parsed.graphView.yMin)) setYMin(Number(parsed.graphView.yMin));
          if (Number.isFinite(parsed.graphView.yMax)) setYMax(Number(parsed.graphView.yMax));
        }
      } catch {
        window.alert("노트 파일을 읽지 못했습니다.");
      }
    };
    reader.readAsText(file);
  }

  const selected = rows.find((row) => row.id === selectedId) ?? rows[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(360px,1.05fr)]">
      <section className="min-w-0 overflow-hidden rounded-[20px] border border-line bg-white shadow-float">
        <div className="border-b border-line bg-paper px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={undoRows}
              disabled={history.length === 0}
              aria-label="되돌리기"
              className="h-9 w-9 rounded-full border border-line bg-white text-sm font-extrabold text-slate-600 disabled:opacity-35"
            >
              ↶
            </button>
            <button
              type="button"
              onClick={redoRows}
              disabled={future.length === 0}
              aria-label="다시 실행"
              className="h-9 w-9 rounded-full border border-line bg-white text-sm font-extrabold text-slate-600 disabled:opacity-35"
            >
              ↷
            </button>
            <span className="rounded-full bg-white px-3 py-2 text-xs font-extrabold text-brand">{title}</span>
            <select
              aria-label="텍스트 스타일"
              value={selected?.title ?? "p"}
              onChange={(event) => selected && updateRow(selected.id, { title: event.target.value })}
              className="h-9 rounded-full border border-line bg-white px-3 text-xs font-extrabold text-ink outline-none"
            >
              <option value="p">본문</option>
              <option value="h2">제목</option>
              <option value="callout">강조</option>
            </select>
            <button
              type="button"
              onClick={() => selected?.kind === "text" && updateRow(selected.id, { content: `${selected.content} **굵은 글씨**` })}
              aria-label="굵게"
              className="h-9 w-9 rounded-full border border-line bg-white text-sm font-extrabold text-ink"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => selected?.kind === "text" && updateRow(selected.id, { content: `${selected.content} _기울임_` })}
              aria-label="기울임"
              className="h-9 w-9 rounded-full border border-line bg-white text-sm font-extrabold italic text-ink"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => setAngleMode((current) => (current === "rad" ? "deg" : "rad"))}
              className="h-9 rounded-full border border-line bg-white px-3 text-xs font-extrabold text-slate-600"
            >
              {angleMode === "rad" ? "Rad" : "Deg"}
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode((current) => !current)}
              className="h-9 rounded-full bg-ink px-4 text-xs font-extrabold text-white md:ml-auto"
            >
              {previewMode ? "편집" : "미리보기"}
            </button>
            <button
              type="button"
              onClick={() => loadNotebookRows(conicMathNoteRows, "원의 방정식 활동지")}
              className="h-9 rounded-full border border-line bg-white px-3 text-xs font-extrabold text-slate-600"
            >
              예제
            </button>
            <button
              type="button"
              onClick={exportNotebook}
              className="h-9 rounded-full border border-line bg-white px-3 text-xs font-extrabold text-slate-600"
            >
              저장
            </button>
            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              className="h-9 rounded-full border border-line bg-white px-3 text-xs font-extrabold text-slate-600"
            >
              불러오기
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => importNotebook(event.target.files?.[0] ?? null)}
            />
            <button
              type="button"
              onClick={resetRows}
              className="h-9 rounded-full border border-line bg-white px-3 text-xs font-extrabold text-slate-600"
            >
              초기화
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <label className="block">
            <span className="sr-only">노트 제목</span>
            <input
              value={notebookTitle}
              onChange={(event) => setNotebookTitle(event.target.value)}
              className="w-full rounded-2xl border-0 bg-transparent px-0 text-3xl font-extrabold text-ink outline-none sm:text-4xl"
              placeholder="제목 없는 노트"
              readOnly={previewMode}
            />
          </label>

          <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {visibleRows.map(({ row, index, hiddenByFolder }) => {
            const result = evaluated.rows.find((item) => item.id === row.id);
            if (hiddenByFolder) return null;
            return (
              <div
                key={row.id}
                className={`grid gap-3 rounded-[18px] border p-3 transition ${notebookRowSpan(row.width)} ${selectedId === row.id ? "border-brand bg-white shadow-sm" : "border-line bg-paper"}`}
              >
                {!previewMode && (
                  <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedId(row.id)}
                    className="grid h-9 w-9 place-items-center rounded-full bg-ink text-sm font-extrabold text-white"
                    aria-label={`${index + 1}번 줄 선택`}
                  >
                    {index + 1}
                  </button>
                  <select
                    aria-label="줄 유형"
                    value={row.kind}
                    onChange={(event) => updateRow(row.id, { kind: event.target.value as MathNoteKind })}
                    className="h-10 rounded-2xl border border-line bg-white px-3 text-sm font-extrabold text-ink outline-none focus:border-brand"
                  >
                    <option value="expression">계산</option>
                    <option value="graph">그래프</option>
                    <option value="text">텍스트</option>
                    <option value="slider">슬라이더</option>
                    <option value="table">표</option>
                    <option value="folder">폴더</option>
                    <option value="button">버튼</option>
                  </select>
                  {row.kind === "folder" && (
                    <button
                      type="button"
                      onClick={() => updateRow(row.id, { collapsed: !row.collapsed })}
                      className="h-10 rounded-2xl border border-line px-3 text-xs font-extrabold text-slate-500"
                    >
                      {row.collapsed ? "펼치기" : "접기"}
                    </button>
                  )}
                  <select
                    aria-label="줄 너비"
                    value={row.width ?? "full"}
                    onChange={(event) => updateRow(row.id, { width: event.target.value as MathNoteRow["width"] })}
                    className="h-10 rounded-2xl border border-line bg-white px-3 text-xs font-extrabold text-slate-600 outline-none focus:border-brand"
                  >
                    <option value="full">전체</option>
                    <option value="left">왼쪽</option>
                    <option value="right">오른쪽</option>
                  </select>
                  {row.kind === "expression" && (
                    <button
                      type="button"
                      onClick={() => updateRow(row.id, { locked: !row.locked })}
                      className="h-10 rounded-2xl border border-line px-3 text-xs font-extrabold text-slate-500"
                    >
                      {row.locked ? "잠금" : "편집 가능"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => moveRow(row.id, -1)}
                    className="h-10 rounded-2xl border border-line px-3 text-xs font-extrabold text-slate-500 transition hover:border-brand hover:text-brand disabled:opacity-35"
                    disabled={index === 0}
                  >
                    위
                  </button>
                  <button
                    type="button"
                    onClick={() => moveRow(row.id, 1)}
                    className="h-10 rounded-2xl border border-line px-3 text-xs font-extrabold text-slate-500 transition hover:border-brand hover:text-brand disabled:opacity-35"
                    disabled={index === rows.length - 1}
                  >
                    아래
                  </button>
                  <button
                    type="button"
                    onClick={() => duplicateRow(row.id)}
                    className="h-10 rounded-2xl border border-line px-3 text-xs font-extrabold text-slate-500 transition hover:border-brand hover:text-brand"
                  >
                    복제
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRow(row.id)}
                    className="ml-auto h-10 rounded-2xl border border-line px-3 text-xs font-extrabold text-slate-500 transition hover:border-red-200 hover:text-red-600 disabled:opacity-40"
                    disabled={rows.length === 1}
                  >
                    삭제
                  </button>
                </div>
                )}
                {row.kind === "folder" ? (
                  <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3">
                    <span className="text-lg font-extrabold text-brand">{row.collapsed ? "▸" : "▾"}</span>
                    {previewMode ? (
                      <p className="text-base font-extrabold text-ink">{row.content || "폴더"}</p>
                    ) : (
                      <input
                        value={row.content}
                        onChange={(event) => updateRow(row.id, { content: event.target.value })}
                        onFocus={() => setSelectedId(row.id)}
                        className="h-10 min-w-0 flex-1 rounded-xl border border-line bg-paper px-3 font-extrabold text-ink outline-none focus:border-brand"
                        placeholder="폴더 이름"
                      />
                    )}
                  </div>
                ) : row.kind === "text" ? (
                  previewMode ? (
                    <div className={`rounded-2xl border border-line bg-white px-4 py-3 text-ink ${row.title === "h2" ? "text-2xl font-extrabold" : row.title === "callout" ? "bg-[#ecfdf5] text-sm font-extrabold leading-6" : "text-sm font-semibold leading-6"}`}>
                      {renderNotebookText(row.content, variables)}
                    </div>
                  ) : (
                  <textarea
                    value={row.content}
                    onChange={(event) => updateRow(row.id, { content: event.target.value })}
                    onFocus={() => setSelectedId(row.id)}
                    rows={row.title === "h2" ? 1 : 3}
                    readOnly={previewMode}
                    className={`w-full resize-y rounded-2xl border border-line bg-white px-4 py-3 text-ink outline-none transition focus:border-brand ${row.title === "h2" ? "min-h-16 text-2xl font-extrabold" : row.title === "callout" ? "min-h-20 bg-[#ecfdf5] text-sm font-extrabold leading-6" : "min-h-24 text-sm font-semibold leading-6"}`}
                    placeholder="풀이 과정, 조건, 아이디어를 적어두세요."
                  />
                  )
                ) : row.kind === "slider" ? (
                  <div className="grid gap-3 rounded-2xl bg-white p-4">
                    <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                      <input
                        value={row.content}
                        onChange={(event) => updateRow(row.id, { content: event.target.value })}
                        onFocus={() => setSelectedId(row.id)}
                        readOnly={previewMode}
                        className="h-11 rounded-2xl border border-line bg-paper px-3 font-extrabold text-ink outline-none focus:border-brand"
                        placeholder="변수명"
                      />
                      <input
                        type="number"
                        value={row.value ?? 0}
                        onChange={(event) => updateRow(row.id, { value: Number(event.target.value) })}
                        readOnly={previewMode}
                        className="h-11 rounded-2xl border border-line bg-paper px-3 font-extrabold text-ink outline-none focus:border-brand"
                      />
                    </div>
                    <input
                      aria-label={`${row.content || "변수"} 슬라이더`}
                      type="range"
                      min={row.min ?? -10}
                      max={row.max ?? 10}
                      step={row.step ?? 0.1}
                      value={row.value ?? 0}
                      onChange={(event) => updateRow(row.id, { value: Number(event.target.value) })}
                    />
                    {!previewMode && (
                      <div className="grid gap-2 sm:grid-cols-3">
                        <NotebookNumberInput label="최소" value={row.min ?? -10} onChange={(value) => updateRow(row.id, { min: value })} />
                        <NotebookNumberInput label="최대" value={row.max ?? 10} onChange={(value) => updateRow(row.id, { max: value })} />
                        <NotebookNumberInput label="간격" value={row.step ?? 0.1} onChange={(value) => updateRow(row.id, { step: value })} />
                      </div>
                    )}
                  </div>
                ) : row.kind === "graph" ? (
                  <div className="grid gap-3">
                    <textarea
                      value={row.content}
                      onChange={(event) => updateRow(row.id, { content: event.target.value })}
                      onFocus={() => setSelectedId(row.id)}
                      readOnly={previewMode}
                      rows={4}
                      className="min-h-28 w-full resize-y rounded-2xl border border-line bg-white px-4 py-3 font-mono text-sm font-bold leading-6 text-ink outline-none transition focus:border-brand"
                      placeholder={"y=x^2\ny=sin(x)"}
                    />
                    <p className="rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand">그래프 식 {row.content.split(/\n+/).filter((line) => line.trim()).length}개</p>
                  </div>
                ) : row.kind === "table" ? (
                  <div className="grid gap-3">
                    <textarea
                      value={row.content}
                      onChange={(event) => updateRow(row.id, { content: event.target.value })}
                      onFocus={() => setSelectedId(row.id)}
                      readOnly={previewMode}
                      rows={5}
                      className="min-h-32 w-full resize-y rounded-2xl border border-line bg-white px-4 py-3 font-mono text-sm font-bold leading-6 text-ink outline-none transition focus:border-brand"
                      placeholder={"x,y\n0,0\n1,1"}
                    />
                    <p className="rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-brand">좌표 {tablePoints.filter((point) => point.rowId === row.id).length}개</p>
                  </div>
                ) : row.kind === "image" ? (
                  <div className="grid gap-3 rounded-2xl bg-white p-4">
                    {!previewMode && (
                      <input
                        value={row.content}
                        onChange={(event) => updateRow(row.id, { content: event.target.value })}
                        onFocus={() => setSelectedId(row.id)}
                        className="h-12 w-full min-w-0 rounded-2xl border border-line bg-paper px-4 font-extrabold text-ink outline-none transition focus:border-brand"
                        placeholder="이미지 URL"
                      />
                    )}
                    {row.content ? (
                      <div
                        role="img"
                        aria-label="노트 이미지"
                        className="min-h-[220px] w-full rounded-2xl border border-line bg-cover bg-center"
                        style={{ backgroundImage: `url(${row.content})` }}
                      />
                    ) : (
                      <p className="rounded-2xl bg-paper px-4 py-6 text-sm font-bold text-slate-500">이미지 URL을 입력하세요.</p>
                    )}
                  </div>
                ) : row.kind === "button" ? (
                  <div className="grid gap-3 rounded-2xl bg-white p-4">
                    <input
                      value={row.content}
                      onChange={(event) => updateRow(row.id, { content: event.target.value })}
                      onFocus={() => setSelectedId(row.id)}
                      readOnly={previewMode}
                      className="h-12 w-full min-w-0 rounded-2xl border border-line bg-paper px-4 font-extrabold text-ink outline-none transition focus:border-brand"
                      placeholder="예: a=random(-5,5)"
                    />
                    <button
                      type="button"
                      onClick={() => commitRows(runNotebookAction(rows, row.content))}
                      className="h-11 rounded-2xl bg-brand px-4 text-sm font-extrabold text-white"
                    >
                      실행
                    </button>
                  </div>
                ) : (
                  <input
                    value={row.content}
                    onChange={(event) => updateRow(row.id, { content: event.target.value })}
                    onFocus={() => setSelectedId(row.id)}
                    readOnly={previewMode || Boolean(row.locked)}
                    className="h-12 w-full min-w-0 rounded-2xl border border-line bg-white px-4 font-extrabold text-ink outline-none transition focus:border-brand"
                    placeholder="예: a=5 또는 sqrt(16)+2"
                  />
                )}
                {row.kind !== "text" && row.kind !== "folder" && row.kind !== "slider" && row.kind !== "table" && row.kind !== "button" && row.kind !== "graph" && row.kind !== "image" && (
                  <div className="rounded-2xl bg-white px-4 py-3">
                    <p className={`text-sm font-extrabold ${result?.error ? "text-red-600" : "text-brand"}`}>
                      {result?.error ? result.error : result?.output ?? "입력 대기"}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
          </div>

        {!previewMode && <div className="mt-5 flex flex-wrap gap-2">
          {mathNoteTemplates.map((template) => (
            <button
              key={template.label}
              type="button"
              onClick={() => addRow(template.kind, template.content)}
              className="rounded-full border border-line bg-white px-4 py-2 text-sm font-extrabold text-slate-700 transition hover:border-brand hover:text-brand"
            >
              {template.label} 추가
            </button>
          ))}
        </div>}
        </div>
      </section>

      <aside className="grid gap-5">
        <section className="rounded-[20px] border border-line bg-white p-5 shadow-panel">
          <p className="text-sm font-extrabold text-ink">목차</p>
          <div className="mt-4 grid gap-2">
            {rows.filter((row) => row.kind === "text" && row.title === "h2").length === 0 ? (
              <p className="rounded-2xl bg-paper px-4 py-3 text-sm font-semibold text-slate-500">제목 스타일 텍스트가 목차에 표시됩니다.</p>
            ) : (
              rows.filter((row) => row.kind === "text" && row.title === "h2").map((row) => (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => setSelectedId(row.id)}
                  className="rounded-2xl bg-paper px-4 py-3 text-left text-sm font-extrabold text-ink transition hover:bg-white hover:shadow-sm"
                >
                  {row.content || "제목 없음"}
                </button>
              ))
            )}
          </div>
        </section>

        <section className="min-w-0 overflow-hidden rounded-[20px] border border-line bg-white p-5 shadow-panel sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-ink">그래프</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">그래프 줄을 추가하면 같은 좌표평면에 표시됩니다.</p>
            </div>
            <span className="rounded-full bg-paper px-3 py-1 text-xs font-extrabold text-slate-500">{graphRows.length + tablePoints.length}개</span>
          </div>
          <div className="mt-4 overflow-hidden rounded-[18px] border border-line bg-white">
            <svg viewBox={`0 0 ${graph.width} ${graph.height}`} role="img" aria-label="노트 그래프" className="h-[330px] w-full bg-white">
              {graph.grid.map((line) => (
                <line key={line.key} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={line.axis ? "#64748b" : "#e2e8f0"} strokeWidth={line.axis ? 2 : 1} />
              ))}
              {graph.xTicks.map((tick) => (
                <text key={`x-${tick.value}`} x={tick.x} y={graph.yAxisLabelY} textAnchor="middle" className="fill-slate-500 text-[11px] font-bold">
                  {formatGraphNumber(tick.value, 1)}
                </text>
              ))}
              {graph.yTicks.map((tick) => (
                <text key={`y-${tick.value}`} x={graph.xAxisLabelX} y={tick.y + 4} textAnchor="end" className="fill-slate-500 text-[11px] font-bold">
                  {formatGraphNumber(tick.value, 1)}
                </text>
              ))}
              {graph.series.map((series) => series.paths.map((path, index) => (
                <path key={`${series.id}-${index}`} d={path} fill="none" stroke={series.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              )))}
              {tablePoints.map((point) => (
                <circle key={`${point.rowId}-${point.x}-${point.y}`} cx={graph.toX(point.x)} cy={graph.toY(point.y)} r="4" fill="#db2777" />
              ))}
            </svg>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <GraphRangeInput label="x 최소" value={xMin} onChange={setXMin} />
            <GraphRangeInput label="x 최대" value={xMax} onChange={setXMax} />
            <GraphRangeInput label="y 최소" value={yMin} onChange={setYMin} />
            <GraphRangeInput label="y 최대" value={yMax} onChange={setYMax} />
          </div>
        </section>

        <section className="rounded-[20px] border border-line bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-extrabold text-ink">변수</p>
            <button
              type="button"
              onClick={() => commitRows(randomizeNotebookSliders(rows))}
              className="rounded-full border border-line px-3 py-2 text-xs font-extrabold text-slate-500 hover:border-brand hover:text-brand"
            >
              랜덤
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {Object.entries(variables).length === 0 ? (
              <p className="rounded-2xl bg-paper px-4 py-3 text-sm font-semibold text-slate-500">변수와 슬라이더가 여기에 표시됩니다.</p>
            ) : (
              Object.entries(variables).map(([name, value]) => (
                <div key={name} className="flex items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3">
                  <span className="text-sm font-extrabold text-ink">{name}</span>
                  <span className="text-sm font-extrabold text-brand">{formatCalculatorResult(value)}</span>
                </div>
              ))
            )}
          </div>
          {selected?.kind === "text" && Object.keys(variables).length > 0 && !previewMode && (
            <div className="mt-4 rounded-[18px] border border-line bg-white p-3">
              <p className="text-xs font-extrabold text-slate-500">토큰 삽입</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {Object.keys(variables).map((name) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => updateRow(selected.id, { content: `${selected.content} {{${name}}}` })}
                    className="rounded-full border border-line px-3 py-2 text-xs font-extrabold text-slate-600 hover:border-brand hover:text-brand"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-[20px] border border-line bg-white p-5 shadow-panel">
          <p className="text-sm font-extrabold text-ink">선택한 줄</p>
          <div className="mt-4 rounded-[18px] bg-paper p-4">
            <p className="text-xs font-extrabold text-slate-500">{notebookKindLabel(selected?.kind)}</p>
            <p className="mt-2 break-words text-lg font-extrabold text-ink">{selected?.content || "빈 줄"}</p>
          </div>
          <div className="mt-5 grid gap-3">
            {checkpoints.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-paper px-4 py-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand" />
                <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function evaluateMathNoteRows(rows: MathNoteRow[], angleMode: "deg" | "rad") {
  const variables: Record<string, number> = {};
  const outputs = rows.map((row) => {
    if (row.kind === "slider") {
      const name = normalizeNotebookVariableName(row.content);
      if (name) variables[name] = Number(row.value ?? 0);
      return { id: row.id, output: name ? `${name} = ${formatCalculatorResult(Number(row.value ?? 0))}` : "", error: "" };
    }
    if (row.kind === "text" || row.kind === "table" || row.kind === "folder" || row.kind === "button" || row.kind === "image") return { id: row.id, output: "", error: "" };
    const content = row.content.trim();
    if (!content) return { id: row.id, output: "입력 대기", error: "" };
    if (row.kind === "graph") return { id: row.id, output: "그래프에 표시됨", error: "" };
    const assignment = content.match(/^([a-zA-Z][a-zA-Z]*)\s*=\s*(.+)$/);
    try {
      if (assignment) {
        const [, name, expression] = assignment;
        const value = evaluateExpression(normalizeGraphExpression(expression), { angleMode, ans: 0, memory: 0, variables });
        if (!Number.isFinite(value)) throw new Error("계산 결과가 유효하지 않습니다.");
        variables[name.toLowerCase()] = value;
        return { id: row.id, output: `${name} = ${formatCalculatorResult(value)}`, error: "" };
      }
      const value = evaluateExpression(normalizeGraphExpression(content), { angleMode, ans: 0, memory: 0, variables });
      if (!Number.isFinite(value)) throw new Error("계산 결과가 유효하지 않습니다.");
      return { id: row.id, output: `= ${formatCalculatorResult(value)}`, error: "" };
    } catch (caught) {
      return { id: row.id, output: "", error: caught instanceof Error ? caught.message : "수식을 확인해 주세요." };
    }
  });
  return { rows: outputs, variables };
}

function NotebookNumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-extrabold text-slate-500">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-10 rounded-xl border border-line bg-paper px-3 text-sm font-extrabold text-ink outline-none focus:border-brand"
      />
    </label>
  );
}

function normalizeNotebookVariableName(name: string) {
  const trimmed = name.trim().toLowerCase();
  return /^[a-z][a-z]*$/.test(trimmed) ? trimmed : "";
}

function notebookKindLabel(kind: MathNoteKind | undefined) {
  if (kind === "graph") return "그래프";
  if (kind === "text") return "텍스트";
  if (kind === "slider") return "슬라이더";
  if (kind === "table") return "표";
  if (kind === "folder") return "폴더";
  if (kind === "button") return "버튼";
  if (kind === "image") return "이미지";
  return "수식";
}

function notebookRowSpan(width: MathNoteRow["width"]) {
  if (width === "left" || width === "right") return "lg:col-span-1";
  return "lg:col-span-2";
}

function renderNotebookText(content: string, variables: Record<string, number>) {
  const pieces = content.split(/(\{\{[a-zA-Z][a-zA-Z]*\}\})/g);
  return pieces.map((piece, index) => {
    const match = piece.match(/^\{\{([a-zA-Z][a-zA-Z]*)\}\}$/);
    if (!match) return <span key={`${piece}-${index}`}>{renderNotebookInlineStyle(piece)}</span>;
    const name = match[1].toLowerCase();
    const value = variables[name];
    return (
      <span key={`${piece}-${index}`} className="mx-1 inline-flex rounded-full bg-paper px-2 py-1 text-xs font-extrabold text-brand">
        {Number.isFinite(value) ? formatCalculatorResult(value) : name}
      </span>
    );
  });
}

function renderNotebookInlineStyle(content: string) {
  return content.split(/(\*\*[^*]+\*\*|_[^_]+_)/g).map((piece, index) => {
    if (/^\*\*[^*]+\*\*$/.test(piece)) {
      return <strong key={`${piece}-${index}`}>{piece.slice(2, -2)}</strong>;
    }
    if (/^_[^_]+_$/.test(piece)) {
      return <em key={`${piece}-${index}`}>{piece.slice(1, -1)}</em>;
    }
    return <span key={`${piece}-${index}`}>{piece}</span>;
  });
}

function visibleNotebookRows(rows: MathNoteRow[]) {
  let hiddenByFolder = false;
  return rows.map((row, index) => {
    if (row.kind === "folder") {
      const previousHidden = hiddenByFolder;
      hiddenByFolder = Boolean(row.collapsed);
      return { row, index, hiddenByFolder: previousHidden };
    }
    return { row, index, hiddenByFolder };
  });
}

function buildNotebookTablePoints(
  rows: MathNoteRow[],
  view: ReturnType<typeof normalizeGraphView>,
  angleMode: "deg" | "rad",
  variables: Record<string, number>
) {
  return rows.flatMap((row) => {
    if (row.kind !== "table") return [];
    return row.content.split(/\n+/).flatMap((line) => {
      const [rawX, rawY] = line.split(/,|\t/).map((value) => evaluateNotebookTableCell(value.trim(), angleMode, variables));
      if (!Number.isFinite(rawX) || !Number.isFinite(rawY)) return [];
      if (rawX < view.xMin || rawX > view.xMax || rawY < view.yMin || rawY > view.yMax) return [];
      return [{ rowId: row.id, x: rawX, y: rawY }];
    });
  });
}

function evaluateNotebookTableCell(value: string, angleMode: "deg" | "rad", variables: Record<string, number>) {
  if (!value) return Number.NaN;
  const numeric = Number(value);
  if (Number.isFinite(numeric)) return numeric;
  try {
    return evaluateExpression(normalizeGraphExpression(value), { angleMode, ans: 0, memory: 0, variables });
  } catch {
    return Number.NaN;
  }
}

function randomizeNotebookSliders(rows: MathNoteRow[]) {
  return rows.map((row) => {
    if (row.kind !== "slider") return row;
    const min = row.min ?? -10;
    const max = row.max ?? 10;
    const step = row.step ?? 0.1;
    const raw = min + Math.random() * (max - min);
    const snapped = Math.round(raw / step) * step;
    return { ...row, value: Number(snapped.toFixed(6)) };
  });
}

function runNotebookAction(rows: MathNoteRow[], action: string) {
  const match = action.trim().match(/^([a-zA-Z][a-zA-Z]*)\s*=\s*random\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)$/i);
  if (!match) return rows;
  const [, rawName, rawMin, rawMax] = match;
  const name = rawName.toLowerCase();
  const min = Number(rawMin);
  const max = Number(rawMax);
  const value = Number((Math.min(min, max) + Math.random() * Math.abs(max - min)).toFixed(3));
  return rows.map((row) => row.kind === "slider" && normalizeNotebookVariableName(row.content) === name ? { ...row, value } : row);
}

type MatrixName = "A" | "B" | "C";
type MatrixMap = Record<MatrixName, number[][]>;
type MatrixValue = number | number[][];

const defaultMatrices: MatrixMap = {
  A: [[1, 2], [3, 4]],
  B: [[2, 0], [1, 2]],
  C: [[1, 0, 2], [0, 1, -1], [3, 2, 1]]
};

const matrixExamples = ["A+B", "A*B", "det(A)", "inv(A)", "rref(C)", "transpose(B)", "2*A-B"];

function MatrixCalculator({ title, checkpoints }: { title: string; checkpoints: string[] }) {
  const [matrices, setMatrices] = useState<MatrixMap>(defaultMatrices);
  const [selected, setSelected] = useState<MatrixName>("A");
  const [expression, setExpression] = useState("A*B");
  const [history, setHistory] = useState<{ expression: string; summary: string }[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(MATRIX_CALCULATOR_STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as { matrices?: MatrixMap; history?: { expression: string; summary: string }[] };
      window.setTimeout(() => {
        if (parsed.matrices) setMatrices(normalizeMatrixMap(parsed.matrices));
        if (Array.isArray(parsed.history)) setHistory(parsed.history.slice(0, 10));
      }, 0);
    } catch {
      window.localStorage.removeItem(MATRIX_CALCULATOR_STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(MATRIX_CALCULATOR_STORAGE_KEY, JSON.stringify({ matrices, history }));
  }, [history, matrices]);

  const result = useMemo(() => evaluateMatrixExpression(expression, matrices), [expression, matrices]);
  const stats = useMemo(() => ({
    detA: determinant(matrices.A),
    rankA: matrixRank(matrices.A),
    rankB: matrixRank(matrices.B),
    rankC: matrixRank(matrices.C)
  }), [matrices]);

  function updateCell(name: MatrixName, row: number, col: number, value: number) {
    setMatrices((current) => ({
      ...current,
      [name]: current[name].map((matrixRow, rowIndex) => (
        rowIndex === row ? matrixRow.map((cell, colIndex) => (colIndex === col ? value : cell)) : matrixRow
      ))
    }));
  }

  function resizeMatrix(name: MatrixName, rows: number, cols: number) {
    const safeRows = Math.min(Math.max(rows, 1), 5);
    const safeCols = Math.min(Math.max(cols, 1), 5);
    setMatrices((current) => ({
      ...current,
      [name]: Array.from({ length: safeRows }, (_, row) => (
        Array.from({ length: safeCols }, (_, col) => current[name][row]?.[col] ?? (row === col ? 1 : 0))
      ))
    }));
  }

  function runExpression(nextExpression = expression) {
    const next = evaluateMatrixExpression(nextExpression, matrices);
    const summary = next.error ? next.error : matrixResultSummary(next.value);
    setHistory((current) => [{ expression: nextExpression, summary }, ...current.filter((item) => item.expression !== nextExpression)].slice(0, 10));
  }

  function applyResultTo(name: MatrixName) {
    const value = result.value;
    if (result.error || !isMatrixValue(value)) return;
    setMatrices((current) => ({ ...current, [name]: cloneMatrix(value) }));
    setSelected(name);
  }

  function resetMatrices() {
    setMatrices(defaultMatrices);
    setExpression("A*B");
    setHistory([]);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.98fr)_minmax(360px,1.02fr)]">
      <section className="min-w-0 overflow-hidden rounded-[20px] border border-line bg-white shadow-float">
        <div className="border-b border-line bg-paper px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            {(["A", "B", "C"] as MatrixName[]).map((name) => (
              <button key={name} type="button" onClick={() => setSelected(name)} className={`h-10 rounded-full px-4 text-sm font-extrabold transition ${selected === name ? "bg-ink text-white" : "border border-line bg-white text-slate-600 hover:border-brand hover:text-brand"}`}>
                {name}
              </button>
            ))}
            <button type="button" onClick={resetMatrices} className="ml-auto h-10 rounded-full border border-line bg-white px-4 text-sm font-extrabold text-slate-600 hover:border-brand hover:text-brand">
              초기화
            </button>
          </div>
        </div>

        <div className="grid gap-5 p-5 sm:p-6">
          <div>
            <p className="text-sm font-extrabold text-brand">{title}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">{selected} 행렬</h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <MatrixSizeSelect label="행" value={matrices[selected].length} onChange={(value) => resizeMatrix(selected, value, matrices[selected][0]?.length ?? 1)} />
            <MatrixSizeSelect label="열" value={matrices[selected][0]?.length ?? 1} onChange={(value) => resizeMatrix(selected, matrices[selected].length, value)} />
            <button type="button" onClick={() => setMatrices((current) => ({ ...current, [selected]: identityMatrix(Math.max(current[selected].length, current[selected][0]?.length ?? 1)) }))} className="h-12 rounded-2xl border border-line px-4 text-sm font-extrabold text-slate-600 hover:border-brand hover:text-brand">
              단위행렬
            </button>
            <button type="button" onClick={() => setMatrices((current) => ({ ...current, [selected]: zeroMatrix(current[selected].length, current[selected][0]?.length ?? 1) }))} className="h-12 rounded-2xl border border-line px-4 text-sm font-extrabold text-slate-600 hover:border-brand hover:text-brand">
              0행렬
            </button>
          </div>

          <div className="overflow-x-auto rounded-[18px] border border-line bg-paper p-4">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrices[selected][0]?.length ?? 1}, minmax(70px, 1fr))` }}>
              {matrices[selected].map((row, rowIndex) => row.map((cell, colIndex) => (
                <input key={`${selected}-${rowIndex}-${colIndex}`} type="number" value={cell} onChange={(event) => updateCell(selected, rowIndex, colIndex, Number(event.target.value))} className="h-14 min-w-0 rounded-2xl border border-line bg-white px-3 text-center text-base font-extrabold text-ink outline-none transition focus:border-brand" aria-label={`${selected}${rowIndex + 1}${colIndex + 1}`} />
              )))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <MatrixMetric label="det(A)" value={Number.isFinite(stats.detA) ? formatMatrixNumber(stats.detA) : "-"} />
            <MatrixMetric label="rank(A)" value={String(stats.rankA)} />
            <MatrixMetric label="rank(C)" value={String(stats.rankC)} />
          </div>
        </div>
      </section>

      <aside className="grid gap-5">
        <section className="rounded-[20px] border border-line bg-white p-5 shadow-panel sm:p-6">
          <p className="text-sm font-extrabold text-brand">식 입력</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input value={expression} onChange={(event) => setExpression(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") runExpression(); }} className="h-14 min-w-0 rounded-2xl border border-line bg-paper px-4 font-extrabold text-ink outline-none transition focus:border-brand focus:bg-white" placeholder="예: inv(A)*B 또는 rref(C)" />
            <button type="button" onClick={() => runExpression()} className="h-14 rounded-2xl bg-brand px-5 text-sm font-extrabold text-white hover:bg-[#029b72]">계산</button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {matrixExamples.map((example) => (
              <button key={example} type="button" onClick={() => { setExpression(example); runExpression(example); }} className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand">
                {example}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[20px] border border-line bg-white p-5 shadow-panel sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-ink">결과</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">지원: +, -, *, 스칼라, det, inv, transpose, rref</p>
            </div>
            {!result.error && typeof result.value !== "number" && (
              <div className="flex gap-2">
                {(["A", "B", "C"] as MatrixName[]).map((name) => (
                  <button key={name} type="button" onClick={() => applyResultTo(name)} className="rounded-full border border-line px-3 py-2 text-xs font-extrabold text-slate-500 hover:border-brand hover:text-brand">{name}에 저장</button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 overflow-x-auto rounded-[18px] border border-line bg-paper p-4">
            {result.error ? (
              <p className="rounded-2xl bg-red-50 px-4 py-4 text-sm font-extrabold text-red-600">{result.error}</p>
            ) : typeof result.value === "number" ? (
              <p className="text-3xl font-extrabold text-brand">{formatMatrixNumber(result.value)}</p>
            ) : (
              <MatrixDisplay matrix={result.value} />
            )}
          </div>
        </section>

        <section className="rounded-[20px] border border-line bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-extrabold text-ink">기록</p>
            <button type="button" onClick={() => setHistory([])} className="rounded-full border border-line px-3 py-2 text-xs font-extrabold text-slate-500 hover:border-brand hover:text-brand">지우기</button>
          </div>
          <div className="mt-4 grid gap-2">
            {history.length === 0 ? (
              <p className="rounded-2xl bg-paper px-4 py-4 text-sm font-semibold text-slate-500">계산 기록이 여기에 표시됩니다.</p>
            ) : history.map((item) => (
              <button key={`${item.expression}-${item.summary}`} type="button" onClick={() => setExpression(item.expression)} className="rounded-2xl bg-paper px-4 py-3 text-left transition hover:bg-white hover:shadow-sm">
                <span className="block text-sm font-extrabold text-ink">{item.expression}</span>
                <span className="mt-1 block truncate text-xs font-bold text-slate-500">{item.summary}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[20px] border border-line bg-white p-5 shadow-panel">
          <p className="text-sm font-extrabold text-ink">해석 포인트</p>
          <div className="mt-4 grid gap-3">
            {checkpoints.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-paper px-4 py-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand" />
                <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

function MatrixSizeSelect({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-extrabold text-slate-500">{label}</span>
      <select value={value} onChange={(event) => onChange(Number(event.target.value))} className="h-12 rounded-2xl border border-line bg-paper px-4 text-sm font-extrabold text-ink outline-none focus:border-brand">
        {[1, 2, 3, 4, 5].map((size) => <option key={size} value={size}>{size}</option>)}
      </select>
    </label>
  );
}

function MatrixMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[18px] border border-line bg-paper p-4">
      <p className="text-xs font-extrabold text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-extrabold text-ink">{value}</p>
    </div>
  );
}

function MatrixDisplay({ matrix }: { matrix: number[][] }) {
  return (
    <div className="inline-grid gap-2 rounded-[18px] bg-white p-4" style={{ gridTemplateColumns: `repeat(${matrix[0]?.length ?? 1}, minmax(70px, 1fr))` }}>
      {matrix.map((row, rowIndex) => row.map((cell, colIndex) => (
        <div key={`${rowIndex}-${colIndex}`} className="rounded-2xl border border-line bg-paper px-3 py-3 text-center text-sm font-extrabold text-ink">
          {formatMatrixNumber(cell)}
        </div>
      )))}
    </div>
  );
}

function normalizeMatrixMap(candidate: MatrixMap) {
  return {
    A: normalizeMatrix(candidate.A, defaultMatrices.A),
    B: normalizeMatrix(candidate.B, defaultMatrices.B),
    C: normalizeMatrix(candidate.C, defaultMatrices.C)
  };
}

function normalizeMatrix(candidate: number[][] | undefined, fallback: number[][]) {
  if (!Array.isArray(candidate) || candidate.length === 0) return fallback;
  const rows = candidate.slice(0, 5);
  const cols = Math.min(Math.max(...rows.map((row) => Array.isArray(row) ? row.length : 0), 1), 5);
  return rows.map((row) => Array.from({ length: cols }, (_, index) => {
    const value = Array.isArray(row) ? Number(row[index]) : 0;
    return Number.isFinite(value) ? value : 0;
  }));
}

function evaluateMatrixExpression(expression: string, matrices: MatrixMap): { value: MatrixValue; error?: string } {
  try {
    const tokens = tokenizeMatrixExpression(expression);
    let index = 0;
    const peek = () => tokens[index];
    const consume = () => tokens[index++];

    function parseExpression(): MatrixValue {
      let value = parseTerm();
      while (peek() === "+" || peek() === "-") {
        const operator = consume();
        const right = parseTerm();
        value = operator === "+" ? addMatrixValues(value, right) : subtractMatrixValues(value, right);
      }
      return value;
    }

    function parseTerm(): MatrixValue {
      let value = parsePrimary();
      while (peek() === "*") {
        consume();
        value = multiplyMatrixValues(value, parsePrimary());
      }
      return value;
    }

    function parsePrimary(): MatrixValue {
      const token = consume();
      if (!token) throw new Error("식을 입력해 주세요.");
      if (/^-?\d+(?:\.\d+)?$/.test(token)) return Number(token);
      if (token === "(") {
        const value = parseExpression();
        if (consume() !== ")") throw new Error("닫는 괄호가 필요합니다.");
        return value;
      }
      if (token === "A" || token === "B" || token === "C") return cloneMatrix(matrices[token]);
      if (["det", "inv", "transpose", "rref"].includes(token)) {
        if (consume() !== "(") throw new Error(`${token}에는 괄호가 필요합니다.`);
        const value = parseExpression();
        if (consume() !== ")") throw new Error("닫는 괄호가 필요합니다.");
        if (typeof value === "number") throw new Error(`${token}에는 행렬이 필요합니다.`);
        if (token === "det") return determinant(value);
        if (token === "inv") return inverseMatrix(value);
        if (token === "transpose") return transposeMatrix(value);
        return rrefMatrix(value);
      }
      throw new Error(`${token}은 지원하지 않는 항목입니다.`);
    }

    const value = parseExpression();
    if (index < tokens.length) throw new Error("처리하지 못한 식이 있습니다.");
    return { value };
  } catch (caught) {
    return { value: [], error: caught instanceof Error ? caught.message : "행렬식을 확인해 주세요." };
  }
}

function tokenizeMatrixExpression(expression: string) {
  return expression
    .replaceAll("⁻¹", "^-1")
    .match(/det|inv|transpose|rref|[ABC]|-?\d+(?:\.\d+)?|[()+\-*]/gi)
    ?.map((token) => {
      const lower = token.toLowerCase();
      if (["det", "inv", "transpose", "rref"].includes(lower)) return lower;
      return token.toUpperCase();
    }) ?? [];
}

function addMatrixValues(left: MatrixValue, right: MatrixValue): MatrixValue {
  if (typeof left === "number" || typeof right === "number") throw new Error("덧셈은 같은 크기의 행렬끼리 지원합니다.");
  assertSameShape(left, right);
  return left.map((row, rowIndex) => row.map((value, colIndex) => value + right[rowIndex][colIndex]));
}

function subtractMatrixValues(left: MatrixValue, right: MatrixValue): MatrixValue {
  if (typeof left === "number" || typeof right === "number") throw new Error("뺄셈은 같은 크기의 행렬끼리 지원합니다.");
  assertSameShape(left, right);
  return left.map((row, rowIndex) => row.map((value, colIndex) => value - right[rowIndex][colIndex]));
}

function multiplyMatrixValues(left: MatrixValue, right: MatrixValue): MatrixValue {
  if (typeof left === "number" && typeof right === "number") return left * right;
  if (typeof left === "number") {
    if (!isMatrixValue(right)) throw new Error("곱셈 값을 확인해 주세요.");
    return right.map((row) => row.map((value) => left * value));
  }
  if (typeof right === "number") return left.map((row) => row.map((value) => value * right));
  if ((left[0]?.length ?? 0) !== right.length) throw new Error("곱셈 차원이 맞지 않습니다.");
  return left.map((row) => right[0].map((_, colIndex) => row.reduce((total, value, index) => total + value * right[index][colIndex], 0)));
}

function isMatrixValue(value: MatrixValue): value is number[][] {
  return Array.isArray(value);
}

function assertSameShape(left: number[][], right: number[][]) {
  if (left.length !== right.length || (left[0]?.length ?? 0) !== (right[0]?.length ?? 0)) throw new Error("행렬 크기가 같아야 합니다.");
}

function cloneMatrix(matrix: number[][]) {
  return matrix.map((row) => [...row]);
}

function zeroMatrix(rows: number, cols: number) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
}

function identityMatrix(size: number) {
  const safeSize = Math.min(Math.max(size, 1), 5);
  return Array.from({ length: safeSize }, (_, row) => Array.from({ length: safeSize }, (_, col) => row === col ? 1 : 0));
}

function transposeMatrix(matrix: number[][]) {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
}

function determinant(matrix: number[][]): number {
  if (matrix.length !== (matrix[0]?.length ?? 0)) return Number.NaN;
  if (matrix.length === 1) return matrix[0][0];
  if (matrix.length === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
  return matrix[0].reduce((total, value, col) => {
    const minor = matrix.slice(1).map((row) => row.filter((_, index) => index !== col));
    return total + (col % 2 === 0 ? 1 : -1) * value * determinant(minor);
  }, 0);
}

function inverseMatrix(matrix: number[][]) {
  if (matrix.length !== (matrix[0]?.length ?? 0)) throw new Error("역행렬은 정사각행렬만 지원합니다.");
  const size = matrix.length;
  const augmented = matrix.map((row, rowIndex) => [
    ...row.map((value) => Number(value)),
    ...Array.from({ length: size }, (_, colIndex) => rowIndex === colIndex ? 1 : 0)
  ]);
  const reduced = rrefMatrix(augmented);
  const left = reduced.map((row) => row.slice(0, size));
  const isIdentity = left.every((row, rowIndex) => row.every((value, colIndex) => Math.abs(value - (rowIndex === colIndex ? 1 : 0)) < 1e-8));
  if (!isIdentity) throw new Error("역행렬이 없습니다.");
  return reduced.map((row) => row.slice(size));
}

function rrefMatrix(matrix: number[][]) {
  const result = cloneMatrix(matrix).map((row) => row.map((value) => Number(value)));
  let lead = 0;
  for (let row = 0; row < result.length; row += 1) {
    if (lead >= (result[0]?.length ?? 0)) return cleanupMatrix(result);
    let pivot = row;
    while (Math.abs(result[pivot][lead]) < 1e-10) {
      pivot += 1;
      if (pivot === result.length) {
        pivot = row;
        lead += 1;
        if (lead === (result[0]?.length ?? 0)) return cleanupMatrix(result);
      }
    }
    [result[row], result[pivot]] = [result[pivot], result[row]];
    const divisor = result[row][lead];
    result[row] = result[row].map((value) => value / divisor);
    for (let other = 0; other < result.length; other += 1) {
      if (other === row) continue;
      const factor = result[other][lead];
      result[other] = result[other].map((value, col) => value - factor * result[row][col]);
    }
    lead += 1;
  }
  return cleanupMatrix(result);
}

function matrixRank(matrix: number[][]) {
  return rrefMatrix(matrix).filter((row) => row.some((value) => Math.abs(value) > 1e-8)).length;
}

function cleanupMatrix(matrix: number[][]) {
  return matrix.map((row) => row.map((value) => Math.abs(value) < 1e-10 ? 0 : value));
}

function formatMatrixNumber(value: number) {
  if (!Number.isFinite(value)) return "-";
  return Number(value.toFixed(6)).toLocaleString("ko-KR", { maximumFractionDigits: 6 });
}

function matrixResultSummary(value: MatrixValue) {
  if (typeof value === "number") return formatMatrixNumber(value);
  return `${value.length}x${value[0]?.length ?? 0} 행렬`;
}

function FourFunctionCalculator({ title, checkpoints }: { title: string; checkpoints: string[] }) {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("0");
  const [error, setError] = useState("");
  const [history, setHistory] = useState<{ expression: string; result: string }[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedHistory = window.localStorage.getItem(FOUR_FUNCTION_HISTORY_STORAGE_KEY);
    if (!storedHistory) return;
    window.setTimeout(() => {
      try {
        setHistory(JSON.parse(storedHistory) as { expression: string; result: string }[]);
      } catch {
        window.localStorage.removeItem(FOUR_FUNCTION_HISTORY_STORAGE_KEY);
      }
    }, 0);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (/^[0-9.]$/.test(event.key)) {
        event.preventDefault();
        append(event.key);
      } else if (["+", "-", "*", "/"].includes(event.key)) {
        event.preventDefault();
        append(event.key);
      } else if (event.key === "Enter" || event.key === "=") {
        event.preventDefault();
        runCalculation();
      } else if (event.key === "Backspace") {
        event.preventDefault();
        backspace();
      } else if (event.key === "Escape") {
        event.preventDefault();
        clearAll();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function persistHistory(nextHistory: { expression: string; result: string }[]) {
    setHistory(nextHistory);
    window.localStorage.setItem(FOUR_FUNCTION_HISTORY_STORAGE_KEY, JSON.stringify(nextHistory));
  }

  function append(value: string) {
    setExpression((current) => {
      if (isBasicOperator(value) && (!current || isBasicOperator(current.slice(-1)))) {
        return current ? `${current.slice(0, -1)}${value}` : current;
      }
      return `${current}${value}`;
    });
    setError("");
  }

  function clearAll() {
    setExpression("");
    setResult("0");
    setError("");
  }

  function backspace() {
    setExpression((current) => current.slice(0, -1));
    setError("");
  }

  function toggleSign() {
    setExpression((current) => {
      if (!current) return "-";
      const match = current.match(/(-?\d*\.?\d+)$/);
      if (!match || match.index === undefined) return `${current}-`;
      const number = match[0];
      const start = match.index;
      return number.startsWith("-")
        ? `${current.slice(0, start)}${number.slice(1)}`
        : `${current.slice(0, start)}-${number}`;
    });
    setError("");
  }

  function applyPercent() {
    setExpression((current) => {
      const match = current.match(/(\d*\.?\d+)$/);
      if (!match || match.index === undefined) return current;
      const number = Number(match[0]);
      if (!Number.isFinite(number)) return current;
      return `${current.slice(0, match.index)}${formatCalculatorResult(number / 100)}`;
    });
    setError("");
  }

  function runCalculation(nextExpression = expression) {
    const trimmed = nextExpression.trim();
    if (!trimmed) return;
    try {
      const normalized = trimmed.replaceAll("×", "*").replaceAll("÷", "/");
      const value = evaluateExpression(normalized, { angleMode: "rad", ans: 0, memory: 0 });
      if (!Number.isFinite(value)) throw new Error("계산 결과가 유효하지 않습니다.");
      const formatted = formatCalculatorResult(value);
      setResult(formatted);
      setExpression(formatted);
      setError("");
      persistHistory([{ expression: trimmed, result: formatted }, ...history.filter((item) => item.expression !== trimmed)].slice(0, 10));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "식을 확인해 주세요.");
    }
  }

  const buttons = [
    ["AC", "⌫", "±", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "%", "="]
  ];

  function handleButton(label: string) {
    if (label === "AC") return clearAll();
    if (label === "⌫") return backspace();
    if (label === "±") return toggleSign();
    if (label === "%") return applyPercent();
    if (label === "=") return runCalculation();
    if (label === "×") return append("*");
    if (label === "÷") return append("/");
    append(label);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="min-w-0 overflow-hidden rounded-[20px] border border-line bg-white p-5 shadow-float sm:p-6">
        <div className="rounded-[18px] bg-ink p-5 text-white">
          <p className="text-sm font-extrabold text-brand">{title}</p>
          <div className="mt-4 min-h-10 break-words text-right text-lg font-bold text-white/60">
            {expression ? formatBasicExpression(expression) : "0"}
          </div>
          <div className="mt-2 break-words text-right text-4xl font-extrabold leading-tight sm:text-5xl">{result}</div>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-extrabold text-ink">계산식</span>
          <input
            value={formatBasicExpression(expression)}
            onChange={(event) => {
              setExpression(parseBasicExpression(event.target.value));
              setError("");
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") runCalculation();
            }}
            className="mt-2 h-14 w-full rounded-2xl border border-line bg-paper px-4 text-right text-lg font-extrabold text-ink outline-none transition focus:border-brand focus:bg-white"
            placeholder="예: 12.5+8/2"
          />
        </label>
        {error && <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-extrabold text-red-600">{error}</p>}

        <div className="mt-5 grid gap-2">
          {buttons.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-2">
              {row.map((label) => (
                <button
                  key={`${rowIndex}-${label}`}
                  type="button"
                  onClick={() => handleButton(label)}
                  className={`h-14 rounded-2xl text-lg font-extrabold transition ${
                    label === "="
                      ? "bg-brand text-white hover:bg-[#029b72]"
                      : ["+", "-", "×", "÷"].includes(label)
                        ? "bg-ink text-white hover:bg-slate-700"
                        : ["AC", "⌫", "±", "%"].includes(label)
                          ? "border border-line bg-white text-brand hover:border-brand"
                          : "border border-line bg-paper text-ink hover:border-brand hover:bg-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </section>

      <aside className="grid gap-5">
        <div className="rounded-[20px] border border-line bg-white p-5 shadow-panel">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-ink">계산 기록</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">최근 10건까지 이 브라우저에 저장됩니다.</p>
            </div>
            <button
              type="button"
              onClick={() => persistHistory([])}
              className="rounded-full border border-line px-3 py-2 text-xs font-extrabold text-slate-500 hover:border-brand hover:text-brand"
            >
              지우기
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            {history.length === 0 ? (
              <p className="rounded-2xl bg-paper px-4 py-4 text-sm font-semibold text-slate-500">계산 결과가 여기에 표시됩니다.</p>
            ) : (
              history.map((item) => (
                <button
                  key={`${item.expression}-${item.result}`}
                  type="button"
                  onClick={() => {
                    setExpression(parseBasicExpression(item.expression));
                    setResult(item.result);
                  }}
                  className="rounded-2xl bg-paper px-4 py-3 text-left transition hover:bg-white hover:shadow-sm"
                >
                  <span className="block truncate text-xs font-bold text-slate-500">{formatBasicExpression(item.expression)}</span>
                  <span className="mt-1 block truncate text-sm font-extrabold text-ink">= {item.result}</span>
                </button>
              ))
            )}
          </div>
        </div>
        <div className="rounded-[20px] border border-line bg-white p-5 shadow-panel">
          <p className="text-sm font-extrabold text-ink">해석 포인트</p>
          <div className="mt-4 grid gap-3">
            {checkpoints.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-paper px-4 py-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand" />
                <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function DdayCalculator({ title, checkpoints }: { title: string; checkpoints: string[] }) {
  const today = getLocalDateInputValue(new Date());
  const [baseDate, setBaseDate] = useState(today);
  const [targetDate, setTargetDate] = useState(today);
  const result = useMemo(() => {
    const base = parseDateInput(baseDate);
    const target = parseDateInput(targetDate);
    const diff = dayDiff(base, target);
    const includeDays = Math.abs(diff) + 1;
    return {
      diff,
      includeDays,
      weeks: diff / 7,
      label: diff === 0 ? "D-Day" : diff > 0 ? `D-${diff.toLocaleString("ko-KR")}` : `D+${Math.abs(diff).toLocaleString("ko-KR")}`,
      direction: diff === 0 ? "오늘입니다" : diff > 0 ? "남았습니다" : "지났습니다"
    };
  }, [baseDate, targetDate]);

  return (
    <LifeToolShell title={title} heading="기준일과 목표일을 계산하세요" checkpoints={checkpoints}>
      <section className="rounded-[20px] border border-line bg-white p-5 shadow-float sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <DateInput label="기준일" value={baseDate} onChange={setBaseDate} />
          <DateInput label="목표일" value={targetDate} onChange={setTargetDate} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {[
            { label: "오늘", days: 0 },
            { label: "7일 후", days: 7 },
            { label: "30일 후", days: 30 },
            { label: "100일 후", days: 100 }
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setTargetDate(getLocalDateInputValue(addDays(parseDateInput(baseDate), preset.days)))}
              className="rounded-full border border-line px-4 py-2 text-xs font-extrabold text-slate-600 hover:border-brand hover:text-brand"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-[20px] border border-line bg-white p-5 shadow-panel sm:p-6">
        <p className="text-sm font-extrabold text-brand">결과</p>
        <h2 className="mt-2 text-4xl font-black text-ink sm:text-5xl">{result.label}</h2>
        <p className="mt-2 text-sm font-bold text-slate-500">{Math.abs(result.diff).toLocaleString("ko-KR")}일 {result.direction}</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <GeometryMetric label="날짜 차이" value={`${result.diff.toLocaleString("ko-KR")}일`} />
          <GeometryMetric label="포함 일수" value={`${result.includeDays.toLocaleString("ko-KR")}일`} />
          <GeometryMetric label="주 환산" value={`${result.weeks.toFixed(1)}주`} />
        </div>
      </section>
    </LifeToolShell>
  );
}

function DateAddCalculator({ title, checkpoints }: { title: string; checkpoints: string[] }) {
  const [startDate, setStartDate] = useState(getLocalDateInputValue(new Date()));
  const [mode, setMode] = useState<1 | -1>(1);
  const [days, setDays] = useState(14);
  const [weeks, setWeeks] = useState(0);
  const [months, setMonths] = useState(0);
  const [years, setYears] = useState(0);
  const resultDate = useMemo(() => {
    const next = parseDateInput(startDate);
    next.setFullYear(next.getFullYear() + years * mode);
    next.setMonth(next.getMonth() + months * mode);
    next.setDate(next.getDate() + (days + weeks * 7) * mode);
    return next;
  }, [days, mode, months, startDate, weeks, years]);
  const totalDays = dayDiff(parseDateInput(startDate), resultDate);

  return (
    <LifeToolShell title={title} heading="날짜에 기간을 더하거나 빼세요" checkpoints={checkpoints}>
      <section className="rounded-[20px] border border-line bg-white p-5 shadow-float sm:p-6">
        <DateInput label="시작일" value={startDate} onChange={setStartDate} />
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            { label: "더하기", value: 1 as const },
            { label: "빼기", value: -1 as const }
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => setMode(item.value)}
              className={`rounded-2xl px-4 py-3 text-sm font-extrabold ${mode === item.value ? "bg-brand text-white" : "border border-line bg-paper text-slate-600"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <LifeNumberInput label="년" value={years} onChange={setYears} />
          <LifeNumberInput label="개월" value={months} onChange={setMonths} />
          <LifeNumberInput label="주" value={weeks} onChange={setWeeks} />
          <LifeNumberInput label="일" value={days} onChange={setDays} />
        </div>
      </section>

      <section className="rounded-[20px] border border-line bg-white p-5 shadow-panel sm:p-6">
        <p className="text-sm font-extrabold text-brand">도착 날짜</p>
        <h2 className="mt-2 text-4xl font-black text-ink">{formatKoreanDate(resultDate)}</h2>
        <p className="mt-2 text-sm font-bold text-slate-500">{formatWeekday(resultDate)} · 시작일 기준 {totalDays.toLocaleString("ko-KR")}일 이동</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <GeometryMetric label="결과 ISO 날짜" value={getLocalDateInputValue(resultDate)} />
          <GeometryMetric label="총 이동 일수" value={`${totalDays.toLocaleString("ko-KR")}일`} />
        </div>
      </section>
    </LifeToolShell>
  );
}

function StopwatchTool({ title, checkpoints }: { title: string; checkpoints: string[] }) {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    if (!running || startedAt === null) return undefined;
    const timer = window.setInterval(() => setElapsed(Date.now() - startedAt), 33);
    return () => window.clearInterval(timer);
  }, [running, startedAt]);

  function start() {
    setStartedAt(Date.now() - elapsed);
    setRunning(true);
  }

  function pause() {
    setRunning(false);
  }

  function reset() {
    setRunning(false);
    setElapsed(0);
    setStartedAt(null);
    setLaps([]);
  }

  return (
    <LifeToolShell title={title} heading="시간을 측정하고 랩을 기록하세요" checkpoints={checkpoints}>
      <section className="rounded-[20px] border border-line bg-white p-6 text-center shadow-float">
        <p className="text-sm font-extrabold text-brand">경과 시간</p>
        <div className="mt-4 font-mono text-5xl font-black text-ink sm:text-6xl">{formatStopwatchTime(elapsed)}</div>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={running ? pause : start} className="rounded-full bg-brand px-6 py-3 text-sm font-extrabold text-white">
            {running ? "일시정지" : "시작"}
          </button>
          <button type="button" onClick={() => setLaps((current) => [elapsed, ...current].slice(0, 20))} disabled={elapsed === 0} className="rounded-full border border-line px-6 py-3 text-sm font-extrabold text-slate-600 disabled:opacity-40">
            랩
          </button>
          <button type="button" onClick={reset} className="rounded-full border border-line px-6 py-3 text-sm font-extrabold text-slate-600">
            초기화
          </button>
        </div>
      </section>

      <section className="rounded-[20px] border border-line bg-white p-5 shadow-panel sm:p-6">
        <p className="text-sm font-extrabold text-ink">랩 기록</p>
        <div className="mt-4 grid gap-2">
          {laps.length === 0 ? (
            <p className="rounded-2xl bg-paper px-4 py-3 text-sm font-bold text-slate-500">아직 기록이 없습니다.</p>
          ) : laps.map((lap, index) => (
            <div key={`${lap}-${index}`} className="flex items-center justify-between rounded-2xl bg-paper px-4 py-3">
              <span className="text-sm font-extrabold text-slate-500">Lap {laps.length - index}</span>
              <span className="font-mono text-sm font-black text-ink">{formatStopwatchTime(lap)}</span>
            </div>
          ))}
        </div>
      </section>
    </LifeToolShell>
  );
}

function InternetSpeedTest({ title, checkpoints }: { title: string; checkpoints: string[] }) {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState<{ mbps: number; latency: number; sizeMb: number } | null>(null);
  const [history, setHistory] = useState<{ mbps: number; latency: number }[]>([]);

  async function runTest() {
    setStatus("running");
    setResult(null);
    const cacheBust = Date.now();
    const latencyStart = performance.now();
    try {
      await fetch(`https://speed.cloudflare.com/__down?bytes=100000&cache=${cacheBust}`, { cache: "no-store" });
      const latency = performance.now() - latencyStart;
      const sizeBytes = 3000000;
      const start = performance.now();
      const response = await fetch(`https://speed.cloudflare.com/__down?bytes=${sizeBytes}&cache=${cacheBust + 1}`, { cache: "no-store" });
      const blob = await response.blob();
      const seconds = (performance.now() - start) / 1000;
      const mbps = seconds > 0 ? (blob.size * 8) / seconds / 1000000 : 0;
      const next = { mbps, latency, sizeMb: blob.size / 1000000 };
      setResult(next);
      setHistory((current) => [{ mbps, latency }, ...current].slice(0, 5));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <LifeToolShell title={title} heading="현재 인터넷 속도를 측정하세요" checkpoints={checkpoints}>
      <section className="rounded-[20px] border border-line bg-white p-6 text-center shadow-float">
        <p className="text-sm font-extrabold text-brand">다운로드 속도</p>
        <div className="mt-4 text-5xl font-black text-ink sm:text-6xl">{result ? result.mbps.toFixed(1) : "-"}</div>
        <p className="mt-2 text-sm font-bold text-slate-500">Mbps</p>
        <button type="button" onClick={runTest} disabled={status === "running"} className="mt-6 rounded-full bg-brand px-6 py-3 text-sm font-extrabold text-white disabled:bg-slate-300">
          {status === "running" ? "측정 중..." : "속도 측정"}
        </button>
        {status === "error" && <p className="mt-4 text-sm font-bold text-red-600">측정에 실패했습니다. 네트워크 상태를 확인해 주세요.</p>}
      </section>

      <section className="rounded-[20px] border border-line bg-white p-5 shadow-panel sm:p-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <GeometryMetric label="다운로드" value={result ? `${result.mbps.toFixed(1)} Mbps` : "-"} />
          <GeometryMetric label="지연 시간" value={result ? `${result.latency.toFixed(0)} ms` : "-"} />
          <GeometryMetric label="테스트 용량" value={result ? `${result.sizeMb.toFixed(1)} MB` : "-"} />
        </div>
        <p className="mt-5 text-sm font-extrabold text-ink">최근 측정</p>
        <div className="mt-3 grid gap-2">
          {history.length === 0 ? (
            <p className="rounded-2xl bg-paper px-4 py-3 text-sm font-bold text-slate-500">아직 측정 기록이 없습니다.</p>
          ) : history.map((item, index) => (
            <div key={`${item.mbps}-${index}`} className="flex items-center justify-between rounded-2xl bg-paper px-4 py-3 text-sm font-bold text-slate-600">
              <span>{index + 1}회차</span>
              <span>{item.mbps.toFixed(1)} Mbps · {item.latency.toFixed(0)} ms</span>
            </div>
          ))}
        </div>
      </section>
    </LifeToolShell>
  );
}

function LifeToolShell({ title, heading, checkpoints, children }: { title: string; heading: string; checkpoints: string[]; children: ReactNode }) {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
      <div className="grid gap-6">
        <div className="rounded-[20px] border border-line bg-white px-5 py-5 shadow-sm sm:px-6">
          <p className="text-sm font-black text-brand">{title}</p>
          <h2 className="mt-2 break-keep text-3xl font-black leading-tight text-ink sm:text-4xl">{heading}</h2>
        </div>
        {children}
      </div>
      <aside className="rounded-[20px] border border-line bg-white p-5 shadow-panel sm:p-6">
        <p className="text-sm font-extrabold text-ink">사용 체크포인트</p>
        <div className="mt-4 grid gap-3">
          {checkpoints.map((item) => (
            <div key={item} className="flex gap-3 rounded-2xl bg-paper px-4 py-4">
              <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand" />
              <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function DateInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-ink">{label}</span>
      <input type="date" value={value} onChange={(event) => onChange(event.target.value)} className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none focus:border-brand focus:bg-white" />
    </label>
  );
}

function LifeNumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-ink">{label}</span>
      <input type="number" value={value} onChange={(event) => onChange(Number(event.target.value) || 0)} className="h-12 rounded-2xl border border-line bg-paper px-4 font-bold text-ink outline-none focus:border-brand focus:bg-white" />
    </label>
  );
}

function parseDateInput(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
}

function getLocalDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function dayDiff(from: Date, to: Date) {
  const start = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate());
  const end = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate());
  return Math.round((end - start) / 86400000);
}

function formatKoreanDate(date: Date) {
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" });
}

function formatWeekday(date: Date) {
  return date.toLocaleDateString("ko-KR", { weekday: "long" });
}

function formatStopwatchTime(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const centiseconds = Math.floor((ms % 1000) / 10);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
}

function isBasicOperator(value: string) {
  return ["+", "-", "*", "/"].includes(value);
}

function formatBasicExpression(expression: string) {
  return expression.replaceAll("*", "×").replaceAll("/", "÷");
}

function parseBasicExpression(expression: string) {
  return expression.replaceAll("×", "*").replaceAll("÷", "/").replace(/[^0-9+\-*/().\s]/g, "");
}

type GeometryPoint = {
  id: string;
  label: string;
  x: number;
  y: number;
};

type GeometryObjectType = "segment" | "line" | "ray" | "polygon" | "circle" | "angle" | "midpoint" | "perpendicular" | "parallel";

type GeometryObject = {
  id: string;
  type: GeometryObjectType;
  pointIds: string[];
  label: string;
};

type GeometryMode = "select" | "point" | GeometryObjectType;

const geometryTools: { value: GeometryMode; label: string; required: number; hint: string }[] = [
  { value: "select", label: "이동", required: 0, hint: "점을 드래그해 작도를 조정합니다." },
  { value: "point", label: "점", required: 0, hint: "작도판을 눌러 새 점을 만듭니다." },
  { value: "segment", label: "선분", required: 2, hint: "두 점을 선택해 선분을 만듭니다." },
  { value: "line", label: "직선", required: 2, hint: "두 점을 지나는 직선을 만듭니다." },
  { value: "ray", label: "반직선", required: 2, hint: "첫 점에서 둘째 점 방향으로 반직선을 만듭니다." },
  { value: "polygon", label: "다각형", required: 3, hint: "세 점 이상 선택한 뒤 완성합니다." },
  { value: "circle", label: "원", required: 2, hint: "중심점과 반지름 기준점을 선택합니다." },
  { value: "angle", label: "각도", required: 3, hint: "점-꼭짓점-점 순서로 각도를 표시합니다." },
  { value: "midpoint", label: "중점", required: 2, hint: "두 점의 중점을 새 점으로 만듭니다." },
  { value: "perpendicular", label: "수직선", required: 3, hint: "기준선 두 점과 지나는 점을 선택합니다." },
  { value: "parallel", label: "평행선", required: 3, hint: "기준선 두 점과 지나는 점을 선택합니다." }
];

function GeometryTool({ title, checkpoints }: { title: string; checkpoints: string[] }) {
  const [points, setPoints] = useState<GeometryPoint[]>([
    { id: "a", label: "A", x: -4, y: -2 },
    { id: "b", label: "B", x: 3, y: 1 },
    { id: "c", label: "C", x: -1, y: 4 }
  ]);
  const [objects, setObjects] = useState<GeometryObject[]>([
    { id: "s-ab", type: "segment", pointIds: ["a", "b"], label: "AB" },
    { id: "s-bc", type: "segment", pointIds: ["b", "c"], label: "BC" },
    { id: "s-ca", type: "segment", pointIds: ["c", "a"], label: "CA" },
    { id: "poly-abc", type: "polygon", pointIds: ["a", "b", "c"], label: "ABC" }
  ]);
  const [mode, setMode] = useState<GeometryMode>("select");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const geometryIdRef = useRef(0);
  const width = 720;
  const height = 460;
  const padding = 34;
  const min = -10;
  const max = 10;
  const pointMap = useMemo(() => new Map(points.map((point) => [point.id, point])), [points]);
  const measurements = useMemo(() => measureGeometryObjects(objects, pointMap), [objects, pointMap]);
  const activeTool = geometryTools.find((tool) => tool.value === mode) ?? geometryTools[0];

  const toX = (x: number) => padding + ((x - min) / (max - min)) * (width - padding * 2);
  const toY = (y: number) => padding + (1 - (y - min) / (max - min)) * (height - padding * 2);
  const fromPointer = (event: PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const px = ((event.clientX - rect.left) / rect.width) * width;
    const py = ((event.clientY - rect.top) / rect.height) * height;
    const x = min + ((px - padding) / (width - padding * 2)) * (max - min);
    const y = max - ((py - padding) / (height - padding * 2)) * (max - min);
    return normalizeGeometryPoint({ x, y }, snapToGrid);
  };

  function createPoint(next: { x: number; y: number }) {
    const point = { id: nextGeometryId("p"), label: nextPointLabel(points.length), x: next.x, y: next.y };
    setPoints((current) => [...current, point].slice(-18));
    return point.id;
  }

  function nextGeometryId(prefix: string) {
    geometryIdRef.current += 1;
    return `${prefix}${geometryIdRef.current}`;
  }

  function handleBoardPointerDown(event: PointerEvent<SVGSVGElement>) {
    if (mode === "select") return;
    const next = fromPointer(event);
    const id = createPoint(next);
    if (mode !== "point") selectPointForTool(id);
  }

  function selectPointForTool(id: string) {
    if (mode === "select" || mode === "point") return;
    setSelectedIds((current) => {
      const next = mode === "polygon" ? [...current, id] : [...current.filter((item) => item !== id), id];
      const unique = Array.from(new Set(next));
      const required = geometryTools.find((tool) => tool.value === mode)?.required ?? 2;

      if (mode !== "polygon" && unique.length >= required) {
        window.requestAnimationFrame(() => finishConstruction(unique.slice(0, required)));
        return [];
      }

      return unique.slice(-6);
    });
  }

  function updatePoint(id: string, next: Partial<GeometryPoint>) {
    setPoints((current) => current.map((point) => (point.id === id ? { ...point, ...next } : point)));
  }

  function finishConstruction(sourceIds = selectedIds) {
    if (mode === "select" || mode === "point") return;
    const required = geometryTools.find((tool) => tool.value === mode)?.required ?? 2;
    if (sourceIds.length < required) return;

    if (mode === "midpoint") {
      const first = pointMap.get(sourceIds[0]);
      const second = pointMap.get(sourceIds[1]);
      if (!first || !second) return;
      const midpoint = normalizeGeometryPoint({ x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 }, false);
      const midpointId = nextGeometryId("m");
      setPoints((current) => [...current, { id: midpointId, label: nextPointLabel(current.length), ...midpoint }]);
      setObjects((current) => [
        ...current,
        { id: `mid-${midpointId}`, type: "midpoint", pointIds: [sourceIds[0], sourceIds[1], midpointId], label: "중점" }
      ]);
      setSelectedIds([]);
      return;
    }

    const pointIds = mode === "polygon" ? sourceIds : sourceIds.slice(0, required);
    setObjects((current) => [
      ...current,
      {
        id: nextGeometryId(mode),
        type: mode,
        pointIds,
        label: geometryObjectLabel(mode, pointIds, pointMap)
      }
    ]);
    setSelectedIds([]);
  }

  function resetShape() {
    setPoints([
      { id: "a", label: "A", x: -4, y: -2 },
      { id: "b", label: "B", x: 3, y: 1 },
      { id: "c", label: "C", x: -1, y: 4 }
    ]);
    setObjects([
      { id: "s-ab", type: "segment", pointIds: ["a", "b"], label: "AB" },
      { id: "s-bc", type: "segment", pointIds: ["b", "c"], label: "BC" },
      { id: "s-ca", type: "segment", pointIds: ["c", "a"], label: "CA" },
      { id: "poly-abc", type: "polygon", pointIds: ["a", "b", "c"], label: "ABC" }
    ]);
    setSelectedIds([]);
    setMode("select");
  }

  const gridTicks = Array.from({ length: 21 }, (_, index) => index - 10);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
      <section className="min-w-0 rounded-[20px] border border-line bg-white p-5 shadow-float sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-brand">{title}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">도형을 만들고 측정하세요</h2>
          </div>
          <button
            type="button"
            onClick={resetShape}
            className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand"
          >
            초기화
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {geometryTools.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                setMode(item.value);
                setSelectedIds([]);
              }}
              className={`rounded-2xl px-4 py-3 text-sm font-extrabold transition ${
                mode === item.value ? "bg-brand text-white" : "border border-line bg-paper text-slate-600 hover:border-brand hover:bg-white"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-[18px] border border-line bg-paper p-4">
          <p className="text-sm font-extrabold text-ink">{activeTool.hint}</p>
          <p className="mt-1 text-xs font-bold text-slate-500">
            선택: {selectedIds.map((id) => pointMap.get(id)?.label ?? id).join(" → ") || "없음"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {mode === "polygon" && (
              <button
                type="button"
                onClick={() => finishConstruction()}
                disabled={selectedIds.length < 3}
                className="rounded-full bg-ink px-4 py-2 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                다각형 완성
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="rounded-full border border-line bg-white px-4 py-2 text-xs font-extrabold text-slate-600 hover:border-brand hover:text-brand"
            >
              선택 해제
            </button>
            <button
              type="button"
              onClick={() => setSnapToGrid((value) => !value)}
              className={`rounded-full border px-4 py-2 text-xs font-extrabold ${snapToGrid ? "border-brand bg-white text-brand" : "border-line bg-white text-slate-500"}`}
            >
              격자 맞춤 {snapToGrid ? "켜짐" : "꺼짐"}
            </button>
            <button
              type="button"
              onClick={() => setShowLabels((value) => !value)}
              className={`rounded-full border px-4 py-2 text-xs font-extrabold ${showLabels ? "border-brand bg-white text-brand" : "border-line bg-white text-slate-500"}`}
            >
              이름 표시 {showLabels ? "켜짐" : "꺼짐"}
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-3">
          {points.map((point) => (
            <div key={point.id} className="grid gap-2 rounded-[18px] border border-line bg-paper p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand text-sm font-extrabold text-white">{point.label}</span>
                <button
                  type="button"
                  onClick={() => {
                    setObjects((current) => current.filter((object) => !object.pointIds.includes(point.id)));
                    setSelectedIds((current) => current.filter((item) => item !== point.id));
                    setPoints((current) => current.length <= 1 ? current : current.filter((item) => item.id !== point.id));
                  }}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-extrabold text-slate-500 hover:border-red-200 hover:text-red-600"
                >
                  삭제
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <GeometryNumberInput label="x" value={point.x} onChange={(value) => updatePoint(point.id, { x: value })} />
                <GeometryNumberInput label="y" value={point.y} onChange={(value) => updatePoint(point.id, { y: value })} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="min-w-0 rounded-[20px] border border-line bg-white p-5 shadow-panel sm:p-6">
        <div className="overflow-hidden rounded-[18px] border border-line bg-white">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            role="img"
            aria-label="기하 작도판"
            className="h-[430px] w-full touch-none bg-white"
            onPointerDown={handleBoardPointerDown}
            onPointerMove={(event) => {
              if (!draggingId) return;
              updatePoint(draggingId, fromPointer(event));
            }}
            onPointerUp={() => setDraggingId(null)}
            onPointerLeave={() => setDraggingId(null)}
          >
            {gridTicks.map((tick) => (
              <g key={tick}>
                <line x1={toX(tick)} y1={padding} x2={toX(tick)} y2={height - padding} stroke={tick === 0 ? "#64748b" : "#e2e8f0"} strokeWidth={tick === 0 ? 2 : 1} />
                <line x1={padding} y1={toY(tick)} x2={width - padding} y2={toY(tick)} stroke={tick === 0 ? "#64748b" : "#e2e8f0"} strokeWidth={tick === 0 ? 2 : 1} />
              </g>
            ))}
            {objects.map((object) => renderGeometryObject(object, pointMap, toX, toY, width, height, padding))}
            {selectedIds.length >= 2 && (
              <polyline
                points={selectedIds.map((id) => pointMap.get(id)).filter(Boolean).map((point) => `${toX(point!.x)},${toY(point!.y)}`).join(" ")}
                fill="none"
                stroke="#f59e0b"
                strokeDasharray="8 8"
                strokeWidth="3"
              />
            )}
            {points.map((point) => (
              <g key={point.id}>
                <circle
                  cx={toX(point.x)}
                  cy={toY(point.y)}
                  r={selectedIds.includes(point.id) ? "12" : "10"}
                  fill={selectedIds.includes(point.id) ? "#f59e0b" : "#0f766e"}
                  stroke="white"
                  strokeWidth="3"
                  className="cursor-grab"
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    if (mode === "select") {
                      setDraggingId(point.id);
                      event.currentTarget.setPointerCapture(event.pointerId);
                      return;
                    }
                    selectPointForTool(point.id);
                  }}
                />
                {showLabels && (
                  <text x={toX(point.x) + 13} y={toY(point.y) - 13} className="fill-slate-700 text-[13px] font-extrabold">
                    {point.label}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <GeometryMetric label="점 개수" value={`${points.length}개`} />
          <GeometryMetric label="작도 개수" value={`${objects.length}개`} />
          <GeometryMetric label="선분 길이 합" value={formatGraphNumber(measurements.totalSegmentLength, 3)} />
          <GeometryMetric label="다각형 면적 합" value={formatGraphNumber(measurements.totalArea, 3)} />
          <GeometryMetric label="원 둘레 합" value={formatGraphNumber(measurements.totalCircumference, 3)} />
          <GeometryMetric label="표시 각도" value={measurements.angles.length ? `${measurements.angles.map((angle) => formatGraphNumber(angle, 1)).join(", ")}°` : "-"} />
        </div>

        <div className="mt-5 rounded-[18px] border border-line bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-extrabold text-ink">작도 목록</p>
            <button
              type="button"
              onClick={() => setObjects([])}
              className="rounded-full border border-line px-3 py-1.5 text-xs font-extrabold text-slate-500 hover:border-red-200 hover:text-red-600"
            >
              모두 지우기
            </button>
          </div>
          <div className="mt-3 grid gap-2">
            {objects.length === 0 ? (
              <p className="rounded-2xl bg-paper px-4 py-3 text-sm font-bold text-slate-500">아직 만든 작도가 없습니다.</p>
            ) : objects.map((object) => (
              <div key={object.id} className="flex items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3">
                <p className="text-sm font-extrabold text-slate-700">{geometryObjectTypeLabel(object.type)} · {object.label}</p>
                <button
                  type="button"
                  onClick={() => setObjects((current) => current.filter((item) => item.id !== object.id))}
                  className="text-xs font-extrabold text-slate-400 hover:text-red-600"
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 rounded-[18px] border border-line bg-paper p-5">
          <p className="text-sm font-extrabold text-ink">해석 포인트</p>
          <div className="mt-4 grid gap-3">
            {checkpoints.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-white px-4 py-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand" />
                <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function GeometryNumberInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-extrabold text-slate-500">{label}</span>
      <input
        type="number"
        value={value}
        step={0.1}
        onChange={(event) => onChange(clampGeometryValue(Number(event.target.value)))}
        className="h-10 rounded-2xl border border-line bg-white px-3 text-sm font-extrabold text-ink outline-none focus:border-brand"
      />
    </label>
  );
}

function GeometryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-paper px-4 py-3">
      <p className="text-xs font-extrabold text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-extrabold text-ink">{value}</p>
    </div>
  );
}

function renderGeometryObject(
  object: GeometryObject,
  pointMap: Map<string, GeometryPoint>,
  toX: (value: number) => number,
  toY: (value: number) => number,
  width: number,
  height: number,
  padding: number
) {
  const pts = object.pointIds.map((id) => pointMap.get(id)).filter(Boolean) as GeometryPoint[];
  if (pts.length === 0) return null;

  if (object.type === "polygon" && pts.length >= 3) {
    return (
      <polygon
        key={object.id}
        points={pts.map((point) => `${toX(point.x)},${toY(point.y)}`).join(" ")}
        fill="#0f766e18"
        stroke="#0f766e"
        strokeLinejoin="round"
        strokeWidth="3"
      />
    );
  }

  if (object.type === "circle" && pts.length >= 2) {
    const radius = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
    return (
      <circle
        key={object.id}
        cx={toX(pts[0].x)}
        cy={toY(pts[0].y)}
        r={(radius / 20) * (width - padding * 2)}
        fill="#2563eb14"
        stroke="#2563eb"
        strokeWidth="3"
      />
    );
  }

  if (object.type === "angle" && pts.length >= 3) {
    const angle = measureAngle(pts[0], pts[1], pts[2]);
    const start = Math.atan2(toY(pts[0].y) - toY(pts[1].y), toX(pts[0].x) - toX(pts[1].x));
    const end = Math.atan2(toY(pts[2].y) - toY(pts[1].y), toX(pts[2].x) - toX(pts[1].x));
    const arc = describeSvgArc(toX(pts[1].x), toY(pts[1].y), 34, start, end);
    return (
      <g key={object.id}>
        <line x1={toX(pts[1].x)} y1={toY(pts[1].y)} x2={toX(pts[0].x)} y2={toY(pts[0].y)} stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
        <line x1={toX(pts[1].x)} y1={toY(pts[1].y)} x2={toX(pts[2].x)} y2={toY(pts[2].y)} stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
        <path d={arc} fill="none" stroke="#7c3aed" strokeWidth="3" />
        <text x={toX(pts[1].x) + 38} y={toY(pts[1].y) - 8} className="fill-violet-700 text-[13px] font-extrabold">
          {formatGraphNumber(angle, 1)}°
        </text>
      </g>
    );
  }

  if (object.type === "midpoint" && pts.length >= 3) {
    return (
      <g key={object.id}>
        <line x1={toX(pts[0].x)} y1={toY(pts[0].y)} x2={toX(pts[1].x)} y2={toY(pts[1].y)} stroke="#94a3b8" strokeDasharray="7 7" strokeWidth="2" />
        <circle cx={toX(pts[2].x)} cy={toY(pts[2].y)} r="7" fill="#f59e0b" stroke="white" strokeWidth="2" />
      </g>
    );
  }

  if ((object.type === "segment" || object.type === "line" || object.type === "ray" || object.type === "perpendicular" || object.type === "parallel") && pts.length >= 2) {
    const endpoints = geometryLineEndpoints(object.type, pts, width, height, padding, toX, toY);
    return (
      <line
        key={object.id}
        x1={endpoints.x1}
        y1={endpoints.y1}
        x2={endpoints.x2}
        y2={endpoints.y2}
        stroke={object.type === "perpendicular" || object.type === "parallel" ? "#dc2626" : "#2563eb"}
        strokeDasharray={object.type === "line" || object.type === "ray" || object.type === "parallel" || object.type === "perpendicular" ? "9 7" : undefined}
        strokeLinecap="round"
        strokeWidth="3"
      />
    );
  }

  return null;
}

function geometryLineEndpoints(
  type: GeometryObjectType,
  pts: GeometryPoint[],
  width: number,
  height: number,
  padding: number,
  toX: (value: number) => number,
  toY: (value: number) => number
) {
  const first = pts[0];
  const second = pts[1];
  const through = pts[2] ?? pts[0];
  let dx = second.x - first.x;
  let dy = second.y - first.y;

  if (type === "perpendicular") {
    [dx, dy] = [-dy, dx];
  }

  if (type === "parallel" || type === "perpendicular") {
    return extendLineThroughPoint(through, dx, dy, width, height, padding, toX, toY);
  }

  if (type === "line") {
    return extendLineThroughPoint(first, dx, dy, width, height, padding, toX, toY);
  }

  if (type === "ray") {
    const extended = extendLineThroughPoint(first, dx, dy, width, height, padding, toX, toY);
    return { x1: toX(first.x), y1: toY(first.y), x2: extended.x2, y2: extended.y2 };
  }

  return { x1: toX(first.x), y1: toY(first.y), x2: toX(second.x), y2: toY(second.y) };
}

function extendLineThroughPoint(
  point: GeometryPoint,
  dx: number,
  dy: number,
  width: number,
  height: number,
  padding: number,
  toX: (value: number) => number,
  toY: (value: number) => number
) {
  const length = Math.hypot(dx, dy) || 1;
  const scale = Math.max(width, height) / length;
  const x1 = toX(point.x - dx * scale);
  const y1 = toY(point.y - dy * scale);
  const x2 = toX(point.x + dx * scale);
  const y2 = toY(point.y + dy * scale);
  return {
    x1: Math.min(width - padding, Math.max(padding, x1)),
    y1: Math.min(height - padding, Math.max(padding, y1)),
    x2: Math.min(width - padding, Math.max(padding, x2)),
    y2: Math.min(height - padding, Math.max(padding, y2))
  };
}

function measureGeometryObjects(objects: GeometryObject[], pointMap: Map<string, GeometryPoint>) {
  return objects.reduce(
    (total, object) => {
      const pts = object.pointIds.map((id) => pointMap.get(id)).filter(Boolean) as GeometryPoint[];
      if (object.type === "segment" && pts.length >= 2) {
        total.totalSegmentLength += distanceBetweenPoints(pts[0], pts[1]);
      }
      if (object.type === "polygon" && pts.length >= 3) {
        total.totalSegmentLength += polygonPerimeter(pts);
        total.totalArea += polygonArea(pts);
      }
      if (object.type === "circle" && pts.length >= 2) {
        total.totalCircumference += Math.PI * 2 * distanceBetweenPoints(pts[0], pts[1]);
      }
      if (object.type === "angle" && pts.length >= 3) {
        total.angles.push(measureAngle(pts[0], pts[1], pts[2]));
      }
      return total;
    },
    { totalSegmentLength: 0, totalArea: 0, totalCircumference: 0, angles: [] as number[] }
  );
}

function polygonPerimeter(points: GeometryPoint[]) {
  return points.reduce((total, point, index) => total + distanceBetweenPoints(point, points[(index + 1) % points.length]), 0);
}

function polygonArea(points: GeometryPoint[]) {
  const signedArea = points.reduce((total, point, index) => {
    const next = points[(index + 1) % points.length];
    return total + point.x * next.y - next.x * point.y;
  }, 0);
  return Math.abs(signedArea) / 2;
}

function distanceBetweenPoints(first: GeometryPoint, second: GeometryPoint) {
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function measureAngle(first: GeometryPoint, vertex: GeometryPoint, second: GeometryPoint) {
  const ax = first.x - vertex.x;
  const ay = first.y - vertex.y;
  const bx = second.x - vertex.x;
  const by = second.y - vertex.y;
  const denominator = Math.hypot(ax, ay) * Math.hypot(bx, by);
  if (!denominator) return 0;
  const cosine = Math.min(1, Math.max(-1, (ax * bx + ay * by) / denominator));
  return (Math.acos(cosine) * 180) / Math.PI;
}

function describeSvgArc(cx: number, cy: number, radius: number, start: number, end: number) {
  const normalizedEnd = end < start ? end + Math.PI * 2 : end;
  const largeArc = normalizedEnd - start > Math.PI ? 1 : 0;
  const startPoint = { x: cx + Math.cos(start) * radius, y: cy + Math.sin(start) * radius };
  const endPoint = { x: cx + Math.cos(normalizedEnd) * radius, y: cy + Math.sin(normalizedEnd) * radius };
  return `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${largeArc} 1 ${endPoint.x} ${endPoint.y}`;
}

function normalizeGeometryPoint(point: { x: number; y: number }, snapToGrid: boolean) {
  const next = snapToGrid ? { x: Math.round(point.x), y: Math.round(point.y) } : point;
  return { x: clampGeometryValue(next.x), y: clampGeometryValue(next.y) };
}

function geometryObjectLabel(type: GeometryObjectType, pointIds: string[], pointMap: Map<string, GeometryPoint>) {
  const labels = pointIds.map((id) => pointMap.get(id)?.label ?? id);
  if (type === "circle") return `${labels[0]} 중심`;
  if (type === "angle") return `∠${labels.join("")}`;
  if (type === "perpendicular") return `${labels[2]} 통과`;
  if (type === "parallel") return `${labels[2]} 통과`;
  return labels.join("");
}

function geometryObjectTypeLabel(type: GeometryObjectType) {
  const labels: Record<GeometryObjectType, string> = {
    segment: "선분",
    line: "직선",
    ray: "반직선",
    polygon: "다각형",
    circle: "원",
    angle: "각도",
    midpoint: "중점",
    perpendicular: "수직선",
    parallel: "평행선"
  };
  return labels[type];
}

function clampGeometryValue(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(10, Math.max(-10, Number(value.toFixed(2))));
}

function nextPointLabel(index: number) {
  return String.fromCharCode(65 + (index % 26));
}

type SurfaceStats = {
  minZ: number;
  maxZ: number;
  sampleZ: number;
  validPoints: number;
};

const threeDPresets = [
  "sin(sqrt(x^2+y^2))",
  "0.08*(x^2-y^2)",
  "cos(x)+sin(y)",
  "sqrt(abs(x*y))",
  "0.5*x+0.25*y"
];

function ThreeDCalculator({ title, checkpoints }: { title: string; checkpoints: string[] }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef({ x: -0.62, y: 0.78 });
  const zoomRef = useRef(18);
  const dragRef = useRef<{ x: number; y: number } | null>(null);
  const [expression, setExpression] = useState("sin(sqrt(x^2+y^2))");
  const [range, setRange] = useState(6);
  const [resolution, setResolution] = useState(38);
  const [zScale, setZScale] = useState(1.4);
  const [wireframe, setWireframe] = useState(true);
  const [stats, setStats] = useState<SurfaceStats>({ minZ: 0, maxZ: 0, sampleZ: 0, validPoints: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = Math.max(mount.clientWidth, 320);
    const height = Math.max(mount.clientHeight, 360);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#ffffff");
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.set(0, 0, zoomRef.current);
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    } catch {
      const fallback = drawThreeFallbackCanvas(width, height, expression, range, resolution, zScale, rotationRef.current);
      setStats(fallback.stats);
      setError("WebGL을 사용할 수 없어 2D 미리보기로 표시합니다.");
      mount.replaceChildren(fallback.canvas);
      return () => {
        mount.replaceChildren();
      };
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    mount.replaceChildren(renderer.domElement);
    const activeRenderer = renderer;

    const group = new THREE.Group();
    group.rotation.x = rotationRef.current.x;
    group.rotation.y = rotationRef.current.y;
    scene.add(group);

    const light = new THREE.DirectionalLight("#ffffff", 2.2);
    light.position.set(8, 10, 12);
    scene.add(light);
    scene.add(new THREE.AmbientLight("#ffffff", 1.6));

    const nextStats = buildThreeScene(group, expression, range, resolution, zScale, wireframe);
    setStats(nextStats.stats);
    setError(nextStats.error);

    let frame = 0;
    const animate = () => {
      camera.position.set(0, 0, zoomRef.current);
      activeRenderer.render(scene, camera);
      frame = window.requestAnimationFrame(animate);
    };
    animate();

    function onPointerDown(event: globalThis.PointerEvent) {
      dragRef.current = { x: event.clientX, y: event.clientY };
      activeRenderer.domElement.setPointerCapture(event.pointerId);
    }
    function onPointerMove(event: globalThis.PointerEvent) {
      const previous = dragRef.current;
      if (!previous) return;
      const dx = event.clientX - previous.x;
      const dy = event.clientY - previous.y;
      rotationRef.current = {
        x: Math.max(-1.35, Math.min(1.35, rotationRef.current.x + dy * 0.008)),
        y: rotationRef.current.y + dx * 0.008
      };
      group.rotation.x = rotationRef.current.x;
      group.rotation.y = rotationRef.current.y;
      dragRef.current = { x: event.clientX, y: event.clientY };
    }
    function onPointerUp(event: globalThis.PointerEvent) {
      dragRef.current = null;
      activeRenderer.domElement.releasePointerCapture(event.pointerId);
    }
    function onWheel(event: WheelEvent) {
      event.preventDefault();
      zoomRef.current = Math.max(8, Math.min(34, zoomRef.current + event.deltaY * 0.02));
    }

    activeRenderer.domElement.className = "h-full w-full cursor-grab touch-none";
    activeRenderer.domElement.addEventListener("pointerdown", onPointerDown);
    activeRenderer.domElement.addEventListener("pointermove", onPointerMove);
    activeRenderer.domElement.addEventListener("pointerup", onPointerUp);
    activeRenderer.domElement.addEventListener("pointercancel", onPointerUp);
    activeRenderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      window.cancelAnimationFrame(frame);
      activeRenderer.domElement.removeEventListener("pointerdown", onPointerDown);
      activeRenderer.domElement.removeEventListener("pointermove", onPointerMove);
      activeRenderer.domElement.removeEventListener("pointerup", onPointerUp);
      activeRenderer.domElement.removeEventListener("pointercancel", onPointerUp);
      activeRenderer.domElement.removeEventListener("wheel", onWheel);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });
      activeRenderer.dispose();
      mount.replaceChildren();
    };
  }, [expression, range, resolution, wireframe, zScale]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.76fr_1.24fr]">
      <section className="min-w-0 rounded-[20px] border border-line bg-white p-5 shadow-float sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-brand">{title}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">z = f(x, y)</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              rotationRef.current = { x: -0.62, y: 0.78 };
              zoomRef.current = 18;
              setExpression((current) => `${current} `);
              window.setTimeout(() => setExpression((current) => current.trim()), 0);
            }}
            className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand"
          >
            보기 초기화
          </button>
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-extrabold text-ink">3D 수식</span>
          <input
            value={expression}
            onChange={(event) => setExpression(event.target.value)}
            className="mt-2 h-14 w-full rounded-2xl border border-line bg-paper px-4 font-extrabold text-ink outline-none transition focus:border-brand focus:bg-white"
            placeholder="예: sin(sqrt(x^2+y^2))"
          />
        </label>
        {error && <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-extrabold text-red-600">{error}</p>}

        <div className="mt-4 flex flex-wrap gap-2">
          {threeDPresets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setExpression(preset)}
              className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand"
            >
              {preset}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4">
          <ThreeDRange label="범위" value={range} min={3} max={10} step={0.5} onChange={setRange} />
          <ThreeDRange label="해상도" value={resolution} min={16} max={64} step={2} onChange={setResolution} />
          <ThreeDRange label="높이 배율" value={zScale} min={0.4} max={3} step={0.1} onChange={setZScale} />
          <label className="flex items-center justify-between rounded-2xl bg-paper px-4 py-3">
            <span className="text-sm font-extrabold text-ink">와이어프레임</span>
            <input type="checkbox" checked={wireframe} onChange={(event) => setWireframe(event.target.checked)} />
          </label>
        </div>
      </section>

      <section className="min-w-0 rounded-[20px] border border-line bg-white p-5 shadow-panel sm:p-6">
        <div ref={mountRef} data-testid="three-d-canvas" className="h-[460px] overflow-hidden rounded-[18px] border border-line bg-white" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <GeometryMetric label="최소 z" value={formatGraphNumber(stats.minZ, 3)} />
          <GeometryMetric label="최대 z" value={formatGraphNumber(stats.maxZ, 3)} />
          <GeometryMetric label="원점 z" value={formatGraphNumber(stats.sampleZ, 3)} />
          <GeometryMetric label="표본 점" value={`${stats.validPoints.toLocaleString("ko-KR")}개`} />
        </div>
        <div className="mt-5 rounded-[18px] border border-line bg-paper p-5">
          <p className="text-sm font-extrabold text-ink">해석 포인트</p>
          <div className="mt-4 grid gap-3">
            {checkpoints.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-white px-4 py-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand" />
                <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ThreeDRange({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-2">
      <span className="flex items-center justify-between text-sm font-extrabold text-ink">
        {label}
        <span className="text-slate-400">{formatGraphNumber(value, 2)}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

function drawThreeFallbackCanvas(width: number, height: number, expression: string, range: number, resolution: number, zScale: number, rotation: { x: number; y: number }) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * Math.min(window.devicePixelRatio, 2));
  canvas.height = Math.round(height * Math.min(window.devicePixelRatio, 2));
  canvas.className = "h-full w-full touch-none";
  const context = canvas.getContext("2d");
  const stats: SurfaceStats = { minZ: 0, maxZ: 0, sampleZ: 0, validPoints: 0 };
  if (!context) return { canvas, stats };

  const scale = Math.min(canvas.width, canvas.height) / (range * 4);
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const normalized = normalizeThreeExpression(expression);
  const safeResolution = Math.max(8, Math.min(64, Math.round(resolution)));
  const points: { x: number; y: number; z: number; sx: number; sy: number }[][] = [];
  let minZ = Number.POSITIVE_INFINITY;
  let maxZ = Number.NEGATIVE_INFINITY;
  let validPoints = 0;

  function project(x: number, y: number, z: number) {
    const cosY = Math.cos(rotation.y);
    const sinY = Math.sin(rotation.y);
    const cosX = Math.cos(rotation.x);
    const sinX = Math.sin(rotation.x);
    const rx = x * cosY - y * sinY;
    const ry = x * sinY + y * cosY;
    const rz = z * zScale;
    const py = ry * cosX - rz * sinX;
    return { sx: centerX + rx * scale, sy: centerY + py * scale };
  }

  for (let yi = 0; yi <= safeResolution; yi += 1) {
    const row = [];
    const y = -range + (yi / safeResolution) * range * 2;
    for (let xi = 0; xi <= safeResolution; xi += 1) {
      const x = -range + (xi / safeResolution) * range * 2;
      let z = evaluateSafeThreeExpression(normalized, x, y);
      z = Math.max(-12, Math.min(12, z));
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z);
      validPoints += 1;
      row.push({ x, y, z, ...project(x, y, z) });
    }
    points.push(row);
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = Math.max(1, window.devicePixelRatio);
  context.strokeStyle = "#cbd5e1";
  for (let tick = -range; tick <= range; tick += 1) {
    const a = project(-range, tick, 0);
    const b = project(range, tick, 0);
    const c = project(tick, -range, 0);
    const d = project(tick, range, 0);
    context.beginPath();
    context.moveTo(a.sx, a.sy);
    context.lineTo(b.sx, b.sy);
    context.moveTo(c.sx, c.sy);
    context.lineTo(d.sx, d.sy);
    context.stroke();
  }
  context.strokeStyle = "#0f766e";
  context.lineWidth = Math.max(1.5, window.devicePixelRatio * 1.5);
  points.forEach((row) => drawProjectedLine(context, row));
  for (let xi = 0; xi <= safeResolution; xi += 2) {
    drawProjectedLine(context, points.map((row) => row[xi]));
  }
  context.strokeStyle = "#0f172a";
  context.lineWidth = Math.max(2, window.devicePixelRatio * 2);
  drawProjectedLine(context, [project(-range, 0, 0), project(range, 0, 0)]);
  drawProjectedLine(context, [project(0, -range, 0), project(0, range, 0)]);
  drawProjectedLine(context, [project(0, 0, -range), project(0, 0, range)]);

  return {
    canvas,
    stats: {
      minZ: Number.isFinite(minZ) ? minZ : 0,
      maxZ: Number.isFinite(maxZ) ? maxZ : 0,
      sampleZ: evaluateSafeThreeExpression(normalized, 0, 0),
      validPoints
    }
  };
}

function drawProjectedLine(context: CanvasRenderingContext2D, points: { sx: number; sy: number }[]) {
  if (points.length === 0) return;
  context.beginPath();
  points.forEach((point, index) => {
    if (index === 0) context.moveTo(point.sx, point.sy);
    else context.lineTo(point.sx, point.sy);
  });
  context.stroke();
}

function buildThreeScene(group: THREE.Group, expression: string, range: number, resolution: number, zScale: number, wireframe: boolean) {
  const safeResolution = Math.max(8, Math.min(80, Math.round(resolution)));
  const normalized = normalizeThreeExpression(expression);
  const values: number[] = [];
  let minZ = Number.POSITIVE_INFINITY;
  let maxZ = Number.NEGATIVE_INFINITY;
  let validPoints = 0;
  let error = "";

  for (let yi = 0; yi <= safeResolution; yi += 1) {
    const y = -range + (yi / safeResolution) * range * 2;
    for (let xi = 0; xi <= safeResolution; xi += 1) {
      const x = -range + (xi / safeResolution) * range * 2;
      let z = 0;
      try {
        z = evaluateExpression(normalized, { angleMode: "rad", ans: 0, memory: 0, variables: { x, y } });
      } catch (caught) {
        error = caught instanceof Error ? caught.message : "수식을 확인해 주세요.";
        z = Number.NaN;
      }
      if (!Number.isFinite(z)) z = 0;
      z = Math.max(-12, Math.min(12, z));
      minZ = Math.min(minZ, z);
      maxZ = Math.max(maxZ, z);
      validPoints += 1;
      values.push(z);
    }
  }

  const geometry = new THREE.PlaneGeometry(range * 2, range * 2, safeResolution, safeResolution);
  const positions = geometry.attributes.position;
  for (let index = 0; index < positions.count; index += 1) {
    positions.setZ(index, values[index] * zScale);
  }
  geometry.rotateX(-Math.PI / 2);
  geometry.computeVertexNormals();

  const material = new THREE.MeshStandardMaterial({
    color: "#0f766e",
    metalness: 0.05,
    roughness: 0.48,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.92
  });
  group.add(new THREE.Mesh(geometry, material));

  if (wireframe) {
    const edges = new THREE.WireframeGeometry(geometry);
    group.add(new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: "#0f172a", transparent: true, opacity: 0.24 })));
  }

  addThreeAxes(group, range);
  const sampleZ = evaluateSafeThreeExpression(normalized, 0, 0);
  return {
    error,
    stats: {
      minZ: Number.isFinite(minZ) ? minZ : 0,
      maxZ: Number.isFinite(maxZ) ? maxZ : 0,
      sampleZ,
      validPoints
    }
  };
}

function addThreeAxes(group: THREE.Group, range: number) {
  const axisMaterial = new THREE.LineBasicMaterial({ color: "#334155" });
  const gridMaterial = new THREE.LineBasicMaterial({ color: "#cbd5e1", transparent: true, opacity: 0.75 });
  const makeLine = (points: THREE.Vector3[], material: THREE.LineBasicMaterial) => {
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material));
  };
  makeLine([new THREE.Vector3(-range, 0, 0), new THREE.Vector3(range, 0, 0)], axisMaterial);
  makeLine([new THREE.Vector3(0, -range, 0), new THREE.Vector3(0, range, 0)], axisMaterial);
  makeLine([new THREE.Vector3(0, 0, -range), new THREE.Vector3(0, 0, range)], axisMaterial);
  for (let tick = -range; tick <= range; tick += 1) {
    makeLine([new THREE.Vector3(-range, 0, tick), new THREE.Vector3(range, 0, tick)], gridMaterial);
    makeLine([new THREE.Vector3(tick, 0, -range), new THREE.Vector3(tick, 0, range)], gridMaterial);
  }
}

function normalizeThreeExpression(expression: string) {
  return normalizeGraphExpression(expression.trim().replace(/^z\s*=/i, ""));
}

function evaluateSafeThreeExpression(expression: string, x: number, y: number) {
  try {
    const value = evaluateExpression(expression, { angleMode: "rad", ans: 0, memory: 0, variables: { x, y } });
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

type GraphExpressionRow = {
  id: string;
  expression: string;
  color: string;
};

const graphColors = ["#0f766e", "#2563eb", "#db2777", "#f97316", "#7c3aed", "#0891b2"];
const graphExamples = ["x^2", "sin(x)", "0.5x+1", "sqrt(abs(x))", "log(x)", "x^3-3x"];

function GraphingCalculator({ title, checkpoints }: { title: string; checkpoints: string[] }) {
  const [expressions, setExpressions] = useState<GraphExpressionRow[]>([
    { id: "g1", expression: "x^2", color: graphColors[0] },
    { id: "g2", expression: "sin(x)", color: graphColors[1] }
  ]);
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [yMin, setYMin] = useState(-10);
  const [yMax, setYMax] = useState(10);
  const [traceX, setTraceX] = useState(0);
  const [angleMode, setAngleMode] = useState<"deg" | "rad">("rad");

  const view = useMemo(() => normalizeGraphView(xMin, xMax, yMin, yMax), [xMin, xMax, yMin, yMax]);
  const graph = useMemo(() => buildGraph(expressions, view, angleMode, traceX), [angleMode, expressions, traceX, view]);
  const traceValues = useMemo(
    () => expressions.map((row) => evaluateGraphExpression(row, traceX, angleMode)),
    [angleMode, expressions, traceX]
  );

  function updateExpression(id: string, expression: string) {
    setExpressions((current) => current.map((row) => (row.id === id ? { ...row, expression } : row)));
  }

  function addExpression(expression = "") {
    setExpressions((current) => [
      ...current,
      { id: `g${Date.now()}`, expression, color: graphColors[current.length % graphColors.length] }
    ]);
  }

  function removeExpression(id: string) {
    setExpressions((current) => current.length === 1 ? current : current.filter((row) => row.id !== id));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="min-w-0 overflow-hidden rounded-[20px] border border-line bg-white p-5 shadow-float sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-brand">{title}</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink">수식을 입력하세요</h2>
          </div>
          <button
            type="button"
            onClick={() => setAngleMode((current) => (current === "rad" ? "deg" : "rad"))}
            className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand"
          >
            {angleMode === "rad" ? "Rad" : "Deg"}
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          {expressions.map((row, index) => (
            <div key={row.id} className="grid gap-2 rounded-[18px] border border-line bg-paper p-3">
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                <input
                  value={row.expression}
                  onChange={(event) => updateExpression(row.id, event.target.value)}
                  className="h-12 min-w-0 flex-1 rounded-2xl border border-line bg-white px-4 font-extrabold text-ink outline-none transition focus:border-brand"
                  placeholder="예: y=x^2+2x-1"
                />
                <button
                  type="button"
                  onClick={() => removeExpression(row.id)}
                  className="h-12 rounded-2xl border border-line px-3 text-xs font-extrabold text-slate-500 transition hover:border-red-200 hover:text-red-600 disabled:opacity-40"
                  disabled={expressions.length === 1}
                >
                  삭제
                </button>
              </div>
              {graph.series[index]?.error && <p className="px-2 text-xs font-extrabold text-red-600">{graph.series[index].error}</p>}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => addExpression("x")}
            className="rounded-full bg-brand px-4 py-2 text-sm font-extrabold text-white transition hover:bg-[#029b72]"
          >
            수식 추가
          </button>
          {graphExamples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => addExpression(example)}
              className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand"
            >
              {example}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <GraphRangeInput label="x 최소" value={xMin} onChange={setXMin} />
          <GraphRangeInput label="x 최대" value={xMax} onChange={setXMax} />
          <GraphRangeInput label="y 최소" value={yMin} onChange={setYMin} />
          <GraphRangeInput label="y 최대" value={yMax} onChange={setYMax} />
        </div>

        <label className="mt-5 block">
          <span className="text-sm font-extrabold text-ink">값 추적 x</span>
          <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_120px]">
            <input
              aria-label="값 추적 x 슬라이더"
              type="range"
              min={view.xMin}
              max={view.xMax}
              step={(view.xMax - view.xMin) / 200}
              value={Math.min(Math.max(traceX, view.xMin), view.xMax)}
              onChange={(event) => setTraceX(Number(event.target.value))}
            />
            <input
              type="number"
              value={traceX}
              onChange={(event) => setTraceX(Number(event.target.value))}
              className="h-11 rounded-2xl border border-line bg-paper px-3 font-extrabold text-ink outline-none focus:border-brand"
            />
          </div>
        </label>
      </section>

      <section className="min-w-0 overflow-hidden rounded-[20px] border border-line bg-white p-5 shadow-panel sm:p-6">
        <div className="overflow-hidden rounded-[18px] border border-line bg-white">
          <svg viewBox={`0 0 ${graph.width} ${graph.height}`} role="img" aria-label="함수 그래프" className="h-[360px] w-full bg-white">
            {graph.grid.map((line) => (
              <line key={line.key} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={line.axis ? "#64748b" : "#e2e8f0"} strokeWidth={line.axis ? 2 : 1} />
            ))}
            {graph.xTicks.map((tick) => (
              <text key={`x-${tick.value}`} x={tick.x} y={graph.yAxisLabelY} textAnchor="middle" className="fill-slate-500 text-[11px] font-bold">
                {formatGraphNumber(tick.value, 1)}
              </text>
            ))}
            {graph.yTicks.map((tick) => (
              <text key={`y-${tick.value}`} x={graph.xAxisLabelX} y={tick.y + 4} textAnchor="end" className="fill-slate-500 text-[11px] font-bold">
                {formatGraphNumber(tick.value, 1)}
              </text>
            ))}
            <line x1={graph.traceXPixel} y1={18} x2={graph.traceXPixel} y2={graph.height - 18} stroke="#94a3b8" strokeDasharray="5 5" />
            {graph.series.map((series) => series.paths.map((path, index) => (
              <path key={`${series.id}-${index}`} d={path} fill="none" stroke={series.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            )))}
          </svg>
        </div>

        <div className="mt-5 grid gap-3">
          {traceValues.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-paper px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate text-sm font-extrabold text-ink">{item.expression || "빈 수식"}</span>
              </div>
              <span className={`shrink-0 text-sm font-extrabold ${item.error ? "text-red-600" : "text-brand"}`}>
                {item.error ? "확인 필요" : `y=${formatGraphNumber(item.value, 4)}`}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-[18px] border border-line bg-paper p-5">
          <p className="text-sm font-extrabold text-ink">해석 포인트</p>
          <div className="mt-4 grid gap-3">
            {checkpoints.map((item) => (
              <div key={item} className="flex gap-3 rounded-2xl bg-white px-4 py-4">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-brand" />
                <p className="text-sm font-medium leading-6 text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function GraphRangeInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold text-ink">{label}</span>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-12 rounded-2xl border border-line bg-paper px-4 font-extrabold text-ink outline-none transition focus:border-brand focus:bg-white"
      />
    </label>
  );
}

function formatGraphNumber(value: number, digits: number) {
  if (!Number.isFinite(value)) return "-";
  return Number(value.toFixed(digits)).toLocaleString("ko-KR");
}

function normalizeGraphView(xMin: number, xMax: number, yMin: number, yMax: number) {
  const safeXMin = Number.isFinite(xMin) ? xMin : -10;
  const safeXMax = Number.isFinite(xMax) ? xMax : 10;
  const safeYMin = Number.isFinite(yMin) ? yMin : -10;
  const safeYMax = Number.isFinite(yMax) ? yMax : 10;
  return {
    xMin: Math.min(safeXMin, safeXMax - 0.001),
    xMax: Math.max(safeXMax, safeXMin + 0.001),
    yMin: Math.min(safeYMin, safeYMax - 0.001),
    yMax: Math.max(safeYMax, safeYMin + 0.001)
  };
}

function buildGraph(
  expressions: GraphExpressionRow[],
  view: ReturnType<typeof normalizeGraphView>,
  angleMode: "deg" | "rad",
  traceX: number,
  variables: Record<string, number> = {}
) {
  const width = 720;
  const height = 440;
  const padding = 32;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;
  const toX = (x: number) => padding + ((x - view.xMin) / (view.xMax - view.xMin)) * plotWidth;
  const toY = (y: number) => padding + (1 - (y - view.yMin) / (view.yMax - view.yMin)) * plotHeight;
  const xTicks = makeTicks(view.xMin, view.xMax).map((value) => ({ value, x: toX(value) }));
  const yTicks = makeTicks(view.yMin, view.yMax).map((value) => ({ value, y: toY(value) }));
  const grid = [
    ...xTicks.map((tick) => ({ key: `vx-${tick.value}`, x1: tick.x, y1: padding, x2: tick.x, y2: height - padding, axis: Math.abs(tick.value) < 1e-9 })),
    ...yTicks.map((tick) => ({ key: `hy-${tick.value}`, x1: padding, y1: tick.y, x2: width - padding, y2: tick.y, axis: Math.abs(tick.value) < 1e-9 }))
  ];
  const series = expressions.map((row) => {
    const verticalMatch = row.expression.trim().match(/^x\s*=\s*(.+)$/i);
    if (verticalMatch) {
      try {
        const x = evaluateExpression(normalizeGraphExpression(verticalMatch[1]), { angleMode, ans: 0, memory: 0, variables });
        const paths = Number.isFinite(x) && x >= view.xMin && x <= view.xMax
          ? [`M ${toX(x).toFixed(2)} ${toY(view.yMin).toFixed(2)} L ${toX(x).toFixed(2)} ${toY(view.yMax).toFixed(2)}`]
          : [];
        return { id: row.id, color: row.color, paths, error: paths.length === 0 ? "그래프 범위 안에서 그릴 수 있는 점이 없습니다." : "" };
      } catch {
        return { id: row.id, color: row.color, paths: [], error: "수식을 확인해 주세요." };
      }
    }
    const sampled = Array.from({ length: 260 }, (_, index) => {
      const x = view.xMin + (index / 259) * (view.xMax - view.xMin);
      try {
        const y = evaluateExpression(normalizeGraphExpression(row.expression), { angleMode, ans: 0, memory: 0, variables: { ...variables, x } });
        return { x, y, valid: Number.isFinite(y) && y >= view.yMin && y <= view.yMax };
      } catch {
        return { x, y: Number.NaN, valid: false };
      }
    });
    const paths = pointsToPaths(sampled, toX, toY);
    return { id: row.id, color: row.color, paths, error: row.expression.trim() && paths.length === 0 ? "그래프 범위 안에서 그릴 수 있는 점이 없습니다." : "" };
  });
  const traceXPixel = toX(Math.min(Math.max(traceX, view.xMin), view.xMax));
  return {
    width,
    height,
    grid,
    xTicks,
    yTicks,
    series,
    traceXPixel,
    xAxisLabelX: padding - 6,
    yAxisLabelY: Math.min(Math.max(toY(0) + 18, padding + 14), height - 8),
    toX,
    toY
  };
}

function makeTicks(min: number, max: number) {
  const span = max - min;
  const step = niceStep(span / 6);
  const first = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let value = first; value <= max + step * 0.5; value += step) ticks.push(Number(value.toFixed(10)));
  return ticks;
}

function niceStep(raw: number) {
  const power = 10 ** Math.floor(Math.log10(Math.max(raw, 1e-9)));
  const fraction = raw / power;
  if (fraction <= 1) return power;
  if (fraction <= 2) return 2 * power;
  if (fraction <= 5) return 5 * power;
  return 10 * power;
}

function pointsToPaths(points: { x: number; y: number; valid: boolean }[], toX: (x: number) => number, toY: (y: number) => number) {
  const paths: string[] = [];
  let current = "";
  points.forEach((point) => {
    if (!point.valid) {
      if (current) paths.push(current);
      current = "";
      return;
    }
    const command = current ? "L" : "M";
    current += `${command} ${toX(point.x).toFixed(2)} ${toY(point.y).toFixed(2)} `;
  });
  if (current) paths.push(current);
  return paths;
}

function evaluateGraphExpression(row: GraphExpressionRow, x: number, angleMode: "deg" | "rad") {
  try {
    const value = evaluateExpression(normalizeGraphExpression(row.expression), { angleMode, ans: 0, memory: 0, variables: { x } });
    return { ...row, value, error: Number.isFinite(value) ? "" : "계산 불가" };
  } catch {
    return { ...row, value: Number.NaN, error: "수식 확인" };
  }
}

function normalizeGraphExpression(expression: string) {
  let normalized = expression
    .trim()
    .replace(/^y\s*=/i, "")
    .replace(/^[a-z]\s*\(\s*x\s*\)\s*=/i, "")
    .replaceAll("π", "pi")
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("√(", "sqrt(");
  const functions = "sin|cos|tan|asin|acos|atan|log|ln|sqrt|cbrt|abs|floor|ceil|round|root";
  normalized = normalized
    .replace(new RegExp(`(\\d|\\)|x|y|pi|e)(?=(${functions})\\()`, "gi"), "$1*")
    .replace(/(\d|\)|x|y|pi|e)(?=(x|y|pi|e|\())/gi, "$1*");
  return normalized;
}

type ExpressionContext = {
  angleMode: "deg" | "rad";
  ans: number;
  memory: number;
  variables?: Record<string, number>;
};

type Token =
  | { type: "number"; value: number }
  | { type: "name"; value: string }
  | { type: "operator"; value: string }
  | { type: "paren"; value: "(" | ")" }
  | { type: "comma"; value: "," };

function formatCalculatorResult(value: number) {
  if (!Number.isFinite(value)) return "계산 불가";
  const rounded = Math.abs(value) >= 1e12 || (Math.abs(value) > 0 && Math.abs(value) < 1e-8)
    ? value.toExponential(8)
    : Number(value.toFixed(10)).toString();
  return rounded.replace(/\.?0+e/, "e");
}

function evaluateExpression(expression: string, context: ExpressionContext) {
  const tokens = tokenizeExpression(expression);
  let index = 0;

  function peek() {
    return tokens[index];
  }

  function consume() {
    return tokens[index++];
  }

  function parseExpression(): number {
    let value = parseTerm();
    while (peek()?.type === "operator" && (peek().value === "+" || peek().value === "-")) {
      const operator = consume().value;
      const right = parseTerm();
      value = operator === "+" ? value + right : value - right;
    }
    return value;
  }

  function parseTerm(): number {
    let value = parsePower();
    while (isOperator(peek(), ["*", "/", "%"])) {
      const operator = consume().value;
      const right = parsePower();
      if (operator === "*") value *= right;
      if (operator === "/") value /= right;
      if (operator === "%") value %= right;
    }
    return value;
  }

  function parsePower(): number {
    const value = parseUnary();
    if (peek()?.type === "operator" && peek().value === "^") {
      consume();
      return value ** parsePower();
    }
    return value;
  }

  function parseUnary(): number {
    if (peek()?.type === "operator" && peek().value === "+") {
      consume();
      return parseUnary();
    }
    if (peek()?.type === "operator" && peek().value === "-") {
      consume();
      return -parseUnary();
    }
    let value = parsePrimary();
    while (peek()?.type === "operator" && peek().value === "!") {
      consume();
      value = factorial(value);
    }
    return value;
  }

  function parsePrimary(): number {
    const token = consume();
    if (!token) throw new Error("수식이 끝났습니다.");
    if (token.type === "number") return token.value;
    if (token.type === "paren" && token.value === "(") {
      const value = parseExpression();
      const close = consume();
      if (close?.type !== "paren" || close.value !== ")") throw new Error("닫는 괄호가 필요합니다.");
      return value;
    }
    if (token.type === "name") {
      const name = token.value.toLowerCase();
      if (name === "pi") return Math.PI;
      if (name === "e") return Math.E;
      if (name === "ans") return context.ans;
      if (name === "m") return context.memory;
      if (context.variables && name in context.variables) return context.variables[name];
      const open = consume();
      if (open?.type !== "paren" || open.value !== "(") throw new Error(`${token.value} 함수에는 괄호가 필요합니다.`);
      const first = parseExpression();
      let second: number | undefined;
      if (peek()?.type === "comma") {
        consume();
        second = parseExpression();
      }
      const close = consume();
      if (close?.type !== "paren" || close.value !== ")") throw new Error("닫는 괄호가 필요합니다.");
      return applyFunction(name, first, second, context.angleMode);
    }
    throw new Error("수식을 확인해 주세요.");
  }

  const value = parseExpression();
  if (index < tokens.length) throw new Error("처리하지 못한 수식이 있습니다.");
  return value;
}

function isOperator(token: Token | undefined, operators: string[]) {
  return token?.type === "operator" && operators.includes(token.value);
}

function tokenizeExpression(expression: string): Token[] {
  const tokens: Token[] = [];
  let index = 0;
  while (index < expression.length) {
    const char = expression[index];
    if (/\s/.test(char)) {
      index += 1;
      continue;
    }
    if (/[0-9.]/.test(char)) {
      let raw = "";
      while (index < expression.length && /[0-9.eE]/.test(expression[index])) {
        raw += expression[index];
        index += 1;
        if ((expression[index - 1] === "e" || expression[index - 1] === "E") && /[+-]/.test(expression[index])) {
          raw += expression[index];
          index += 1;
        }
      }
      const value = Number(raw);
      if (!Number.isFinite(value)) throw new Error(`숫자 ${raw}를 확인해 주세요.`);
      tokens.push({ type: "number", value });
      continue;
    }
    if (/[A-Za-z]/.test(char)) {
      let raw = "";
      while (index < expression.length && /[A-Za-z]/.test(expression[index])) {
        raw += expression[index];
        index += 1;
      }
      tokens.push({ type: "name", value: raw });
      continue;
    }
    if ("+-*/%^!".includes(char)) {
      tokens.push({ type: "operator", value: char });
      index += 1;
      continue;
    }
    if (char === "(" || char === ")") {
      tokens.push({ type: "paren", value: char });
      index += 1;
      continue;
    }
    if (char === ",") {
      tokens.push({ type: "comma", value: char });
      index += 1;
      continue;
    }
    throw new Error(`${char} 문자는 사용할 수 없습니다.`);
  }
  return tokens;
}

function applyFunction(name: string, first: number, second: number | undefined, angleMode: "deg" | "rad") {
  const toRadians = (value: number) => angleMode === "deg" ? value * Math.PI / 180 : value;
  const fromRadians = (value: number) => angleMode === "deg" ? value * 180 / Math.PI : value;
  if (name === "sin") return Math.sin(toRadians(first));
  if (name === "cos") return Math.cos(toRadians(first));
  if (name === "tan") return Math.tan(toRadians(first));
  if (name === "asin") return fromRadians(Math.asin(first));
  if (name === "acos") return fromRadians(Math.acos(first));
  if (name === "atan") return fromRadians(Math.atan(first));
  if (name === "log") return Math.log10(first);
  if (name === "ln") return Math.log(first);
  if (name === "sqrt") return Math.sqrt(first);
  if (name === "cbrt") return Math.cbrt(first);
  if (name === "abs") return Math.abs(first);
  if (name === "floor") return Math.floor(first);
  if (name === "ceil") return Math.ceil(first);
  if (name === "round") return Math.round(first);
  if (name === "root") {
    if (second === undefined) throw new Error("root에는 두 값이 필요합니다. 예: root(3, 27)");
    return Math.sign(second) * Math.abs(second) ** (1 / first);
  }
  throw new Error(`${name} 함수는 지원하지 않습니다.`);
}

function factorial(value: number) {
  const integer = Math.floor(value);
  if (integer !== value || integer < 0 || integer > 170) throw new Error("계승은 0 이상 170 이하의 정수만 지원합니다.");
  return Array.from({ length: integer }, (_, index) => index + 1).reduce((total, next) => total * next, 1);
}

function formatInputValue(
  field: ReturnType<typeof getCalculatorBySlug>["fields"][number],
  value: number
) {
  if (!Number.isFinite(value)) return "-";
  if (field.type === "select") {
    return field.options?.find((option) => option.value === value)?.label ?? String(value);
  }

  const formatted = Number.isInteger(value)
    ? value.toLocaleString("ko-KR")
    : value.toLocaleString("ko-KR", { maximumFractionDigits: 2 });

  return field.unit ? `${formatted}${field.unit}` : formatted;
}
