"use strict"
import * as t from './filter-actiontypes'
import nodePath from 'path'
import {Map, fromJS} from 'immutable'

const INITIAL_STATE = {
  global: {
    notHidden: /^[^.]/
  },
  focused: {
    userInput: {
      input: 'do',
      regEx: /^\.?d/i,
    }
  }
}

export default function reducer(state = fromJS(INITIAL_STATE), action = { type: '' }) {

  switch (action.type) {

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