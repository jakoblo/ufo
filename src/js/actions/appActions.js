import {
  APP_CHANGE_PATH
  } from '../constants/action-types'
import _ from 'underscore'
import nodePath from 'path'
import {fsWatcherRequest, fsWatcherClose} from './fs-actions'

let pathRoute = []

/**
 * change the path of folders that is displayed in the app
 * Should be called by user actions (Click on a folder) or by walking through the history
 * If you call it the first the, you need to Provied fromPath and toPath.
 * After that only of is possible.
 * @param  {string} fromPath The first folder of the pathRout that will be displayed
 * @param  {string} toPath   The last folder of the pathRout that will be displayed
 */
export function changeAppPath(fromPath, toPath) {

  return dispatch => {

    fromPath = fromPath   ||  _.first(pathRoute)
    toPath =   toPath     ||  _.last(pathRoute)
    if(!fromPath || !toPath) { throw "Set 'from' and 'to' at the first call of changeAppPath()"}
    let newPathRoute = buildPathRoute(fromPath, toPath)

    dispatch({
      type: APP_CHANGE_PATH,
      payload: {
        pathRoute : newPathRoute
      }
    })

    let closeFsWatcher = _.difference(pathRoute, newPathRoute)
    closeFsWatcher.forEach((path, index) => {
      dispatch( fsWatcherClose(path) )
      pathRoute.splice( pathRoute.indexOf(path), 1 )
    })

    let createFsWatcher = _.difference(newPathRoute, pathRoute)
    createFsWatcher.forEach((path, index) => {
      dispatch( fsWatcherRequest(path) )
      pathRoute.push(path)
    })

    var testDiff = _.difference(newPathRoute, pathRoute)
    if(testDiff.length > 0) {
      throw "missmatch ahhh!"
    }
  }
}

/**
 * pure helper function that takes to paths and creates every "path step" between them
 * @param  {string} fromPath The first folder of the pathRout
 * @param  {string} toPath   The last folder of the pathRout
 * @return {array}        A array of paths inculding fromPath and toPath and every path between them
 */
function buildPathRoute(fromPath, toPath) {
  let newPathRoute = []
  let pathStep = toPath
  while (pathStep != fromPath) {
    newPathRoute.unshift(pathStep)
    pathStep = nodePath.dirname(pathStep)
  }
  newPathRoute.unshift(fromPath)
  return newPathRoute
}
