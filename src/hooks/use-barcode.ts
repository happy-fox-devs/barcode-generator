"use client";

import { useState, useEffect } from "react";
import type { BarcodeData, SequenceOptions } from "@/types/barcode";
import {
  saveBarcodeData,
  loadBarcodeData,
  saveSequenceOptions,
  loadSequenceOptions,
} from "@/lib/storage";

const defaultBarcodeData: BarcodeData = {
  barcodeData: "100001",
  barcodeType: "CODE128",
  barcodeWidth: 3,
  barcodeHeight: 2,
  dimensionUnit: "cm",
  fontSize: 12,
  displayValue: true,
  background: "#ffffff",
  lineColor: "#000000",
  barWidth: 3,
  padding: 7,
  showHeader: true,
  headerText: "",
  headerFontSize: 12,
  elementGap: 3,
};

const defaultSequenceOptions: SequenceOptions = {
  sequenceEnd: 3,
  repeatCount: 3,
  sequencePrefix: "",
  sequenceSuffix: "",
};

export function useBarcodeData() {
  const [barcodeData, setBarcodeDataState] =
    useState<BarcodeData>(defaultBarcodeData);
  const [sequenceOptions, setSequenceOptionsState] = useState<SequenceOptions>(
    defaultSequenceOptions
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const loadedBarcodeData = await loadBarcodeData(defaultBarcodeData);
      const loadedSequenceOptions = await loadSequenceOptions(
        defaultSequenceOptions
      );

      const correctedBarcodeData = {
        ...loadedBarcodeData,
        background: "#ffffff",
        lineColor: "#000000",
        barWidth: 3,
      };

      setBarcodeDataState(correctedBarcodeData);
      setSequenceOptionsState(loadedSequenceOptions);
      setIsLoaded(true);
    }

    load();
  }, []);

  const setBarcodeData = (data: BarcodeData) => {
    const correctedData = {
      ...data,
      background: "#ffffff",
      lineColor: "#000000",
      barWidth: 3,
    };
    setBarcodeDataState(correctedData);
    saveBarcodeData(correctedData);
  };

  const setSequenceOptions = (options: SequenceOptions) => {
    setSequenceOptionsState(options);
    saveSequenceOptions(options);
  };

  const generateBarcodeList = () => {
    const codes = [];
    const startNum = Number.parseInt(barcodeData.barcodeData) || 1;
    const count = sequenceOptions.sequenceEnd;
    const repeatCount = sequenceOptions.repeatCount;
    const { sequencePrefix, sequenceSuffix } = sequenceOptions;

    for (let i = 0; i < count; i++) {
      for (let j = 0; j < repeatCount; j++) {
        codes.push(`${sequencePrefix}${startNum + i}${sequenceSuffix}`);
      }
    }

    return codes;
  };

  const generateRandom = () => {
    const randomNumber = Math.floor(Math.random() * 1000000000000).toString();
    setBarcodeData({
      ...barcodeData,
      barcodeData: randomNumber,
    });
  };

  return {
    barcodeData,
    setBarcodeData,
    sequenceOptions,
    setSequenceOptions,
    generateBarcodeList,
    generateRandom,
    isLoaded,
  };
}
