//@flow
import * as t from "./fs-watch-actiontypes";
import watchHandler from "./fs-watch-watcher";
import type {
  WatchedFile,
  WatcherSettings,
  WatcherStack,
  Callback,
  UnlinkCallback,
  ReadyCallback,
  ErrorCallback
} from "./fs-watch-watcher";

import nodePath from "path";
import App from "../../app/app-index";
import type { ThunkArgs, Action } from "../../types";

const watcherSettings: WatcherSettings = {
  persistent: true,
  depth: 0,
  followSymlinks: false, // Symlinks are annoying on windows
  alwaysStat: true
};

/**
 * Creats a new FileSystem watcher with async Callbacks
 * they will dispatch further actions
 *
 * @param  {string} path
 */
export function watcherRequest(path: string) {
  return function(dispatch: Function, getState: Function) {
    dispatch(watcherReading(path));

    const addCallback: Callback = (fileObj: WatchedFile) => {
      dispatch(fileAdd(fileObj));
    };

    const unlinkCallback: UnlinkCallback = (
      fileObj: WatchedFile,
      activeWatcher: WatcherStack
    ) => {
      dispatch(fileUnlink(fileObj, activeWatcher));
    };

    const changeCallback: Callback = (fileObj: WatchedFile) => {
      dispatch(fileChange(fileObj));
    };

    const readyCallback: ReadyCallback = (
      path: string,
      files: WatcherStack
    ) => {
      dispatch(watcherReady(path, files));
    };

    const errorCallback: ErrorCallback = (path: string, err: Object) => {
      dispatch(watcherError(path, err));
    };

    let watcher = watchHandler.watch(
      path,
      watcherSettings,
      addCallback,
      unlinkCallback,
      changeCallback,
      readyCallback,
      errorCallback
    );
  };
}

/*
 * Close/Unwatch the FileSystem watcher for the given path
 */
export function watcherClose(path: string): Action {
  watchHandler.unwatch(path);
  return {
    type: t.WATCHER_CLOSE,
    payload: {
      path: path
    }
  };
}

let watcherReading = (path: string): Action => {
  return {
    type: t.WATCHER_READING,
    payload: {
      path: path
    }
  };
};

function watcherReady(path: string, files: WatcherStack) {
  return {
    type: t.WATCHER_READY,
    payload: {
      path: path,
      files: files
    }
  };
}

function watcherError(path: string, error: Object): Action {
  console.log(error, path);
  return {
    type: t.WATCHER_ERROR,
    payload: {
      error: error,
      path: path
    }
  };
}

function fileAdd(fileObj: WatchedFile): Action {
  return {
    type: t.FILE_ADD,
    payload: fileObj
  };
}

/**
 * Action Creator to remove file from view
 * It checks the if the removed path is currently watched
 * and changes the app Path if necessary to not look in an not existing folder
 */

function fileUnlink(fileObj: WatchedFile, activeWatcher: WatcherStack) {
  return (dispatch: Function, getState: Function) => {
    if (activeWatcher[fileObj.path]) {
      dispatch(App.actions.changeAppPath(null, nodePath.dirname(fileObj.path)));
    }
    dispatch({
      type: t.FILE_UNLINK,
      payload: fileObj
    });
  };
}

function fileChange(fileObj: WatchedFile): Action {
  return {
    type: t.FILE_CHANGE,
    payload: fileObj
  };
}
