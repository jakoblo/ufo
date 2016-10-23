import {ipcRenderer} from 'electron'
import nodePath from 'path'
import trash from 'trash'
import fs from 'mz/fs'
import fsWatch from '../watch/fs-watch-index'
import fsRename from '../rename/rename-index'
import {fork} from 'child_process'
import * as c from './fs-write-constants'
import * as t from './fs-write-actiontypes'

/**
 * @param  {string[]} sources
 */
export function moveToTrash(sources) {
  sources.forEach((source) => {
    let id = window.store.getState()[c.NAME].size 
    let payload = {
      id: id,
      task: t.TASK_TRASH,
      source: source
    }
    window.store.dispatch({
      type: t.FS_WRITE_NEW,
      payload: payload
    })
    trash([source]).then(() => {
      window.store.dispatch({
        type: t.FS_WRITE_DONE,
        payload: payload
      })
    })
    .catch((err) => {
      window.store.dispatch({
        type: t.FS_WRITE_ERROR,
        payload: payload,
        error: err
      })
    })
  })
}

/**
 * @param  {string[]} sources
 * @param  {string} targetFolder
 * @param  {Object} options clobber & task: MOVE || COPY 
 */
export function move(sources, targetFolder, options) {
  sources.forEach((src) => {
    startFsWorker(
      src,
      nodePath.join(targetFolder, nodePath.basename(src)), 
      {clobber: false, ...options, task: t.TASK_MOVE}
    )
  })
}


/**
 * @param  {string[]} sources
 * @param  {string} targetFolder
 * @param  {Object} options clobber & task: MOVE || COPY 
 */
export function copy(sources, targetFolder, options) {
  sources.forEach((src) => {
    startFsWorker(
      src, 
      nodePath.join(targetFolder, nodePath.basename(src)), 
      {clobber: false, ...options, task: t.TASK_COPY}
    )
  })
}


/**
 * @param  {string} source
 * @param  {string} destination
 */
export function rename(source, destination) {

  let payload = {
    id: window.store.getState()[c.NAME].size,
    task: t.TASK_RENAME,
    source: source,
    destination: destination
  }

  window.store.dispatch({
    type: t.FS_WRITE_NEW,
    payload: payload
  })

  fs.access(destination, fs.constants.R_OK) // test if already exists
    .then(() => {
      //destination already exists
      renameError({
          code: c.ERROR_DEST_ALREADY_EXISTS
      })
    })
    .catch((err) => {
      if(err = c.ERROR_NOT_EXISTS) {
        // destination does not exists start renaming
        fs.rename(source, destination).then(() => {
          window.store.dispatch({
            type: t.FS_WRITE_DONE,
            payload: payload
          })
        })
        .catch(renameError)
      } else {
        // unknown error
        renameError(err)
      }
    })

  function renameError(err) {
    window.store.dispatch({
      type: t.FS_WRITE_ERROR,
      payload: payload,
      error: err
    })
  }
}
/**
 * Remove Action from store
 * @param  {number} id
 */
export function removeAction(id) {
  return {
    type: t.FS_WRITE_REMOVE_ACTION,
    payload: {
      id: id
    }
  }
}


/**
 * @param  {string} source
 * @param  {string} destination
 * @param  {Object} options clobber & task: MOVE || COPY 
 * @param  {number} setId optional
 */
export function startFsWorker(source, destination, options, setId) {
  
  let id = (setId != undefined) ? setId : window.store.getState()[c.NAME].size
  var fsWriteWorker = fork(__dirname + '/child-worker/fs-write-worker.js');

  fsWriteWorker.send({
    id: id,
    source: source,
    dest: destination,
    options
  })

  fsWriteWorker.on('message', function(response) {
    window.store.dispatch(response)
  })

  // fsWriteWorker.on('close', (code) => {
  //   console.log(`fs write worker exit: ${code}`);
  // });
}


/**
 * Create a blank new folder and start a rename action for that
 * @param  {string} parentFolder
 */
export function newFolder(parentFolder) {
  return (dispatch, getState) => {
    let existingFiles = fsWatch.selectors.getFilesSeq(getState(), {path: parentFolder})
    let folderName = "new Folder"
    if(existingFiles.indexOf(folderName) > -1) {
      let count = 2
      while (existingFiles.indexOf(folderName+count) > -1) {
        count++
      }
      folderName = folderName+count
    }
    let newFolderPath = nodePath.join(parentFolder, folderName)
    
    fs.mkdir(nodePath.join(parentFolder, folderName))
      .then(() => {
        dispatch( fsRename.actions.renameStart(newFolderPath) )
      })
      .catch((err) => {
        alert(err)
      })
  }
}