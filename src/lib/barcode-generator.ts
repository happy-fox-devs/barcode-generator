import JsBarcode from "jsbarcode";

export const generateBarcode = (
  canvas: HTMLCanvasElement,
  text: string,
  options: any,
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = options.width;
  canvas.height = options.height;

  ctx.fillStyle = options.background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  try {
    const padding = options.padding || 0;
    const innerWidth = options.width - padding * 2;
    const innerHeight = options.height - padding * 2;
    const elementGap = options.elementGap || 5;

    const headerHeight =
      options.showHeader && options.headerText ? options.headerFontSize : 0;
    const textHeight = options.displayValue ? options.fontSize : 0;

    let totalGaps = 0;
    if (headerHeight > 0) totalGaps += elementGap;
    if (textHeight > 0) totalGaps += elementGap;

    const barsHeight = Math.max(
      20,
      innerHeight - headerHeight - textHeight - totalGaps,
    );

    let currentY = padding;

    if (options.showHeader && options.headerText && headerHeight > 0) {
      ctx.fillStyle = options.lineColor;
      ctx.font = `${options.headerFontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      ctx.fillText(options.headerText, options.width / 2, currentY);
      currentY += headerHeight + elementGap;
    }

    if (barsHeight > 0) {
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = innerWidth;
      tempCanvas.height = barsHeight;

      JsBarcode(tempCanvas, text, {
        format: options.format || "CODE128",
        width: 10,
        height: Math.max(20, barsHeight - 10),
        displayValue: false,
        background: options.background,
        lineColor: options.lineColor,
        margin: 0,

        fontSize: 0,
        textMargin: 0,
        fontOptions: "",
        font: "monospace",
        textAlign: "center",
        textPosition: "bottom",
        valid: (valid) => {
          if (!valid && options.onInvalid) {
            options.onInvalid();
          }
        },
      });

      ctx.drawImage(tempCanvas, padding, currentY, innerWidth, barsHeight);
      currentY += barsHeight;
    }

    if (options.displayValue && textHeight > 0) {
      ctx.fillStyle = options.lineColor;
      ctx.font = `${options.fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";

      const textY = options.height - padding;
      ctx.fillText(text, options.width / 2, textY);
    }
  } catch (error) {
    console.warn("Error generating barcode with JsBarcode:", error);

    generateSimulatedBarcode(canvas, text, options);
  }
};

const generateSimulatedBarcode = (
  canvas: HTMLCanvasElement,
  text: string,
  options: any,
) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const padding = options.padding || 0;
  const innerWidth = options.width - padding * 2;
  const innerHeight = options.height - padding * 2;
  const elementGap = options.elementGap || 5;

  const headerHeight =
    options.showHeader && options.headerText ? options.headerFontSize : 0;
  const textHeight = options.displayValue ? options.fontSize : 0;

  let totalGaps = 0;
  if (headerHeight > 0) totalGaps += elementGap;
  if (textHeight > 0) totalGaps += elementGap;

  const barsHeight = Math.max(
    20,
    innerHeight - headerHeight - textHeight - totalGaps,
  );

  let currentY = padding;

  if (options.showHeader && options.headerText && headerHeight > 0) {
    ctx.fillStyle = options.lineColor;
    ctx.font = `${options.headerFontSize}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";

    ctx.fillText(options.headerText, options.width / 2, currentY);
    currentY += headerHeight + elementGap;
  }

  if (barsHeight > 0) {
    ctx.fillStyle = options.lineColor;

    const barWidth = options.barWidth || 2;
    const totalBars = text.length * 6;
    const totalBarsWidth = Math.min(totalBars * barWidth, innerWidth);
    const actualBarWidth = totalBarsWidth / totalBars;

    const startX = padding + (innerWidth - totalBarsWidth) / 2;
    const barStartY = currentY + (barsHeight - barsHeight * 0.8) / 2;

    let x = startX;

    for (let i = 0; i < totalBars; i++) {
      const charCode = text.charCodeAt(i % text.length);
      const shouldDraw = (charCode + i) % 3 !== 0;

      if (shouldDraw) {
        ctx.fillRect(x, barStartY, actualBarWidth, barsHeight * 0.8);
      }
      x += actualBarWidth;
    }

    currentY += barsHeight;
  }

  if (options.displayValue && textHeight > 0) {
    ctx.fillStyle = options.lineColor;
    ctx.font = `${options.fontSize}px monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    const textY = options.height - padding;
    ctx.fillText(text, options.width / 2, textY);
  }
};

export const generateFullSizePage = (layout: any, barcodeData: any) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const {
    finalPageWidth,
    marginLeftPx,
    marginTopPx,
    marginRightPx,
    marginBottomPx,
    gapHorizontalPx,
    gapVerticalPx,
    horizontalAlignment,
    verticalAlignment,
    codesPerRow,
    barcodeWidthPx,
    barcodeHeightPx,
    codes,
  } = layout;

  const {
    fontSize,
    displayValue,
    background,
    lineColor,
    barcodeType,
    padding,
    showHeader,
    headerText,
    headerFontSize,
    elementGap,
  } = barcodeData;

  const finalHeight = (() => {
    const totalRows = Math.ceil(codes.length / codesPerRow);
    const totalCodesHeight =
      totalRows * barcodeHeightPx + (totalRows - 1) * gapVerticalPx;
    return marginTopPx + totalCodesHeight + marginBottomPx;
  })();

  canvas.width = finalPageWidth;
  canvas.height = finalHeight;

  ctx.imageSmoothingEnabled = false;
  ctx.textRendering = "optimizeLegibility";

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const availableWidth = finalPageWidth - marginLeftPx - marginRightPx;

  const totalRows = Math.ceil(codes.length / codesPerRow);

  let startY = marginTopPx;
  switch (verticalAlignment) {
    case "center":
      startY = marginTopPx;
      break;
    case "bottom":
      startY = marginTopPx;
      break;
  }

  for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
    const rowStart = rowIndex * codesPerRow;
    const rowEnd = Math.min(rowStart + codesPerRow, codes.length);
    const codesInThisRow = codes.slice(rowStart, rowEnd);

    let totalRowWidth;
    if (
      horizontalAlignment === "justify" &&
      codesInThisRow.length > 1 &&
      rowIndex < totalRows - 1
    ) {
      totalRowWidth = availableWidth;
    } else {
      totalRowWidth =
        codesInThisRow.length * barcodeWidthPx +
        (codesInThisRow.length - 1) * gapHorizontalPx;
    }

    let startX = marginLeftPx;
    switch (horizontalAlignment) {
      case "center":
        startX = marginLeftPx + (availableWidth - totalRowWidth) / 2;
        break;
      case "right":
        startX = marginLeftPx + availableWidth - totalRowWidth;
        break;
      case "justify":
        if (codesInThisRow.length > 1 && rowIndex < totalRows - 1) {
          startX = marginLeftPx;
        }
        break;
    }

    for (let colIndex = 0; colIndex < codesInThisRow.length; colIndex++) {
      const code = codesInThisRow[colIndex];

      let x = startX + colIndex * (barcodeWidthPx + gapHorizontalPx);

      if (
        horizontalAlignment === "justify" &&
        codesInThisRow.length > 1 &&
        rowIndex < totalRows - 1
      ) {
        const justifyGap =
          (availableWidth - codesInThisRow.length * barcodeWidthPx) /
          (codesInThisRow.length - 1);
        x = marginLeftPx + colIndex * (barcodeWidthPx + justifyGap);
      }

      const y = startY + rowIndex * (barcodeHeightPx + gapVerticalPx);

      const tempCanvas = document.createElement("canvas");
      generateBarcode(tempCanvas, code, {
        width: barcodeWidthPx,
        height: barcodeHeightPx,
        fontSize,
        displayValue,
        background,
        lineColor,
        barWidth: 10,
        format: barcodeType,
        padding,
        showHeader,
        headerText,
        headerFontSize,
        elementGap,
        onInvalid: () => console.warn(`Invalid barcode: ${code}`),
      });

      ctx.drawImage(tempCanvas, x, y, barcodeWidthPx, barcodeHeightPx);
    }
  }

  return canvas;
};
