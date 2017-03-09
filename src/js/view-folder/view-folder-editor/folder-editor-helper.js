import * as c from  './folder-editor-constants'
import {Block, Selection, Raw} from 'slate'

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

export const getSelectedFiles = (state) => {
  return getFilesInNodes(state.blocks)
}

export const getFilesInNodes = (nodes) => {
  return nodes.filter((node) => {
    return node.get('type') == "file"
  }).map((fileBlock) => {
    return fileBlock.getIn(['data', 'base'])
  }).toJS()
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
        type: 'markdown',
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

export function getFilesInState(state) {
  return state.document.getBlocks().filter((block) => {
    return block.get('type') == "file"
  }).map((fileBlock) => {
    return fileBlock.getIn(['data', 'base'])
  }).toJS()
}


export const getFileBlock = (fileBase) => {
  return {
    kind: 'block',
    type: c.BLOCK_TYPE_FILE,
    isVoid: true,
    "nodes": [
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



/**
 * Deserialize a plain text `string` to a state.
 *
 * @param {String} string
 * @param {Object} options
 *   @property {Boolean} toRaw
 * @return {State}
 */

export function deserializeMarkdown(string, options = {}) {
  const raw = {
    kind: 'state',
    document: {
      kind: 'document',
      nodes: string.split('\n').map((line) => {
        if(line.match( /<.*>/ )){
          // insert Void Block with filename as data
          return getFileBlock( line.substring(1, line.length - 1) )
        } else {
          return {
            kind: 'block',
            type: 'line',
            nodes: [
              {
                kind: 'text',
                ranges: [
                  {
                    text: line,
                    marks: [],
                  }
                ]
              }
            ]
          }
        }
      }),
    }
  }

  return options.toRaw ? raw : Raw.deserialize(raw)
}


/**
 * Serialize a `state` to plain text.
 *
 * @param {State} state
 * @return {String}
 */

export function serializeMarkdown(state) {
  return state.document.nodes
    .map((block) => {
      if(block.type == c.BLOCK_TYPE_FILE) {
        return '<'+block.getIn(['data', 'base'])+'>'
      } else {
        return block.text
      }
    }).join('\n')
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
