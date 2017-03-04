import React from 'react'
import FileItem from '../../../../file-item/components/file-item'
import nodePath from 'path'
import {Block, Selection} from 'slate'
import * as c from '../../folder-editor-constants'
import * as dragndrop from '../../../../utils/dragndrop'
import * as Helper from '../../folder-editor-helper'

export default function FilePlugin(options) {

  const { BLOCK_TYPE, folderPath } = options

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
      if (event.key == "Backspace" || event.key == "Delete") {
        // Line without text between FileBlocks
        if (prevBlockIsFile && onStartOfBlock && nextBlockIsFile && onEndOfBlock) {
          // Remove Empty Line
          return state.transform().removeNodeByKey(startBlock.get('key')).apply()
        }
      }

      /*
      * [FileItem]
      * |text
      */
      if (event.key == "Backspace") {
        if (prevBlockIsFile && onStartOfBlock) {
          return state // Chancel Backspace - would delete previous file block
        }
      }

      /*
      * text| 
      * [FileItem]
      */
      if (event.key == "Delete") {
        if (nextBlockIsFile && onEndOfBlock) {
          return state // Chancel Delete - would delete next file block
        }
      }

      // Selection is expanded arround FileBlock(s)
      if (Helper.selectionIsOnFile(state)) {
        return state // Chancel Delete - would delete selected file block
      }
    },

    schema: { // https://docs.slatejs.org/reference/models/schema.html
      nodes: {
        // Render FileItems in blocks with type file
        [BLOCK_TYPE]: function (editorProps) {
          const { node, state, editor } = editorProps
          const isFocused = state.selection.hasEdgeIn(node)
          const base = node.getIn(['data', 'base'])
          return (
            <FileItem
              className='view-folder-item'
              isFocused={isFocused}
              path={nodePath.join(folderPath, base)}
              onDrop={(event, cursorPosition) => {

                const fileList = dragndrop.getFilePathArray(event)
                let transforming = state.transform().select( Helper.getSelectionForFileNode(node) )

                fileList.forEach((filePath) => {
                  const basename = nodePath.basename(filePath)
                  transforming = Helper.fileBlockTransforms.removeExisting(transforming, basename)
                  transforming = 
                    (cursorPosition == dragndrop.constants.CURSOR_POSITION_TOP) ?
                      Helper.fileBlockTransforms.insertFileOnTop(transforming, basename)
                    :
                      Helper.fileBlockTransforms.insertFileBelow(transforming, basename)
                }) 

                editor.onChange(transforming.apply())
                dragndrop.executeFileDropOnDisk(event, folderPath)

              }}
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
    onBeforeInput: (event, data, state) => {
      if (Helper.selectionIsOnFile(state)) {
        return  Helper.fileBlockTransforms
                .insetLineAboveFileBlock( state.transform() )
                .apply()
      }
    },

    onDrop: (event, data, state, editor) => {
      event.preventDefault()
      event.stopPropagation()
      
      if(dragndrop.shouldAcceptDrop(event, [dragndrop.constants.TYPE_FILE])) {
        const fileList = dragndrop.getFilePathArray(event)

        // Transform selection
        let transforming = state.transform().deselect().select(data.target)
      
        // Insert File Blocks
        fileList.forEach((filePath) => {
          const basename = nodePath.basename(filePath)
          transforming = Helper.fileBlockTransforms.removeExisting(transforming, basename)
          transforming = Helper.fileBlockTransforms.insertFileBelow(transforming, basename)
        })

        state = transforming.deselect().apply()
        
        // Move Files
        dragndrop.executeFileDropOnDisk(event, folderPath)

        return state
      }
    },


  }
}