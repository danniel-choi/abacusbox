import Link from "next/link";
import { calculators } from "@/lib/calculators";
import {
  CALCULATOR_GROUP_META,
  getCalculatorsByGroup,
  getFeaturedCalculators,
  getPopularCalculators,
  getRecentCalculators
} from "@/lib/calculator-directory";
import { getLatestBlogPosts } from "@/lib/content";
import { legalStandards } from "@/lib/constants";
import { formatWon } from "@/lib/format";
import { CalculatorDirectoryClient } from "@/components/CalculatorDirectoryClient";
import { HomeBlogRoller } from "@/components/HomeBlogRoller";
import { Logo } from "@/components/Logo";
import { RecentCalculatorsSection } from "@/components/RecentCalculatorsSection";

export default function HomePage() {
  const featured = getFeaturedCalculators().slice(0, 4);
  const popular = getPopularCalculators();
  const recent = getRecentCalculators();
  const latestBlogPosts = getLatestBlogPosts(3);
  const groups = Object.entries(CALCULATOR_GROUP_META).map(([key, meta]) => ({
    key,
    ...meta,
    count: getCalculatorsByGroup(key as keyof typeof CALCULATOR_GROUP_META).length
  }));

  return (
    <main className="pb-4">
      <section className="bg-ink text-white">
        <div className="page-shell grid gap-10 pb-14 pt-10 md:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] md:items-center md:pb-20 md:pt-14">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-bold text-brand">
              2026년 기준 {calculators.length}개 계산기·수학 도구 디렉토리
            </p>
            <h1 className="max-w-3xl text-[clamp(2.15rem,10vw,3.75rem)] font-extrabold leading-tight md:text-6xl">계산의정석</h1>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-white/68 md:mt-5 md:text-lg md:leading-8">
              복잡한 기준과 숫자를 빠르게 정리할 수 있도록 노무, 금융, 절세, 생활, 사업, 수학 도구를 한곳에 모았습니다.
              계산 결과만 끝내지 않고, 비교와 기준 설명까지 한 흐름으로 확인할 수 있게 구성했습니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#directory" className="min-h-12 w-full rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b72] sm:w-auto">
                계산기 찾기
              </Link>
              <Link href="/calculators" className="min-h-12 w-full rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white/88 transition hover:border-brand hover:text-brand sm:w-auto">
                전체 계산기 보기
              </Link>
              <Link href="#sources" className="min-h-12 w-full rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white/88 transition hover:border-brand hover:text-brand sm:w-auto">
                기준 출처 확인
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <HeroStat label="운영 계산기" value={`${calculators.length}개`} />
              <HeroStat label="계산기 그룹" value={`${Object.keys(CALCULATOR_GROUP_META).length}개`} />
              <HeroStat label="반영 기준연도" value={`${legalStandards.year}년`} />
            </div>
          </div>
          <div className="grid gap-4 self-stretch">
            <div className="rounded-[28px] border border-white/10 bg-white p-5 text-ink shadow-float md:p-6">
              <div className="mb-5 flex items-center justify-between">
                <Logo />
                <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-extrabold text-brand">LIVE</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Metric label="2026 최저시급" value={formatWon(legalStandards.minimumWage)} compact />
                <Metric label="월 환산액 209시간" value={formatWon(legalStandards.minimumMonthlyWage209h)} compact />
                <Metric label="건강보험료율" value="7.19%" compact />
              </div>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {featured.map((calculator) => (
                  <Link
                    key={calculator.slug}
                    href={`/calculators/${calculator.slug}`}
                    className="flex h-full flex-col justify-between rounded-2xl border border-line bg-paper px-4 py-4 text-left transition hover:border-brand hover:bg-white"
                  >
                    <p className="text-xs font-extrabold text-brand">{calculator.badge}</p>
                    <h3 className="mt-2 text-base font-extrabold text-ink">{calculator.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{calculator.audience}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-2 md:py-3">
        <div className="rounded-[28px] border border-line bg-white p-5 shadow-panel md:p-6">
          <div className="section-heading mb-4">
            <div>
              <p className="text-sm font-extrabold text-brand">빠른 진입</p>
              <h2 className="mt-1 text-xl font-extrabold text-ink md:text-2xl">분야별 계산기 바로가기</h2>
            </div>
            <Link href="/calculators" className="text-sm font-extrabold text-brand transition hover:text-ink">
              전체 보기 ↗
            </Link>
          </div>
          <div className="grid gap-3 xl:grid-cols-6">
            {groups.map((group) => (
              <Link
                key={group.key}
                href={`/calculators?group=${group.key}`}
                className="flex h-full rounded-[22px] border border-line bg-paper px-4 py-4 text-left transition hover:border-brand hover:bg-white"
              >
                <div className="flex w-full flex-col justify-between gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-extrabold text-brand">
                      {group.icon} {group.label}
                    </p>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-extrabold text-slate-600">{group.count}개</span>
                  </div>
                  <p className="text-sm font-medium leading-6 text-slate-600">{group.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RecentCalculatorsSection />

      <section id="directory" className="page-shell section-shell">
        <CalculatorDirectoryClient compact />
      </section>

      <section className="page-shell py-2 md:py-3">
        <div className="grid gap-6 lg:grid-cols-2">
          <MiniCalculatorSection title="많이 찾는 계산기" items={popular} />
          <MiniCalculatorSection title="새로 추가된 계산기" items={recent} />
        </div>
      </section>

      <section className="page-shell section-shell">
        <div className="section-heading mb-6">
          <div>
            <p className="text-sm font-extrabold text-brand">이용 흐름</p>
            <h2 className="mt-2 text-2xl font-extrabold leading-tight text-ink md:text-3xl">필요한 계산에서 기준 확인까지 한 흐름으로 이어집니다.</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <ProcessCard step="01" title="계산기 찾기" text="검색어, 분야, 그룹 기준으로 필요한 계산기를 먼저 좁힙니다." />
          <ProcessCard step="02" title="바로 계산" text="급여, 금리, 기간, 세율 같은 실제 입력값으로 바로 결과를 확인합니다." />
          <ProcessCard step="03" title="근거까지 검토" text="FAQ, 기준 설명, 관련 계산기까지 이어서 보고 판단 정확도를 높입니다." />
        </div>
      </section>

      <section className="page-shell section-shell">
        <div className="rounded-[28px] border border-line bg-white p-6 shadow-panel">
          <div className="section-heading mb-5">
            <div>
              <p className="text-sm font-extrabold text-brand">사이트 안내</p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight text-ink md:text-3xl">계산 도구와 해설 콘텐츠를 함께 제공합니다.</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { title: "고유 콘텐츠", text: "각 계산기마다 입력 기준, 결과 해석, FAQ, 관련 계산기를 함께 제공합니다." },
              { title: "명확한 탐색", text: "상단 메뉴, 계산기 디렉토리, 그룹 필터, 사이트맵으로 주요 페이지를 찾을 수 있습니다." },
              { title: "정책 공개", text: "소개, 운영 원칙, 개인정보처리방침, 이용약관, 문의 페이지를 공개합니다." },
              { title: "지속 갱신", text: "제도 변경과 사용자 제보를 반영해 계산식과 설명을 점검합니다." }
            ].map((item) => (
              <div key={item.title} className="rounded-[20px] bg-paper p-5">
                <h3 className="text-base font-extrabold text-ink">{item.title}</h3>
                <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/about" className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand">서비스 소개</Link>
            <Link href="/editorial-policy" className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand">운영 원칙</Link>
            <Link href="/privacy" className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand">개인정보처리방침</Link>
            <Link href="/terms" className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand">이용약관</Link>
            <Link href="/contact" className="rounded-full border border-line px-4 py-2 text-sm font-extrabold text-slate-600 transition hover:border-brand hover:text-brand">문의</Link>
          </div>
        </div>
      </section>

      <section id="sources" className="page-shell pb-16">
        <div className="rounded-[28px] bg-navy p-6 text-white shadow-panel">
          <p className="text-sm font-extrabold text-brand">신뢰 기준</p>
          <h2 className="mt-2 text-2xl font-extrabold leading-tight md:text-3xl">공식 기준을 바탕으로 구성했습니다.</h2>
          <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-white/70">
            계산 결과는 참고용 추정치이지만, 반영 기준은 공식 기관 고시와 제도 안내를 바탕으로 관리합니다.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              "최저임금, 고용보험, 국민연금, 건강보험 등 공식 기준 반영",
              "계산 결과와 함께 제도 설명·주의 포인트 동시 제공",
              "검색·필터·정렬 구조로 계산기 탐색 효율 강화",
              "노무·금융·절세·생활·사업 계산기를 한 브랜드 안에 통합"
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-white/82">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-6 pb-16">
        <div className="rounded-[28px] border border-line bg-white p-6 shadow-panel">
          <div className="section-heading">
            <div>
              <p className="text-sm font-extrabold text-brand">블로그</p>
              <h2 className="mt-2 text-2xl font-extrabold leading-tight md:text-3xl text-ink">계산과 연결되는 해설 콘텐츠</h2>
            </div>
            <Link href="/blog" className="text-sm font-extrabold text-brand">
              전체 보기 ↗
            </Link>
          </div>
          <HomeBlogRoller posts={latestBlogPosts} />
        </div>
        <div className="flex justify-end">
          <Link
            href="/admin"
            aria-label="관리자 페이지"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.9">
              <circle cx="12" cy="12" r="3.2" />
              <path strokeLinecap="round" d="M12 2.75v2.1" />
              <path strokeLinecap="round" d="M12 19.15v2.1" />
              <path strokeLinecap="round" d="M21.25 12h-2.1" />
              <path strokeLinecap="round" d="M4.85 12h-2.1" />
              <path strokeLinecap="round" d="M18.54 5.46l-1.49 1.49" />
              <path strokeLinecap="round" d="M6.95 17.05l-1.49 1.49" />
              <path strokeLinecap="round" d="M18.54 18.54l-1.49-1.49" />
              <path strokeLinecap="round" d="M6.95 6.95L5.46 5.46" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value, compact = false }: { label: string; value: string; compact?: boolean }) {
  return (
    <div className={`rounded-2xl border border-line bg-white px-4 ${compact ? "py-4" : "py-4"}`}>
      <span className="block text-sm font-bold text-slate-500">{label}</span>
      <strong className={`mt-2 block font-extrabold text-ink ${compact ? "text-lg leading-6" : "text-xl"}`}>{value}</strong>
    </div>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4">
      <p className="text-sm font-bold text-white/60">{label}</p>
      <p className="mt-2 text-2xl font-extrabold text-white">{value}</p>
    </div>
  );
}

function ProcessCard({ step, title, text }: { step: string; title: string; text: string }) {
  return (
    <div className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
      <p className="text-sm font-extrabold text-brand">{step}</p>
      <h3 className="mt-3 text-xl font-extrabold text-ink">{title}</h3>
      <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function MiniCalculatorSection({
  title,
  items
}: {
  title: string;
  items: typeof calculators;
}) {
  return (
    <div className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold text-ink">{title}</h2>
        <Link href="/calculators" className="text-sm font-extrabold text-brand">
          전체 보기 ↗
        </Link>
      </div>
      <div className="mt-4 grid gap-2">
        {items.map((calculator) => (
          <Link
            key={calculator.slug}
            href={`/calculators/${calculator.slug}`}
            className="flex items-center justify-between rounded-2xl bg-paper px-4 py-3 transition hover:bg-white"
          >
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold text-ink">{calculator.title}</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">{calculator.audience}</span>
            </span>
            <span className="ml-3 text-sm font-extrabold text-brand">↗</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
