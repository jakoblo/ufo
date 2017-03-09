import * as t from './folder-editor-actiontypes'
import * as selectors from './folder-editor-selectors'
import * as c from  './folder-editor-constants'
import * as Helper from  './folder-editor-helper'
import * as Utils from  '../../utils/utils-index'
import * as Markdown from  './folder-editor-serializer'
import nodePath from 'path'
import _ from 'lodash'
import {Raw, Plain, setKeyGenerator} from 'slate'

/**
 * @param {string} path
 * @returns {action}
 */
export function folderEditorInit(props) {
  return (dispatch, getState) => {

    const {path, fileList} = props

    if(fileList.indexOf('index.md') > -1) {
      const fileContent = Utils.fs.loadFile( nodePath.join(props.path, 'index.md') )
        .then((fileContent) => {
          let editorState = Helper.deserializeMarkdown(fileContent)
          editorState = mapFilesToEditorState(props, editorState)

          dispatch({
            type: t.FOLDER_EDITOR_INIT,
            payload: {
              path : path,
              editorState: editorState
            }
          })
      })
    }
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
// export function mapFilesToEditor(props) {
//   return (dispatch, getState) => {

//     const {editorState} = props
//     const newEditorState = mapFilesToEditorState(state, props)

//     if(editorState != newEditorState) {
//       dispatch({
//         type: t.FOLDER_EDITOR_FILEMAPPING,
//         payload: {
//           path : path,
//           editorState: editorState
//         }
//       })
//     }
//   }
// }

/**
 * Will create file blocks for each file 
 * which is in the props.folder and not jet in the Editor
 * 
 * @param {State} state - redux store state
 * @param {Props} props - component props
 * @param {Immuteable} editorState
 * @returns {ActionCreator}
 */
function mapFilesToEditorState(props, editorState) {

  const filesOnDisk = props.fileList

  const filesInEditor = Helper.getFilesInState(editorState)
  const filesNotInEditor = _.difference(filesOnDisk, filesInEditor)

  if(filesNotInEditor.length > 0) {
    // editorState = newStateWithFileNodes(filesNotInEditor)
    let transforming = editorState.transform()
    filesNotInEditor.forEach((base, index) => {
      transforming = Helper.fileBlockTransforms.insertFileAtEnd(transforming, editorState.get('document'), base)
    })
    editorState = transforming.apply()

  }
  return editorState
}

// Faster than block transforms, but still slow
function newStateWithFileNodes(filesNotInEditor) {

  let state = {
    "document": {
        "data": {},
        "kind": "document",
        "nodes": []
    },
    kind: "state"
  }

  filesNotInEditor.forEach((base, index) => {
    state.document.nodes.push({
      kind: 'block',
      type: c.BLOCK_TYPE_FILE,
      isVoid: true,
      "nodes": [
        {
          "kind": "text",
          "ranges": [
            {
              "kind": "range",
              "text": " ",
              "marks": []
            }
          ]
        }
      ],
      data: {
        base: base
      }
    })
  })

  // Add empty line at the end
  // nodes.push({
  //   kind: 'block',
  //   type: 'markdown'
  // })

  console.time('Create Slate State')
  const editorState = Raw.deserialize(state, { terse: false, normalize: false })
  console.timeEnd('Create Slate State')

  return editorState
}


