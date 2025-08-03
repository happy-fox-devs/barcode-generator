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
    <div className="fixed right-4 bottom-4 z-50 space-y-2 rounded border bg-white p-4 shadow-lg">
      <p className="text-sm font-medium text-neutral-700">
        {t("updateDownloaded")}
      </p>
      <Button onClick={() => window.api?.quitAndInstall?.()} size="sm">
        {t("reboot")}
      </Button>
    </div>
  );
}
