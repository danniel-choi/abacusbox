"use client";

import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

type Token = number | "+" | "-" | "*" | "/" | "%" | "(" | ")";

function tokenize(source: string): Token[] {
  const normalized = source.replace(/[×x]/gi, "*").replace(/[÷]/g, "/").replace(/,/g, "").trim();
  const tokens: Token[] = [];
  let index = 0;

  while (index < normalized.length) {
    const character = normalized[index];
    if (/\s/.test(character)) {
      index += 1;
      continue;
    }
    if (/[0-9.]/.test(character)) {
      const match = normalized.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)/);
      if (!match) throw new Error("잘못된 숫자");
      tokens.push(Number(match[0]));
      index += match[0].length;
      continue;
    }
    if (["+", "-", "*", "/", "%", "(", ")"].includes(character)) {
      tokens.push(character as Exclude<Token, number>);
      index += 1;
      continue;
    }
    throw new Error("지원하지 않는 문자");
  }

  return tokens;
}

function evaluateExpression(source: string): number {
  const tokens = tokenize(source);
  let position = 0;

  function parseExpression(): number {
    let value = parseTerm();
    while (tokens[position] === "+" || tokens[position] === "-") {
      const operator = tokens[position++];
      const right = parseTerm();
      value = operator === "+" ? value + right : value - right;
    }
    return value;
  }

  function parseTerm(): number {
    let value = parseFactor();
    while (tokens[position] === "*" || tokens[position] === "/") {
      const operator = tokens[position++];
      const right = parseFactor();
      if (operator === "/" && right === 0) throw new Error("0으로 나눌 수 없습니다.");
      value = operator === "*" ? value * right : value / right;
    }
    return value;
  }

  function parseFactor(): number {
    const token = tokens[position++];
    if (token === "+") return parseFactor();
    if (token === "-") return -parseFactor();
    let value: number;
    if (token === "(") {
      value = parseExpression();
      if (tokens[position++] !== ")") throw new Error("괄호를 확인하세요.");
    } else if (typeof token === "number") {
      value = token;
    } else {
      throw new Error("수식을 확인하세요.");
    }
    while (tokens[position] === "%") {
      position += 1;
      value /= 100;
    }
    return value;
  }

  if (!tokens.length) throw new Error("수식을 입력하세요.");
  const result = parseExpression();
  if (position !== tokens.length || !Number.isFinite(result)) throw new Error("수식을 확인하세요.");
  return result;
}

function formatResult(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "en" ? "en-US" : locale === "ja" ? "ja-JP" : "ko-KR", {
    maximumFractionDigits: 12
  }).format(value);
}

export function HomeFormulaCalculator({ trigger = "desktop" }: { trigger?: "desktop" | "mobile" }) {
  const { locale } = useLanguage();
  const [open, setOpen] = useState(false);
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const labels = useMemo(() => {
    if (locale === "en") return { eyebrow: "QUICK TOOL", title: "Basic formula calculator", clear: "Clear", calculate: "Calculate" };
    if (locale === "ja") return { eyebrow: "すぐ使える計算機", title: "基本式計算機", clear: "クリア", calculate: "計算" };
    return { eyebrow: "바로 쓰는 계산기", title: "기본 수식 계산기", clear: "지우기", calculate: "계산" };
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  function calculate() {
    try {
      setResult(formatResult(evaluateExpression(expression), locale));
      setError(null);
    } catch (calculationError) {
      setResult(null);
      setError(calculationError instanceof Error ? calculationError.message : "수식을 확인하세요.");
    }
  }

  function append(value: string) {
    setExpression((current) => `${current}${value}`);
    setResult(null);
    setError(null);
  }

  function clear() {
    setExpression("");
    setResult(null);
    setError(null);
  }

  const isMobile = trigger === "mobile";

  return (
    <>
      <button
        type="button"
        aria-label={labels.title}
        onClick={() => setOpen(true)}
        className={isMobile
          ? "inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-brand/40 bg-white text-ink transition hover:border-brand hover:bg-brand hover:text-white md:hidden"
          : "hidden min-h-12 items-center rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white/88 transition hover:border-brand hover:text-brand md:inline-flex"}
      >
        {isMobile ? (
          <>
            <span className="sr-only">{labels.title}</span>
            <span aria-hidden="true" className="text-lg font-black">＋÷</span>
          </>
        ) : labels.title}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ink/75 px-4 py-6 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-formula-calculator-title"
            className="max-h-[calc(100dvh-3rem)] w-full max-w-md overflow-y-auto rounded-[28px] border border-line bg-white p-5 text-ink shadow-float md:p-6"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-extrabold text-brand">{labels.eyebrow}</p>
                <h2 id="home-formula-calculator-title" className="mt-1 text-2xl font-extrabold">{labels.title}</h2>
              </div>
              <button type="button" aria-label={locale === "en" ? "Close" : locale === "ja" ? "閉じる" : "닫기"} onClick={() => setOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-paper text-xl font-bold text-slate-500 transition hover:bg-brand/10 hover:text-brand">×</button>
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                calculate();
              }}
            >
              <label htmlFor={`home-formula-expression-${trigger}`} className="sr-only">{labels.title}</label>
              <input
                id={`home-formula-expression-${trigger}`}
                value={expression}
                onChange={(event) => {
                  setExpression(event.target.value);
                  setResult(null);
                  setError(null);
                }}
                inputMode="decimal"
                autoFocus
                placeholder="예: (12500 + 3500) ÷ 2"
                className="h-12 w-full rounded-xl border border-line bg-paper px-4 text-right text-lg font-extrabold outline-none transition focus:border-brand"
                aria-describedby={`home-formula-result-${trigger}`}
              />
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[
                  { key: "(", label: "(" },
                  { key: ")", label: ")" },
                  { key: "%", label: "%" },
                  { key: "AC", label: "AC", action: "clear" },
                  { key: "7", label: "7" },
                  { key: "8", label: "8" },
                  { key: "9", label: "9" },
                  { key: "÷", label: "÷" },
                  { key: "4", label: "4" },
                  { key: "5", label: "5" },
                  { key: "6", label: "6" },
                  { key: "×", label: "×" },
                  { key: "1", label: "1" },
                  { key: "2", label: "2" },
                  { key: "3", label: "3" },
                  { key: "-", label: "−" },
                  { key: "0", label: "0" },
                  { key: ".", label: "." },
                  { key: "=", label: "=", action: "calculate" },
                  { key: "+", label: "+" }
                ].map(({ key, label, action }) => (
                  <button
                    key={key}
                    type={action === "calculate" ? "submit" : "button"}
                    onClick={action === "clear" ? clear : action === "calculate" ? undefined : () => append(key)}
                    className={`h-11 rounded-xl border text-sm font-extrabold transition ${action === "calculate" ? "border-brand bg-brand text-white hover:bg-[#029b72]" : action === "clear" ? "border-line bg-slate-200 text-ink hover:border-brand hover:text-brand" : ["÷", "×", "-", "+"].includes(key) ? "border-line bg-slate-100 text-ink hover:border-brand hover:text-brand" : "border-line bg-white text-ink hover:border-brand hover:text-brand"}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <p id={`home-formula-result-${trigger}`} aria-live="polite" className={`mt-3 min-h-7 text-right text-xl font-black ${error ? "text-rose-600" : "text-ink"}`}>
                {error || (result !== null ? `= ${result}` : "")}
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
