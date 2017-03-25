//@flow

import { createSelector } from "reselect";
import nodePath from "path";
import FsWrite from "../write/fs-write-index";
import ViewFile from "../../view-file/vf-index";
import { Map, List } from "immutable";

import type { WatchedFile } from "./fs-watch-watcher";

const getPath = (state, path) => path;
const getState = (state, path) => state;

/*
 * Get FileInformation from Watcher (Disk) to the given file
 */
export const getFile = (state: any, path: string): Map<string, any> => {
  const dir = nodePath.dirname(path);
  const base = nodePath.basename(path);
  return state.fs.getIn([dir, "files", base]);
};

/*
 * Get all Files with Information from Watcher (Disk) to the given Folder
 */
export const getFilesOfFolder = (
  state: any,
  path: string
): List<Map<WatchedFile>> => {
  let dir = state.fs.getIn([path, "files"]);
  if (dir) {
    return dir;
  } else {
    console.log(state.fs.toJS());
    throw "Request folder which is not watched: " + path;
  }
};

/*
 * Get all Filepaths in the given Folder
 */
export const getFilesSeqOf = (state: any, path: string): Array<string> =>
  getFilesOfFolder(state, path).keySeq().toJS();

/*
 * Get all Folderpaths which are Visible as a View
 */
export const getDirSeq = (state: any): Array<string> =>
  state.fs.keySeq().toJS();

/*
 * Get the next (right-side) Viewfolder from the given one
 */
export const getDirNext = (state: any, path: string): string =>
  getDirDirection(state, path, +1);

/*
 * Get the previous (left-side) Viewfolder from the given one
 */
export const getDirPrevious = (state: any, path: string): string =>
  getDirDirection(state, path, -1);

/*
 * Get the Watcher State for the given Folder
 */
export const getDirState = (
  state: any,
  path: string
): {
  path: string,
  ready: boolean,
  error: Object | null
} => {
  return {
    path: path,
    ready: state.fs.get(path).get("ready"),
    error: state.fs.get(path).get("error")
  };
};

function getDirDirection(state: any, path: string, direction: number): string {
  let directorySeq = getDirSeq(state);
  let currentIndex = directorySeq.findIndex(dir => {
    return dir == path;
  });
  let nextPath = directorySeq[currentIndex + direction];
  return nextPath;
}

/*
 * openFile
 * is the file/folder which is opend in the next View
 */
export const getOpenFileOf = createSelector(
  getState,
  getPath,
  (state: any, path: string): string => {
    let nextDir = getDirNext(state, path);
    if (!nextDir) {
      // @TODO fs selection has to know things about preview, not nice
      let previewPath = ViewFile.selectors.getViewFilePath(state, path);
      if (previewPath && nodePath.dirname(previewPath) == path) {
        return nodePath.basename(previewPath);
      } else {
        return "";
      }
    } else {
      return nodePath.basename(nextDir);
    }
  }
);

/*
 * Is the given File opend in an other View?
 */
export function isFileOpen(state: any, path: string): boolean {
  const dir = nodePath.dirname(path);
  const base = nodePath.basename(path);
  const openFile = getOpenFileOf(state, dir);
  if (!openFile) {
    return false;
  } else {
    return base == openFile;
  }
}
