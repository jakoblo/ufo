import {Block, Text, Selection} from 'slate'
import * as Blocks from './slate-file-blocks'
import {List} from 'immutable'

export const removeExisting = (transforming, basename) => {
  const existingFileBlock = Blocks.getFileBlockByBase(transforming.state, basename)
  if(existingFileBlock) {
    transforming = transforming
      .removeNodeByKey(existingFileBlock.get('key'))
  }
  return transforming
}

export const insertFile = (transforming, basename) => transforming.splitBlock()
  .insertBlock(Blocks.createFileBlock(basename))



/*
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
export const createNewLineAroundFileBlock = (transforming, range) => {

  // Invert Selection Position, to split in the right direction.
  // Do not really understand why, but works fine.
  const splitSelectionOffset = (range.focusOffset == 0) ? 1 : 0
  // console.log(range.toJS())
  // debugger
  const splitRange = new Selection({
    ...range.toJS(),
    anchorKey: range.focusKey,
    anchorOffset: splitSelectionOffset,
    focusOffset: splitSelectionOffset,
  })
  return transforming.splitBlockAtRange( splitRange )
    .setBlock({
      type: 'markdown',
      isVoid: false,
      // nodes: List([Text.createFromString('')]),
      data: {}
    })
}

export const insertFileAtEnd = (transforming, document, basename) => {
  const block = Block.create( Blocks.getFileBlockProperties(basename) ) 
  return transforming.insertNodeByKey(document.key, document.nodes.size, block)
}

export const renameFile = (state, transforming, sourceBase, targetBase) => {
  const sourceBlock = Blocks.getFileBlockByBase( state, sourceBase )
  if(!sourceBlock) return transforming
  return transforming.setNodeByKey(sourceBlock.key, Blocks.getFileBlockProperties(targetBase))
}

export const removeFiles = (state, baseList) => {
  let transforming = state.transform()
  baseList.forEach((fileBase) => {
    transforming = removeExisting( transforming, fileBase )
  })
  return transforming.apply({save: false})
}

export const insertFilesAt = (state, baseList, indexPosition) => {
  let transforming = state.transform()
  baseList.forEach((fileBase) => {
    transforming = transforming.insertNodeByKey(state.document.key, indexPosition, Blocks.createFileBlock(fileBase))
  })
  return transforming.apply({save: false})
}


