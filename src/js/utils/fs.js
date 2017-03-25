//@flow

import fs from "fs";
import { ipcRenderer } from "electron";

export const loadFile = (path: string) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

export function saveFile(path: string, content: string) {
  ipcRenderer.send("writeFile", path, content);
}
