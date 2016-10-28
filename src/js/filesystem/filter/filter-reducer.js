"use strict"
import * as t from './filter-actiontypes'
import * as c from './filter-constants'
import Selection from '../selection/sel-index'
import App from '../../App/app-index'
import nodePath from 'path'
import {Map, fromJS} from 'immutable'

const INITIAL_STATE = {
  global: {
    notHidden: c.NOT_HIDDEN_REGEX
  },
  focused: {},
  focusedPath: ''
}

export default function reducer(state = fromJS(INITIAL_STATE), action = { type: '' }) {

  switch (action.type) {

    case App.actiontypes.APP_CHANGE_PATH:
      let newFocus = null
      if(action.payload.peak && action.payload.pathRoute.length > 1) {
        newFocus = action.payload.pathRoute[ action.payload.pathRoute.length - 2 ]
      } else {
        newFocus = action.payload.pathRoute[ action.payload.pathRoute.length - 1 ]
      }
      if(state.get('focusedPath') != newFocus) {
        state = state.deleteIn(['focused', 'userInput'])
        return state.set('focusedPath', newFocus)
      } else {
        return state
      }
    
    case Selection.actiontypes.SET_SELECTION:
      return state.set('focusedPath', action.payload.root).deleteIn(['focused', 'userInput'])

    case t.FILTER_SHOW_HIDDEN:
      return state.deleteIn(['global', 'notHidden'])
    
    case t.FILTER_HIDE_HIDDEN:
      return state.setIn(['global', 'notHidden'], c.NOT_HIDDEN_REGEX)

    case t.FILTER_USER_SET:
      return state.setIn(['focused', 'userInput'], Map({
        input: action.payload.input,
        regEx: action.payload.regEx
      }))

    case t.FILTER_USER_CLEAR:
      return state.deleteIn(['focused', 'userInput'])
    
    case Selection.actiontypes.SET_SELECTION:
      return state.deleteIn(['focused', 'userInput'])
    
    case Selection.actiontypes.SET_SELECTION_FOCUS:
      return state.deleteIn(['focused', 'userInput'])

    default:
      return state;
  }
}