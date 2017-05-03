//@flow

import { BrowserWindow, ipcMain } from "electron";
import fs from "fs";

export default function ipcListener(/*handleNewWindow: Function */) {
  ipcMain.on("ondragstart", (event, filePath) => {
    const count = filePath.length;
    let imageName;
    switch (count) {
      case 1:
        imageName = "1";
        break;

      case 2:
        imageName = "2";
        break;

      case 3:
        imageName = "3";
        break;

      default:
        imageName = "4+";
    }

    event.sender.startDrag({
      files: filePath,
      icon: __dirname +
        "/../../themes/light-blue/img/dragging-count-" +
        imageName +
        ".png"
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
