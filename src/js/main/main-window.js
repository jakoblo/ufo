//@flow

/**
 * We could maybe use instead https://www.npmjs.com/package/electron-window-manager
 * @author bunterWolf
 */

import { app, BrowserWindow } from "electron";
import os from "os";

/**
 *  Creates, stores and handeles Appliaction Windows (BrowserWindows)
 */
export default class WindowManager {
  windows = [];

  constructor() {
    app.on("window-all-closed", this.handleAllWindowsClosed);
  }
  /**
   * Create a new Window of the Application
   */
  new = () => {
    let browserWindow = new BrowserWindow({
      width: 800,
      height: 600,
      resizable: true,
      frame: os.platform() != "darwin" // Windows needs the ugly frame, linux?
    });
    browserWindow.loadURL("file://" + __dirname + "/../../html/window.html");
    browserWindow.on("closed", this.handleWindowClose);
    browserWindow.webContents.on("will-navigate", event => {
      // Disable Navigation
      // prevent Drop files on window
      event.preventDefault();
    });

    this.windows.push(browserWindow);
  };

  /**
   * @param {BrowserWindow} window
   */
  handleWindowClose = (window: BrowserWindow) => {
    this.windows.splice(this.windows.indexOf(window), 1);
    window = null; // Dereference the window object, usually you would store windows in an array if your app supports multi windows, this is the time when you should delete the corresponding element.
  };

  /**
   * if all windows are close, the app quites no windows & linux
   */
  handleAllWindowsClosed = () => {
    if (os.platform() != "darwin") {
      app.quit();
    }
  };
}
