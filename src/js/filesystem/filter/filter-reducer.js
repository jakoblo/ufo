"use strict"
import * as t from './filter-actiontypes'
import * as c from './filter-constants'
import Selection from '../selection/sel-index'
import App from '../../app/app-index'
import nodePath from 'path'
import _ from 'lodash'
import {Map, fromJS} from 'immutable'

const INITIAL_STATE = {
  global: {
    notHidden: c.NOT_HIDDEN_REGEX
  },
  focused: {}, // Filter Collection for the folder in 'focusedPath'
  focusedPath: '' 
}

export default function reducer(state = fromJS(INITIAL_STATE), action = { type: '' }) {

  switch (action.type) {

    case App.actiontypes.APP_CHANGE_PATH:

      /**
       * The behaviour is little bit confused but thaken from Finder
       * it make sens, but is hard to explain...
       * 
       * The Focused Folder where the Typing filter will apply,
       * is different is Click on a folder or if you select it arrow keys.
       * If you select a file, its different again.
       * 
       * @TODO try to remove peak 
       */
      let newFocus = null
      if(action.payload.peak && action.payload.pathRoute.length > 1) {
        newFocus = action.payload.pathRoute[ action.payload.pathRoute.length - 2 ]
        if(_.last(action.payload.pathRoute) == state.get('focusedPath')) {
          // Skip Change if filtering in the same folder is switching to a file
          return state
        }
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
      if(action.payload.root != state.get('focusedPath')) {
        console.log(action.payload.root)
        return state.set('focusedPath', action.payload.root).deleteIn(['focused', 'userInput'])
      } else {
        return state
      }

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

    default:
      return state;
  }
}