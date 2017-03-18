import * as t from "./folder-editor-actiontypes";
import * as selectors from "./folder-editor-selectors";
import * as c from "./folder-editor-constants";
import SlateFile from "./slate-extensions/slate-file/slate-file-index";
import * as Utils from "../../utils/utils-index";
import nodePath from "path";
import _ from "lodash";
import { Raw } from "slate";

/**
 * @param {string} path
 * @returns {action}
 */
export function folderEditorInit(props) {
  return (dispatch, getState) => {
    const { path, fileList } = props;
    let editorState;

    if (fileList.indexOf(c.INDEX_BASE_NAME) > -1) {
      const fileContent = Utils.fs
        .loadFile(nodePath.join(props.path, c.INDEX_BASE_NAME))
        .then(fileContent => {
          editorState = SlateFile.serialize.plainToState(fileContent);
          editorState = mapFilesToEditorState(props, editorState);

          dispatch({
            type: t.FOLDER_EDITOR_INIT,
            payload: {
              path: path,
              editorState: editorState
            }
          });
        });
    } else {
      console.time("Init");
      dispatch({
        type: t.FOLDER_EDITOR_INIT,
        payload: {
          path: path,
          editorState: newStateWithFileNodes(fileList)
        }
      });
      console.timeEnd("Init");
    }
  };
}

/**
 * @param {string} path
 * @returns {action}
 */
export function folderEditorClose(path) {
  return {
    type: t.FOLDER_EDITOR_CLOSE,
    payload: {
      path: path
    }
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
      path: path,
      editorState: editorState,
      selectedFiles: SlateFile.utils.buildSelectedFiles(editorState)
    }
  };
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
function mapFilesToEditorState(props, editorState) {
  const filesOnDisk = props.fileList;

  const filesInEditor = SlateFile.utils.getFilesInState(editorState);
  const filesNotInEditor = _.difference(filesOnDisk, filesInEditor);
  const fileNotOnDisk = _.difference(filesInEditor, filesOnDisk);

  let transforming = editorState.transform();

  fileNotOnDisk.forEach((base, index) => {
    transforming = SlateFile.stateTransforms.removeExisting(transforming, base);
  });
  filesNotInEditor.forEach((base, index) => {
    if (base != c.INDEX_BASE_NAME) {
      transforming = SlateFile.stateTransforms.insertFileAtEnd(
        transforming,
        editorState.get("document"),
        base
      );
    }
  });

  editorState = transforming.apply({ save: false });

  return editorState;
}

// Faster than block transforms, but still slow
function newStateWithFileNodes(filesNotInEditor) {
  let state = {
    document: {
      data: {},
      kind: "document",
      nodes: []
    },
    kind: "state"
  };

  filesNotInEditor.forEach((base, index) => {
    if (base != c.INDEX_BASE_NAME) {
      state.document.nodes.push({
        kind: "block",
        type: c.BLOCK_TYPE_FILE,
        isVoid: true,
        nodes: [
          {
            kind: "text",
            ranges: [
              {
                kind: "range",
                text: " ",
                marks: []
              }
            ]
          }
        ],
        data: {
          base: base
        }
      });
    }
  });

  //Add empty line at the end
  state.document.nodes.push({
    kind: "block",
    type: "markdown",
    isVoid: false,
    nodes: [
      {
        kind: "text",
        ranges: [
          {
            kind: "range",
            text: "",
            marks: []
          }
        ]
      }
    ]
  });

  const editorState = Raw.deserialize(state, {
    terse: false,
    normalize: false
  });

  return editorState;
}
