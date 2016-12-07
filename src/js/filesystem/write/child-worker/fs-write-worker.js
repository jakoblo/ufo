'use strict';

/**
 * Modified from mv
 * https://www.npmjs.com/package/mv
 */

var nodePath = require('path');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var progress = require('progress-stream');
var fs = require('mz/fs')
var c = require('../fs-write-constants')
var t = require('../fs-write-actiontypes')
var utils = require('../fs-write-utils')
var utils = require('../fs-write-utils')
import move from './fs-write-worker-move'
import copy from './fs-write-worker-copy'

process.on('message', (m) => {
  mv(m.id, m.sources, m.targetFolder, m.options)
});

export default function mv(task, dispatch){

  let subTasks = task.sources
    .filter(source => (nodePath.dirname(source) != task.targetFolder))
    .map( source => {
      return {
        source: source, 
        destination: nodePath.join( task.targetFolder, nodePath.basename(source)), 
        type: task.type, 
        clobber: task.clobber,
        done: false
      }
    })
    
  if(subTasks.length > 0) {
    window.store.dispatch({
      type: t.FS_WRITE_NEW,
      payload: {
        id: task.id,
        clobber: task.clobber,
        type: task.type,
        targetFolder: task.targetFolder,
        subTasks: subTasks
      }
    })
  }

  let reportError = (err) => {
    window.store.dispatch({
      type: t.FS_WRITE_ERROR,
      payload: {
        id: task.id 
      },
      error: err
    });
    // process.exit()
  }

  let reportDone = () => {
    console.log('FS done')
    window.store.dispatch({
      type: t.FS_WRITE_DONE,
      payload: task
    })
    // process.exit()
  }

  Promise.all( subTasks.map( 
    subTask => validateSubTask(subTask)
  ))
  .then((subTasks) => {
    // validation is successfull
    subTasks.forEach((subTask, index) => {
      switch (subTask.type) {
        case t.TASK_MOVE:
          move(subTask, reportError, reportDone)
          return

        case t.TASK_COPY:
          copy(subTask, reportError, reportDone)
          return

        default:
          throw "Dont know what to do with subTask type: "+subTask.type
          break;
      }
    })
  }).catch((errList) => {

    console.log(errList)

    // errList.forEach(reportError)
  });
}

function validateSubTask(subTask) {  
  return new Promise( function(resolve, reject) {
    Promise.all([
      validateSubTaskAccess(subTask),
      (subTask.type == t.TASK_MOVE) ? noMoveInItSelf(subTask) : null
    ])
    .then(resolve(subTask))
    .catch(reject)
  })
}

function validateSubTaskAccess (subTask) {

  const sourcePermissions = (subTask.type == t.TASK_MOVE) ? fs.constants.W_OK : fs.constants.R_OK || fs.constants.W_OK
  const destPermissions = fs.constants.W_OK
  
  return new Promise( function(resolve, reject) {
    fs.access(subTask.source, sourcePermissions) // Can Read Source? 
      .then( () => {
          fs.access(nodePath.dirname(subTask.destination), fs.constants.W_OK)  // Can Write Target Parent?
            .then( () => {
              fs.access(subTask.destination, fs.constants.W_OK) // does the Target already exists?
                .then( () => {
                  if(clobber) {
                    resolve(subTask) // im allowed to overwrite the existing destionation
                  } else {
                    reject({  // not allowed to overwrite
                      code: c.ERROR_DEST_ALREADY_EXISTS,
                      source: source,
                      destination: destination
                    })
                  }
                })
                .catch((err) => {
                  if(err.code == c.ERROR_NOT_EXISTS) 
                  { resolve(subTask) } // Destination does not exists -> free space -> go
                  else 
                  { reject(err) } // No write access or something like that
                })
            })
            .catch(reject)  // can not read/write destination dir
        })
      .catch(reject) // can not read the source
  })
}

function noMoveInItSelf (subTask) {
  return new Promise( function(resolve, reject) {
    if(subTask.destination.indexOf(subTask.source) > -1) {
      reject({code: c.ERROR_MOVE_IN_IT_SELF})
    } else {
      resolve(subTask)
    }
  })
}  


var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };