import { createSelector } from 'reselect'
import nodePath from 'path'
import FsWrite from '../write/fs-write-index'
import ViewFile from '../../view-file/vf-index'

export const getFile = (state, props) => {
  const dir = nodePath.dirname(props.path)
  const base = nodePath.basename(props.path)
  return state.fs.getIn([dir, 'files', base])
}

export const getFilesOfFolder = (state, props)  => {
  let dir = state.fs.getIn([props.path, 'files'])
  if(dir) {
    return dir
  } else {
    console.log(state.fs.toJS())
    throw 'Request folder which is not watched: '+props.path
  }
}

export const getFilesSeqOf = (state, props) => getFilesOfFolder(state, props).keySeq().toJS()

export const getDirSeq = (state) => state.fs.keySeq().toJS()
export const getDirNext = (state, props) => getDirDirection(state, props, +1)
export const getDirPrevious = (state, props) => getDirDirection(state, props, -1)
export const getDirState = (state, props)  => { 
  return {
    path: props.path,
    ready: state.fs.get(props.path).get('ready'),
    error: state.fs.get(props.path).get('error')
  }
}
function getDirDirection(state, props, direction) {
  let directorySeq = getDirSeq(state)
  let currentIndex = directorySeq.findIndex((dir) => {
    return dir == props.path
  })
  let nextPath = directorySeq[currentIndex + direction]
  return nextPath
}


/**
 * openFile
 * is the file/folder which is opend in the next View
 * 
 * @param  {store} state
 * @param  {path: string} props
 * @returns {string}
 */
export function getOpenFileOf(state, props) {
  let nextDir = getDirNext(state, props)
  if(!nextDir) {
    // @TODO fs selection has to know things about preview, not nice
    let previewPath = ViewFile.selectors.getViewFilePath(state, props)
    if(previewPath && nodePath.dirname(previewPath) == props.path) {
      return nodePath.basename(previewPath)
    }
  } else {
    return nodePath.basename(nextDir)
  }
}

export function isFileOpen(state, props) {
  const dir = nodePath.dirname(props.path)
  const base = nodePath.basename(props.path)
  const openFile = getOpenFileOf(state, {path: dir})
  return (base == openFile)
}