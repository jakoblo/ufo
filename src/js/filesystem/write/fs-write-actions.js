//@flow

import { ipcRenderer } from "electron";
import nodePath from "path";
import trash from "trash";
import fs from "mz/fs";
import fsWatch from "../watch/fs-watch-index";
import fsRename from "../rename/rename-index";
import { fork } from "child_process";
import fsWriteWorker from "./child-worker/fs-write-worker";
import * as c from "./fs-write-constants";
import * as t from "./fs-write-actiontypes";

import type { Action, ThunkArgs } from "../../types";
import type { Task, WorkerParams } from "./fs-write-types";

export function moveToTrash(sources: Array<string>) {
  let id = window.store.getState()[c.NAME].size;
  let payload = {
    id: id,
    type: t.TASK_TRASH,
    sources: sources,
    target: "Trash"
  };
  window.store.dispatch({
    type: t.FS_WRITE_NEW,
    payload: payload
  });

  sources.forEach(source => {
    trash([source])
      .then(() => {
        window.store.dispatch({
          type: t.FS_WRITE_DONE,
          payload: payload
        });
      })
      .catch(err => {
        window.store.dispatch({
          type: t.FS_WRITE_ERROR,
          payload: {
            id: id
          },
          error: err
        });
      });
  });
}

/**
 * target is Folder where should moved in
 */
export function move(sources: Array<string>, target: string) {
  startFsWorker({
    sources: sources,
    target: target,
    type: t.TASK_MOVE,
    clobber: false
  });
}

/**
 * target is Folder where should copied in
 */
export function copy(sources: Array<string>, target: string) {
  startFsWorker({
    sources: sources,
    target: target,
    type: t.TASK_COPY,
    clobber: false
  });
}

/**
 * source & destination = fullpath
 */
export function rename(source: string, destination: string) {
  let payload = {
    id: window.store.getState()[c.NAME].size,
    type: t.TASK_RENAME,
    sources: [source],
    target: destination
  };

  window.store.dispatch({
    type: t.FS_WRITE_NEW,
    payload: payload
  });

  fs
    .access(destination, fs.constants.R_OK) // test if already exists
    .then(() => {
      //destination already exists
      renameError({
        code: c.ERROR_DEST_ALREADY_EXISTS
      });
    })
    .catch(err => {
      if ((err = c.ERROR_NOT_EXISTS)) {
        // destination does not exists start renaming
        fs
          .rename(source, destination)
          .then(() => {
            window.store.dispatch({
              type: t.FS_WRITE_DONE,
              payload: payload
            });
          })
          .catch(renameError);
      } else {
        // unknown error
        renameError(err);
      }
    });

  function renameError(err) {
    window.store.dispatch({
      type: t.FS_WRITE_ERROR,
      payload: payload,
      error: err
    });
  }
}

/**
 * Remove Action from store
 */
export function removeAction(id: number) {
  return {
    type: t.FS_WRITE_REMOVE_ACTION,
    payload: {
      id: id
    }
  };
}

export function startFsWorker(
  workerParams: {
    id?: number,
    clobber: boolean,
    type: string,
    sources: Array<string>,
    target: string
  }
) {
  const paramsWithID = {
    // Create id there isnt one
    id: window.store.getState()[c.NAME].size,
    ...workerParams
  };
  new fsWriteWorker(paramsWithID);

  // var fsWriteWorker = fork(__dirname + '/child-worker/fs-write-worker.js');

  // fsWriteWorker.send({
  //   id: id,
  //   sources: sources,
  //   target: target,
  //   options
  // })

  // fsWriteWorker.on('message', function(response) {
  //   window.store.dispatch(response)
  // })

  // fsWriteWorker.on('close', (code) => {
  //   console.log(`fs write worker exit: ${code}`);
  // });
}

/**
 * Create a blank new folder and start a rename action for that
 */
export function newFolder(parentFolder: string) {
  return (dispatch: Function, getState: Function) => {
    let existingFiles = fsWatch.selectors.getFilesSeqOf(
      getState(),
      parentFolder
    );
    let folderName = "new Folder";

    if (existingFiles.indexOf(folderName) > -1) {
      let count = 2;
      while (existingFiles.indexOf(folderName + count) > -1) {
        count++;
      }
      folderName = folderName + count;
    }
    let newFolderPath = nodePath.join(parentFolder, folderName);

    fs
      .mkdir(nodePath.join(parentFolder, folderName))
      .then(() => {
        dispatch(fsRename.actions.renameStart(newFolderPath));
      })
      .catch(err => {
        alert(err);
      });
  };
}
