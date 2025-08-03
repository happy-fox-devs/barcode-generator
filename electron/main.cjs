const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const { autoUpdater } = require("electron-updater");

const isDev = !app.isPackaged;
const devURL = "http://localhost:5173";

if (isDev) {
  configPath = path.join(app.getPath("userData"), "config.json");
} else {
  const configDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(configDir)) fs.mkdirSync(configDir);
  configPath = path.join(configDir, "config.json");
}

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    win.loadURL(devURL);
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
    win.webContents.session.webRequest.onHeadersReceived(
      (details, callback) => {
        callback({
          responseHeaders: {
            ...details.responseHeaders,
            "Content-Security-Policy": ["default-src 'self'"],
          },
        });
      }
    );
  }
}

// IPC: guardar y leer configuraciones
ipcMain.handle("read-config", () => {
  try {
    if (!fs.existsSync(configPath)) return {};
    return JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch (e) {
    console.warn("Error reading config:", e);
    return {};
  }
});

ipcMain.handle("write-config", (event, data) => {
  try {
    fs.writeFileSync(configPath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.warn("Error writing config:", e);
  }
});

ipcMain.handle("print", () => {
  if (!win) return;

  win.webContents.print(
    {
      silent: false,
      printBackground: true,
    },
    (success, errorType) => {
      if (!success) console.error("Error printing:", errorType);
    }
  );
});

app.whenReady().then(() => {
  createWindow();

  app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

autoUpdater.checkForUpdatesAndNotify();

autoUpdater.on("update-available", () => {
  win.webContents.send("update_available");
});

autoUpdater.on("update-downloaded", () => {
  win.webContents.send("update_downloaded");
});

ipcMain.on("quit_and_install", () => {
  autoUpdater.quitAndInstall();
});
