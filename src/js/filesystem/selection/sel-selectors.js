import { createSelector } from 'reselect'
import FS from '../watch/fs-watch-index'
import nodePath from 'path'

/**
 * @param  {State} state - redux store state
 * @returns {ImmuteableMap} - selection state
 */
export const getSelection = (state) => state.selection

/**
 * Folder path in which items currentlich selelected
 * 
 * @param  {State} state - redux store state
 * @returns {string}
 */
export const getSelectionRoot = (state) => state.selection.get('root')

/**
 * List of paths of all selected files
 * 
 * @param  {State} state - redux store state
 * @returns {ImmteableList}
 */
export const getSelectionPathList = createSelector(
  getSelection,
  (selection) => {
    let root = selection.get('root')
    let files = selection.get('files')
    return files.map((base) => {
      return nodePath.join(root, base)
    })
  }
)

/**
 * The Focused File is last File which is added to the selection
 * 
 * @param  {State} state - redux store state
 * @returns {string} - full path
 */
export const getFocusedFile = (state) => {
  let root = state.selection.get('root')
  let files = state.selection.get('files')
  if(root && files.size > 0) {
    return nodePath.join(root, files.last())
  } else {
    return null
  }
}

/**
 * Get Selected Files of the given Folder
 * 
 * @param  {State} state - redux store state
 * @param  {string} path - of the Folder
 * @returns {ImmuteableList | Null} - of file paths
 */
export const getSelectionOfFolder = (state, path) => {
  if(path == state.selection.get('root')) {
    return state.selection.get('files')
  } else {
    return null
  }
}

/**
 * Is File selected? Facory
 * 
 * @param  {State} state - redux store state
 * @param  {string} path - of the file
 * @returns {boolean}
 */
export const isFileSelected__Factory = (state, path) => {
  return createSelector(
    [
      getSelectionPathList, 
      (state, path) => path]
    ,(
      selectionPathList, 
      path
    ) => {
      return selectionPathList.find((entry) => (entry == path))
    }
  )
}

// repalced by filter, but keep it here for now
// export const getSelectTypeInput = (state) => state.selection.getIn(['selectTypeInput'])