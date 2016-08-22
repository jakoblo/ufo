"use strict"
import {
  APP_CHANGE_PATH
} from '../constants/action-types'

import Immutable from 'immutable'
import { List } from 'immutable'

const INITIAL_STATE = List([])

export default function viewContainerReducer(state = INITIAL_STATE, action = { type: '' }) {
  switch (action.type) {
    case APP_CHANGE_PATH:
      return state.set(0, action.payload.fromPath)
      break;
    default:
      return state;
  }
}
