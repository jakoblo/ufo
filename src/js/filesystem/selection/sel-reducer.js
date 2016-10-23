"use strict"
import * as t from './sel-actiontypes'
import App from '../../app/app-index'
import Preview from '../../view-file/vf-index'
import FS from '../watch/fs-watch-index'
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
      if(action.payload.pathRoute.length > 1) {
        let selected = nodePath.basename( _.last(action.payload.pathRoute) )
        let root = action.payload.pathRoute[ action.payload.pathRoute.length - 2 ]
        return fromJS({
          root: root,
          files: [selected]
        })  
      } else {
        return fromJS({
          root: _.last(action.payload.pathRoute),
          files: []
        })
      }

    case Preview.actiontypes.SHOW_PREVIEW:
      return fromJS({
        root: nodePath.dirname(action.payload.path),
        files: [ nodePath.basename(action.payload.path) ]
      })

    case FS.actiontypes.FILE_UNLINK:
        // a selected file has maybe been delete
        // If that is the case, it's necessary to remove that
        // or the easy way, reset the selection....
        if(state.get('root') && state.get('root').indexOf(nodePath.dirname(action.payload.path)) > -1) {
          return fromJS(INITIAL_STATE)
        }
        return state

    default:
      return state;
  }
}