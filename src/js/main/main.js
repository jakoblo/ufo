//@flow

/**
 * @file Starting point for the application (electron main process).
 */

import ipcListener from "./main-ipc";
import { app, BrowserWindow } from "electron";
import os from "os";

let window;

app.on("ready", function() {
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
    width: 800,
    height: 600,
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
}

// Disabled Multiwindow base
// may use in the future:
//
// import WindowManager from "./main-window";
// import loadAppMenu from "./menu/main-menu";
// let windowManager = new WindowManager();
// App Menu is disabled until we get multiwindow support ;)
// loadAppMenu(windowManager.new);
// ipcListener(windowManager.new);
// windowManager.new();
