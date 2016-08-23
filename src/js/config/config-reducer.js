"use strict"
import * as t from './config-actiontypes'
import { Map } from 'immutable'

const INITIAL_STATE = Map({
  windowWidth: 800,
  windowHeight: 600,
  editMode: false
})

export default function configReducer(state = INITIAL_STATE, action = { type: '' }) {
  switch (action.type) {
    case t.APP_TOGGLE_EDIT_MODE:
      return state.set('editMode', action.payload.editMode)
    default:
      return state
  }
}
