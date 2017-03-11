import * as c from  '../../folder-editor-constants'
import {Selection} from 'slate'
import * as Blocks from './slate-file-blocks'

export const includesAFileBlock = (state) => state.blocks.some(block => block.type == c.BLOCK_TYPE_FILE)

export function createSelectionForFile(node) {
  const childTextNodeKey = node.get('nodes').first().get('key')
  return new Selection({
    anchorKey: childTextNodeKey,
    anchorOffset: 1,
    focusKey: childTextNodeKey,
    focusOffset: 1,
    isBackward: false,
    isFocused: false
  })
}

export const getSelectedFiles = (state) => {
  return Blocks.getFilesInNodes(state.blocks)
}