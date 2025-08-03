/// <reference types="vite/client" />

interface Window {
  api: {
    readConfig: () => Promise<any>;
    writeConfig: (data: any) => Promise<void>;
    print: () => Promise<void>;
    onUpdateAvailable: (callback: any) => Promise<void>;
    onUpdateDownloaded: (callback: any) => Promise<void>;
    quitAndInstall: () => Promise<void>;
  };
}
