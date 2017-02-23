import { createSelector } from 'reselect'
import FS from '../watch/fs-watch-index'
import nodePath from 'path'

export const getPath = (state, props) => props.path
export const getSelection = (state) => state.selection
export const getSelectionRoot = (state) => state.selection.get('root')

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
 * @param  {State} state
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

export const getSelectionOfFolder = (state, props) => {
  if(props.path == state.selection.get('root')) {
    return state.selection.get('files')
  } else {
    return null
  }
}

export const isFileSelected__Factory = (state, props) => {
  return createSelector(
    [getSelectionPathList, getPath],
    (selectionPathList, path) => {
      return selectionPathList.find((entry) => (entry == path))
    }
  )
}

// repalced by filter, but keep it here for now
// export const getSelectTypeInput = (state) => state.selection.getIn(['selectTypeInput'])