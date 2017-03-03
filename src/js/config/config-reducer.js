"use strict"
import * as t from './config-actiontypes'
import { Map } from 'immutable'

const INITIAL_STATE = Map({
  windowWidth: 800,
  windowHeight: 600,
  readOnly: false
})

export default function configReducer(state = INITIAL_STATE, action = { type: '' }) {
  switch (action.type) {
    case t.APP_READ_ONLY_TOGGLE:
      return state.set('readOnly', action.payload.readOnly)
    default:
      return state
  }
}
