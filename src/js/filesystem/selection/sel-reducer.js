"use strict"
import * as t from './sel-actiontypes'
import App from '../../app/app-index'
import Preview from '../../view-file/vf-index'
import Filter from '../filter/filter-index'
import FS from '../watch/fs-watch-index'
import FsWrite from '../write/fs-write-index'
import FolderEditor from '../../view-folder/view-folder-editor/folder-editor-index'
import * as _ from 'lodash'
import nodePath from 'path'
import {Map, List, Seq, fromJS} from 'immutable'

const INITIAL_STATE = {
  root: '',
  files: [],
  selectTypeInput: ""
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
          files: [],
          selectTypeInput: ""
        })
      }

    case Preview.actiontypes.SHOW_PREVIEW:
      // Select File wich is opend in File Preview
      return fromJS({
        root: nodePath.dirname(action.payload.path),
        files: [ nodePath.basename(action.payload.path) ],
        selectTypeInput: ""
      })

    case FS.actiontypes.FILE_UNLINK:
      // a selected file has maybe been delete
      // If that is the case, it's necessary to remove that
      // or the easy way, reset the selection....
      if(state.get('root') && state.get('root').indexOf(nodePath.dirname(action.payload.path)) > -1) {
        return state.set('files', List([]))
      }
      return state

    case FolderEditor.actiontypes.FOLDER_EDITOR_CHANGE:
      return state.set('root', action.payload.path).set('files', List(action.payload.selectedFiles))

    case t.SELECT_TYPE_SET:
      return state.set('selectTypeInput', action.payload.input)

    case t.SELECT_TYPE_CLEAR:
      return state.set('selectTypeInput', '')
    
    case FsWrite.actiontypes.FS_WRITE_NEW:
      return state.set('files', List([])) // Clear selection

    case Filter.actiontypes.FILTER_HIDE_HIDDEN: // NOT IN USE RIGHT NOW
      return state.set('files', List([]))
    
    case Filter.actiontypes.FILTER_USER_SET: // NOT IN USE RIGHT NOW
      return state.set('files', List([]))

    default:
      return state;
  }
}