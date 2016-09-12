"use strict"
import App from '../app/app-index'
import { Map } from 'immutable'
import * as t from './vf-actiontypes'

const INITIAL_STATE = Map({
  path: null
})

  export default function previewReducer(state = INITIAL_STATE, action = { type: '' }) {
    switch (action.type) {
      
      case t.SHOW_PREVIEW:
        return state.set('path', action.payload.path)
      
      case App.actiontypes.APP_CHANGE_PATH:
        return state.set('path', null)

      default:
        return state;
    }
  }
