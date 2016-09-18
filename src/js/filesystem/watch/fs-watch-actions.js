import * as t from './fs-watch-actiontypes'
import watchHandler from './fs-watch-watcher'
import nodePath from 'path'
import App from '../../app/app-index'

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
      (fileObj, activeWatcher) => {dispatch( fileUnlink(fileObj, activeWatcher) )},
      (fileObj)     => {dispatch( fileChange(fileObj) )},
      (path, files) => {dispatch( watcherReady(path, files) )},
      (err, path) => {dispatch( watcherError(err, path) )}
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

function watcherError(error, path) {
  console.log(error, path)
  return {
    type: t.WATCHER_ERROR,
    payload: {
      error: error,
      path: path
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
 * Action Creator to remove file from view
 * It checks the if the removed path is currently watched 
 * and changes the app Path if necessary to not look in an not existing folder
 * 
 * @param  {Object} fileObj
 * @param  {Array} activeWatcher
 * @returns {Object}
 */

function fileUnlink(fileObj, activeWatcher) {
  return dispatch => {
    if(activeWatcher[fileObj.path]) {
      dispatch(App.actions.changeAppPath(null, nodePath.dirname(fileObj.path)))
    }
    dispatch({
      type: t.FILE_UNLINK,
      payload: fileObj
    })
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