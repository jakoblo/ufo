//@flow
import React from "react";
import FileItem from "../../../../file-item/components/file-item";
import Selection from "../../../../filesystem/selection/sel-index";
import nodePath from "path";
import * as dragndrop from "../../../../utils/dragndrop";

import { DEFAULT_NODE } from "../rich-text-types";

import { Block, State } from "slate";
import VoidCursorEmulator from "./components/void-cursor-emulator";
import * as c from "../../folder-editor-constants";
import * as stateTransforms from "./slate-file-state-transforms";
import * as slateUtils from "./slate-file-utils";

const defaultBlock = {
  type: DEFAULT_NODE.type,
  isVoid: false,
  data: {}
};

type PluginOptions = {
  folderPath: string,
  BLOCK_TYPE: string,
  dispatch: Function
};

export default function FilePlugin_Factory(options: PluginOptions) {
  const { BLOCK_TYPE, folderPath, dispatch } = options;

  return {
    onKeyDown(event: SyntheticKeyboardEvent, data: any, state: Class<State>) {
      const { document, startKey, startBlock } = state;
      const prevBlock = document.getPreviousBlock(startKey);
      const nextBlock = document.getNextBlock(startKey);
      const prevBlockIsFile = prevBlock && prevBlock.get("type") == BLOCK_TYPE;
      const nextBlockIsFile = nextBlock && nextBlock.get("type") == BLOCK_TYPE;
      const onStartOfBlock =
        state.selection.hasStartAtStartOf(startBlock) &&
        state.selection.hasEndAtStartOf(startBlock);
      const onEndOfBlock =
        state.selection.hasStartAtEndOf(startBlock) &&
        state.selection.hasEndAtEndOf(startBlock);

      /*
      * [FileItem]
      * |
      * [FileItem]
      */
      if (event.key == "Backspace" || event.key == "Delete") {
        // Line without text between FileBlocks
        if (
          prevBlockIsFile &&
          onStartOfBlock &&
          nextBlockIsFile &&
          onEndOfBlock
        ) {
          // Remove Empty Line
          event.preventDefault();
          return state
            .transform()
            .removeNodeByKey(startBlock.get("key"))
            .apply();
        }

        if (
          state.selection.isExpanded &&
          slateUtils.includesAFileBlock(state)
        ) {
          event.preventDefault(); // Chancel Delete - would delete selected file block
          return state;
        }
      }

      /*
      * [FileItem]
      * |text
      */
      if (event.key == "Backspace") {
        if (prevBlockIsFile && onStartOfBlock) {
          event.preventDefault();
          return state; // Chancel Backspace - would delete previous file block
        }
      }

      /*
      * text|
      * [FileItem]
      */
      if (event.key == "Delete") {
        if (nextBlockIsFile && onEndOfBlock) {
          event.preventDefault();
          return state; // Chancel Delete - would delete next file block
        }
      }

      /*
      * on ENTER
      *
      * [FileItem]|
      * to:
      * [FileItem]
      * |
      * --- or ---
      * |[FileItem]
      * to:
      * |
      * [FileItem]
      */
      if (event.key == "Enter" && slateUtils.includesAFileBlock(state)) {
        event.preventDefault();
        return stateTransforms
          .createNewLineAroundFileBlock(state.transform(), state.selection)
          .apply();
      }

      if (slateUtils.includesAFileBlock(state)) {
        // Import to allow arrow key movement vom cursor to the other side of the file block
        // But don't know why
        return state;
      }
    },

    schema: {
      // https://docs.slatejs.org/reference/models/schema.html
      nodes: {
        // Render FileItems in blocks with type file
        [BLOCK_TYPE]: function(editorProps) {
          const { node, editor } = editorProps;
          const base = node.getIn(["data", "base"]);
          const asImage = node.getIn(["data", "asImage"]);

          return (
            <VoidCursorEmulator editor={editor} node={node}>
              <FileItem
                className="view-folder-item"
                path={nodePath.join(folderPath, base)}
                asImage={asImage}
                toggleImageCallback={() => {
                  editor.onChange(
                    slateUtils.toggleBlockImage(editor.getState(), node)
                  );
                }}
                onDrop={(event, cursorPosition) => {
                  const fileList = dragndrop.getFilePathArray(event);
                  const baselist = fileList.map(filePath =>
                    nodePath.basename(filePath)
                  );
                  let state = editor.getState();

                  state = stateTransforms.removeFiles(state, baselist);

                  // Need to be calcualted after remove Files
                  const nodeIndex = state.document
                    .getParent(node)
                    .get("nodes")
                    .indexOf(node);
                  const position = cursorPosition ==
                    dragndrop.constants.CURSOR_POSITION_TOP
                    ? nodeIndex
                    : nodeIndex + 1;

                  state = stateTransforms.insertFilesAt(
                    state,
                    baselist,
                    position
                  );

                  editor.onChange(state);
                  dragndrop.executeFileDropOnDisk(event, folderPath);
                }}
              />
            </VoidCursorEmulator>
          );
        }
      },

      rules: [
        // Rule to insert a paragraph block if the document is empty
        {
          match: (node: any) => {
            return node.kind == "document";
          },
          validate: (document: any) => {
            return document.nodes.size ? null : true;
          },
          normalize: (transform: any, document: any) => {
            const block = Block.create(defaultBlock);
            transform.insertNodeByKey(document.key, 0, block);
          }
        },
        // Rule to insert a paragraph below a void node (File)
        // if that node is the last one in the document
        {
          match: (node: any) => {
            return node.kind == "document";
          },
          validate: (document: any) => {
            const lastNode = document.nodes.last();
            return lastNode && lastNode.isVoid ? true : null;
          },
          normalize: (transform: any, document: any) => {
            const block = Block.create(defaultBlock);
            transform.insertNodeByKey(document.key, document.nodes.size, block);
          }
        }
      ]
    },

    onBeforeInput: (
      event: SyntheticKeyboardEvent,
      data: any,
      state: Class<State>
    ) => {
      if (slateUtils.includesAFileBlock(state)) {
        let stateTransform = state.transform();

        if (state.selection.isExpanded) {
          // Would delete Files, collapse first
          stateTransform.collapseToFocus();
        }

        /*
        * | FileItem |
        * | FileItem | < selection
        *
        * will transform to:
        *
        * | FileItem |
        * |            < new Empty Text line
        * | FileItem |
        */
        stateTransform = stateTransforms.createNewLineAroundFileBlock(
          stateTransform,
          state.selection
        );

        return stateTransform.apply();
      }
    },

    onDrop: (
      event: SyntheticDragEvent,
      data: any,
      state: Class<State>,
      editor: any
    ) => {
      event.preventDefault();
      event.stopPropagation();

      if (dragndrop.shouldAcceptDrop(event, [dragndrop.constants.TYPE_FILE])) {
        const fileList = dragndrop.getFilePathArray(event);
        const baselist = fileList.map(filePath => nodePath.basename(filePath));
        const selection = data.target;

        state = stateTransforms.removeFiles(state, baselist);

        // Set Selection to Drop Position and create a Break there
        state = state
          .transform()
          .deselect()
          .select(selection)
          .splitBlock()
          .apply({ save: false });

        const node = state.document.findDescendant(
          node => node.key == selection.focusKey
        );
        const block = slateUtils.getRootBlockOfNode(state, node);
        const blockIndex = state.document.get("nodes").indexOf(block);

        state = stateTransforms.insertFilesAt(state, baselist, blockIndex + 1);

        // state = state.transform().deselect().apply()

        // Move Files
        dragndrop.executeFileDropOnDisk(event, folderPath);

        return state;
      }
    }
  };
}
