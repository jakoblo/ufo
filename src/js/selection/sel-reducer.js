"use strict"
import * as t from './sel-actiontypes'
import App from '../app/app-index.js'
import * as _ from 'lodash'
import nodePath from 'path'
import {Map, List, Seq, fromJS} from 'immutable'

const INITIAL_STATE = {
  root: '',
  files: []
}

export default function reducer(state = fromJS(INITIAL_STATE), action = { type: '' }) {

  switch (action.type) {

    case t.SET_SELECTION:
      return fromJS(action.payload)

    case App.actiontypes.APP_CHANGE_PATH:
      // Set Selection to last folder in pathRoute
      let selected = nodePath.basename( _.last(action.payload.pathRoute) )
      let root = action.payload.pathRoute[ action.payload.pathRoute.length - 2 ]
      return fromJS({
        root: root,
        files: [selected]
      })

    default:
      return state;
  }
}