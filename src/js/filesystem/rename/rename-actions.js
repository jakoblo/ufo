//@flow
import * as t from "./rename-actiontypes";
import * as selectors from "./rename-selectors";
import Selection from "../selection/sel-index";
import fsWrite from "../write/fs-write-index";
import nodePath from "path";
import * as _ from "lodash";

import type { Action, ThunkArgs } from "../../types";

export function renameSelected() {
  return function(dispatch: Function, getState: Function) {
    let currentSelectedFile = Selection.selectors.getFocusedFile(getState());
    if (currentSelectedFile) {
      dispatch(renameStart(currentSelectedFile));
    }
  };
}

export function renameStart(filePath: string): Action {
  return {
    type: t.RENAME_START,
    payload: {
      path: filePath
    }
  };
}

export function renameCancel(filePath: string): Action {
  return {
    type: t.RENAME_CANCEL,
    payload: {
      path: filePath
    }
  };
}

export function renameSave(filePath: string, newName: string) {
  return function(dispatch: Function, getState: Function) {
    dispatch({
      type: t.RENAME_SAVE,
      payload: {
        path: filePath,
        newName: newName
      }
    });

    fsWrite.actions.rename(
      filePath,
      nodePath.join(nodePath.dirname(filePath), newName)
    );
  };
}
