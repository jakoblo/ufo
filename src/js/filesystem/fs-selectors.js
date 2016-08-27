import { createSelector } from 'reselect'
import nodePath from 'path'

const getIndexedDirs = (state, props) => state.fs.keySeq().toJS()
const getCurrentPath = (state, props) => props.path
const getDirFromFS = (state, props) => state.fs.get(props.path).get('files')

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
    [ getDirFromFS, getActiveFile],
    (folderContent, activeFile) => {
      if(folderContent && activeFile) {
        folderContent = folderContent.setIn([activeFile, 'active'], true)
      }
      return folderContent.sortBy(file => file.get('base')).sortBy(file => file.get('type'))
  })
}