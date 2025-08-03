const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("api", {
  readConfig: () => ipcRenderer.invoke("read-config"),
  writeConfig: (data) => ipcRenderer.invoke("write-config", data),
  print: () => ipcRenderer.invoke("print"),
  onUpdateAvailable: (callback) => ipcRenderer.on("update_available", callback),
  onUpdateDownloaded: (callback) =>
    ipcRenderer.on("update_downloaded", callback),
  quitAndInstall: () => ipcRenderer.send("quit_and_install"),
  openExternalLink: (url) => ipcRenderer.invoke("open-external-link", { url }),
});
