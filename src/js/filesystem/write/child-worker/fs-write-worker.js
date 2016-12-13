'use strict';

var nodePath = require('path');
var mkdirp = require('mkdirp');
var fs = require('mz/fs')
var c = require('../fs-write-constants')
var t = require('../fs-write-actiontypes')
var utils = require('../fs-write-utils')
var utils = require('../fs-write-utils')
import move from './fs-write-worker-move'
import copy from './fs-write-worker-copy'

process.on('message', (m) => {
  mv(m.id, m.sources, m.target, m.options)
});

export default class FSWorker {

  constructor(task) {
    window.test = this
    this.task = task
    this.task.subTasks = this.buildSubTasks(this.task.sources)
    if(Object.keys(this.task.subTasks).length > 0) {
      this.start()
      this.progressReporter = new ProgressReporter(this.task)
    }
  }

  start = () => {
    window.store.dispatch({
      type: t.FS_WRITE_NEW,
      payload: this.task
    })

    Promise.all( Object.keys(this.task.subTasks).map( 
      key => this.validateSubTask(this.task.subTasks[key])
    ))
    .then(() => {
      // validation is successfull
      console.log('Everything fine, start')
      Promise.all( Object.keys(this.task.subTasks).map(key => {
        switch (this.task.subTasks[key].type) {
          case t.TASK_MOVE:
            return move(this.task.subTasks[key], this.storeProgress).then(() => {
              delete this.task.subTasks[key]
              this.progressReporter.request()
            })

          case t.TASK_COPY:
            return copy(this.task.subTasks[key], this.storeProgress).then(() => {
              delete this.task.subTasks[key]
              this.progressReporter.request()
            })
            
          default:
            throw "Dont know what to do with subTask type: "+this.task.subTasks[key].type
            break;
        }
      }))
      .then(() => {
        window.store.dispatch({
          type: t.FS_WRITE_DONE,
          payload: {
            id: this.task.id
          }
        })
        // process.exit()
      }).catch(this.reportError)
    }).catch(this.reportError)
  }

  storeProgress = (subTaskProgress) => {
    if(this.task.subTasks[subTaskProgress.destination]) {
      this.task.subTasks[subTaskProgress.destination].percentage = subTaskProgress.percentage
      this.progressReporter.request(this.task)
    }
  }

  buildSubTasks = (sources) => {
    let subTasks = {}
    sources
      .filter(source => (nodePath.dirname(source) != this.task.target))
      .forEach( source => {
        let destination = nodePath.join( this.task.target, nodePath.basename(source)) 
        subTasks[destination] = {
          id: this.task.id,
          source: source, 
          destination: destination, 
          type: this.task.type,
          percentage: 1,
          clobber: this.task.clobber
        }
      })
    return subTasks
  }

  reportError = (err) => {
    window.store.dispatch({
      type: t.FS_WRITE_ERROR,
      payload: { id: this.task.id },
      error: err
    })
    // process.exit()
  }

  validateSubTask = (subTask) => {
    return new Promise( (resolve, reject) => {

      const sourcePermissions = (subTask.type == t.TASK_MOVE) ? fs.constants.W_OK : fs.constants.R_OK || fs.constants.W_OK
      Promise.all([
        fs.access(subTask.source, sourcePermissions), // Can read Source
        fs.access(nodePath.dirname(subTask.destination), fs.constants.W_OK), // Can Write Target Parent?
        (subTask.clobber) ? true : this.validateNotAlreadyExists(subTask),
        (subTask.type == t.TASK_MOVE) ? this.noMoveInItSelf(subTask) : null
      ])
      .then(() =>{
        resolve(subTask)
      })
      .catch(reject)
    })
  }

  validateNotAlreadyExists = (subTask) => {
    return new Promise( (resolve, reject) => {
      fs.access(subTask.destination, fs.constants.W_OK)
        .then(() => {
          reject({
            code: c.ERROR_DEST_ALREADY_EXISTS,
            path: subTask.destination
          })
        }
        )
        .catch(resolve)
    })
  }

  noMoveInItSelf = (subTask) => {
    return new Promise( (resolve, reject) => {
      if(subTask.destination.indexOf(subTask.source) > -1) {
        reject({code: c.ERROR_MOVE_IN_IT_SELF})
      } else {
        resolve(subTask)
      }
    })
  }
}

class ProgressReporter {

  constructor(task) {
    this.task = task
    this.lastProgressReport = Date.now()+200
    this.selfCallTimeout = null
  }

  request = () => {
    if(this.lastProgressReport+1000 > Date.now()) {
      clearTimeout(this.selfCallTimeout)
      this.selfCallTimeout = setTimeout(this.request, 200)
      return
    }
    this.lastProgressReport = Date.now()
    window.store.dispatch({
      type: t.FS_WRITE_PROGRESS,
      payload: {
        id: this.task.id,
        subTasks: this.task.subTasks
      }
    })
  }
}