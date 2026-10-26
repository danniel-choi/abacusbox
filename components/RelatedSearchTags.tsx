import Link from "next/link";

const RELATED_SEARCH_TAGS = [
  { href: "/calculators", label: "계산기 모음" },
  { href: "/calculators/minimum-wage", label: "최저임금 계산기" },
  { href: "/calculators/net-salary", label: "실수령액 계산기" },
  { href: "/calculators/severance", label: "퇴직금 계산기" },
  { href: "/calculators/year-end-tax-settlement", label: "연말정산 계산기" },
  { href: "/calculators/loan-interest", label: "대출 계산기" },
  { href: "/calculators/lotto-probability", label: "복권 당첨 확률" },
  { href: "/calculators/lightning-strike-probability", label: "번개 맞을 확률" },
  { href: "/daily", label: "생활 계산기" },
  { href: "/tax", label: "세금 계산기" },
  { href: "/labor", label: "급여 계산기" },
  { href: "/loan", label: "금융 계산기" }
];

export function RelatedSearchTags() {
  return (
    <section className="rounded-2xl border border-line bg-white px-4 py-4" aria-labelledby="related-search-tags-title">
      <h2 id="related-search-tags-title" className="text-sm font-extrabold text-ink">연관 검색어</h2>
      <p className="mt-1 text-sm font-medium leading-6 text-slate-600">
        계산의정석에서 자주 찾는 계산기와 분야별 검색어를 바로 확인하세요.
      </p>
      <nav aria-label="계산의정석 연관 검색어" className="mt-3 flex flex-wrap gap-2">
        {RELATED_SEARCH_TAGS.map((tag) => (
          <Link
            key={tag.href}
            href={tag.href}
            className="rounded-full border border-line bg-paper px-3 py-2 text-xs font-extrabold text-brand transition hover:border-brand hover:bg-white hover:text-ink"
          >
            {tag.label}
          </Link>
        ))}
      </nav>
    </section>
  );
}
