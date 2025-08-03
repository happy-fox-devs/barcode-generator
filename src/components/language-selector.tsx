"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "@/lib/i18n";
import type { Language } from "@/types/barcode";

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({
  language,
  onLanguageChange,
}: LanguageSelectorProps) {
  const { t } = useTranslation(language);

  return (
    <div className="flex items-center space-x-2">
      <label className="text-xs text-neutral-600 dark:text-neutral-400">
        {t("language")}:
      </label>
      <Select
        value={language}
        onValueChange={(value: Language) => onLanguageChange(value)}
      >
        <SelectTrigger className="h-7 w-24 text-xs dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200 dark:hover:bg-black">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="dark:border-neutral-950 dark:bg-neutral-950 dark:text-neutral-200">
          <SelectItem
            className="dark:focus:text-neutral-200 dark:data-[highlighted]:bg-black"
            value="en"
          >
            {t("english")}
          </SelectItem>
          <SelectItem
            className="dark:focus:text-neutral-200 dark:data-[highlighted]:bg-black"
            value="es"
          >
            {t("spanish")}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
