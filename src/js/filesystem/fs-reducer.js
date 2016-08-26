"use strict"
import * as t from './fs-actiontypes'
import {OrderedMap, Map, Seq, fromJS} from 'immutable'

const INITIAL_STATE = OrderedMap({})

export default function reducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {

    case t.WATCHER_READING:
      return state.setIn([action.payload.path], fromJS(
        {
          ready: false,
          files: {}
        }))

    case t.WATCHER_READY:
      return state.setIn([action.payload.path], fromJS(
        {
          ready: true,
          files: action.payload.files
        }))

    case t.WATCHER_CLOSE:
      return state.deleteIn([action.payload.path])

    case t.FILE_ADD:
      return state.setIn([action.payload.root, 'files', action.payload.base], Map(action.payload))

    case t.FILE_UNLINK:
      return state.deleteIn([action.payload.root, 'files', action.payload.base])

    case t.FILE_CHANGE:
      return state.updateIn([action.payload.root, 'files', action.payload.base], Map(action.payload))

    default:
      return state;
  }
}