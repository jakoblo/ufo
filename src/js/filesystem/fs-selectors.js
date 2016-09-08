import { createSelector } from 'reselect'
import nodePath from 'path'
import Selection from '../selection/sel-index'

/**
 * Main Selector to get all Files with all Information 
 * which are need to display the current Folder State
 * @return selector(state, {path: string}) => Immuteable Map of Files
 */
export const getFolderCombinedFactory = () => {

  let getFolderWithActive = getFolderWithActiveFactory()

  return createSelector(
    [getFolderWithActive, Selection.selectors.getSelectionFor],
    (files, selection) => {
      if(selection) {
        selection.get('files').forEach((selectedFile, index) => {
          files = files.setIn([selectedFile, 'selected'], true)
        })
      }
      return files
  })
}

/**
 * @param  {store} state
 */
export const getDirectorySeq = (state) => state.fs.keySeq().toJS()


/**
 * @param  {store} stats
 * @param  {path: string} props
 */
export const getFilesSeq = (state, props)  => getFiles(state, props).keySeq().toJS()

/**
 * @param  {store} stats
 * @param  {path: string} props
 */
export const getDirState = (state, props)  => { 
  return {
    path: props.path,
    ready: state.fs.get(props.path).get('ready'),
    error: state.fs.get(props.path).get('error')
  }
}


/**
 * @param  {store} state
 * @param  {path: string} props
 */
export function getNextDir(state, props) {
  return getDirDirection(state, props, +1)
}

/**
 * @param  {store} state
 * @param  {path: string} props
 */
export function getPreviousDir(state, props) {
  return getDirDirection(state, props, -1)
}


/**
 * activeFile
 * is the file/folder which is opend in the next View
 * @param  {store} state
 * @param  {path: string} props
 * @returns string
 */
export function getActiveFile(state, props) {
  let nextPath = getNextDir(state, props)
  return (nextPath) ? nodePath.basename(nextPath) : null
}

/**
 * activeFile
 * is the file/folder which is opend in the next View
 * @param  {store} state
 * @param  {path: string} props
 * @returns number
 */
export function getActiveFileIndex(stats, props) {
  let fileSeq = getFilesSeq(stats, props)
  let activeFile = getActiveFile(stats, props)

  let activeIndex = fileSeq.findIndex((filename) => {
    return filename == activeFile
  })
  return activeIndex      
}


// -------------------
// Private
// -------------------

const getCurrentPath =   (state, props)  => props.path
const getFiles =         (state, props)  => state.fs.get(props.path).get('files')

function getDirDirection(stats, props, direction) {
  let directorySeq = getDirectorySeq(stats)
  let currentIndex = directorySeq.findIndex((dir) => {
    return dir == props.path
  })
  let nextPath = directorySeq[currentIndex + direction]
  return nextPath
}

const getFolderWithActiveFactory = () => {
  return createSelector(
    [getFiles, getActiveFile],
    (files, activeFile) => {
      if(files && activeFile) {
        files = files.setIn([activeFile, 'active'], true)
      }
      return files
  })
}