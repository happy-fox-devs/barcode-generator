import type {
  BarcodeData,
  Language,
  PageOptions,
  SequenceOptions,
} from "@/types/barcode";

const STORAGE_KEYS = {
  BARCODE_DATA: "barcodeData",
  SEQUENCE_OPTIONS: "sequenceOptions",
  PAGE_OPTIONS: "pageOptions",
  LANGUAGE: "language",
  ACTIVE_TAB: "activeTab",
};

let configCache: Record<string, any> = {};

const ensureConfigLoaded = async () => {
  if (Object.keys(configCache).length === 0) {
    configCache = await window.api.readConfig();
  }
};

const saveConfig = async () => {
  await window.api.writeConfig(configCache);
};

export const saveToStorage = async (key: string, data: any): Promise<void> => {
  try {
    await ensureConfigLoaded();
    configCache[key] = data;
    await saveConfig();
  } catch (error) {
    console.warn("Failed to save to config file:", error);
  }
};

export const loadFromStorage = async <T>(
  key: string,
  defaultValue: T
): Promise<T> => {
  try {
    await ensureConfigLoaded();

    if (!configCache[key]) {
      saveToStorage(key, defaultValue);
      configCache[key] = defaultValue;
    }

    return configCache[key];
  } catch (error) {
    console.warn("Failed to load from config file:", error);
    return defaultValue;
  }
};

export const saveBarcodeData = (data: BarcodeData) =>
  saveToStorage(STORAGE_KEYS.BARCODE_DATA, data);
export const loadBarcodeData = (defaultValue: BarcodeData) =>
  loadFromStorage(STORAGE_KEYS.BARCODE_DATA, defaultValue);

export const saveSequenceOptions = (data: SequenceOptions) =>
  saveToStorage(STORAGE_KEYS.SEQUENCE_OPTIONS, data);
export const loadSequenceOptions = (defaultValue: SequenceOptions) =>
  loadFromStorage(STORAGE_KEYS.SEQUENCE_OPTIONS, defaultValue);

export const savePageOptions = (data: PageOptions) =>
  saveToStorage(STORAGE_KEYS.PAGE_OPTIONS, data);
export const loadPageOptions = (defaultValue: PageOptions) =>
  loadFromStorage(STORAGE_KEYS.PAGE_OPTIONS, defaultValue);

export const saveLanguage = (language: Language) =>
  saveToStorage(STORAGE_KEYS.LANGUAGE, language);
export const loadLanguage = () =>
  loadFromStorage<Language>(STORAGE_KEYS.LANGUAGE, "en");

export const saveActiveTab = (tab: string) =>
  saveToStorage(STORAGE_KEYS.ACTIVE_TAB, tab);
export const loadActiveTab = () =>
  loadFromStorage<string>(STORAGE_KEYS.ACTIVE_TAB, "design");
