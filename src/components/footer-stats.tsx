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
      <div className="text-xs text-slate-400 font-mono px-4 py-2 rounded content-center text-right w-full">
        {t("poweredBy")}{" "}
        <a href="https://github.com/happy-fox-devs">HappyFox.devs</a>
      </div>
    </div>
  );
}
