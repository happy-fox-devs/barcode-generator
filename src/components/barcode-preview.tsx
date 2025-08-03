import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateBarcode } from "@/lib/barcode-generator";

import type { BarcodeData, Language } from "@/types/barcode";
import { convertToPixels } from "@/lib/unit-conversion";

interface BarcodePreviewProps {
  code: string;
  barcodeData: BarcodeData;
  title: string;
  language: Language;
}

export function BarcodePreview({
  code,
  barcodeData,
  title,
}: BarcodePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {
    barcodeWidth,
    barcodeHeight,
    dimensionUnit,
    fontSize,
    displayValue,
    background,
    lineColor,
    barWidth,
    padding,
    barcodeType,
    showHeader,
    headerText,
    headerFontSize,
    elementGap,
  } = barcodeData;

  useEffect(() => {
    if (canvasRef.current) {
      const widthPx = convertToPixels(barcodeWidth, dimensionUnit);
      const heightPx = convertToPixels(barcodeHeight, dimensionUnit);

      generateBarcode(canvasRef.current, code, {
        width: widthPx,
        height: heightPx,
        fontSize,
        displayValue,
        background,
        lineColor,
        barWidth,
        padding,
        format: barcodeType,
        showHeader,
        headerText,
        headerFontSize,
        elementGap,
      });
    }
  }, [
    code,
    barcodeWidth,
    barcodeHeight,
    dimensionUnit,
    fontSize,
    displayValue,
    background,
    lineColor,
    barWidth,
    padding,
    barcodeType,
    showHeader,
    headerText,
    headerFontSize,
    elementGap,
  ]);

  return (
    <Card className="gap-2 px-4 py-2 dark:border-neutral-950 dark:bg-neutral-900">
      <CardHeader className="gap-0 p-0">
        <CardTitle className="text-sm dark:text-neutral-200">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="rounded border border-neutral-200 bg-neutral-100 p-2 dark:bg-neutral-300">
          <canvas
            ref={canvasRef}
            className="h-auto max-w-full"
            style={{ maxWidth: "200px", maxHeight: "100px" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
