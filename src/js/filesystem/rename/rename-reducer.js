"use strict"
import * as t from './rename-actiontypes'
import * as _ from 'lodash'
import nodePath from 'path'
import {Map} from 'immutable'

const INITIAL_STATE = {
  current: ''
}

export default function reducer(state = Map(INITIAL_STATE), action = { type: '' }) {

  switch (action.type) {

    case t.RENAME_START:
      return Map({
        current: action.payload.path
      })

    case t.RENAME_CANCEL:
      return Map(INITIAL_STATE)

    case t.RENAME_SAVE:
      return Map(INITIAL_STATE)

    default:
      return state;
  }
}