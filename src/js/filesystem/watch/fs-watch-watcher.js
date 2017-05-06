//@flow

import chokidar from "chokidar";
import nodePath from "path";
import fs from "fs";
import type { Stats } from "fs";
import { TYPE_FILE, TYPE_DIR } from "./fs-watch-constants";

const logging = false;

export type WatchedFile = {
  base: string,
  suffix: string,
  name: string,
  root: string,
  path: string,
  type: typeof TYPE_DIR | typeof TYPE_FILE,
  stats: Stats
};

export type WatcherSettings = {
  persistent?: boolean,
  depth?: number,
  ignored?: RegExp,
  followSymlinks?: false, // Symlinks are annoying on windows
  alwaysStat?: boolean
};

export type Callback = (file: WatchedFile) => void;
export type UnlinkCallback = (
  file: WatchedFile,
  watcherStack: WatcherStack
) => void;
export type ReadyCallback = (root: string, files: HoldingLine) => void;
export type ErrorCallback = (path: string, error: Object) => void;

type watcherEntry = {
  watcher: chokidar,
  holdingLine: HoldingLine,
  ready: boolean
};

type HoldingLine =
  | {
      [fileBase: string]: WatchedFile
    }
  | Object;

export type WatcherStack =
  | {
      [folderPath: string]: watcherEntry
    }
  | Object;

/* ChokidarHandler - creates usable ChokdiarWatcher */
class ChokidarHandler {
  // Collects all active Watchers
  watcherStack: WatcherStack;

  constructor() {
    this.watcherStack = {};
  }

  /*
   * Create a new Watcher to watch a direcotry
   */
  watch = (
    path: string,
    settings: WatcherSettings,
    addCallback: Callback,
    unlinkCallback: UnlinkCallback,
    changeCallback: Callback,
    readyCallback: ReadyCallback,
    errorCallback: ErrorCallback
  ): Object => {
    this._verify(path, settings);
    let watcher = chokidar.watch(path, settings);
    this.watcherStack[path] = {
      watcher: watcher,
      holdingLine: {},
      ready: false
    };
    let root = path;

    // Check if folder exists and is readable / chokidar doesn't do that
    fs.access(path, fs.constants.R_OK || fs.constants.W_OK, err => {
      if (err) {
        if (errorCallback) {
          errorCallback(root, err);
        }
        this.unwatch(root);
      }
    });

    // Add Listener to the watcher and bind the curren parameters to them

    if (addCallback) {
      watcher.on(
        "add",
        this._handleEventAdd.bind(this, addCallback, root, TYPE_FILE)
      );
      watcher.on(
        "addDir",
        this._handleEventAdd.bind(this, addCallback, root, TYPE_DIR)
      );
    }
    if (unlinkCallback) {
      watcher.on(
        "unlink",
        this._handleEventDelete.bind(this, unlinkCallback, root, TYPE_FILE)
      );
      watcher.on(
        "unlinkDir",
        this._handleEventDelete.bind(this, unlinkCallback, root, TYPE_DIR)
      );
    }
    if (changeCallback) {
      watcher.on(
        "change",
        this._handleEventChange.bind(this, changeCallback, root, TYPE_FILE)
      );
    }
    if (readyCallback) {
      watcher.on("ready", this._handleReady.bind(this, readyCallback, root));
    }
    if (errorCallback) {
      watcher.on("error", errorCallback.bind(this, root));
    }
    if (logging) {
      watcher.on("ready", this._logging.bind(this, watcher, root));
    }
    return watcher;
  };

  unwatch = (path: string) => {
    if (this.watcherStack[path]) {
      this.watcherStack[path].watcher.close();
      delete this.watcherStack[path];
    }
  };

  _handleEventChange(
    changeCallback: Callback,
    root: string,
    type: string,
    path: string,
    stats: Stats
  ) {
    let fileObj = this._createFileObj(...arguments);
    changeCallback(fileObj);
  }

  _handleEventDelete(
    unlinkCallback: UnlinkCallback,
    root: string,
    type: string,
    path: string,
    stats: Stats
  ) {
    if (path == root) {
      console.error(
        'chokikar wants to remove "',
        path,
        '" which is prevented, should be wrong.'
      );
      return;
    }
    let fileObj = this._createFileObj(...arguments);
    unlinkCallback(fileObj, this.watcherStack);
  }

  _handleEventAdd(
    addCallback: Callback,
    root: string,
    type: string,
    path: string,
    stats: Stats
  ) {
    let fileObj = this._createFileObj(...arguments);
    if (root == path) {
      return; // the file is direcotry itself. Chokidar... i don't know why
    }
    if (stats.isSymbolicLink()) {
      return; // Ignore Symbolic Links, they are anoying... and can crash node/chokidar on windows
    }
    if (nodePath.dirname(path) != root) {
      // Prevent adding of subfolder files
      // Dont know why, depth: 0 seems not to work that well in chokidar
      return;
    }
    if (this.watcherStack[root].ready) {
      addCallback(fileObj);
    } else {
      this.watcherStack[root].holdingLine[fileObj.base] = fileObj;
    }
  }

  _handleReady(readyCallback: ReadyCallback, root: string) {
    readyCallback(root, this.watcherStack[root].holdingLine);
    this.watcherStack[root].ready = true;
    delete this.watcherStack[root].holdingLine;
  }

  _verify = (path: string, settings: Object) => {
    if (this.watcherStack[path] != undefined) {
      throw "Try to watch the same directory again!";
    }
    if (settings.alwaysStat == false) {
      throw "Chokidar Settings 'alwaysStat' should be true";
    }
  };

  _createFileObj(
    callback: Function,
    root: string,
    type: string,
    path: string,
    stats: Stats
  ): WatchedFile {
    let pathObj = nodePath.parse(path);
    return {
      base: pathObj.base,
      suffix: pathObj.ext,
      name: pathObj.name,
      root: root,
      path: path,
      type: type,
      stats: stats
    };
  }

  _logging(watcher: chokidar, root: string) {
    watcher
      .on("add", path => console.log(`File ${path} has been added`, root))
      .on("change", path => console.log(`File ${path} has been changed`, root))
      .on("unlink", path => console.log(`File ${path} has been removed`, root))
      .on("addDir", path =>
        console.log(`Directory ${path} has been added`, root)
      )
      .on("unlinkDir", path =>
        console.log(`Directory ${path} has been removed`, root)
      )
      .on("error", error => console.log(`Watcher error: ${error}`, root))
      .on("ready", () =>
        console.log("Initial scan complete. Ready for changes", root)
      );
  }
}

export default new ChokidarHandler();
