"use strict"
import * as t from './filter-actiontypes'
import nodePath from 'path'
import {Map, fromJS} from 'immutable'

const INITIAL_STATE = {
  global: {
    notHidden: /^[^.]/
  },
  specific: {
    '/Users/flow': /^\.?do/i
  }
}

export default function reducer(state = fromJS(INITIAL_STATE), action = { type: '' }) {

  switch (action.type) {

    case t.FILTER_USER_SET:
      return state.setIn(['specific', action.payload.path], new RegExp("^\.?"+action.payload.filterString, "i"))

    case t.FILTER_USER_CLEAR:
      return state.deleteIn(['specific', action.payload.path])

    default:
      return state;
  }
}