export interface BarcodeOptions {
  width: number;
  height: number;
  fontSize: number;
  displayValue: boolean;
  background: string;
  lineColor: string;
  barWidth: number;
  padding: number;
}

export interface BarcodeData {
  barcodeData: string;
  barcodeType: string;
  barcodeWidth: number;
  barcodeHeight: number;
  dimensionUnit: string;
  fontSize: number;
  displayValue: boolean;
  background: string;
  lineColor: string;
  barWidth: number;
  padding: number;
  showHeader: boolean;
  headerText: string;
  headerFontSize: number;
  elementGap: number;
}

export interface SequenceOptions {
  sequenceEnd: number;
  repeatCount: number;
  sequencePrefix: string;
  sequenceSuffix: string;
}

export type Language = "en" | "es";

export type HorizontalAlignment = "left" | "center" | "right" | "justify";
export type VerticalAlignment = "top" | "center" | "bottom";

export interface PageOptions {
  pageWidth: number;
  pageHeight: number;
  pageUnit: string;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  orientation: "portrait" | "landscape";
  autoHeight: boolean;
  gapHorizontal: number;
  gapVertical: number;
  horizontalAlignment: HorizontalAlignment;
  verticalAlignment: VerticalAlignment;
  distributeVertically: boolean;
}

export interface PageLayout {
  codesPerRow: number;
  rowsPerPage: number;
  codesPerPage: number;
  totalPages: number;
  totalCodes: number;
  barcodeWidthPx: number;
  barcodeHeightPx: number;
  finalPageWidth: number;
  finalPageHeight: number;
  marginLeftPx: number;
  marginTopPx: number;
  marginRightPx: number;
  marginBottomPx: number;
  gapHorizontalPx: number;
  gapVerticalPx: number;
  horizontalAlignment: HorizontalAlignment;
  verticalAlignment: VerticalAlignment;
  distributeVertically: boolean;
  codes: string[];
}
