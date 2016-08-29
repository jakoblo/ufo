import { createSelector } from 'reselect'
import nodePath from 'path'


export const getCurrentPath = (state, props) => props.path
export const getFilesFromDir = (state, props) => state.fs.get(props.path).get('files')


export const getIndexedDirs = (state) => state.fs.keySeq().toJS()
export const getIndexedFiles = createSelector(
    [getFilesFromDir],
    (files) => files.keySeq().toJS()
  )

export const makeGetActiveFileIndex = () => {
  const getActiveFile = makeGetActiveFile()

  return createSelector(
    [getIndexedFiles, getActiveFile],
    (fileIndex, activeFile) => {
      let activeIndex = indexedFiles.findIndex((filename) => {
        return filename == activeFile
      })
      return activeIndex
    }
  )
}


/**
 * @returns {string} nextPath /Users/User/Desktop
 */
export const makeGetNextDir = () => {
  return createSelector(
    [getIndexedDirs, getCurrentPath],
    (directories, path) => {
      let currentIndex = directories.findIndex((dir) => {
        return dir == path
      })
      let nextPath = directories[currentIndex + 1]
      return nextPath
    }
  )
}

/**
 * @returns {string} activeFileName hey.txt
 */
export const makeGetActiveFile = () => {
  let getNextDir = makeGetNextDir()
  return createSelector(
    getNextDir,
    (nextPath) => {
      let activeItemName =  (nextPath) ? nodePath.basename(nextPath) : false 
      return activeItemName
    }
  )
}

export const makeGetFolderWithActive = () => {
  
  let getActiveFile = makeGetActiveFile()

  return createSelector(
    [ getFilesFromDir, getActiveFile],
    (folderContent, activeFile) => {
      if(folderContent && activeFile) {
        folderContent = folderContent.setIn([activeFile, 'active'], true)
      }
      return folderContent
  })
}