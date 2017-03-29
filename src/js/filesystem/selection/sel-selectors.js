//@flow

import { createSelector } from "reselect";
import FS from "../watch/fs-watch-index";
import nodePath from "path";
import { List } from "immutable";

export const getSelection = (state: any): any => state.selection;

/*
 * Folder path in which items currentlich selelected
 */
export const getSelectionRoot = (state: any): string =>
  state.selection.get("root");

/*
 * List of paths of all selected files
 */
export const getSelectionPathList = createSelector(getSelection, selection => {
  let root: string = selection.get("root");
  let files = selection.get("files");
  if (files) {
    return files.map(base => {
      return nodePath.join(root, base);
    });
  } else {
    return List([]);
  }
});

/*
 * The Focused File is last File which is added to the selection
 */
export const getFocusedFile = (state: any): string => {
  let root = state.selection.get("root");
  let files = state.selection.get("files");
  if (root && files.size > 0) {
    return nodePath.join(root, files.last());
  } else {
    return "";
  }
};

/*
 * Get Selected Files of the given Folder
 */
export const getSelectionOfFolder = (
  state: any,
  path: string
): List<string> | null => {
  if (path == state.selection.get("root")) {
    return state.selection.get("files");
  } else {
    return null;
  }
};

/*
 * Is File selected? Facory
 */
export const isFileSelected__Factory = () => {
  return createSelector(
    [getSelectionPathList, (state, path) => path],
    (selectionPathList, path) => {
      return selectionPathList.find(entry => entry == path);
    }
  );
};

// repalced by filter, but keep it here for now
// export const getSelectTypeInput = (state) => state.selection.getIn(['selectTypeInput'])
