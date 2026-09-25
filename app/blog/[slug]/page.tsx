import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost, getLatestBlogPosts } from "@/lib/content";
import { SITE_URL } from "@/lib/constants";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return {
      title: "블로그 글",
      description: "계산의정석 블로그 글"
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${SITE_URL}/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: ["계산의정석"],
      tags: post.tags
    }
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = getLatestBlogPosts()
    .filter((item) => item.slug !== post.slug && (item.category === post.category || item.tags.some((tag) => post.tags.includes(tag))))
    .slice(0, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "계산의정석",
      url: SITE_URL
    },
    publisher: {
      "@type": "Organization",
      name: "계산의정석",
      url: SITE_URL
    },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`
  };

  return (
    <main className="mx-auto w-full max-w-4xl min-w-0 px-4 py-8 sm:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article className="readable-content w-full max-w-full min-w-0 overflow-hidden rounded-[28px] border border-line bg-white p-5 shadow-panel sm:p-7">
        <Link href="/blog" className="text-sm font-extrabold text-brand">
          ← 블로그 목록
        </Link>

        <div className="mt-5 flex flex-wrap gap-2 text-sm font-extrabold">
          <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">{post.category}</span>
          <span className="rounded-full bg-paper px-3 py-1 text-slate-500">{formatDate(post.publishedAt)}</span>
          <span className="rounded-full bg-paper px-3 py-1 text-slate-500">읽는 시간 {post.readTime}</span>
          <span className="rounded-full bg-paper px-3 py-1 text-slate-500">계산의정석</span>
        </div>

        <h1 className="mt-5 break-words text-3xl font-extrabold leading-tight text-ink [word-break:normal] sm:text-4xl">{post.title}</h1>
        <p className="mt-4 break-words text-base font-medium leading-7 text-slate-600 [word-break:normal]">{post.excerpt}</p>

        <div className="mt-8 grid min-w-0 gap-5 break-words text-base font-medium leading-8 text-slate-700 [word-break:normal]">
          {post.content.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-line px-3 py-1 text-xs font-bold text-slate-500">
              #{tag}
            </span>
          ))}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="readable-content mt-8 w-full max-w-full min-w-0 overflow-hidden rounded-[28px] border border-line bg-white p-6 shadow-panel">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold text-brand">관련 글</p>
              <h2 className="mt-2 text-2xl font-extrabold text-ink">함께 보면 좋은 가이드</h2>
            </div>
            <Link href="/blog" className="text-sm font-extrabold text-brand">
              블로그 전체 보기
            </Link>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {relatedPosts.map((item) => (
              <Link key={item.slug} href={`/blog/${item.slug}`} className="min-w-0 rounded-[20px] border border-line bg-paper p-5 transition hover:border-brand hover:bg-white">
                <p className="text-xs font-extrabold text-brand">{item.category}</p>
                <h3 className="mt-3 break-words text-base font-extrabold leading-6 text-ink [word-break:normal]">{item.title}</h3>
                <p className="mt-2 break-words text-sm font-medium leading-6 text-slate-600 [word-break:normal]">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}
