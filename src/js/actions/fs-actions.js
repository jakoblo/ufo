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
/**
 * Creats a new FileSystem watcher with async Callbacks
 * they will dispatch further actions
 * @param  {String} path
 */
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

/**
 * Close/Unwatch the FileSystem watcher for the given path
 * @param  {String} path
 * @returns {Object}
 */
export function fsWatcherClose(path) {
  fsWatcher.unwatch(path)
  return {
    type: FS_WATCHER_CLOSE,
    payload: {
      path: path
    }
  }
}

/**
 * Action Creator
 * @param  {String} path
 * @returns {Object}
 */
let fsWatcherReading = (path) => {
  return {
    type: FS_WATCHER_READING,
    payload: {
      path: path
    }
  }
}

/**
 * Action Creator
 * @param  {String} path the path where the watcher is looking into
 * @param  {[Object]} files Array of all fileObj which the watch found
 * @returns {Object}
 */
function fsWatcherReady(path, files) {
  return {
    type: FS_WATCHER_READY,
    payload: {
      path: path,
      files: files
    }
  }
}

/**
 * Action Creator
 * @param  {Object} fileObj
 * @returns {Object}
 */
function fsAdd(fileObj) {
  return {
    type: FS_ADD,
    payload: fileObj
  }
}

/**
 * Action Creator
 * @param  {Object} fileObj
 * @returns {Object}
 */
function fsUnlink(fileObj) {

  if(fileObj.type == DIR) {
    // PUh?...
  }

  return {
    type: FS_UNLINK,
    payload: fileObj
  }
}

/**
 * Action Creator
 * @param  {Object} fileObj
 * @returns {Object}
 */
function fsChange(fileObj) {
  return {
    type: FS_CHANGE,
    payload: fileObj
  }
}
