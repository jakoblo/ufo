import { fromJS, Map } from 'immutable'
import * as t from './folder-editor-actiontypes'
import * as c from './folder-editor-constants'
import SlateFile from './slate-extensions/slate-file/slate-file-index'
import fsWatch from '../../filesystem/watch/fs-watch-index'
import fsWrite from '../../filesystem/write/fs-write-index'
import {Raw} from 'slate'
import _ from 'lodash'
import nodePath from 'path'

const INITIAL_STATE = fromJS({})

export default function folderEditorReducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {

    case t.FOLDER_EDITOR_INIT:
      return state.set(action.payload.path, action.payload.editorState)

    case t.FOLDER_EDITOR_CHANGE:
      return state.set(action.payload.path, action.payload.editorState)

    case t.FOLDER_EDITOR_FILEMAPPING:
      return state.set(action.payload.path, action.payload.editorState)

    case t.FOLDER_EDITOR_CLOSE:
      return state.delete(action.payload.path)
    

    // Add file at the end of the Document if not exists
    case fsWatch.actiontypes.FILE_ADD:
      if(action.payload.base == c.INDEX_BASE_NAME) return state

      // File Exists already ?
      if(SlateFile.Blocks.getFileBlockByBase(state.get(action.payload.root), action.payload.base)) return state
      
      // Add file at the end of the Document
      const document = state.get(action.payload.root).get('document')
      let transformAddFile = state.get(action.payload.root).transform()
          transformAddFile = SlateFile.Transforms.insertFileAtEnd(transformAddFile, document, action.payload.base)

      return state.set(action.payload.root, transformAddFile.apply())

    // Remove file from document is exists
    case fsWatch.actiontypes.FILE_UNLINK:
      let transformRemoveFile = state.get(action.payload.root).transform()
          transformRemoveFile = SlateFile.Transforms.removeExisting(transformRemoveFile, action.payload.base)
      return state.set(action.payload.root, transformRemoveFile.apply())
    

    // Rename File in Document
    case fsWrite.actiontypes.FS_WRITE_NEW:
      return (() => {
        if(action.payload.type != fsWrite.actiontypes.TASK_RENAME) return state
        
        const renamingSource = action.payload.sources[0]
        const renamingSourceBase = nodePath.basename(renamingSource)
        const renamingSourceRoot = nodePath.dirname(renamingSource)
        const renamingTarget = action.payload.target
        const renamingTargetBase = nodePath.basename(renamingTarget)
        const renamingEditor = state.get(renamingSourceRoot)

        if(!renamingEditor) return state

        return state.set(renamingSourceRoot, SlateFile.Transforms.renameFile( 
          renamingEditor,
          renamingEditor.transform(),
          renamingSourceBase,
          renamingTargetBase
        ).apply() )
      })()
    

    // Rename Error, undo the rename in the Document
    case fsWrite.actiontypes.FS_WRITE_ERROR:
      return (() => {
        if(action.payload.type != fsWrite.actiontypes.TASK_RENAME) return state
        
        const renamingSource = action.payload.sources[0]
        const renamingSourceBase = nodePath.basename(renamingSource)
        const renamingSourceRoot = nodePath.dirname(renamingSource)
        const renamingTarget = action.payload.target
        const renamingTargetBase = nodePath.basename(renamingTarget)
        const renamingEditor = state.get(renamingSourceRoot)

        if(!renamingEditor) return state

        return state.set(renamingSourceRoot, SlateFile.Transforms.renameFile( 
          renamingEditor,
          renamingEditor.transform(),
          renamingTargetBase, // Inverted
          renamingSourceBase // Inverted
        ).apply() )
      })()

    default:
      return state
  }

}
