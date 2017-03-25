//@flow

"use strict";

var nodePath = require("path");
var mkdirp = require("mkdirp");
var fs = require("mz/fs");
var c = require("../fs-write-constants");
var t = require("../fs-write-actiontypes");
import move from "./fs-write-worker-move";
import copy from "./fs-write-worker-copy";

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

    Promise.all(
      // First, check if every subtask is valid and possible
      Object.keys(this.task.subTasks).map(key =>
        this.validateSubTask(this.task.subTasks[key]))
    )
      .then(() => {
        // validation is successfull
        console.log("Everything fine, start");
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
          .catch(this.reportError);
      })
      .catch(this.reportError);
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
    this.lastProgressReport = Date.now() + 200;
    this.selfCallTimeout = null;
  }

  request = () => {
    if (this.lastProgressReport + 1000 > Date.now()) {
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
