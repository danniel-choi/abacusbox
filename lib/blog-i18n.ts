import type { BlogPost } from "@/lib/content";
import type { Locale } from "@/lib/i18n";

type BlogInput = Pick<BlogPost, "slug" | "title" | "excerpt" | "category" | "tags">;
type LocalizedText = { en: string; ja: string };

const TITLE_OVERRIDES: Record<string, LocalizedText> = {
  "one-in-eight-billion-life-calculator": {
    en: "The 1-in-8-Billion Life Calculator",
    ja: "80億分の1の人生計算機"
  },
  "loan-interest-checklist-20260901-00-hourly": {
    en: "Loan Interest Checklist: What to Check Before Borrowing",
    ja: "ローン利息チェックリスト：借りる前に確認すること"
  },
  "year-end-tax-settlement-mistakes-20260901-01-hourly": {
    en: "Common Year-end Tax Settlement Mistakes",
    ja: "年末調整でよくある間違い"
  },
  "stock-return-comparison-20260901-02-hourly": {
    en: "How to Compare Stock Returns",
    ja: "株式収益率を比較する方法"
  }
};

const CATEGORY_LABELS: Record<BlogPost["category"], LocalizedText> = {
  "노무 가이드": { en: "Labor guide", ja: "労務ガイド" },
  "금융 가이드": { en: "Finance guide", ja: "金融ガイド" },
  "세금 가이드": { en: "Tax guide", ja: "税金ガイド" },
  "건강 가이드": { en: "Health guide", ja: "健康ガイド" },
  "생활 가이드": { en: "Life guide", ja: "生活ガイド" },
  "게임 가이드": { en: "Game guide", ja: "ゲームガイド" },
  "사업 가이드": { en: "Business guide", ja: "ビジネスガイド" },
  "수학 도구": { en: "Math tools", ja: "数学ツール" },
  운영: { en: "Updates", ja: "運営情報" }
};

const TOKEN_LABELS: Record<string, LocalizedText> = {
  calculator: { en: "Calculator", ja: "計算機" },
  checklist: { en: "Checklist", ja: "チェックリスト" },
  guide: { en: "Guide", ja: "ガイド" },
  strategy: { en: "Strategy", ja: "戦略" },
  mistakes: { en: "Mistakes", ja: "間違い" },
  comparison: { en: "Comparison", ja: "比較" },
  tax: { en: "Tax", ja: "税金" },
  salary: { en: "Salary", ja: "給与" },
  loan: { en: "Loan", ja: "ローン" },
  interest: { en: "Interest", ja: "利息" },
  stock: { en: "Stock", ja: "株式" },
  return: { en: "Return", ja: "収益" },
  life: { en: "Life", ja: "人生" },
  birth: { en: "Birth", ja: "誕生" },
  date: { en: "Date", ja: "日付" },
  budget: { en: "Budget", ja: "予算" },
  marketing: { en: "Marketing", ja: "マーケティング" }
};

function humanizeSlug(slug: string, locale: "en" | "ja") {
  const words = slug
    .replace(/-\d{8}-\d{2}-hourly$/, "")
    .split("-")
    .filter((word) => !/^\d+$/.test(word))
    .map((word) => TOKEN_LABELS[word]?.[locale] ?? word);
  if (locale === "ja") return `${words.join("")}ガイド`;
  return `${words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")} Guide`;
}

export function getLocalizedBlogPresentation(post: BlogInput, locale: Locale) {
  if (locale === "ko") {
    return { title: post.title, excerpt: post.excerpt, category: post.category, tags: post.tags };
  }

  const title = TITLE_OVERRIDES[post.slug]?.[locale] ?? humanizeSlug(post.slug, locale);
  const category = CATEGORY_LABELS[post.category]?.[locale] ?? (locale === "en" ? "Guide" : "ガイド");
  return {
    title,
    excerpt:
      locale === "en"
        ? `A practical guide connected to ${title.toLowerCase()}. Review the key points and use the related calculator when you need a quick estimate.`
        : `${title}に関連する実用ガイドです。ポイントを確認し、必要に応じて関連計算機で目安を確認できます。`,
    category,
    tags: post.tags.map((tag) => (locale === "en" ? tag.replace(/[가-힣]/g, "").trim() || "Guide" : tag.replace(/[가-힣]/g, "").trim() || "ガイド"))
  };
}
