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
import * as t from '../fs-write-actiontypes'

process.on('message', (m) => {
  mv(m.id, m.source, m.dest, m.options)
});

function mv(id, source, dest, param){
  process.send({
    type: t.FS_WRITE_NEW,
    payload: {
      ...param,
      id: id,
      source: source,
      destination: dest
    }
  })

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
        if (!err) return sendDone();
        if (err.code !== c.ERROR_RENAME_CROSS_DEVICE) return sendError(err);
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
          length: fs.statSync(read.path).size,
          time: 200
        });
        str.on('progress', (progress) => {
          process.send({
            type: t.FS_WRITE_PROGRESS,
            payload: {
              id: id,
              file: {
                source: read.path,
                destination: write.path,
                progress: progress}
            }
          })
        })
        
        read.pipe(str).pipe(write) 
      } 
    };
    if (options.clobber) {
      console.log('rimraf')
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

  function sendError(err) {
    process.send({ 
      type: t.FS_WRITE_ERROR,
      payload: {
        id: id,
        source: source,
        destination: dest,
        ...param
      },
      error: err
    });
  }

  function sendLog(message) {
    process.send({
      type: 'LOG',
      payload: message 
    });
  }

  function sendDone() {
    process.send({
      type: t.FS_WRITE_DONE,
      payload: {
        id: id,
        source: source,
        destination: dest,
        ...param
      }
    })
  }
}
