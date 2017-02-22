import * as t from './folder-editor-actiontypes'
import * as selectors from './folder-editor-selectors'
import _ from 'lodash'

/**
 * @param {string} path
 * @returns {action}
 */
export function folderEditorInit(path) {
  return {
    type: t.FOLDER_EDITOR_INIT,
    payload: {path : path}
  };
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

export function actionCreator() {
  return (dispatch, getState) => {
    
    dispatch( )
  }
}


/**
 * Will create file blocks for each file 
 * which is in the props.folder and not jet in the Editor
 * 
 * @param {Props} props
 * @returns {ActionCreator}
 */
export function mapFilesToEditor(props) {
  return (dispatch, getState) => {

    const {folder, path} = props
    let {editorState} = props

    const filesInEditor = selectors.getFilesInEditor_Factory()(getState(), props)
    const filesOnDisk = folder.keySeq().toJS()

    const filesNotInEditor = _.difference(filesOnDisk, filesInEditor)

    if(filesNotInEditor.length > 0) {
      filesNotInEditor.forEach((base, index) => {
        editorState = insertFile(editorState, base)
      })
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