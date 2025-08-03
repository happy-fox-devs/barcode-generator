import { useTranslation } from "@/lib/i18n";
import type { Language } from "@/types/barcode";

interface LoadingScreenProps {
  language: Language;
}

export function LoadingScreen({ language }: LoadingScreenProps) {
  const { t } = useTranslation(language);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">{t("title")}</h1>
          <p className="text-lg text-slate-600">{t("subtitle")}</p>
        </div>

        <div className="flex items-center justify-center space-x-2 text-slate-500">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-500"></div>
          <span className="text-sm">{t("loading")}</span>
        </div>

        <div className="pt-8">
          <p className="text-xs text-slate-400 font-mono">{t("poweredBy")}</p>
        </div>
      </div>
    </div>
  );
}
