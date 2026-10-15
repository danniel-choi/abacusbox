"use client";

import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { VisitorCounter } from "@/components/VisitorCounter";

export function SiteFooter() {
  const { t } = useLanguage();

  return (
    <footer className="mt-12 border-t border-white/10 bg-ink sm:mt-16">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4">
          <VisitorCounter />
        </div>
        <div className="grid gap-6 text-sm text-white/60 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="font-extrabold text-white">{t("footer.brand")}</p>
            <p className="mt-2 leading-6">{t("footer.description")}</p>
            <p className="mt-2 text-xs font-semibold text-white/45">{t("footer.contact")}</p>
          </div>
          <div className="grid gap-3">
            <p className="font-extrabold text-white">{t("footer.info")}</p>
            <div className="flex flex-wrap gap-3 text-white/82">
              <Link href="/about">{t("footer.about")}</Link>
              <Link href="/blog">{t("footer.blog")}</Link>
              <Link href="/resources">{t("footer.resources")}</Link>
              <Link href="/editorial-policy">{t("footer.policy")}</Link>
              <Link href="/privacy">{t("footer.privacy")}</Link>
              <Link href="/terms">{t("footer.terms")}</Link>
              <Link href="/contact">{t("footer.contactLink")}</Link>
              <Link href="/sitemap.xml">{t("footer.sitemap")}</Link>
            </div>
            <LanguageSwitcher className="mt-5" />
          </div>
        </div>
      </div>
    </footer>
  );
}
