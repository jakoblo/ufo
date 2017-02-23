import { createSelector } from 'reselect'
import * as c from './folder-editor-constants'

export const getEditorState = (state, props) => state[c.NAME].get(props.path)

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
      return editorState.document.getBlocks().filter((block) => {
        return block.get('type') == "file"
      }).map((fileBlock) => {
        return fileBlock.getIn(['data', 'base'])
      }).toJS()
    }
  )
}