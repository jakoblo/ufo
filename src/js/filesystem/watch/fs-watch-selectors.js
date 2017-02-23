import { createSelector } from 'reselect'
import nodePath from 'path'
import FsWrite from '../write/fs-write-index'
import ViewFile from '../../view-file/vf-index'

/**
 * Get FileInformation from Watcher (Disk) to the given file
 * 
 * @param  {State} state - redux store state
 * @param  {string} path - of the File
 * @returns {ImmuteableMap} - of file
 */
export const getFile = (state, path) => {
  const dir = nodePath.dirname(path)
  const base = nodePath.basename(path)
  return state.fs.getIn([dir, 'files', base])
}

/**
 * Get all Files with Information from Watcher (Disk) to the given Folder
 * 
 * @param  {State} state - redux store state
 * @param  {string} path - of the File
 * @returns {ImmuteableList} - of files
 */
export const getFilesOfFolder = (state, path)  => {
  let dir = state.fs.getIn([path, 'files'])
  if(dir) {
    return dir
  } else {
    console.log(state.fs.toJS())
    throw 'Request folder which is not watched: '+path
  }
}

/**
 * Get all Filepaths in the given Folder
 * 
 * @param  {State} state - redux store state
 * @param  {string} path - of the File
 * @returns {Array} - of filespaths
 */
export const getFilesSeqOf = (state, path) => getFilesOfFolder(state, path).keySeq().toJS()


/**
 * Get all Folderpaths which are Visible as a View
 * 
 * @param  {State} state - redux store state
 * @returns {Array} - of Folderpaths
 */
export const getDirSeq = (state) => state.fs.keySeq().toJS()

/**
 * Get the next (right-side) Viewfolder from the given one
 * 
 * @param  {State} state - redux store state 
 * @param  {string} path - of the Folder
 * @returns {string} - next folder path
 */
export const getDirNext = (state, path) => getDirDirection(state, path, +1)

/**
 * Get the previous (left-side) Viewfolder from the given one
 * 
 * @param  {State} state - redux store state 
 * @param  {string} path - of the Folder
 * @returns {string} - previous folder path
 */
export const getDirPrevious = (state, path) => getDirDirection(state, path, -1)


/**
 * Get the Watcher State for the given Folder
 * 
 * @param  {State} state - redux store state 
 * @param  {string} path - of the Folder
 * @returns {path, ready, error}
 */
export const getDirState = (state, path)  => { 
  return {
    path: path,
    ready: state.fs.get(path).get('ready'),
    error: state.fs.get(path).get('error')
  }
}

function getDirDirection(state, path, direction) {
  let directorySeq = getDirSeq(state)
  let currentIndex = directorySeq.findIndex((dir) => {
    return dir == path
  })
  let nextPath = directorySeq[currentIndex + direction]
  return nextPath
}


/**
 * openFile
 * is the file/folder which is opend in the next View
 * 
 * @param  {store} state - redux store state 
 * @param  {string} path - of the Folder
 * @returns {string}
 */
export function getOpenFileOf(state, path) {
  let nextDir = getDirNext(state, path)
  if(!nextDir) {
    // @TODO fs selection has to know things about preview, not nice
    let previewPath = ViewFile.selectors.getViewFilePath(state, path)
    if(previewPath && nodePath.dirname(previewPath) == path) {
      return nodePath.basename(previewPath)
    }
  } else {
    return nodePath.basename(nextDir)
  }
}

/**
 * Is the given File opend in an other View?
 * 
 * @param  {store} state - redux store state 
 * @param  {string} path - of the File
 * @returns {boolean}
 */
export function isFileOpen(state, path) {
  const dir = nodePath.dirname(path)
  const base = nodePath.basename(path)
  const openFile = getOpenFileOf(state, dir)
  return (base == openFile)
}