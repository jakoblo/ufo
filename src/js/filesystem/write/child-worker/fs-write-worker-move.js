var fs = require('mz/fs')
var c = require('../fs-write-constants')

export default function move(subTask, errCallback, doneCallback) {
  if (subTask.clobber) {
    clobberMove(...arguments)
  } else {
    saveMove(...arguments)
  } 
}

function saveMove(subTask, errCallback, doneCallback) {
  fs.link(subTask.source, subTask.destination, function(err) {
    if (err) {
      switch (err.code) {
        case c.ERROR_RENAME_CROSS_DEVICE:
          copy(subTask) // cross-device link not permitted -> do a real copy
          return

        case c.ERROR_IS_DIR || err.code === c.ERROR_OPERATION_NOT_PERMITTED:
          copy(subTask);
          return

        default:
          errCallback(err, subTask);
          return;
      }
    }
    fs.unlink(subTask.source, (err) => {
      if(err) {
        errCallback(err, task)
        return
      }
      doneCallback()
    });
  });
}

function clobberMove(subTask, errCallback, doneCallback) {
  fs.rename(subTask.source, subTask.destination, function(err) {
    if(err) {
      switch (err.code) {
        case c.ERROR_RENAME_CROSS_DEVICE:
          errCallback(err, task)
          return
        default:
          copy(subTask)
          return
      }
    }
    doneCallback()
  });
}