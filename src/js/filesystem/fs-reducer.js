"use strict"
import * as t from './fs-actiontypes'
import {
  TYPE_DIR
} from './fs-constants'
import Immutable from 'immutable'

const INITIAL_STATE = Immutable.OrderedMap({})

export default function reducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {

    case t.WATCHER_CLOSE:
      return state.deleteIn([action.payload.path])

    case t.WATCHER_READY:
      return state.setIn([action.payload.path], Immutable.OrderedMap(action.payload.files).sortBy(file => file.base))

    case t.FILE_ADD:
      return state.setIn([action.payload.root, action.payload.base], action.payload)

    case t.FILE_UNLINK:
      return state.deleteIn([action.payload.root, action.payload.base])

    case t.FILE_CHANGE:
      return state.updateIn([action.payload.root, action.payload.base], action.payload)

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