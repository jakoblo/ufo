import {ncp} from 'graceful-ncp'
import progress from 'progress-stream'
import getSize from 'get-folder-size'
import fs from 'mz/fs'
import * as c from '../fs-write-constants'
import * as t from '../fs-write-actiontypes'

export default function copy(subTask, handleProgress) {
  var fullSize = 1
  var progressPerFileStack = []
  var calcProgress = () => {
    var fullProgress = 0
    progressPerFileStack.forEach((bytes) => {
      fullProgress = fullProgress + bytes;
    })
    handleProgress({
      destination: subTask.destination,
      percentage: Math.round(fullProgress / fullSize * 100)
    })
  }

  var ncpOptions = {
    stopOnErr: true,
    clobber: subTask.clobber,
    limit: 16,
    transform: (read, write) => {
      var id = progressPerFileStack.length
      progressPerFileStack[id] = 0
      var str = progress({
        time: 100
      }).on('progress', (progress) => {
        progressPerFileStack[id] = progress.transferred
        calcProgress()
      })
      read.pipe(str).pipe(write)
    }
  };

  return new Promise( (resolve, reject) => {
    getSize(subTask.source, (err, size) => {
      if (err) { reject(err) ; return }
      fullSize = size
      ncp(subTask.source, subTask.destination, ncpOptions, (errList) => {
        if (errList) { reject(errList[0]); return}
        resolve()
      });
    });
  })
}
