/**
 * Modified from mv
 * https://www.npmjs.com/package/mv
 */

import {ncp} from 'ncp'
import nodePath from 'path'
import rimraf from 'rimraf'
import mkdirp from 'mkdirp'
import progress from 'progress-stream';
import fs from 'mz/fs'
import * as c from '../fs-write-constants'

process.on('message', (m) => {
  mv(m.source, m.dest, m.options, sendError)
});

function sendError(err) {
  process.send({ 
    type: c.CHILD_ERR,
    error: err 
  });
} 

function sendLog(message) {
  process.send({ 
    type: c.CHILD_LOG,
    payload: message 
  });
}

function sendDone() {
  process.send({
    type: c.CHILD_DONE
  })
}

function mv(source, dest, param, cb){

  sendLog('start fs write')

  const options = {...param, limit: 16}
  const sourePermissions = (options.move) ? fs.constants.W_OK : fs.constants.R_OK || fs.constants.W_OK
  const destPermissions = fs.constants.W_OK
  questionJob()

  function questionJob() {
    fs.access(source, sourePermissions)
    // Can Read Source? 
    .then(
      fs.access(nodePath.dirname(dest), fs.constants.W_OK)  
        // Can Write Target Parent?
        .then(
          fs.access(dest, fs.constants.W_OK)
            // does the Target already exists?
            .then(() => {
              if(options.clobber) {
                startJob() // overwrite
              } else {
                sendError({
                  code: c.ERROR_DEST_ALREADY_EXISTS
                }) // not alloed to overwrite
              }
            })
            .catch((err) => {
                if(err.code == c.ERROR_NOT_EXISTS) {
                  startJob() // Free Space, start FileTransfer
                } else {
                  sendError(err)
                }
              }
            )
        )
      .catch(sendError)
    )
    .catch(sendError)
  }

  function startJob () {
    console.log('start')
    if(options.move) {
      tryRename();
    } else {
      copy(source, dest);
    }
  }

  function tryRename() {
    sendLog('try rename')
    if (options.clobber) {
      fs.rename(source, dest, function(err) {
        if (!err) return cb();
        if (err.code !== c.ERROR_RENAME_CROSS_DEVICE) return cb(err);
        copy(source, dest);
      });
    } else {
      fs.link(source, dest, function(err) {
        if (err) {
          if (err.code === c.ERROR_RENAME_CROSS_DEVICE) { // cross-device link not permitted -> do a real copy
            copy(source, dest); 
            return;
          }
          if (err.code === c.ERROR_IS_DIR || err.code === c.ERROR_OPERATION_NOT_PERMITTED) {
            copy(source, dest);
            return;
          }
          sendError(err);
          return;
        }
        fs.unlink(source, (err) => {
          if(err) {sendError(err); return}
          sendDone()
        });
      });
    } 
  }

  function copy(source, dest) {
    sendLog('copy')
    var ncpOptions = {
      stopOnErr: true,
      clobber: false,
      limit: options.limit,
      transform: (read, write) => {
        var str = progress({
          length: fs.statSync(source).size,
          time: 500
        });
        str.on('progress', (progress) => {
          process.send({
            type: c.CHILD_PROGRESS,
            payload: {
              source: read.path,
              dest: write.path,
              progress: progress
            }
          })
        })
        
        read.pipe(str).pipe(write) 
      } 
    };
    if (options.clobber) {
      rimraf(dest, { disableGlob: true }, (err) => {
        if (err) return sendError(err);
        startNcp();
      });
    } else {
      startNcp();
    }
    function startNcp() {
      ncp(source, dest, ncpOptions, (errList) => {
        if (errList) {return sendError(errList[0]);}
        sendLog(options)
        if(options.move) {
          sendLog('Remove Source')
          rimraf(source, { disableGlob: true }, (err) => {
            if(err) {sendError(err); return}
            sendDone()
          });
        } else {
          sendDone()
        }
      });
    }
  }

}

