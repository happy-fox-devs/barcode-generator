"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { RefreshCw, Zap, Settings, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import type { BarcodeData, SequenceOptions, Language } from "@/types/barcode";

interface BarcodeSettingsProps {
  barcodeData: BarcodeData;
  setBarcodeData: (data: BarcodeData) => void;
  generateRandom: () => void;
  sequenceOptions: SequenceOptions;
  setSequenceOptions: (options: SequenceOptions) => void;
  language: Language;
}

export function BarcodeSettings({
  barcodeData,
  setBarcodeData,
  generateRandom,
  sequenceOptions,
  setSequenceOptions,
  language,
}: BarcodeSettingsProps) {
  const { t } = useTranslation(language);

  const handleChange = (field: keyof BarcodeData, value: any) => {
    setBarcodeData({
      ...barcodeData,
      [field]: value,
    });
  };

  const handleSequenceChange = (field: keyof SequenceOptions, value: any) => {
    setSequenceOptions({
      ...sequenceOptions,
      [field]: value,
    });
  };

  // Validar si el texto es compatible con el tipo de código seleccionado
  const validateBarcodeType = (text: string, type: string): boolean => {
    switch (type) {
      case "EAN13":
        return /^\d{12,13}$/.test(text);
      case "UPC":
        return /^\d{11,12}$/.test(text);
      case "CODE39":
        return /^[A-Z0-9\-. $/+%]*$/.test(text);
      case "ITF14":
        return /^\d{13,14}$/.test(text);
      case "CODE128":
      default:
        return true;
    }
  };

  const isValidBarcode = validateBarcodeType(
    barcodeData.barcodeData,
    barcodeData.barcodeType
  );

  return (
    <>
      <Card className="bg-transparent border-none shadow-none px-4 py-2">
        <CardHeader className="gap-0 p-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="w-4 h-4" />
            {t("contentAndHeader")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-0">
          <div className="space-y-2">
            <Label htmlFor="barcode-type" className="text-sm">
              {t("barcodeType")}{" "}
              <span className="text-green-600 text-xs">✓ Functional</span>
            </Label>
            <Select
              value={barcodeData.barcodeType || "CODE128"}
              onValueChange={(value) => handleChange("barcodeType", value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CODE128">CODE128 (Alphanumeric)</SelectItem>
                <SelectItem value="EAN13">EAN13 (12-13 digits)</SelectItem>
                <SelectItem value="UPC">UPC-A (11-12 digits)</SelectItem>
                <SelectItem value="CODE39">CODE39 (Limited chars)</SelectItem>
                <SelectItem value="ITF14">ITF-14 (13-14 digits)</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
              💡 Each barcode type has different format requirements. CODE128 is
              the most flexible.
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="header-text" className="text-sm">
              {t("headerText")}
            </Label>
            <Input
              id="header-text"
              value={barcodeData.headerText}
              onChange={(e) => handleChange("headerText", e.target.value)}
              placeholder={t("headerTextPlaceholder")}
              className="h-8"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="header-font-size" className="text-sm">
              {t("headerFontSize")}
            </Label>
            <Input
              id="header-font-size"
              type="number"
              value={barcodeData.headerFontSize || "8"}
              onChange={(e) =>
                handleChange(
                  "headerFontSize",
                  Number.parseInt(e.target.value) || 16
                )
              }
              min="8"
              max="32"
              className="h-8"
            />
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="barcode-data" className="text-sm">
              {t("initialNumber")}
            </Label>
            <div className="flex gap-2">
              <Input
                id="barcode-data"
                type="text"
                value={barcodeData.barcodeData}
                onChange={(e) => handleChange("barcodeData", e.target.value)}
                placeholder={t("initialNumber")}
                className={`flex-1 h-8 ${
                  !isValidBarcode ? "border-red-500" : ""
                }`}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={generateRandom}
                title={t("generateRandom")}
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
            {!isValidBarcode && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2 rounded">
                <AlertTriangle className="w-3 h-3" />
                <span>Invalid format for {barcodeData.barcodeType}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="display-text" className="text-sm">
              {t("showCodeText")}
            </Label>
            <Switch
              id="display-text"
              checked={barcodeData.displayValue}
              onCheckedChange={(checked) =>
                handleChange("displayValue", checked)
              }
            />
          </div>

          {barcodeData.displayValue && (
            <div className="space-y-2">
              <Label htmlFor="font-size" className="text-sm">
                {t("codeFontSize")}
              </Label>
              <Input
                id="font-size"
                type="number"
                value={barcodeData.fontSize || "8"}
                onChange={(e) =>
                  handleChange(
                    "fontSize",
                    Number.parseInt(e.target.value) || 14
                  )
                }
                min="8"
                max="24"
                className="h-8"
              />
            </div>
          )}

          <Separator />

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="seq-count" className="text-xs">
                {t("numberOfCodes")}
              </Label>
              <Input
                id="seq-count"
                type="number"
                value={sequenceOptions.sequenceEnd || "1"}
                onChange={(e) =>
                  handleSequenceChange(
                    "sequenceEnd",
                    Number.parseInt(e.target.value) || 1
                  )
                }
                min="1"
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="repeat-count" className="text-xs">
                {t("repetitions")}
              </Label>
              <Input
                id="repeat-count"
                type="number"
                value={sequenceOptions.repeatCount || 1}
                onChange={(e) =>
                  handleSequenceChange(
                    "repeatCount",
                    Number.parseInt(e.target.value) || 1
                  )
                }
                min="1"
                className="h-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="seq-prefix" className="text-sm">
              {t("prefix")}
            </Label>
            <Input
              id="seq-prefix"
              value={sequenceOptions.sequencePrefix}
              onChange={(e) =>
                handleSequenceChange("sequencePrefix", e.target.value)
              }
              placeholder={t("prefixPlaceholder")}
              className="h-8"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="seq-suffix" className="text-sm">
              {t("suffix")}
            </Label>
            <Input
              id="seq-suffix"
              value={sequenceOptions.sequenceSuffix}
              onChange={(e) =>
                handleSequenceChange("sequenceSuffix", e.target.value)
              }
              placeholder={t("suffixPlaceholder")}
              className="h-8"
            />
          </div>

          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
            {t("exampleText")}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none border-none bg-transparent px-4 py-2 gap-0">
        <CardHeader className="p-0">
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="w-4 h-4" />
            {t("dimensionsAndStyling")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-0">
          <div className="space-y-2">
            <Label className="text-sm">{t("measurementUnit")}</Label>
            <Select
              value={barcodeData.dimensionUnit || "cm"}
              onValueChange={(value) => handleChange("dimensionUnit", value)}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="px">{t("pixels")}</SelectItem>
                <SelectItem value="in">{t("inches")}</SelectItem>
                <SelectItem value="cm">{t("centimeters")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor="barcode-width" className="text-xs">
                {t("totalWidth")}
              </Label>
              <Input
                id="barcode-width"
                type="number"
                value={barcodeData.barcodeWidth || 5}
                onChange={(e) =>
                  handleChange(
                    "barcodeWidth",
                    Number.parseFloat(e.target.value) || 0
                  )
                }
                min={1}
                step={barcodeData.dimensionUnit === "px" ? "1" : "0.1"}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="barcode-height" className="text-xs">
                {t("totalHeight")}
              </Label>
              <Input
                id="barcode-height"
                type="number"
                value={barcodeData.barcodeHeight || 1}
                onChange={(e) =>
                  handleChange(
                    "barcodeHeight",
                    Number.parseFloat(e.target.value) || 0
                  )
                }
                min={1}
                step={barcodeData.dimensionUnit === "px" ? "1" : "0.1"}
                className="h-8"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="padding" className="text-sm">
              {t("padding")}
            </Label>
            <Input
              id="padding"
              type="number"
              value={barcodeData.padding || 3}
              onChange={(e) =>
                handleChange("padding", Number.parseInt(e.target.value) || 0)
              }
              min="1"
              className="h-8"
            />
            <div className="text-xs text-slate-500">{t("paddingHelp")}</div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="element-gap" className="text-sm">
              {t("elementGap")}
            </Label>
            <Input
              id="element-gap"
              type="number"
              value={barcodeData.elementGap || 1}
              onChange={(e) =>
                handleChange("elementGap", Number.parseInt(e.target.value) || 0)
              }
              min="1"
              max="20"
              className="h-8"
            />
            <div className="text-xs text-slate-500">{t("elementGapHelp")}</div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
