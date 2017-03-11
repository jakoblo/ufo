import {Block, Text} from 'slate'
import * as Blocks from './slate-file-blocks'
import {List} from 'immutable'
import * as Selection from './slate-file-selection'

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
  
export const insetLineAboveFileBlock = (transforming) => {
  return transforming.splitBlock()
    .setBlock({
      type: 'markdown',
      isVoid: false,
      nodes: List([Text.createFromString('')]),
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
  return transforming.apply()
}

export const insertFilesAt = (state, baseList, indexPosition) => {
  let transforming = state.transform()
  baseList.forEach((fileBase) => {
    transforming = transforming.insertNodeByKey(state.document.key, indexPosition, Blocks.createFileBlock(fileBase))
  })
  return transforming.apply()
}


