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
      <label className="text-xs text-slate-600">{t("language")}:</label>
      <Select
        value={language}
        onValueChange={(value: Language) => onLanguageChange(value)}
      >
        <SelectTrigger className="h-7 w-24 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t("english")}</SelectItem>
          <SelectItem value="es">{t("spanish")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
