import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslation } from "@/lib/i18n";

export function UpdateNotifier() {
  const { t } = useTranslation();
  const [updateDownloaded, setUpdateDownloaded] = useState(false);

  useEffect(() => {
    window.api?.onUpdateAvailable?.(() => {
      toast.info("Hay una actualización disponible. Descargando…");
    });

    window.api?.onUpdateDownloaded?.(() => {
      setUpdateDownloaded(true);
      toast.success("Actualización lista. Reinicia para instalar.");
    });
  }, []);

  if (!updateDownloaded) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded shadow-lg border space-y-2 z-50">
      <p className="text-sm text-slate-700 font-medium">
        {t("updateDownloaded")}
      </p>
      <Button onClick={() => window.api?.quitAndInstall?.()} size="sm">
        {t("reboot")}
      </Button>
    </div>
  );
}
