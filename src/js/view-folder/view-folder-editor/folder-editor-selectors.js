import { createSelector } from 'reselect'
import * as c from './folder-editor-constants'
import * as Helper from './folder-editor-helper'

export const getEditorState = (state, path) => state[c.NAME].get(path)

/**
 * Factroy for Selector that returns the editorState
 * 
 * @returns {Function} reselect
 */
export const getFilesInEditor_Factory = () => {
  return createSelector(
    [getEditorState], (editorState) => {
      if(!editorState) {
        return null
      }
      return Helper.getFilesInNodes(editorState.document.getBlocks())
    }
  )
}
