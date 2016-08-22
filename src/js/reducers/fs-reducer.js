"use strict"
import {
  FS_WATCHER_READY,
  FS_WATCHER_CLOSE,
  FS_ADD,
  FS_UNLINK,
  FS_CHANGE
} from '../constants/action-types'
import {DIR} from '../constants/fs-types'
import { Map } from 'immutable'

const INITIAL_STATE = Map({})

export function fsReducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {

    case FS_WATCHER_CLOSE:
      return state.deleteIn([action.payload.path])

    case FS_WATCHER_READY:
      return state.setIn([action.payload.path], Map(action.payload.files))

    case FS_ADD:
      return state.setIn([action.payload.root, action.payload.base], action.payload)

    case FS_UNLINK:
      if(action.payload.type == DIR) {
        state = state.deleteIn([action.payload.path])
        console.log('delete dir, maybe views have to change, but how?')
      }
      return state.deleteIn([action.payload.root, action.payload.base])

    case FS_CHANGE:
      return state.updateIn([action.payload.root, action.payload.base], action.payload)

    default:
      return state;
  }
}
