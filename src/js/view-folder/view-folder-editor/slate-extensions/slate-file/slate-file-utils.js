import * as c from '../../folder-editor-constants'
import {Block, Text, Selection} from 'slate'
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

/**
 * Creats an base array of the fileblocks in the selection
 * 
 * @param {State} editorState
 * @returns {Array<string>} - file bases
 */
export function buildSelectedFiles(editorState) {
  const selection = editorState.selection
  return editorState.blocks
    .filter(block => block.type == c.BLOCK_TYPE_FILE) // This block is Fileblock
    .filter(block => selection.isExpanded) // Selection is Expaneded
    .map( (block) => block.getIn( ['data', 'base'] ))
    .toJS()
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

export const includesAFileBlock = (state) => state.blocks.some(block => block.type == c.BLOCK_TYPE_FILE)

export function createSelectionForFile(node) {
  const childTextNodeKey = node.get('nodes').first().get('key')
  return new Selection({
    anchorKey: childTextNodeKey,
    anchorOffset: 0,
    focusKey: childTextNodeKey,
    focusOffset: 1,
    isBackward: false,
    isFocused: false
  })
}

export const getSelectedFiles = (state) => {
  return Blocks.getFilesInNodes(state.blocks)
}