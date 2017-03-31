//@flow

import { BrowserWindow, ipcMain } from "electron";
import fs from "fs";

export default function ipcListener(/*handleNewWindow: Function */) {
  ipcMain.on("ondragstart", (event, filePath) => {
    event.sender.startDrag({
      files: filePath,
      icon: __dirname + "/../../themes/default/img/multiDragPlaceholder.png"
    });
  });

  // ipcMain.on("closeWindow", function(event, bwid) {
  //   let bw = BrowserWindow.fromId(bwid);
  //   bw.close();
  // });

  // ipcMain.on("global.newWindow", function(event, path) {
  //   console.log("global.ipcMain.newWindow: " + path);
  //   handleNewWindow();
  // });

  ipcMain.on("writeFile", function(event, path, content) {
    fs.writeFile(path, content);
  });
}
