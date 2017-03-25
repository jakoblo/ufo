//@flow
import * as t from "./sel-actiontypes";
import * as selectors from "./sel-selectors";
import * as c from "./sel-constants";
import fsWatch from "../watch/fs-watch-index";
import fsWrite from "../write/fs-write-index";
import * as fsMergedSelector from "../fs-merged-selectors";
import FolderEditor
  from "../../view-folder/view-folder-editor/folder-editor-index";
import App from "../../app/app-index";
import ViewFile from "../../view-file/vf-index";
import nodePath from "path";
import * as FileActions from "../../file-item/fi-actions";
import * as _ from "lodash";
import { ipcRenderer } from "electron";

import type { ThunkArgs, Action } from "../../types";

/*
 * Sets set selection to the given files
 * used by all selecion actions
 */
export function set(pathArray: Array<string>) {
  return function(dispatch: Function, getState: Function) {
    let fileList = [];
    let lastRoot = null;

    pathArray.forEach(path => {
      let root = nodePath.dirname(path);
      let filename = nodePath.basename(path);
      if (lastRoot && lastRoot != root) {
        throw "Selection with different root folders is not possible";
      }
      lastRoot = root;
      fileList.push(filename);
    });

    if (fileList.length > 1) {
      //Close Appending View if multiple files are selected
      //@TODO is Dirty
      dispatch(App.actions.changeAppPath(null, lastRoot));
      dispatch(ViewFile.actions.closePreview());
    }

    dispatch({
      type: t.SET_SELECTION,
      payload: {
        root: lastRoot,
        files: fileList
      }
    });
  };
}

/*
 * Adds the List of given paths to the selection
 * Ctrl Click on file & used by expandToFile()
 */
export function filesAdd(pathArray: Array<string>) {
  return function(dispatch: Function, getState: Function) {
    let previousRoot = getState()[c.NAME].get("root");
    let selectedFiles = getState()[c.NAME].get("files").toJS().map(filename => {
      return nodePath.join(previousRoot, filename);
    });
    pathArray.forEach((filePath, index) => {
      let root = nodePath.dirname(filePath);
      if (previousRoot != root) {
        // Reset Selection if root is differnt
        (previousRoot = root), (selectedFiles = []);
      }
      if (selectedFiles.indexOf(filePath) < 0) {
        // skip is already exists
        selectedFiles.push(filePath);
      }
    });
    dispatch(set(selectedFiles));
  };
}

/*
 * Base on current selection
 */
export function dirNext() {
  return function(dispatch: Function, getState: Function) {
    let currentSelection = selectors.getSelection(getState());
    let nextFolder = fsWatch.selectors.getDirNext(
      getState(),
      currentSelection.get("root")
    );
    if (nextFolder) dispatch(dirSet(nextFolder));
  };
}

/*
 * Base on current selection
 */
export function dirPrevious() {
  return function(dispatch: Function, getState: Function) {
    let currentSelection = selectors.getSelection(getState());
    let prevFolder = fsWatch.selectors.getDirPrevious(
      getState(),
      currentSelection.get("root")
    );
    if (prevFolder) dispatch(dirSet(prevFolder));
  };
}

/*
 * used by arrow right/left navigation
 * selects active or first file in the folder
 */
export function dirSet(root: string) {
  return function(dispatch: Function, getState: Function) {
    const state = getState();
    let openFile = fsWatch.selectors.getOpenFileOf(state, root);

    // @TODO Use Existing Factory somehow
    let firstFile = FolderEditor.selectors.getFilesInEditor_Factory()(
      state,
      root
    )[0];
    if (openFile) {
      dispatch(set([nodePath.join(root, openFile)]));
    } else if (firstFile) {
      dispatch(
        App.actions.changeAppPath(
          null,
          nodePath.join(root, firstFile),
          false,
          true
        )
      );
    } else {
      dispatch({
        type: t.SET_SELECTION,
        payload: {
          root: root,
          files: []
        }
      });
    }
  };
}

/*
 * Navigate up in the focused Folder/View
 */
export let fileNavUp = () => fileNav(-1);

/*
 * Navigate down in the focused Folder/View
 */
export let fileNavDown = () => fileNav(+1);

/*
 * Navigate Up and Down in the focused Folder/View
 * Base on current Selection the "next" file will be selected
 * Changes the App path to the new folder
 */
function fileNav(direction: number) {
  return function(dispatch: Function, getState: Function) {
    const state = getState();
    const currentSelectionRoot = selectors.getSelection(getState()).get("root");
    const firstDir = fsWatch.selectors.getDirSeq(getState())[0];

    // Path of active Folder
    // If there is nothing selected, take the first folder
    const path = currentSelectionRoot || firstDir;

    const fileList = FolderEditor.selectors.getFilesInEditor_Factory()(
      state,
      path
    );
    const focusedFile = fsMergedSelector.getFocusedFileOf(state, path);
    const focusedFileIndex = fileList.indexOf(focusedFile);
    const newActiveName = fileList[focusedFileIndex + direction];

    if (newActiveName) {
      dispatch(
        FileActions.show(
          fsWatch.selectors.getFile(state, nodePath.join(path, newActiveName)),
          true
        )
      );
    }
  };
}

/**
 * Base on current selection
 */
export function selectAll() {
  return function(dispatch: Function, getState: Function) {
    let state = getState();
    let root = state[c.NAME].get("root");
    // @TODO Use Existing Factory somehow
    let allFiles = fsMergedSelector
      .getFiltedBaseArrayOfFolder_Factory()(state, root)
      .map(filename => {
        return nodePath.join(root, filename);
      });
    dispatch(set(allFiles));
  };
}

/*
 * Moves all Selected files to Trash
 */
export function toTrash() {
  return function(dispatch: Function, getState: Function) {
    fsWrite.actions.moveToTrash(
      selectors.getSelectionPathList(getState()).toJS()
    );
  };
}

/*
 * Start a FileDrag for all selected files
 */
export function startDrag() {
  return function(dispatch: Function, getState: Function) {
    let selection = selectors.getSelection(getState());
    let selectedFiles = selection.get("files").toJS().map(filename => {
      return nodePath.join(selection.get("root"), filename);
    });
    ipcRenderer.send("ondragstart", selectedFiles);
  };
}
