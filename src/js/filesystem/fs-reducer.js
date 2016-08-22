"use strict"
import {
  WATCHER_READY,
  WATCHER_CLOSE,
  FILE_ADD,
  FILE_UNLINK,
  FILE_CHANGE
} from './fs-action-types'
import {
  TYPE_DIR
} from './fs-constants'
import { Map } from 'immutable'

const INITIAL_STATE = Map({})

export default function reducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {

    case WATCHER_CLOSE:
      return state.deleteIn([action.payload.path])

    case WATCHER_READY:
      return state.setIn([action.payload.path], Map(action.payload.files))

    case FILE_ADD:
      return state.setIn([action.payload.root, action.payload.base], action.payload)

    case FILE_UNLINK:
      return state.deleteIn([action.payload.root, action.payload.base])

    case FILE_CHANGE:
      return state.updateIn([action.payload.root, action.payload.base], action.payload)

    default:
      return state;
  }
}
