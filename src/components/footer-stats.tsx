import { useTranslation } from "@/lib/i18n";
import type { PageLayout, Language } from "@/types/barcode";

interface FooterStatsProps {
  layout: PageLayout;
  dimensionUnit: string;
  pageUnit: string;
  language: Language;
}

export function FooterStats({ language }: FooterStatsProps) {
  const { t } = useTranslation(language);

  return (
    <div className="flex h-[35px]">
      <div className="w-full content-center rounded px-4 py-2 text-right font-mono text-xs text-neutral-400">
        {t("poweredBy")}{" "}
        <a
          className="underline hover:text-blue-600 dark:hover:text-blue-400"
          href="https://github.com/happy-fox-devs"
          target="_blank"
        >
          HappyFox.devs
        </a>
      </div>
    </div>
  );
}
