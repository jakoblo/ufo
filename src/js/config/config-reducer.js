"use strict"
import {
  APP_TOGGLE_EDIT_MODE
} from '../constants/action-types'
import { Map } from 'immutable'

const INITIAL_STATE = Map({
  windowWidth: 800,
  windowHeight: 600,
  editMode: false
})

export default function configReducer(state = INITIAL_STATE, action = { type: '' }) {
  switch (action.type) {
    case APP_TOGGLE_EDIT_MODE:
        return state.set('editMode', action.payload.editMode)
      break
    default:
      return state
  }
}
