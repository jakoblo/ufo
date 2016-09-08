import { createSelector } from 'reselect'
import FS from '../filesystem/fs-index'


export const getSelection = (state) => state.selection

/**
 * get Selection for the given path
 * maybe null
 * @param  {store} state
 * @param  {path: string} props
 */
export const getSelectionFor = (state, props) => {
  if(props.path == state.selection.get('root')) {
    return state.selection
  } else {
    return null
  }
}

/**
 * Current Files the Last Selected or the Active one
 * @param  {store} state
 * @param  {path: string} props
 * @ returns string
 */
export const getCurrentFile = (state, props) => {
  let lastestSelected = undefined
  if(state.selection.get('root') == props.path) {
    lastestSelected = state.selection.get('files').last()
  }
  let activeFile = FS.selectors.getActiveFile(state, props)
  return lastestSelected || activeFile
}

/**
 * Current Files the Last Selected or the Active one
 * @param  {store} state
 * @param  {path: string} props
 * @returns number
 */
export const getCurrentFileIndex = (state, props) => {
  return FS.selectors.getFilesSeq(state, props).indexOf(  getCurrentFile(state, props)  )
}