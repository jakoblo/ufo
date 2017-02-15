import { createSelector } from 'reselect'
import FS from '../watch/fs-watch-index'
import nodePath from 'path'

export const getSelection = (state) => state.selection
export const getSelectionRoot = (state) => state.selection.get('root')
export const getSelectionPathArray = (state) => {
  let root = state.selection.get('root')
  let files = state.selection.get('files')
  return files.map((base) => {
    return nodePath.join(root, base)
  })
}

export const getFocusedFile = (state) => {
  let root = state.selection.get('root')
  let files = state.selection.get('files')
  if(root && files.size > 0) {
    return nodePath.join(root, files.last())
  } else {
    return null
  }
}

export const getSelectionOf = (state, props) => {
  if(props.path == state.selection.get('root')) {
    return state.selection.get('files')
  } else {
    return null
  }
}

export const getSelectTypeInput = (state) => state.selection.getIn(['selectTypeInput'])