"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { localeLabels, SUPPORTED_LOCALES } from "@/lib/i18n";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  function handleChange(nextLocale: typeof locale) {
    setLocale(nextLocale);
  }

  return (
    <label className={`inline-flex items-center gap-2 ${className}`}>
      <span className="sr-only">{t("language.label")}</span>
      <select
        value={locale}
        aria-label={t("language.label")}
        onChange={(event) => handleChange(event.target.value as typeof locale)}
        className="h-10 rounded-full border border-white/15 bg-white px-3 text-xs font-extrabold text-ink shadow-[0_6px_18px_rgba(255,255,255,0.1)] outline-none transition focus:border-brand"
      >
        {SUPPORTED_LOCALES.map((item) => (
          <option key={item} value={item}>
            {localeLabels[item].short} · {localeLabels[item].native}
          </option>
        ))}
      </select>
    </label>
  );
}
