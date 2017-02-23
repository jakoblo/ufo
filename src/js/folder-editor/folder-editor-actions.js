import * as t from './folder-editor-actiontypes'
import * as selectors from './folder-editor-selectors'
import _ from 'lodash'
import {Raw} from 'slate'

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

/**
 * @param {string} path
 * @returns {action}
 */
export function folderEditorInit(props) {
  return (dispatch, getState) => {

    const {path} = props

    let editorState = INITIAL_EDITOR_STATE
    editorState = mapFilesToEditorState(getState(), props, editorState)

    dispatch({
      type: t.FOLDER_EDITOR_INIT,
      payload: {
        path : path,
        editorState: editorState
      }
    })
  }
}

/**
 * @param {string} path
 * @returns {action}
 */
export function folderEditorClose(path) {
  return {
    type: t.FOLDER_EDITOR_CLOSE,
    payload: {
      path : path
    }
  }
}

/**
 * @param {string} path
 * @param {state} editorState
 * @returns {action}
 */
export function folderEditorChange(path, editorState) {
  return {
    type: t.FOLDER_EDITOR_CHANGE,
    payload: {
      path : path,
      editorState: editorState
    }
  };
}


/**
 * Will create file blocks for each file 
 * which is in the props.folder and not jet in the Editor
 * 
 * @param {Props} props - component props
 * @returns {ActionCreator}
 */
export function mapFilesToEditor(props) {
  return (dispatch, getState) => {

    const {editorState} = props
    const newEditorState = mapFilesToEditorState(state, props)

    if(editorState != newEditorState) {
      dispatch({
        type: t.FOLDER_EDITOR_FILEMAPPING,
        payload: {
          path : path,
          editorState: editorState
        }
      })
    }
  }
}


/**
 * Will create file blocks for each file 
 * which is in the props.folder and not jet in the Editor
 * 
 * @param {State} state - redux store state
 * @param {Props} props - component props
 * @returns {ActionCreator}
 */
function mapFilesToEditorState(state, props, editorState) {

  const {fileList} = props

  const filesInEditor = selectors.getFilesInEditor_Factory()(state, props.path)
  const filesNotInEditor = _.difference(fileList, filesInEditor)

  if(filesNotInEditor.length > 0) {
    filesNotInEditor.forEach((base, index) => {
      editorState = insertFile(editorState, base)
    })
  }
  return editorState
}



/**
 * Insert an file with `path` at the current selection.
 *
 * @param {State} editorState
 * @param {String} base filename with suffix
 * @return {State}
 */

function insertFile(editorState, base) {
  return editorState
    .transform()
    .insertBlock({
      type: 'file',
      isVoid: true,
      data: { base }
    })
    .apply()
}