import { BarcodePreview } from "@/components/barcode-preview";
import { BarcodeSettings } from "@/components/barcode-settings";
import { FooterStats } from "@/components/footer-stats";
import { LanguageSelector } from "@/components/language-selector";
import { LoadingScreen } from "@/components/loading-screen";
import { PagePreview } from "@/components/page-preview";
import { PageSettings } from "@/components/page-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBarcodeData } from "@/hooks/use-barcode";
import { calculatePageLayout, usePageLayout } from "@/hooks/use-page-layout";
import { useTranslation } from "@/lib/i18n";
import {
  loadActiveTab,
  loadLanguage,
  saveActiveTab,
  saveLanguage,
} from "@/lib/storage";
import type { Language } from "@/types/barcode";
import { useEffect, useState } from "react";

export default function BarcodeGenerator() {
  const [language, setLanguage] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState("design");
  const [isAppLoaded, setIsAppLoaded] = useState(false);

  const { t } = useTranslation(language);
  const {
    barcodeData,
    setBarcodeData,
    sequenceOptions,
    setSequenceOptions,
    generateBarcodeList,
    generateRandom,
    isLoaded: barcodeLoaded,
  } = useBarcodeData();
  const { pageOptions, setPageOptions, isLoaded: pageLoaded } = usePageLayout();

  useEffect(() => {
    async function loadConfig() {
      const loadedLanguage = await loadLanguage();
      const loadedActiveTab = await loadActiveTab();
      setLanguage(loadedLanguage);
      setActiveTab(loadedActiveTab);
    }

    loadConfig();
  }, []);

  useEffect(() => {
    if (barcodeLoaded && pageLoaded) {
      const timer = setTimeout(() => {
        setIsAppLoaded(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [barcodeLoaded, pageLoaded]);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    saveLanguage(newLanguage);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    saveActiveTab(tab);
  };

  if (!isAppLoaded) {
    return <LoadingScreen language={language} />;
  }

  const codes = generateBarcodeList();
  const layout = calculatePageLayout(
    pageOptions,
    barcodeData.barcodeWidth,
    barcodeData.barcodeHeight,
    barcodeData.dimensionUnit,
    codes,
  );

  return (
    <div className="box-border flex h-screen min-h-[600px] w-screen flex-col bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700">
      <div className="mx-auto flex max-w-7xl grow flex-col">
        {/* Header */}
        <div className="flex h-[100px] items-center justify-between">
          <div className="flex-1 text-center">
            <h1 className="mb-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {t("title")}
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              {t("subtitle")}
            </p>
          </div>
          <div className="ml-4">
            <LanguageSelector
              language={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>

        <div className="grid h-0 grow gap-2 lg:grid-cols-3">
          {/* Configuration Panel - Con altura máxima y scroll */}
          <div className="h-auto min-h-[470px] space-y-2 overflow-hidden p-2 pr-0 lg:col-span-1">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="h-full w-full"
            >
              <TabsList className="grid w-full grid-cols-2 dark:border-neutral-900 dark:bg-neutral-800">
                <TabsTrigger
                  className="border-none dark:data-[state=active]:bg-neutral-900 dark:data-[state=active]:text-neutral-100"
                  value="design"
                >
                  {t("design")}
                </TabsTrigger>
                <TabsTrigger
                  className="dark:data-[state=active]:border-neutral-950 dark:data-[state=active]:bg-neutral-900 dark:data-[state=active]:text-neutral-100"
                  value="page"
                >
                  {t("page")}
                </TabsTrigger>
              </TabsList>

              {/* Contenido con scroll */}
              <div className="h-0 grow overflow-y-auto rounded-xl border bg-white shadow-sm dark:border-neutral-950 dark:bg-neutral-900">
                <TabsContent value="design" className="mt-2 space-y-2">
                  <BarcodeSettings
                    barcodeData={barcodeData}
                    setBarcodeData={setBarcodeData}
                    generateRandom={generateRandom}
                    sequenceOptions={sequenceOptions}
                    setSequenceOptions={setSequenceOptions}
                    language={language}
                  />
                </TabsContent>

                <TabsContent value="page" className="mt-2 space-y-2">
                  <PageSettings
                    pageOptions={pageOptions}
                    setPageOptions={setPageOptions}
                    language={language}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Preview Panel - Con altura máxima */}
          <div className="flex h-full min-h-[470px] flex-col gap-2 p-2 pl-0 lg:col-span-2">
            {/* Individual codes */}
            <div className="grid grid-cols-2 gap-2">
              <BarcodePreview
                code={codes[0] || ""}
                barcodeData={barcodeData}
                title={t("firstCode")}
                language={language}
              />

              {codes.length > 1 && (
                <BarcodePreview
                  code={codes[codes.length - 1] || ""}
                  barcodeData={barcodeData}
                  title={t("lastCode")}
                  language={language}
                />
              )}
            </div>

            {/* Page preview */}
            <PagePreview
              layout={layout}
              barcodeData={barcodeData}
              language={language}
            />
          </div>
        </div>
      </div>

      {/* Fixed footer with stats and powered by */}
      <FooterStats
        layout={layout}
        dimensionUnit={barcodeData.dimensionUnit}
        pageUnit={pageOptions.pageUnit}
        language={language}
      />
    </div>
  );
}
