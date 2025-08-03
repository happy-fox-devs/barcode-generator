"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { PageLayout } from "@/types/barcode";

interface StatsPanelProps {
  layout: PageLayout;
  dimensionUnit: string;
  pageUnit: string;
}

export function StatsPanel({ layout }: StatsPanelProps) {
  const {
    totalCodes,
    codesPerRow,
    codesPerPage,
    totalPages,
    barcodeWidthPx,
    barcodeHeightPx,
    gapHorizontalPx,
    gapVerticalPx,
  } = layout;

  return (
    <Card className="border-neutral-200 bg-neutral-50">
      <CardContent className="py-3">
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-6">
          <div>
            <div className="text-lg font-bold text-neutral-900">
              {totalCodes}
            </div>
            <div className="text-xs text-neutral-600">Códigos totales</div>
          </div>
          <div>
            <div className="text-lg font-bold text-neutral-900">
              {codesPerRow}
            </div>
            <div className="text-xs text-neutral-600">Por fila</div>
          </div>
          <div>
            <div className="text-lg font-bold text-neutral-900">
              {codesPerPage}
            </div>
            <div className="text-xs text-neutral-600">Por página</div>
          </div>
          <div>
            <div className="text-lg font-bold text-neutral-900">
              {totalPages}
            </div>
            <div className="text-xs text-neutral-600">Páginas</div>
          </div>
          <div>
            <div className="text-lg font-bold text-neutral-900">
              {Math.round(barcodeWidthPx)}×{Math.round(barcodeHeightPx)}
            </div>
            <div className="text-xs text-neutral-600">Tamaño (px)</div>
          </div>
          <div>
            <div className="text-lg font-bold text-neutral-900">
              {Math.round(gapHorizontalPx)}×{Math.round(gapVerticalPx)}
            </div>
            <div className="text-xs text-neutral-600">Espaciado (px)</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
