'use strict';

/**
 * Modified from mv
 * https://www.npmjs.com/package/mv
 */

var {ncp} = require('ncp');
var nodePath = require('path');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var progress = require('progress-stream');
var fs = require('mz/fs')
var c = require('../fs-write-constants')
var t = require('../fs-write-actiontypes')
var utils = require('../fs-write-utils')

process.on('message', (m) => {
  mv(m.id, m.sources, m.targetFolder, m.options)
});

/**
 * not really ready
 * 
 * @param {number} id
 * @param {string} source
 * @param {string} dest
 * @param {Object} param
 */

debugger

function mv(id, sources, targetFolder, param){

  sources.forEach((src) => {
    if(nodePath.dirname(src) == targetFolder) { 
      process.exit() 
    }
  })

  process.send({
    type: t.FS_WRITE_NEW,
    payload: {
      ...param,
      id: id,
      sources: sources,
      targetFolder: targetFolder
    }
  })

  var state = {
    error: false,
    options: _extends({}, param, { limit: 8 }),
    toWorkOff: [],
    size: 0
  }

  var validateStack = []

  sources.forEach((source) => {
    var destination = nodePath.join( targetFolder, nodePath.basename(source));
    validateStack.push(
      utils.verifyAccess(source, destination, (state.options.task == t.TASK_MOVE), param.clobber)
    )
    validateStack.push(
      utils.noMoveInItSelf(source, destination, (state.options.task == t.TASK_MOVE))
    )
  })

  Promise.all(validateStack)
    .then(values => {
      console.log('hey')
      if (state.options.task == t.TASK_MOVE) {
        state.toWorkOff.push(() => { move() })
      } else if(options.task == t.TASK_COPY) {
        state.toWorkOff.push(() => { copy(source, destination) })
      }
    })
    .catch(handleError);

  function move() {
    console.log('FS try rename')
    if (options.clobber) {
      console.log('FS rename')
      fs.rename(source, dest, function(err) {
        if (!err) return sendDone();
        if (err.code !== c.ERROR_RENAME_CROSS_DEVICE) return handleError(err);
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
          handleError(err);
          return;
        }
        fs.unlink(source, (err) => {
          if(err) {handleError(err); return}
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
        if (err) return handleError(err);
        console.log('rimraf done')
        startNcp();
      });
    } else {
      startNcp();
    }
    function startNcp() {
      ncp(source, dest, ncpOptions, (errList) => {
        if (errList) {return handleError(errList[0]);}
        if(options.task == t.TASK_MOVE) {
          console.log('start rimraf')
          rimraf(source, { disableGlob: true }, (err) => {
            if(err) {handleError(err); return}
            console.log('rimraf done')
            sendDone()
          });
        } else {
          sendDone()
        }
      });
    }
  }

  function handleError(err) {
    console.log('FS error', err)
    state.error = true
    process.send({ 
      type: t.FS_WRITE_ERROR,
      payload: {
        id: id,
        sources: sources,
        targetFolder: targetFolder,
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
        sources: sources,
        targetFolder: targetFolder,
        ...param
      }
    })
    process.exit()
  }
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };