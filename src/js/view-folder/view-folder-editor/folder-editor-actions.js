import * as t from './folder-editor-actiontypes'
import * as selectors from './folder-editor-selectors'
import * as c from  './folder-editor-constants'
import * as Helper from  './folder-editor-helper'
import _ from 'lodash'
import {Raw} from 'slate'

// const INITIAL_EDITOR_STATE = Raw.deserialize({
//   nodes: [
//     {
//       kind: 'block',
//       type: 'paragraph',
//       nodes: [
//         {
//           kind: 'text',
//           text: 'Empty'
//         }
//       ]
//     }
//   ]
// }, { terse: true })

/**
 * @param {string} path
 * @returns {action}
 */
export function folderEditorInit(props) {
  return (dispatch, getState) => {

    const {path} = props

    // let editorState = INITIAL_EDITOR_STATE
    const editorState = mapFilesToEditorState(getState(), props, null)

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
 * @param {Immuteable} editorState
 * @returns {ActionCreator}
 */
function mapFilesToEditorState(state, props, editorState) {

  const {fileList} = props

  const filesInEditor = selectors.getFilesInEditor_Factory()(state, props.path)
  const filesNotInEditor = _.difference(fileList, filesInEditor)

  if(filesNotInEditor.length > 0) {
    editorState = newStateWithFileNodes(filesNotInEditor)
    // filesNotInEditor.forEach((base, index) => {
    //   editorState = insertFile(editorState, base)
    // })
  }
  return editorState
}

// Faster than block transforms, but still slow
function newStateWithFileNodes(filesNotInEditor) {
  const nodes = []

  filesNotInEditor.forEach((base, index) => {
    nodes.push({
      kind: 'block',
      type: c.BLOCK_TYPE_FILE,
      isVoid: true,
      data: {
        base: base
      }
    })
  })

  // Add empty line at the end
  nodes.push({
    kind: 'block',
    type: 'paragraph'
  })

  console.time('Create Slate State')
  const editorState = Raw.deserialize({ nodes }, { terse: true })
  console.timeEnd('Create Slate State')

  return editorState
}