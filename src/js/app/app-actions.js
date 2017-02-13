import * as t from './app-actiontypes'
import _ from 'lodash'
import nodePath from 'path'
import * as selectors from './app-selectors'
import FileSystem from '../filesystem/watch/fs-watch-index'

let pathRoute = []

/**
 * Change the path of folders that is displayed in the app.
 * Should be called by user actions (Click on a folder) or by walking through the history.
 * If you call it the first the, you need to Provied fromPath and toPath.
 * After that only of them is possible.
 * 
 * @param  {string} [fromPath] - The first folder of the pathRout that will be displayed is optional
 * @param  {string} [toPath] - The last folder of the pathRout that will be displayed is optional
 * @param  {boolean} [historyJump=false] - true will not create a new history point
 * @param  {boolean} [peak=false] - The toPath is only a kind of preview and is not focused (keyboard arrow up/down navigation)
 */
export function changeAppPath(fromPath, toPath, historyJump = false, peak = false) {

  return dispatch => {
    if(fromPath && !toPath) { toPath = fromPath }
    fromPath = fromPath   ||  _.first(pathRoute)
    toPath =   toPath     ||  _.last(pathRoute)

    if(!fromPath || !toPath) { throw "Set 'from' and 'to' at the first call of changeAppPath()"}
    
    if(toPath.indexOf(fromPath) < 0) {
      // Set fromPath to Root
      fromPath = nodePath.parse(toPath).root
    }
    
    let newPathRoute = buildPathRoute(fromPath, toPath)

    dispatch({
      type: t.APP_CHANGE_PATH,
      payload: {
        pathRoute : newPathRoute,
        historyJump: historyJump,
        peak: peak
      }
    })    

    //@TODO is Dirty
    let closeFsWatcher = _.difference(pathRoute, newPathRoute)
    closeFsWatcher.reverse().forEach((path, index) => { // reverse is necessary to Keep always the right Order of paths
      dispatch( FileSystem.actions.watcherClose(path) )
      pathRoute.splice( pathRoute.indexOf(path), 1 )
    })

    let createFsWatcher = _.difference(newPathRoute, pathRoute)
    createFsWatcher.forEach((path, index) => {
      dispatch( FileSystem.actions.watcherRequest(path) )
      pathRoute.push(path)
    })
  }
}

export function navigateToParentFolder() {
  return (dispatch, getState) => {
    let currentDir = _.last( FileSystem.selectors.getDirSeq( getState() ) )
    let parentDir = nodePath.dirname( currentDir )
    dispatch( changeAppPath( null, parentDir))
  }
}

export function historyBack() {
  return (dispatch, getState) => {
    dispatch( historyJump(-1) )
  }
}

export function historyForward() {
  return (dispatch, getState) => {
    dispatch( historyJump(+1) )
  }
}

function historyJump(direction) {
  return (dispatch, getState) => {
    let newPosition = selectors.getHistoryPosition(getState()) + direction
    let Sequence = selectors.getHistorySequence(getState())

    if(-1 < newPosition && newPosition < Sequence.size) {
      let newPath = Sequence.get(newPosition)
      dispatch( changeAppPath( newPath.get('from'), newPath.get('to'), newPosition ))
    }
  }
}


/**
 * helper function that takes to paths and creates every "path step" between them
 * @param  {string} fromPath
 * @param  {string} toPath
 * @returns {[string]}
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
