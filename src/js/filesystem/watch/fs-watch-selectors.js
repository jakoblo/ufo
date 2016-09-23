import { createSelector } from 'reselect'
import nodePath from 'path'
import FsWrite from '../write/fs-write-index'
import ViewFile from '../../view-file/vf-index'

/**
 * @param  {store} state
 */
export const getDirectorySeq = (state) => state.fs.keySeq().toJS()



/**
 * @param  {store} state
 * @param  {path: string} props
 */
export const getFilesSeq = (state, props)  => getFiles(state, props).keySeq().toJS()

/**
 * @param  {store} state
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
  let nextDir = getNextDir(state, props)
  if(!nextDir) {
    // @todo fs selection has to know things about preview, not nice
    let previewPath = ViewFile.selectors.getViewFilePath(state, props)
    if(previewPath && nodePath.dirname(previewPath) == props.path) {
      return nodePath.basename(previewPath)
    }
  } else {
    return nodePath.basename(nextDir)
  }
}

/**
 * activeFile
 * is the file/folder which is opend in the next View
 * @param  {store} state
 * @param  {path: string} props
 * @returns number
 */
export function getActiveFileIndex(state, props) {
  let fileSeq = getFilesSeq(state, props)
  let activeFile = getActiveFile(state, props)

  let activeIndex = fileSeq.findIndex((filename) => {
    return filename == activeFile
  })
  return activeIndex      
}

/**
 * @param  {store} state
 * @param  {path: string} props
 * @returns {Immutable Map}
 */
export function getFile(state, props) {
  let files = getFiles(state, {path: nodePath.dirname(props.path)})
  return files.get( nodePath.basename(props.path) )
}


export const getFolderWithActiveFactory = () => {
  return createSelector(
    [getFiles, getActiveFile],
    (files, activeFile) => {
      if(files && activeFile) {
        if(files.get(activeFile)) {
          files = files.setIn([activeFile, 'active'], true)
        } else {
          console.error('Try to set a File active which does not exists in the FileSystem', files.toJS(), activeFile) 
        }
      }
      return files
  })
}


// -------------------
// Private
// -------------------

const getCurrentPath =   (state, props)  => props.path
const getFiles =         (state, props)  => {
  let dir = state.fs.get(props.path)
  if(dir) {
    return dir.get('files')
  } else {
    console.log(state.fs.toJS())
    throw 'Request folder which is not watched: '+props.path
  }
}

function getDirDirection(state, props, direction) {
  let directorySeq = getDirectorySeq(state)
  let currentIndex = directorySeq.findIndex((dir) => {
    return dir == props.path
  })
  let nextPath = directorySeq[currentIndex + direction]
  return nextPath
}
