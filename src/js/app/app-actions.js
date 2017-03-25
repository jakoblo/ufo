//@flow
import * as t from "./app-actiontypes";
import * as c from "./app-constants";
import _ from "lodash";
import nodePath from "path";
import * as selectors from "./app-selectors";
import FileSystem from "../filesystem/watch/fs-watch-index";

import type { ThunkArgs, Action } from "../types";

let pathRoute = [];

/**
 * Change the path of folders that is displayed in the app.
 * Should be called by user actions (Click on a folder) or by walking through the history.
 * If you call it the first the, you need to Provied fromPath and toPath.
 * After that only of them is possible.
 *
 * @param  {string} fromPath - The first folder of the pathRout that will be displayed is optional
 * @param  {string} toPath - The last folder of the pathRout that will be displayed is optional
 * @param  {boolean} historyJump=false - true will not create a new history point
 * @param  {boolean} peak=false - The toPath is only a kind of preview and is not focused (keyboard arrow up/down navigation)
 */
export function changeAppPath(
  fromPath?: string | null,
  toPath?: string | null,
  historyJump?: boolean | number = false,
  peak?: boolean = false
) {
  return (dispatch: Function, getState: Function) => {
    if (fromPath && !toPath) {
      toPath = fromPath;
    }
    fromPath = fromPath || _.first(pathRoute);
    toPath = toPath || _.last(pathRoute);

    if (!fromPath || !toPath) {
      throw "Set 'from' and 'to' at the first call of changeAppPath()";
    }

    if (toPath.indexOf(fromPath) < 0) {
      // Set fromPath to Root
      fromPath = nodePath.parse(toPath).root;
    }

    let newPathRoute = buildPathRoute(fromPath, toPath);

    dispatch({
      type: t.APP_CHANGE_PATH,
      payload: {
        pathRoute: newPathRoute,
        historyJump: historyJump,
        peak: peak
      }
    });

    //@TODO is Dirty
    let closeFsWatcher = _.difference(pathRoute, newPathRoute);
    closeFsWatcher.reverse().forEach((path, index) => {
      // reverse is necessary to Keep always the right Order of paths
      dispatch(FileSystem.actions.watcherClose(path));
      pathRoute.splice(pathRoute.indexOf(path), 1);
    });

    let createFsWatcher = _.difference(newPathRoute, pathRoute);
    createFsWatcher.forEach((path, index) => {
      dispatch(FileSystem.actions.watcherRequest(path));
      pathRoute.push(path);
    });
  };
}

export function navigateToParentFolder() {
  return (dispatch: Function, getState: Function) => {
    let currentDir = _.last(FileSystem.selectors.getDirSeq(getState()));
    let parentDir = nodePath.dirname(currentDir);
    dispatch(changeAppPath(null, parentDir));
  };
}

export function historyBack() {
  return (dispatch: Function, getState: Function) => {
    dispatch(historyJump(-1));
  };
}

export function historyForward() {
  return (dispatch: Function, getState: Function) => {
    dispatch(historyJump(+1));
  };
}

function historyJump(direction: number) {
  return (dispatch: Function, getState: Function) => {
    let newPosition = selectors.getHistoryPosition(getState()) + direction;
    let Sequence = selectors.getHistorySequence(getState());

    if (-1 < newPosition && newPosition < Sequence.size) {
      let newPath = Sequence.get(newPosition);
      dispatch(
        changeAppPath(newPath.get("from"), newPath.get("to"), newPosition)
      );
    }
  };
}

/**
 * helper function that takes to paths and creates every "path step" between them
 */
function buildPathRoute(fromPath: string, toPath: string): Array<string> {
  let newPathRoute = [];
  let pathStep = toPath;
  while (pathStep != fromPath) {
    newPathRoute.unshift(pathStep);
    pathStep = nodePath.dirname(pathStep);
  }
  newPathRoute.unshift(fromPath);
  return newPathRoute;
}

export const setDisplayType = displayType => {
  return {
    type: t.APP_SET_DISPLAY_TYPE,
    payload: {
      displayType: displayType
    }
  };
};

export const setDisplayTypeSingle = () => {
  return {
    type: t.APP_SET_DISPLAY_TYPE,
    payload: {
      displayType: c.DISPLAY_TYPE_SINGLE
    }
  };
};

export const toggleDisplayType = () => {
  return (dispatch: Function, getState: Function) => {
    const currentType = selectors.getDisplayType(getState());
    let displayType = c.DISPLAY_TYPE_SINGLE;
    if (currentType == c.DISPLAY_TYPE_SINGLE) {
      displayType = c.DISPLAY_TYPE_COLUMNS;
    }
    dispatch(setDisplayType(displayType));
  };
};

export const setDisplayTypeColumns = (): Action => {
  return {
    type: t.APP_SET_DISPLAY_TYPE,
    payload: {
      displayType: c.DISPLAY_TYPE_COLUMNS
    }
  };
};

export const setViewType = (path: string, type: string): Action => {
  return {
    type: t.APP_SET_VIEW_TYPE,
    payload: {
      path: path,
      type: type
    }
  };
};

export const viewTypeToggle = (path: string) => {
  return (dispatch: Function, getState: Function) => {
    const currentViewSettings = selectors.getViewSettings(getState(), path);

    let viewType = c.FOLDER_VIEW_EDITOR;
    if (currentViewSettings.get("type") == c.FOLDER_VIEW_EDITOR) {
      viewType = c.FOLDER_VIEW_LIST;
    }

    dispatch(setViewType(path, viewType));
  };
};
