// @flow
import * as t from "./folder-editor-actiontypes";
import * as selectors from "./folder-editor-selectors";
import * as c from "./folder-editor-constants";
import SlateFile from "./slate-extensions/slate-file/slate-file-index";
import * as Utils from "../../utils/utils-index";
import * as FsMergedSelector from "../../filesystem/fs-merged-selectors";
import nodePath from "path";
import _ from "lodash";
import { Raw, State } from "slate";

import type { ThunkArgs, Action } from "../../types";

export function folderEditorInit(path: string) {
  return (dispatch: Function, getState: Function) => {
    const fileList = FsMergedSelector.getFiltedBaseArrayOfFolder_Factory()(
      getState(),
      path
    );

    if (fileList.indexOf(c.INDEX_BASE_NAME) > -1) {
      let editorState;
      const fileContent = Utils.fs
        .loadFile(nodePath.join(path, c.INDEX_BASE_NAME))
        .then(fileContent => {
          editorState = SlateFile.serialize.markdownToState(fileContent);
          editorState = mapFilesToEditorState(fileList, editorState);

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

export function folderEditorClose(path: string): Action {
  return {
    type: t.FOLDER_EDITOR_CLOSE,
    payload: {
      path: path
    }
  };
}

export function folderEditorChange(
  path: string,
  editorState: Class<State>
): Action {
  return {
    type: t.FOLDER_EDITOR_CHANGE,
    payload: {
      path: path,
      editorState: editorState,
      selectedFiles: SlateFile.utils.buildSelectedFiles(editorState)
    }
  };
}

function mapFilesToEditorState(
  fileList: Array<string>,
  editorState: Class<State>
): Class<State> {
  const filesOnDisk = fileList;

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
function newStateWithFileNodes(filesNotInEditor): Class<State> {
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

  const editorState: Class<State> = Raw.deserialize(state, {
    terse: false,
    normalize: false
  });

  return editorState;
}
