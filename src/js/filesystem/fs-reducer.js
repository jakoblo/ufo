"use strict"
import * as t from './fs-actiontypes'
import {
  TYPE_DIR
} from './fs-constants'
import { Map } from 'immutable'

const INITIAL_STATE = Map({})

export default function reducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {

    case t.WATCHER_CLOSE:
      return state.deleteIn([action.payload.path])

    case t.WATCHER_READY:
      return state.setIn([action.payload.path], Map(action.payload.files))

    case t.FILE_ADD:
      return state.setIn([action.payload.root, action.payload.base], action.payload)

    case t.FILE_UNLINK:
      if(action.payload.type == DIR) {
        state = state.deleteIn([action.payload.path])
        console.log('delete dir, maybe views have to change, but how?')
      }
      return state.deleteIn([action.payload.root, action.payload.base])

    case t.FILE_CHANGE:
      return state.updateIn([action.payload.root, action.payload.base], action.payload)

    default:
      return state;
  }
}
