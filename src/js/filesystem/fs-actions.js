import * as t from './fs-actiontypes'
import watchHandler from './fs-watch-handler'
const watcherSettings = {
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
export function watcherRequest(path) {
  return function (dispatch) {

    dispatch(  watcherReading(path)  )

    let watcher = watchHandler.watch(
      path,
      watcherSettings,
      (fileObj)     => {dispatch( fileAdd(fileObj) )},
      (fileObj)     => {dispatch( fileUnlink(fileObj) )},
      (fileObj)     => {dispatch( fileChange(fileObj) )},
      (path, files) => {dispatch( watcherReady(path, files) )}
    )
  }
}

/**
 * Close/Unwatch the FileSystem watcher for the given path
 * @param  {String} path
 * @returns {Object}
 */
export function watcherClose(path) {
  watchHandler.unwatch(path)
  return {
    type: t.WATCHER_CLOSE,
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
let watcherReading = (path) => {
  return {
    type: t.WATCHER_READING,
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
function watcherReady(path, files) {
  return {
    type: t.WATCHER_READY,
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
function fileAdd(fileObj) {
  return {
    type: t.FILE_ADD,
    payload: fileObj
  }
}

/**
 * Action Creator
 * @param  {Object} fileObj
 * @returns {Object}
 */
function fileUnlink(fileObj) {

  if(fileObj.type == TYPE_DIR) {
    // PUh?...
  }

  return {
    type: t.FILE_UNLINK,
    payload: fileObj
  }
}

/**
 * Action Creator
 * @param  {Object} fileObj
 * @returns {Object}
 */
function fileChange(fileObj) {
  return {
    type: t.FILE_CHANGE,
    payload: fileObj
  }
}
