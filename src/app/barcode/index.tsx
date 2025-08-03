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
    codes
  );

  return (
    <div className="min-h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 w-screen box-border flex flex-col h-screen">
      <div className="mx-auto max-w-7xl flex flex-col grow">
        {/* Header */}
        <div className="flex items-center justify-between h-[100px]">
          <div className="text-center flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              {t("title")}
            </h1>
            <p className="text-slate-600">{t("subtitle")}</p>
          </div>
          <div className="ml-4">
            <LanguageSelector
              language={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-2 h-0 grow">
          {/* Configuration Panel - Con altura máxima y scroll */}
          <div className="lg:col-span-1 space-y-2 h-auto overflow-hidden min-h-[470px] p-2 pr-0">
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="w-full h-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="design">{t("design")}</TabsTrigger>
                <TabsTrigger value="page">{t("page")}</TabsTrigger>
              </TabsList>

              {/* Contenido con scroll */}
              <div className="h-0 grow overflow-y-auto bg-white rounded-xl shadow-sm border">
                <TabsContent value="design" className="space-y-2 mt-2">
                  <BarcodeSettings
                    barcodeData={barcodeData}
                    setBarcodeData={setBarcodeData}
                    generateRandom={generateRandom}
                    sequenceOptions={sequenceOptions}
                    setSequenceOptions={setSequenceOptions}
                    language={language}
                  />
                </TabsContent>

                <TabsContent value="page" className="space-y-2 mt-2">
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
          <div className="lg:col-span-2 h-full flex flex-col gap-2 min-h-[470px] p-2 pl-0">
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
