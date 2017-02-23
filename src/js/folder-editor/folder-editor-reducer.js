import { fromJS, Map } from 'immutable'
import FolderEditor from '../folder-editor/folder-editor-index'
import {Raw} from 'slate'
import _ from 'lodash'

const INITIAL_STATE = Map({})
const INITIAL_EDITOR_STATE = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: 'Empty'
        }
      ]
    }
  ]
}, { terse: true })

export default function folderEditorReducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {

    case FolderEditor.actiontypes.FOLDER_EDITOR_INIT:
      return state.set(action.payload.path, action.payload.editorState)

    case FolderEditor.actiontypes.FOLDER_EDITOR_CHANGE:
      return state.set(action.payload.path, action.payload.editorState)

    case FolderEditor.actiontypes.FOLDER_EDITOR_FILEMAPPING:
      return state.set(action.payload.path, action.payload.editorState)

    case FolderEditor.actiontypes.FOLDER_EDITOR_CLOSE:
      return state.delete(action.payload.path)

    default:
      return state;
  }

}
