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
    <Card className="px-4 py-2 gap-2">
      <CardHeader className="p-0 gap-0">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="border border-slate-200 rounded p-2 bg-slate-100">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto"
            style={{ maxWidth: "200px", maxHeight: "100px" }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
