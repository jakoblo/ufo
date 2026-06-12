//@flow
/* global MAIN_WINDOW_WEBPACK_ENTRY */

/**
 * @file Starting point for the application (electron main process).
 */

import ipcListener from "./main-ipc";
import { app, BrowserWindow, protocol, globalShortcut } from "electron";
import windowStateKeeper from "electron-window-state";
import os from "os";
import loadAppMenu from "./menu/main-menu";

let window;
let mainWindowState;

app.on("ready", function() {
  loadAppMenu();

  // Register Protocol to load and show local images
  protocol.registerFileProtocol(
    "local",
    (request, callback) => {
      const url = request.url.substr(7);
      callback({ path: url });
    },
    error => {
      if (error) console.error("Failed to register protocol");
    }
  );

  mainWindowState = windowStateKeeper({
    defaultWidth: 1000,
    defaultHeight: 800
  });
  startWindow();
  ipcListener();

  globalShortcut.register("CommandOrControl+Shift+I", () => {
    if (window) window.webContents.toggleDevTools();
  });
});

/**
 * if all windows are close, the app quites no windows & linux
 */
app.on("window-all-closed", () => {
  if (os.platform() != "darwin") {
    app.quit();
  }
});

/* 'activate' is emitted when the user clicks the Dock icon (OS X) */
app.on("activate", () => {
  if (window == null) {
    startWindow();
  }
});

function startWindow() {
  window = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    resizable: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  });
  window.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
  window.webContents.on("will-navigate", event => {
    // Disable Navigation
    // prevent Drop files on window
    event.preventDefault();
  });

  window.on("closed", e => {
    window = null;
  });

  mainWindowState.manage(window);
}
