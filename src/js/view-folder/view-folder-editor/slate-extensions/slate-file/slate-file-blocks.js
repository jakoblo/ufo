import * as c from '../../folder-editor-constants'
import {generateKey, Data, Block, Text} from 'slate'
import {List} from 'immutable'

export function getFileBlockByBase(state, base) {
  return state.get('document').findDescendant((node) => {
    return (node.getIn(['data', 'base']) == base)
  })
}

export const getFilesInNodes = (nodes) => {
  return nodes.filter((node) => {
    return node.get('type') == "file"
  }).map((fileBlock) => {
    return fileBlock.getIn(['data', 'base'])
  }).toJS()
}

export function getFilesInState(state) {
  return state.document.getBlocks().filter((block) => {
    return block.get('type') == "file"
  }).map((fileBlock) => {
    return fileBlock.getIn(['data', 'base'])
  }).toJS()
}

export function getRootBlockOfNode(state, node) {
  let block = node
  while(state.document.get('nodes').indexOf(block) < 0) {
    block = state.document.getParent(block.key)
  }
  return block
}

export const getFileBlockProperties = (basename) => {
  const properties = {
    type: c.BLOCK_TYPE_FILE,
    isVoid: true,
    nodes: List([Text.createFromString(' ')]),
    data: {
      base: basename
    }
  }

  const test = Block.create(properties)
  return properties
}


export const getIndexOfNodeInDocument = (state, node) => {
  const rootNode = getRootBlockOfNode(state, node)
  const index = state.document.get('nodes').indexOf(rootNode)

  return index
}

export const createFileBlock = (basename) => {
  return Block.create(getFileBlockProperties(basename))
}

export const getRawFileBlock = (fileBase) => {
  return {
    kind: 'block',
    type: c.BLOCK_TYPE_FILE,
    isVoid: true,
    nodes: [
      {
        "kind": "text",
        "ranges": [
          {
            "kind": "range",
            "text": " ",
            "marks": []
          }
        ]
      }
    ],
    data: {
      base: fileBase
    }
  }
}