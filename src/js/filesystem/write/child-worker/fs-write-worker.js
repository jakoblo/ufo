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
import * as utils from '../fs-write-utils'

process.on('message', (m) => {
  mv(m.id, m.source, m.dest, m.options)
});

/**
 * not really ready
 * 
 * @param {number} id
 * @param {string} source
 * @param {string} dest
 * @param {Object} param
 */
function mv(id, source, dest, param){

  if(source == dest) { process.exit() }

  process.send({
    type: t.FS_WRITE_NEW,
    payload: {
      ...param,
      id: id,
      source: source,
      destination: dest
    }
  })

  const options = {...param, limit: 8}

  utils.verifyAccess(source, dest, (options.task == t.TASK_MOVE), param.clobber)
    .then( () => {
      utils.noMoveInItSelf(source, dest, (options.task == t.TASK_MOVE))
        .then( () => {
          if (options.task == t.TASK_MOVE) { 
            tryRename()
          } else if(options.task == t.TASK_COPY) {
            copy(source, dest)
          }
        })
        .catch(sendError)
    })
    .catch(sendError)

  function tryRename() {
    console.log('FS try rename')
    if (options.clobber) {
      console.log('FS rename')
      fs.rename(source, dest, function(err) {
        if (!err) return sendDone();
        if (err.code !== c.ERROR_RENAME_CROSS_DEVICE) return sendError(err);
        copy(source, dest);
      });
    } else {
      console.log('FS link')
      fs.link(source, dest, function(err) {
        if (err) {
          console.log(err)
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
          console.log('FS unlink done')
          sendDone()
        });
      });
    } 
  }

  function copy(source, dest) {
    console.log('copy')
    var ncpOptions = {
      stopOnErr: true,
      clobber: false,
      limit: options.limit,
      transform: (read, write) => {
        var str = progress({
          length: fs.statSync(read.path).size,
          time: 700
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
        console.log('rimraf done')
        startNcp();
      });
    } else {
      startNcp();
    }
    function startNcp() {
      ncp(source, dest, ncpOptions, (errList) => {
        if (errList) {return sendError(errList[0]);}
        if(options.task == t.TASK_MOVE) {
          console.log('start rimraf')
          rimraf(source, { disableGlob: true }, (err) => {
            if(err) {sendError(err); return}
            console.log('rimraf done')
            sendDone()
          });
        } else {
          sendDone()
        }
      });
    }
  }

  function sendError(err) {
    console.log('FS error', err)
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
    process.exit()
  }

  function sendDone() {
    console.log('FS done')
    process.send({
      type: t.FS_WRITE_DONE,
      payload: {
        id: id,
        source: source,
        destination: dest,
        ...param
      }
    })
    process.exit()
  }
}
