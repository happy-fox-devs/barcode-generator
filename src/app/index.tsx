"use client";

import { Toaster } from "@/components/ui/sonner";
import { UpdateNotifier } from "@/components/update-notifier";
import BarcodeGenerator from "./barcode";

function App() {
  return (
    <section id="app">
      <BarcodeGenerator />
      <UpdateNotifier />
      <Toaster richColors />
    </section>
  );
}

export default App;
