import {
  FS_WATCHER_READING,
  FS_WATCHER_CLOSE,
  FS_WATCHER_READY,
  FS_ADD,
  FS_UNLINK,
  FS_CHANGE
  } from '../constants/action-types'
import {DIR} from '../constants/fs-types'
import {fsWatcher} from '../filesystem/fs-watcher'
const fsWatcherSettings = {
  ignored: /[\/\\]\./,
  persistent: true,
  depth: 0,
  alwaysStat: true
}

export function fsWatcherRequest(path) {
  return function (dispatch) {

    dispatch(  fsWatcherReading(path)  )

    let watcher = fsWatcher.watch(
      path,
      fsWatcherSettings,
      (fileObj)     => {dispatch( fsAdd(fileObj) )},
      (fileObj)     => {dispatch( fsUnlink(fileObj) )},
      (fileObj)     => {dispatch( fsChange(fileObj) )},
      (path, files) => {dispatch( fsWatcherReady(path, files) )}
    )
  }
}

export function fsWatcherClose(path) {
  fsWatcher.unwatch(path)
  return {
    type: FS_WATCHER_CLOSE,
    payload: {
      path: path
    }
  }
}

let fsWatcherReading = (path) => {
  return {
    type: FS_WATCHER_READING,
    payload: {
      path: path
    }
  }
}

function fsWatcherReady(path, files) {
  return {
    type: FS_WATCHER_READY,
    payload: {
      path: path,
      files: files
    }
  }
}

function fsAdd(fileObj) {
  return {
    type: FS_ADD,
    payload: fileObj
  }
}

function fsUnlink(fileObj) {

  if(fileObj.type == DIR) {

  }

  return {
    type: FS_UNLINK,
    payload: fileObj
  }
}

function fsChange(fileObj) {
  return {
    type: FS_CHANGE,
    payload: fileObj
  }
}
