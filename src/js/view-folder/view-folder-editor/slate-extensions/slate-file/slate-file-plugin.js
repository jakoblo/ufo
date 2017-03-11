import React from 'react'
import FileItem from '../../../../file-item/components/file-item'
import Selection from '../../../../filesystem/selection/sel-index'
import nodePath from 'path'
import {Block} from 'slate'
import * as c from '../../folder-editor-constants'
import * as dragndrop from '../../../../utils/dragndrop'
import * as EditorSelection from './slate-file-selection'
import * as Transforms from './slate-file-transforms'
import * as Blocks from './slate-file-blocks'

const defaultBlock = {
  type: 'paragraph',
  isVoid: false,
  data: {}
}

export default function FilePlugin_Factory(options) {

  const { BLOCK_TYPE, folderPath, dispatch } = options
  let stateCache

  // const onSelectionChange = (state) => {
  //   const selectedFiles = EditorSelection.getSelectedFiles(state).map((fileBase) => {
  //     return nodePath.join(folderPath, fileBase)
  //   })
    
  //   dispatch( Selection.actions.set(selectedFiles) )
  // }

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
      if (EditorSelection.includesAFileBlock(state)) {
        return state // Chancel Delete - would delete selected file block
      }
    },

    schema: { // https://docs.slatejs.org/reference/models/schema.html
      nodes: {
        // Render FileItems in blocks with type file
        [BLOCK_TYPE]: function (editorProps) {
          const { node, editor } = editorProps
          const isCursor = editor.getState().selection.hasEdgeIn(node)
          const base = node.getIn(['data', 'base'])
          return (
            <FileItem
              className='view-folder-item'
              isCursor={isCursor}
              path={nodePath.join(folderPath, base)}
              onDrop={(event, cursorPosition) => {

                const fileList = dragndrop.getFilePathArray(event)
                const baselist = fileList.map(filePath => nodePath.basename(filePath))
                let state = editor.getState()

                state = Transforms.removeFiles(state, baselist)

                // Need to be calcualted after remove Files
                const nodeIndex = state.document.getParent(node).get('nodes').indexOf(node)
                const position = (cursorPosition == dragndrop.constants.CURSOR_POSITION_TOP) ? nodeIndex : nodeIndex + 1
                
                state = Transforms.insertFilesAt(state, baselist, position)

                editor.onChange(state)
                dragndrop.executeFileDropOnDisk(event, folderPath)

              }}
            />
          )
        }
      },
      rules: [
        // Rule to insert a paragraph block if the document is empty
        {
          match: (node) => {
            return node.kind == 'document'
          },
          validate: (document) => {
            return document.nodes.size ? null : true
          },
          normalize: (transform, document) => {
            const block = Block.create(defaultBlock)
            transform
              .insertNodeByKey(document.key, 0, block)
          }
        },
        // Rule to insert a paragraph below a void node (File)
        // if that node is the last one in the document
        {
          match: (node) => {
            return node.kind == 'document'
          },
          validate: (document) => {
            const lastNode = document.nodes.last()
            return lastNode && lastNode.isVoid ? true : null
          },
          normalize: (transform, document) => {
            const block = Block.create(defaultBlock)
            transform
              .insertNodeByKey(document.key, document.nodes.size, block)
          }
        }
      ]
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
      if (EditorSelection.includesAFileBlock(state)) {
        return  Transforms
                .insetLineAboveFileBlock( state.transform() )
                .apply()
      }
    },

    onDrop: (event, data, state, editor) => {
      event.preventDefault()
      event.stopPropagation()
      
      if(dragndrop.shouldAcceptDrop(event, [dragndrop.constants.TYPE_FILE])) {
        const fileList = dragndrop.getFilePathArray(event)
        const baselist = fileList.map(filePath => nodePath.basename(filePath))
        const selection = data.target

        state = Transforms.removeFiles(state, baselist)
      
        // Set Selection to Drop Position and create a Break there
        state = state.transform().deselect().select(selection).splitBlock().apply()

        const node = state.document.findDescendant((node) => (node.key == selection.focusKey))
        const block = Blocks.getRootBlockOfNode(state, node)
        const blockIndex = state.document.get('nodes').indexOf(block)
        
        state = Transforms.insertFilesAt(state, baselist, blockIndex+1)

        // state = state.transform().deselect().apply()
        
        // Move Files
        dragndrop.executeFileDropOnDisk(event, folderPath)

        return state
      }
    },

    // onChange: (state) => {
    //   // if(stateCache && state && state.selection != stateCache.selection ) {
    //   //   onSelectionChange(state)
    //   // }
    //   // stateCache = state
    // }


  }
}