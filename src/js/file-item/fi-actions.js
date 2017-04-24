//@flow

import App from "../app/app-index";
import ViewFile from "../view-file/vf-index";
import Selection from "../filesystem/selection/sel-index";
import fsWrite from "../filesystem/write/fs-write-index";
import * as c from "./file-item-constants";
import fsRename from "../filesystem/rename/rename-index";
import nodePath from "path";
import { ipcRenderer, shell, remote } from "electron";
const { Menu, MenuItem } = remote;

import type { ThunkArgs } from "../types";

/**
 * Open File or Directory or hole Selection
 */
export function open(file: string) {
  return (dispatch: Function, getState: Function) => {
    getPathArray(file, getState).forEach(filePath => {
      shell.openItem(filePath);
    });
  };
}

/**
 * Opens view-folder for directory or view-file for file
 */
export function show(file: any, peakInFolder: boolean = false) {
  return (dispatch: Function, getState: Function) => {
    if (file.get("stats").isFile()) {
      dispatch(
        App.actions.changeAppPath(
          null,
          nodePath.dirname(file.get("path")),
          false,
          false
        )
      );
      dispatch(ViewFile.actions.showPreview(file.get("path")));
    } else {
      dispatch(
        App.actions.changeAppPath(null, file.get("path"), false, peakInFolder)
      );
    }
  };
}

/**
 * Drag of the Single file or the Selection
 */
export function startDrag(file: any) {
  return (dispatch: Function, getState: Function) => {
    ipcRenderer.send("ondragstart", getPathArray(file, getState));
  };
}

export function showContextMenu(
  file: any,
  asImage?: boolean,
  toggleImageCallback?: Function
) {
  return (dispatch: Function, getState: Function) => {
    let filePathArray = getPathArray(file, getState);
    let title = filePathArray.length > 1 ? filePathArray.length + " items" : "";

    let menu = new Menu();
    menu.append(
      new MenuItem({
        label: "Open " + title,
        click: () => {
          dispatch(open(file));
        }
      })
    );
    menu.append(
      new MenuItem({
        label: "Rename: " + '"' + file.get("base") + '"',
        click: () => {
          dispatch(fsRename.actions.renameStart(file.get("path")));
        }
      })
    );

    if (
      toggleImageCallback &&
      c.chromeImageSuffixes.indexOf(file.get("suffix")) > -1
    ) {
      menu.append(
        new MenuItem({
          label: "Toggle: Image",
          click: () => {
            if (toggleImageCallback) {
              toggleImageCallback();
            }
          }
        })
      );
    }
    menu.append(new MenuItem({ type: "separator" }));
    menu.append(
      new MenuItem({
        label: "Move " + title + " to Trash",
        click: () => {
          fsWrite.actions.moveToTrash(filePathArray);
        }
      })
    );
    menu.popup(remote.getCurrentWindow());
  };
}

/**
 * getPathArray
 * actions should maybe applied to multiples files if they are part of the selection too.
 * Because of that this function returns an array with the path of the of file or the whole selection
 */
function getPathArray(file: any, getState: Function) {
  if (file.get("selected")) {
    return Selection.selectors.getSelectionPathList(getState()).toJS();
  } else {
    return [file.get("path")];
  }
}
