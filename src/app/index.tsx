"use client";

import { Toaster } from "@/components/ui/sonner";
import { UpdateNotifier } from "@/components/update-notifier";
import BarcodeGenerator from "./barcode";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      const anchor = el.closest("a") as HTMLAnchorElement | null;

      if (anchor && anchor.href.startsWith("http")) {
        e.preventDefault();
        window.api.openExternalLink(anchor.href);
      }
    };

    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return (
    <section id="app">
      <BarcodeGenerator />
      <UpdateNotifier />
      <Toaster richColors />
    </section>
  );
}

export default App;
