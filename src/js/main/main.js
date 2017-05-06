//@flow

/**
 * @file Starting point for the application (electron main process).
 */

import ipcListener from "./main-ipc";
import { app, BrowserWindow, protocol } from "electron";
import windowStateKeeper from "electron-window-state";
import { enableLiveReload } from "electron-compile";
import os from "os";
import loadAppMenu from "./menu/main-menu";
import path from "path";

let window;
let mainWindowState;

app.on("ready", function() {
  enableLiveReload();
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
    webSecurity: false,
    allowRunningInsecureContent: true,
    resizable: true,
    frame: false //os.platform() != "darwin" // Windows needs the ugly frame, linux?
  });
  window.loadURL("file://" + __dirname + "/../../html/window.html");
  window.webContents.on("will-navigate", event => {
    // Disable Navigation
    // prevent Drop files on window
    event.preventDefault();
  });

  window.on("closed", e => {
    window = null;
  });

  // Let us register listeners on the window, so we can update the state
  // automatically (the listeners will be removed when the window is closed)
  // and restore the maximized or full screen state
  mainWindowState.manage(window);
}

// Disabled Multiwindow base
// may use in the future:
//
// import WindowManager from "./main-window";

// let windowManager = new WindowManager();
// App Menu is disabled until we get multiwindow support ;)
// ipcListener(windowManager.new);
// windowManager.new();
