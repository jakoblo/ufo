import React from 'react'
import FileItem from '../../file-item/components/file-item'
import nodePath from 'path'
import {Block, Selection} from 'slate'
import * as c from '../folder-editor-constants'
import * as dragndrop from '../../utils/dragndrop'

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

  function getBlockByKey(state, key) {
    return state.get('document').getChild(key)              
  }

  function getSelectionForFileNode(node) {
    const childTextNodeKey = node.get('nodes').first().get('key')
    return new Selection({
      anchorKey: childTextNodeKey,
      anchorOffset: 1,
      focusKey: childTextNodeKey,
      focusOffset: 1,
      isBackward: false,
      isFocused: true
    })
  }

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
      if (selectionIsOnFile(state)) {
        return state // Chancel Delete - would delete selected file block
      }
    },

    schema: { // https://docs.slatejs.org/reference/models/schema.html
      nodes: {
        // Render FileItems in blocks with type file
        [BLOCK_TYPE]: function (editorProps) {
          const { node, state, editor } = editorProps
          const isFocused = state.selection.hasEdgeIn(node)
          const base = node.key
          return (
            <FileItem
              className='folder-list-item'
              isFocused={isFocused}
              path={nodePath.join(folderPath, base)}
              onDrop={(cursorPosition, event) => {
                
                //console.log(arguments)
                //console.log(editor)
                console.log(node.toJS())
                window.node = node
                //console.log(base)
                //console.log(isFocused)
                //console.log(state)
                //console.log(state.toJS())

                const fileList = dragndrop.getFilePathArray(event)
                let transforming = state.transform().select( getSelectionForFileNode(node) )

                fileList.forEach((filePath) => {
                  const basename = nodePath.basename(filePath)
                  const existingFileBlock = getBlockByKey(state, basename)
                  const newFileBlock = Block.create({
                    type: c.BLOCK_TYPE_FILE,
                    isVoid: true,
                    key: basename
                  })

                  if(existingFileBlock) {
                    transforming = transforming
                      .removeNodeByKey(existingFileBlock.get('key'))
                  }
                  transforming = transforming
                    .insertBlock(newFileBlock)

                }) 

                editor.onChange(transforming.apply())
                dragndrop.executeFileDrop(event, folderPath)

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
      if (selectionIsOnFile(state)) {
        return insetLineAboveFileBlock(state)
      }
    },

    onDrop: (event, data, state, editor) => {
      console.log('EDITOR DROP')
      event.preventDefault()
      event.stopPropagation()
      
      if(dragndrop.shouldAcceptDrop(event, [dragndrop.constants.TYPE_FILE])) {
        const fileList = dragndrop.getFilePathArray(event)

        console.log(
          data.target.toJS()
        )
        // Transform selection
        let transforming = state.transform().unsetSelection().moveTo(data.target)
      
        // Insert File Blocks
        fileList.forEach((filePath) => {
          const fileBase = nodePath.basename(filePath)
          const existsAlready = state.getIn(['document', 'nodes']).find((node) => {
            return (node.get('key') == fileBase)
          })
          if(existsAlready) {
            transforming = transforming.removeNodeByKey(fileBase)
          }
          transforming = transforming.insertBlock({
            type: c.BLOCK_TYPE_FILE,
            isVoid: true,
            key: fileBase
          })
        })

        state = transforming.apply()

        // Move Files
        dragndrop.handleFileDrop(event, folderPath)

        return state
      }
    },


  }
}