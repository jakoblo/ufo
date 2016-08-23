"use strict"
import FS from '../filesystem/fs-index'
import App from '../app/app-index'
import nodePath from 'path'
import Immutable from 'immutable'

const INITIAL_STATE = Immutable.OrderedMap({})

export default function reducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {

    case App.actiontypes.APP_CHANGE_PATH:
      // set active values
      let activeMap = []
      action.payload.pathRoute.map((path, index) => {
        let nextFolder = action.payload.pathRoute[index+1]
        let active = nextFolder ? nodePath.basename(nextFolder) : false
        state = state.setIn([path, 'active'], active)
      })
      return state

    case FS.actiontypes.WATCHER_CLOSE:
      return state.deleteIn([action.payload.path])

    case FS.actiontypes.WATCHER_READY:
      return state.setIn([action.payload.path, 'files'], Immutable.OrderedMap(action.payload.files).sortBy(file => file.base))

    case FS.actiontypes.FILE_ADD:
      return state.setIn([action.payload.root, 'files', action.payload.base], action.payload)

    case FS.actiontypes.FILE_UNLINK:
      return state.deleteIn([action.payload.root, 'files', action.payload.base])

    case FS.actiontypes.FILE_CHANGE:
      return state.updateIn([action.payload.root, 'files', action.payload.base], action.payload)

    default:
      return state;
  }
}

/**
 * @param  {Object} state
 * @param  {Array} pathRoute list of Paths
 */
function setActiveFiles(state, pathRoute) {

}