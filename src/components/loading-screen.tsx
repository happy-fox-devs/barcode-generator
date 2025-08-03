import { useTranslation } from "@/lib/i18n";
import type { Language } from "@/types/barcode";

interface LoadingScreenProps {
  language: Language;
}

export function LoadingScreen({ language }: LoadingScreenProps) {
  const { t } = useTranslation(language);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700">
      <div className="space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100">
            {t("title")}
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex items-center justify-center space-x-2 text-neutral-500">
          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-neutral-500"></div>
          <span className="text-sm">{t("loading")}</span>
        </div>

        <div className="pt-8">
          <p className="font-mono text-xs text-neutral-400">
            {t("poweredBy")}{" "}
            <a
              className="underline hover:text-blue-600 dark:hover:text-blue-400"
              href="https://github.com/happy-fox-devs"
              target="_blank"
            >
              HappyFox.devs
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
