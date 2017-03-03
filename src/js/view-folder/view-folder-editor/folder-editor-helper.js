import * as c from  './folder-editor-constants'

/**
 * Insert an file with `path` at the current selection.
 *
 * @param {State} editorState
 * @param {string} base - filename with suffix
 * @returns {State}
 */
export function insertFile(editorState, base) {
  return editorState
    .transform()
    .insertBlock({
      type: c.BLOCK_TYPE_FILE,
      isVoid: true,
      data: { base }
    })
    .apply()
}
