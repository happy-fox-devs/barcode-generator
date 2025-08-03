"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateBarcode, generateFullSizePage } from "@/lib/barcode-generator";
import { useTranslation } from "@/lib/i18n";
import type {
  BarcodeData,
  HorizontalAlignment,
  Language,
  PageLayout,
  VerticalAlignment,
} from "@/types/barcode";
import { Copy, Download, Printer } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface PagePreviewProps {
  layout: PageLayout;
  barcodeData: BarcodeData;
  language: Language;
}

export function PagePreview({
  layout,
  barcodeData,
  language,
}: PagePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useTranslation(language);

  const {
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

  const {
    codesPerRow,
    rowsPerPage,
    barcodeWidthPx,
    barcodeHeightPx,
    finalPageWidth,
    finalPageHeight,
    marginLeftPx,
    marginTopPx,
    marginRightPx,
    marginBottomPx,
    gapHorizontalPx,
    gapVerticalPx,
    horizontalAlignment,
    verticalAlignment,
    distributeVertically,
    codes,
  } = layout;

  const print = () => {
    const canvas = generateFullSizePage(layout, barcodeData);
    const dataUrl = canvas?.toDataURL();
    const printWindow = window.open("", "_blank");

    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { margin: 0; display: flex; align-items: center; justify-content: center; background: whitesmoke }
            img { max-width: 100%; max-height: 100%; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" onload="window.print(); window.close();" />
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const calculateScale = () => {
    const maxWidth = 600;
    const maxHeight = 400;
    const scaleX = maxWidth / finalPageWidth;
    const scaleY = maxHeight / finalPageHeight;
    return Math.min(scaleX, scaleY, 1);
  };

  const calculateXPosition = (
    rowIndex: number,
    availableWidth: number,
    totalWidthOfRow: number,
    alignment: HorizontalAlignment
  ): number => {
    const startX = marginLeftPx;

    switch (alignment) {
      case "center":
        return startX + (availableWidth - totalWidthOfRow) / 2;
      case "right":
        return startX + availableWidth - totalWidthOfRow;
      case "justify":
        if (
          codesPerRow > 1 &&
          rowIndex < Math.ceil(codes.length / codesPerRow) - 1
        ) {
          return startX;
        }
        return startX;
      case "left":
      default:
        return startX;
    }
  };

  const calculateYPosition = (
    availableHeight: number,
    totalHeightOfCodes: number,
    alignment: VerticalAlignment
  ): number => {
    const startY = marginTopPx;

    switch (alignment) {
      case "center":
        return startY + (availableHeight - totalHeightOfCodes) / 2;
      case "bottom":
        return startY + availableHeight - totalHeightOfCodes;
      case "top":
      default:
        return startY;
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const scale = calculateScale();

      canvas.width = finalPageWidth * scale;
      canvas.height = finalPageHeight * scale;

      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#cbd5e1";
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        marginLeftPx * scale,
        marginTopPx * scale,
        (finalPageWidth - marginLeftPx - marginRightPx) * scale,
        (finalPageHeight - marginTopPx - marginBottomPx) * scale
      );
      ctx.setLineDash([]);

      const availableWidth = finalPageWidth - marginLeftPx - marginRightPx;
      const availableHeight = finalPageHeight - marginTopPx - marginBottomPx;

      const maxPreviewRows = 10;
      const previewRowsPerPage = Math.min(rowsPerPage, maxPreviewRows);
      const previewCodesPerPage = codesPerRow * previewRowsPerPage;

      const totalRows = Math.ceil(
        Math.min(codes.length, previewCodesPerPage) / codesPerRow
      );
      const totalHeightOfCodes =
        totalRows * barcodeHeightPx + (totalRows - 1) * gapVerticalPx;

      const startY = calculateYPosition(
        availableHeight,
        totalHeightOfCodes,
        verticalAlignment
      );

      const codesToShow = codes.slice(0, previewCodesPerPage);
      const rows = Math.ceil(codesToShow.length / codesPerRow);

      for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
        const rowStart = rowIndex * codesPerRow;
        const rowEnd = Math.min(rowStart + codesPerRow, codesToShow.length);
        const codesInThisRow = codesToShow.slice(rowStart, rowEnd);

        let totalRowWidth;

        if (
          horizontalAlignment === "justify" &&
          codesInThisRow.length > 1 &&
          rowIndex < rows - 1
        ) {
          totalRowWidth = availableWidth;
        } else {
          totalRowWidth =
            codesInThisRow.length * barcodeWidthPx +
            (codesInThisRow.length - 1) * gapHorizontalPx;
        }

        const startX = calculateXPosition(
          rowIndex,
          availableWidth,
          totalRowWidth,
          horizontalAlignment
        );

        for (let colIndex = 0; colIndex < codesInThisRow.length; colIndex++) {
          const code = codesInThisRow[colIndex];

          let x = startX + colIndex * (barcodeWidthPx + gapHorizontalPx);

          if (
            horizontalAlignment === "justify" &&
            codesInThisRow.length > 1 &&
            rowIndex < rows - 1
          ) {
            const justifyGap =
              (availableWidth - codesInThisRow.length * barcodeWidthPx) /
              (codesInThisRow.length - 1);
            x = marginLeftPx + colIndex * (barcodeWidthPx + justifyGap);
          }

          let y = startY + rowIndex * (barcodeHeightPx + gapVerticalPx);

          if (distributeVertically && rows > 1) {
            const distributeGap =
              (availableHeight - rows * barcodeHeightPx) / (rows - 1);
            y = marginTopPx + rowIndex * (barcodeHeightPx + distributeGap);
          }

          const tempCanvas = document.createElement("canvas");
          generateBarcode(tempCanvas, code, {
            width: barcodeWidthPx,
            height: barcodeHeightPx,
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

          ctx.drawImage(
            tempCanvas,
            x * scale,
            y * scale,
            barcodeWidthPx * scale,
            barcodeHeightPx * scale
          );
        }
      }

      ctx.fillStyle = "#64748b";
      ctx.font = `${12 * scale}px sans-serif`;
      const previewText =
        rows >= maxPreviewRows
          ? `${t("pagePreview")} (${t("total")}: ${
              codes.length
            }, showing first ${codesToShow.length})`
          : `${t("codesPerPage")}: ${codesPerRow * rowsPerPage} | ${t(
              "total"
            )}: ${codes.length}`;

      ctx.fillText(previewText, 10 * scale, (finalPageHeight - 10) * scale);
    }
  }, [
    finalPageWidth,
    finalPageHeight,
    marginLeftPx,
    marginTopPx,
    marginRightPx,
    marginBottomPx,
    barcodeWidthPx,
    barcodeHeightPx,
    gapHorizontalPx,
    gapVerticalPx,
    horizontalAlignment,
    verticalAlignment,
    distributeVertically,
    codesPerRow,
    rowsPerPage,
    codes,
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
    t,
  ]);

  const downloadBarcode = (format: "png" | "svg") => {
    const fullSizeCanvas = generateFullSizePage(layout, barcodeData);
    if (!fullSizeCanvas) return;

    if (format === "png") {
      const link = document.createElement("a");
      link.download = `barcode-page.png`;
      link.href = fullSizeCanvas.toDataURL();
      link.click();
    }

    toast.success(
      `${t("downloadStarted")} - ${t("pageDownloaded")} ${format.toUpperCase()}`
    );
  };

  const copyToClipboard = async () => {
    const fullSizeCanvas = generateFullSizePage(layout, barcodeData);
    if (!fullSizeCanvas) return;

    try {
      const blob = await new Promise<Blob>((resolve) => {
        fullSizeCanvas!.toBlob((blob) => resolve(blob!), "image/png");
      });

      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ]);

      toast.success(`${t("copied")} - ${t("fullPageCopied")}`);
    } catch (error) {
      toast.error(`${t("error")} - ${t("couldNotCopy")}`);
    }
  };

  return (
    <Card className="px-4 py-2 gap-2 h-0 grow overflow-hidden relative">
      <CardHeader className="p-0 gap-0">
        <CardTitle className="text-sm">{t("pagePreview")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="border border-slate-300 rounded p-4 bg-slate-200 overflow-auto">
            <canvas ref={canvasRef} className="max-w-full h-auto" />
          </div>

          <div className="flex flex-wrap gap-2 justify-center absolute bottom-0 m-2 right-0">
            <Button onClick={print} size="sm" className="gap-2 bg-blue-400">
              <Printer className="w-3 h-3" />
              {t("print")}
            </Button>
            <Button
              onClick={() => downloadBarcode("png")}
              size="sm"
              className="gap-2"
            >
              <Download className="w-3 h-3" />
              {t("downloadPNG")}
            </Button>
            <Button
              onClick={copyToClipboard}
              size="sm"
              className="gap-2"
              variant={"outline"}
            >
              <Copy className="w-3 h-3" />
              {t("copy")}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
