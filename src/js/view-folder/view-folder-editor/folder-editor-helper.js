import * as c from  './folder-editor-constants'
import {Block, Selection} from 'slate'

export const selectionIsOnFile = (state) => state.blocks.some(block => block.type == c.BLOCK_TYPE_FILE)

export function getFileBlockByBase(state, base) {
  return state.get('document').findDescendant((node) => {
    return (node.getIn(['data', 'base']) == base)
  })
}

export function getSelectionForFileNode(node) {
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

export const getFileBlockProperties = (basename) => {
  return {
    type: c.BLOCK_TYPE_FILE,
    isVoid: true,
    data: {
      base: basename
    }
  }
}

export const fileBlockTransforms = {
  removeExisting: (transforming, basename) => {
    const existingFileBlock = getFileBlockByBase(transforming.state, basename)
    if(existingFileBlock) {
      transforming = transforming
        .removeNodeByKey(existingFileBlock.get('key'))
    }
    return transforming
  },

  insertFileOnTop: (transforming, basename) => transforming
      .splitBlock()
      .setBlock(getFileBlockProperties(basename)),    

  insertFileBelow: (transforming, basename) => transforming
      .insertBlock(getFileBlockProperties(basename)),
  
  insetLineAboveFileBlock: (transforming) => {
    return transforming.splitBlock()
      .setBlock({
        type: 'paragraph',
        isVoid: false,
        data: {}
      })
  },

  insertFileAtEnd: (transforming, document, basename) => {
    const block = Block.create( getFileBlockProperties(basename) ) 
    
    return transforming
      .insertNodeByKey(document.key, document.nodes.size, block)
  },

  renameFile: (state, transforming, sourceBase, targetBase) => {
    const sourceBlock = getFileBlockByBase( state, sourceBase )
    if(!sourceBlock) return transforming
    return transforming
            .setNodeByKey(sourceBlock.key, getFileBlockProperties(targetBase))
  }
}



/**
 * Insert an file with `path` at the current selection.
 *
 * @param {State} editorState
 * @param {string} base - filename with suffix
 * @returns {State}
 */
// export function insertFile(editorState, base) {
//   return editorState
//     .transform()
//     .insertBlock({
//       type: c.BLOCK_TYPE_FILE,
//       isVoid: true,
//       data: { base }
//     })
//     .apply()
// }
