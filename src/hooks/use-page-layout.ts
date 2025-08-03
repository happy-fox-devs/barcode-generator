"use client";

import { useState, useEffect } from "react";
import type { PageOptions, PageLayout } from "@/types/barcode";
import { convertToPixels } from "@/lib/unit-conversion";
import { savePageOptions, loadPageOptions } from "@/lib/storage";

const defaultPageOptions: PageOptions = {
  pageWidth: 10.3,
  pageHeight: 11,
  pageUnit: "cm",
  marginTop: 0.3,
  marginBottom: 0.3,
  marginLeft: 0.3,
  marginRight: 0.3,
  orientation: "portrait",
  autoHeight: true,
  gapHorizontal: 0.3,
  gapVertical: 0.3,
  horizontalAlignment: "left",
  verticalAlignment: "top",
  distributeVertically: false,
};

export function usePageLayout() {
  const [pageOptions, setPageOptionsState] =
    useState<PageOptions>(defaultPageOptions);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const loadedPageOptions = await loadPageOptions(defaultPageOptions);
      setPageOptionsState(loadedPageOptions);
      setIsLoaded(true);
    }

    load();
  }, []);

  const setPageOptions = (options: PageOptions) => {
    setPageOptionsState(options);
    savePageOptions(options);
  };

  return {
    pageOptions,
    setPageOptions,
    isLoaded,
  };
}

export function calculatePageLayout(
  pageOptions: PageOptions,
  barcodeWidth: number,
  barcodeHeight: number,
  dimensionUnit: string,
  codes: string[],
): PageLayout {
  const {
    pageWidth,
    pageHeight,
    pageUnit,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    orientation,
    autoHeight,
    gapHorizontal,
    gapVertical,
    horizontalAlignment,
    verticalAlignment,
    distributeVertically,
  } = pageOptions;

  const pageWidthPx = convertToPixels(pageWidth, pageUnit);
  const pageHeightPx = convertToPixels(pageHeight, pageUnit);
  const marginTopPx = convertToPixels(marginTop, pageUnit);
  const marginBottomPx = convertToPixels(marginBottom, pageUnit);
  const marginLeftPx = convertToPixels(marginLeft, pageUnit);
  const marginRightPx = convertToPixels(marginRight, pageUnit);
  const gapHorizontalPx = convertToPixels(gapHorizontal, pageUnit);
  const gapVerticalPx = convertToPixels(gapVertical, pageUnit);

  const finalPageWidth =
    orientation === "portrait" ? pageWidthPx : pageHeightPx;
  const finalPageHeight =
    orientation === "portrait" ? pageHeightPx : pageWidthPx;

  const barcodeWidthPx = convertToPixels(barcodeWidth, dimensionUnit);
  const barcodeHeightPx = convertToPixels(barcodeHeight, dimensionUnit);

  const availableWidth = finalPageWidth - marginLeftPx - marginRightPx;
  const availableHeight = finalPageHeight - marginTopPx - marginBottomPx;

  const codesPerRow = Math.max(
    1,
    Math.floor(
      (availableWidth + gapHorizontalPx) / (barcodeWidthPx + gapHorizontalPx),
    ),
  );

  const totalRows = Math.ceil(codes.length / codesPerRow);

  let rowsPerPage;
  if (autoHeight) {
    rowsPerPage = totalRows;
  } else {
    rowsPerPage = Math.max(
      1,
      Math.floor(
        (availableHeight + gapVerticalPx) / (barcodeHeightPx + gapVerticalPx),
      ),
    );
  }

  const codesPerPage = codesPerRow * rowsPerPage;
  const totalPages = Math.ceil(codes.length / codesPerPage);

  return {
    codesPerRow,
    rowsPerPage,
    codesPerPage,
    totalPages,
    totalCodes: codes.length,
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
  };
}
