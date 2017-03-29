//@flow

"use strict";

import nodePath from "path";
import mkdirp from "mkdirp";
import fs from "mz/fs";
import * as c from "../fs-write-constants";
import * as t from "../fs-write-actiontypes";
import move from "./fs-write-worker-move";
import copy from "./fs-write-worker-copy";
import trash from "trash";

import type {
  WorkerParams,
  Task,
  SubTask,
  SubTasks,
  ProgressReport
} from "../fs-write-types";

process.on("message", m => {
  // mv(m.id, m.sources, m.target, m.options);
});

export default class FSWorker {
  task: Task;
  progressReporter: ProgressReporter;

  constructor(params: WorkerParams) {
    const subTasks = this.buildSubTasks(params);

    this.task = {
      ...params,
      subTasks,
      errors: {},
      finished: false,
      clobber: params.clobber
    };

    if (Object.keys(subTasks).length > 0) {
      this.start();
      this.progressReporter = new ProgressReporter(this.task);
    } else {
      console.log("Nothing to do", this.task);
    }
  }

  start = () => {
    // Send FS-Write start to store
    window.store.dispatch({
      type: t.FS_WRITE_NEW,
      payload: this.task
    });

    // First, check if every subtask is valid and possible
    // Or cancel bevore anything is done
    Promise.all(
      Object.keys(this.task.subTasks).map(key =>
        this.validateSubTask(this.task.subTasks[key]))
    )
      .then(() => {
        // all subtasks are valid
        // Now we check if we have to move existing destinations for to trash
        // bevore copy/move are able to start
        Promise.all(
          Object.keys(this.task.subTasks).map(key => {
            return new Promise((resolve, reject) => {
              // File exists already?
              fs.access(
                this.task.subTasks[key].destination,
                fs.constants.W_OK,
                err => {
                  if (err && err.code == c.ERROR_NO_SUCH_FILE) {
                    resolve(); // destination doesnt exist already, free space to move to
                    return;
                  }

                  if (err) {
                    reject(err); // Unknown error
                    return;
                  }

                  // No Error, the is already a file/folder at the destination
                  // And it is write able
                  if (this.task.subTasks[key].clobber) {
                    // Allowed to overwrite, move it to trash, to make room
                    // for the new file/folder
                    trash(this.task.subTasks[key].destination)
                      .then(resolve)
                      .catch(reject);
                  } else {
                    // Not allowed to overwrite = error
                    // Should handeld already by validateSubTask
                    throw "Not allowed to overwrite, should already be canceld by validateSubTask";
                  }
                }
              );
            });
          })
        )
          .then(() => {
            // Validation was successfull
            // And file/move at the destination where moved to trash
            // Time to start copy/move
            Promise.all(
              Object.keys(this.task.subTasks).map(key => {
                switch (this.task.subTasks[key].type) {
                  case t.TASK_MOVE:
                    return move(
                      this.task.subTasks[key],
                      this.storeProgress
                    ).then(() => {
                      delete this.task.subTasks[key];
                      this.progressReporter.request();
                    });

                  case t.TASK_COPY:
                    return copy(
                      this.task.subTasks[key],
                      this.storeProgress
                    ).then(() => {
                      delete this.task.subTasks[key];
                      this.progressReporter.request();
                    });

                  default:
                    throw "Dont know what to do with subTask type: " +
                      this.task.subTasks[key].type;
                }
              })
            )
              .then(() => {
                window.store.dispatch({
                  type: t.FS_WRITE_DONE,
                  payload: {
                    id: this.task.id
                  }
                });
                // process.exit()
              })
              .catch(this.reportError); // Error in MOVE/COPY
          })
          .catch(this.reportError); // Error in move to trash (handlng overwrite)
      })
      .catch(this.reportError); // Error in Task validation
  };

  storeProgress = (subTaskProgress: ProgressReport) => {
    if (this.task.subTasks[subTaskProgress.destination]) {
      this.task.subTasks[
        subTaskProgress.destination
      ].percentage = subTaskProgress.percentage;
      this.progressReporter.request(this.task);
    }
  };

  /**
   * Build Subtask for every source
   */
  buildSubTasks = (params: WorkerParams): SubTasks => {
    const subTasks = {};
    params.sources
      .filter(source => nodePath.dirname(source) != params.target) // In same folder can be ignored
      .forEach(source => {
        const destination = nodePath.join(
          params.target,
          nodePath.basename(source)
        );
        const subTask: SubTask = {
          id: params.id,
          source: source,
          destination: destination,
          type: params.type,
          percentage: 1,
          clobber: params.clobber
        };
        subTasks[destination] = subTask;
      });
    return subTasks;
  };

  reportError = (err: Object) => {
    window.store.dispatch({
      type: t.FS_WRITE_ERROR,
      payload: { id: this.task.id },
      error: err
    });
    // process.exit()
  };

  // Setup all needed Promises to make sure that the subTask
  // is valid and possible
  validateSubTask = (subTask: SubTask): Promise<*> => {
    return new Promise((resolve, reject) => {
      const sourcePermissions = subTask.type == t.TASK_MOVE
        ? fs.constants.W_OK
        : fs.constants.R_OK || fs.constants.W_OK;

      Promise.all([
        fs.access(subTask.source, sourcePermissions), // Can read Source
        fs.access(nodePath.dirname(subTask.destination), fs.constants.W_OK), // Can Write Target Parent?
        subTask.clobber ? true : this.validateNotAlreadyExists(subTask), //validateNotAlreadyExists
        subTask.type == t.TASK_MOVE ? this.noMoveInItSelf(subTask) : null //noMoveInItSelf
      ])
        .then(() => {
          resolve(subTask);
        })
        .catch(reject);
    });
  };

  validateNotAlreadyExists = (subTask: SubTask): Promise<*> => {
    return new Promise((resolve, reject) => {
      fs
        .access(subTask.destination, fs.constants.W_OK)
        .then(() => {
          reject({
            code: c.ERROR_DEST_ALREADY_EXISTS,
            path: subTask.destination
          });
        })
        .catch(resolve);
    });
  };

  // Validate that the folder isnt moving into it self.
  // Just checking the source and destination path
  noMoveInItSelf = (subTask: SubTask): Promise<*> => {
    return new Promise((resolve, reject) => {
      if (subTask.destination.indexOf(subTask.source) > -1) {
        reject({ code: c.ERROR_MOVE_IN_IT_SELF });
      } else {
        resolve(subTask);
      }
    });
  };
}

class ProgressReporter {
  task: Task;
  lastProgressReport: number;
  selfCallTimeout: any;

  constructor(task: Task) {
    this.task = task;
    this.lastProgressReport = Date.now() + 100;
    this.selfCallTimeout = null;
  }

  request = () => {
    if (this.lastProgressReport + 300 > Date.now()) {
      // Already a report in the last second.
      // Try in 200ms again
      clearTimeout(this.selfCallTimeout);
      this.selfCallTimeout = setTimeout(this.request, 200);
      return;
    }
    this.lastProgressReport = Date.now();
    window.store.dispatch({
      type: t.FS_WRITE_PROGRESS,
      payload: {
        id: this.task.id,
        subTasks: this.task.subTasks
      }
    });
  };
}
