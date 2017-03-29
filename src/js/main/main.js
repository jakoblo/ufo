//@flow

/**
 * @file Starting point for the application (electron main process).
 */

import { app } from "electron";
import WindowManager from "./main-window";
import loadAppMenu from "./menu/main-menu";
import ipcListener from "./main-ipc";

let windowManager = new WindowManager();

app.on("ready", function() {
  loadAppMenu(windowManager.new);
  ipcListener(windowManager.new);
  windowManager.new();
});
