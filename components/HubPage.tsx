import Link from "next/link";
import { getCalculatorsByGroup } from "@/lib/calculator-directory";
import { calculators, type CalculatorConfig } from "@/lib/calculators";
import { blogPosts, type BlogPost } from "@/lib/content";
import type { HubContent } from "@/lib/hub-content";

export function HubPage({ hub }: { hub: HubContent }) {
  const groupCalculators = getCalculatorsByGroup(hub.group);
  const featured = hub.featuredSlugs
    .map((slug) => calculators.find((calculator) => calculator.slug === slug))
    .filter((calculator): calculator is CalculatorConfig => Boolean(calculator));
  const posts = hub.blogSlugs
    .map((slug) => blogPosts.find((post) => post.slug === slug))
    .filter((post): post is BlogPost => Boolean(post));

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-[28px] bg-ink px-6 py-10 text-white shadow-panel">
        <p className="text-sm font-extrabold text-brand">{hub.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight md:text-5xl">{hub.title}</h1>
        <p className="mt-4 max-w-3xl text-sm font-medium leading-7 text-white/72 md:text-base">{hub.description}</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href={`/calculators?group=${hub.group}`} className="rounded-full bg-brand px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#029b72]">
            계산기 전체 보기
          </Link>
          <Link href="/blog" className="rounded-full border border-white/15 px-5 py-3 text-sm font-extrabold text-white/88 transition hover:border-brand hover:text-brand">
            관련 글 보기
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {hub.sections.map((section) => (
          <article key={section.title} className="rounded-[24px] border border-line bg-white p-6 shadow-panel">
            <h2 className="text-lg font-extrabold leading-7 text-ink">{section.title}</h2>
            <p className="mt-3 text-sm font-medium leading-7 text-slate-600">{section.body}</p>
          </article>
        ))}
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)]">
        <div className="rounded-[28px] border border-line bg-white p-6 shadow-panel">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-brand">추천 계산기</p>
              <h2 className="mt-2 text-2xl font-extrabold text-ink">먼저 확인하면 좋은 도구</h2>
            </div>
            <Link href={`/calculators?group=${hub.group}`} className="text-sm font-extrabold text-brand">
              {groupCalculators.length}개 전체 보기
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {featured.map((calculator) => (
              <Link
                key={calculator.slug}
                href={`/calculators/${calculator.slug}`}
                className="rounded-[22px] border border-line bg-paper p-5 transition hover:border-brand hover:bg-white"
              >
                <p className="text-xs font-extrabold text-brand">{calculator.badge}</p>
                <h3 className="mt-2 text-lg font-extrabold text-ink">{calculator.title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{calculator.description}</p>
              </Link>
            ))}
          </div>
        </div>

        <aside className="rounded-[28px] bg-navy p-6 text-white shadow-panel">
          <p className="text-sm font-extrabold text-brand">점검 체크리스트</p>
          <h2 className="mt-2 text-2xl font-extrabold">계산 전 확인할 것</h2>
          <div className="mt-5 grid gap-3">
            {hub.checklist.map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm font-semibold leading-6 text-white/82">
                {item}
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-8 rounded-[28px] border border-line bg-white p-6 shadow-panel">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-extrabold text-brand">관련 해설</p>
            <h2 className="mt-2 text-2xl font-extrabold text-ink">계산 결과를 이해하는 글</h2>
          </div>
          <Link href="/blog" className="text-sm font-extrabold text-brand">
            블로그 전체 보기
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/post?slug=${post.slug}`}
              className="rounded-[22px] border border-line bg-paper p-5 transition hover:border-brand hover:bg-white"
            >
              <p className="text-xs font-extrabold text-brand">{post.category}</p>
              <h3 className="mt-2 text-lg font-extrabold leading-7 text-ink">{post.title}</h3>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
