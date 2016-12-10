var fs = require('mz/fs')
var c = require('../fs-write-constants')
import copy from './fs-write-worker-copy'
import rimraf from 'rimraf'

export default function move(subTask, handleProgress) {

  return new Promise( function(resolve, reject) {

    if (subTask.clobber) {
      fs.rename(subTask.source, subTask.destination, function(err) {
        if(err) {
          switch (err.code) {
            case c.ERROR_RENAME_CROSS_DEVICE:
              moveWithCopy(subTask)
              return
            default:
              reject(err)
              return
          }
        }
        resolve()
      });
    } else {
      fs.link(subTask.source, subTask.destination, function(err) {
        if (err) {
          switch (err.code) {
            case c.ERROR_RENAME_CROSS_DEVICE: 
              moveWithCopy(subTask)
              return
            case c.ERROR_IS_DIR: 
              moveWithCopy(subTask)
              return
            case c.ERROR_OPERATION_NOT_PERMITTED: 
              moveWithCopy(subTask)
              return

            default:
              reject(err);
              return;
          }
        }
        fs.unlink(subTask.source, (err) => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        });
      });
    }

    var moveWithCopy = (subTask) => {
      copy(subTask, handleProgress)
        .then(() => {
          rimraf(subTask.source, { disableGlob: true }, (err) => {
            if(err) {
              reject(err);
              return
            }
            resolve()
          });
        })
        .catch(reject)
    }
  })
}