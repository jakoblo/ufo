import React from 'react'
import FileItem from '../../file-item/components/file-item'
import nodePath from 'path'

export default function FilePlugin(options) {

  const { BLOCK_TYPE, folderPath } = options
  const insetLineAboveFileBlock = (editorState) => {
    return editorState
      .transform()
      .splitBlock()
      .setBlock({
        type: 'paragraph',
        isVoid: false,
        data: {}
      })
      .apply()
  }
  const selectionIsOnFile = (state) => state.blocks.some(block => block.type == BLOCK_TYPE)

  return {

    onKeyDown(event, data, state) {
      const { document, startKey, startBlock} = state
      const prevBlock = document.getPreviousBlock(startKey)
      const nextBlock = document.getNextBlock(startKey)
      const prevBlockIsFile = (prevBlock && prevBlock.get('type') == BLOCK_TYPE)
      const nextBlockIsFile = (nextBlock && nextBlock.get('type') == BLOCK_TYPE)
      const onStartOfBlock = state.selection.hasStartAtStartOf(startBlock) && state.selection.hasEndAtStartOf(startBlock)
      const onEndOfBlock = state.selection.hasStartAtEndOf(startBlock) && state.selection.hasEndAtEndOf(startBlock)

      /*
      * | = cursor)
      * [FileItem]
      * |
      * [FileItem]
      */
      if(event.key == "Backspace" || event.key == "Delete") {
        // Line without text between FileBlocks
        if(prevBlockIsFile && onStartOfBlock && nextBlockIsFile && onEndOfBlock) {
          // Remove Empty Line
          return state.transform().removeNodeByKey(startBlock.get('key')).apply()
        }
      }

      /*
      * [FileItem]
      * |text
      */
      if(event.key == "Backspace") {
        if(prevBlockIsFile && onStartOfBlock) {
          return state // Chancel Backspace - would delete previous file block
        }
      }

      /*
      * text| 
      * [FileItem]
      */
      if(event.key == "Delete") {
        if(nextBlockIsFile && onEndOfBlock) {
          return state // Chancel Delete - would delete next file block
        }
      }

      // Selection is expanded arround FileBlock(s)
      if(selectionIsOnFile(state)) {
        return state // Chancel Delete - would delete selected file block
      }
    },

    schema: { // https://docs.slatejs.org/reference/models/schema.html
      nodes: {
        // Render FileItems in blocks with type file
        [BLOCK_TYPE]: function(editorProps) {
          const { node, state } = editorProps
          const isFocused = state.selection.hasEdgeIn(node)
          const base = node.data.get('base')
          return (
            <FileItem
              className='folder-list-item'
              isFocused={isFocused}
              path={nodePath.join(folderPath, base)}
            />
          )
        }
      }
    },

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
    onBeforeInput(event, data, state) {
      if(selectionIsOnFile(state)) {
        return insetLineAboveFileBlock(state)
      }
    }
  }
}