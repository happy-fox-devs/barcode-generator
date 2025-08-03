const { app, BrowserWindow, ipcMain, Menu, shell } = require("electron");
const fs = require("fs");
const path = require("path");
const { autoUpdater } = require("electron-updater");

const isDev = !app.isPackaged;
const devURL = "http://localhost:5173";

const userDataPath = app.getPath("userData");

const configPath = path.join(userDataPath, "config.json");

if (!isDev) Menu.setApplicationMenu(null);

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
    win.removeMenu();
    win.setMenuBarVisibility(false);
    win.loadFile(path.join(__dirname, "..", "dist", "index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("window-all-closed", () => {
    win = null;

    if (!BrowserWindow.getAllWindows().length) {
      app.quit();
    }
  });

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("quit", () => {
  win = null;
});

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
    (ok, err) => {
      if (!ok) console.error("Print error:", err);
    },
  );
});

ipcMain.handle("open-external-link", (event, { url }) =>
  shell.openExternal(url),
);

autoUpdater.on("update-available", () => {
  win.webContents.send("update_available");
});
autoUpdater.on("update-downloaded", () => {
  win.webContents.send("update_downloaded");
});
ipcMain.on("quit_and_install", () => {
  if (win && !win.isDestroyed()) {
    win.removeAllListeners("close");
    win.destroy();
  }
  autoUpdater.quitAndInstall();
});
