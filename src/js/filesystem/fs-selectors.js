import { createSelector } from 'reselect'
import nodePath from 'path'

export const getCurrentPath =   (state, props)  => props.path
export const getFiles =         (state, props)  => state.fs.get(props.path).get('files')
export const getDirectorySeq =  (state)         => state.fs.keySeq().toJS()
export const getFilesSeq =      (state, props)  => getFiles(state, props).keySeq().toJS()

export function getNextDir(stats, props) {
  let directorySeq = getDirectorySeq(stats)
  let currentIndex = directorySeq.findIndex((dir) => {
    return dir == props.path
  })
  let nextPath = directorySeq[currentIndex + 1]
  return nextPath
}

export function getActiveFile(stats, props) {
  let nextPath = getNextDir(stats, props)
  return (nextPath) ? nodePath.basename(nextPath) : false
}

export function getActiveFileIndex(stats, props) {
  let fileSeq = getFilesSeq(stats, props)
  let activeFile = getActiveFile(stats, props)

  let activeIndex = fileSeq.findIndex((filename) => {
    return filename == activeFile
  })
  return activeIndex      
}

export const getFolderWithActiveFactory = () => {
  return createSelector(
    [getFiles, getActiveFile],
    (files, activeFile) => {
      if(files && activeFile) {
        files = files.setIn([activeFile, 'active'], true)
      }
      return files
  })
}