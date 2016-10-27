import { createSelector } from 'reselect'
import nodePath from 'path'
import Watch from './watch/fs-watch-index'
import Write from './write/fs-write-index'
import Selection from './selection/sel-index'
import Rename from './rename/rename-index'
import Filter from './filter/filter-index'

/**
 * Main Selector to get all Files with all Information 
 * which are need to display the current State of the Folder
 * @return selector(state, {path: string}) => Immuteable Map of Files
 */
export const getFilesMergedOf_Factory = () => {

  let getFilteredFiles = getFilteredFiles_Factory()
  let getProgressingForFolder = Write.selectors.getProgressingForFolderFactory()

  /**
   * Saved Selector
   * https://github.com/reactjs/reselect
   */
  return createSelector(  
    [
      getFilteredFiles,
      Watch.selectors.getOpenFileOf,
      Selection.selectors.getSelectionOf, 
      getProgressingForFolder,
      Rename.selectors.getRenamingForDirectory, 
      getPath
    ],
    (files, openFile, selection, write, renaming, path) => {

      // Merge openFile
      if(files && openFile) {
        if(files.get(openFile)) {
          files = files.setIn([openFile, 'active'], true)
        } else {
          // console.error('Try to set a File active which does not exists in the FileSystem', files.toJS(), openFile) 
        }
      }

      // Merge Selection
      if(files && selection) {
        selection.get('files').forEach((selectedFile, index) => {
          if(files.get(selectedFile)) {
            files = files.setIn([selectedFile, 'selected'], true)
          } else {
            // console.error('Try to set a File selected which does not exists in the FileSystem', files.toJS(), selectedFile)
          }
        })
      }

      // Merge write progress for progressbars
      if(files && write) {
        write.forEach((progressingFile) => {
          files = files.setIn([nodePath.basename(progressingFile.get('destination')), 'progress'], progressingFile.get('progress'))
        })
      }

      // Merge Renaming
      if(files && renaming) {
        if(files.get(renaming)) {
          files = files.setIn([renaming, 'renaming'], true)
        }
      }
      return files
  })
}

export const getFilteredFiles_Factory = () => {
   
  let getFiterForFolder = Filter.selectors.getFiterRegExForFolder_Factory()

  return createSelector(
    [Watch.selectors.getFilesOf, getFiterForFolder],
    (files, filters) => {
      if(filters.length == 0) {
        return files
      }
      return files.filter((file) => {
        let filename = file.get('name')
        let count = 0
        while (count < filters.length && filename.match(filters[count])) {
          if(count == filters.length-1) {
            return true
          }
          count++
        }
        return false
      })
  })
}

export const getFiltedFilesSeq_Factory = () => {
  let getFilteredFiles = getFilteredFiles_Factory()
  return createSelector(
    [getFilteredFiles], files => files.keySeq().toJS()
  )
}


/**
 * Index of File which is opend in the next View
 */
export const getOpenFileIndex_Factory = () => {
  
  let getFilesSeq = getFiltedFilesSeq_Factory()

  return createSelector(
    [getFilesSeq, Watch.selectors.getOpenFileOf],
    (filesSeq, openFile) => {
      return filesSeq.indexOf(openFile)
    }
  )
}

/**
 * Index of the last selected or the open one
 */
export const getFocusedFileIndexOf_Factory = () => {
  
  let getFilesSeq = getFiltedFilesSeq_Factory()

  return createSelector(
    [getFilesSeq, getFocusedFileOf],
    (filesSeq, focusedFile) => {
      return filesSeq.indexOf(focusedFile)
    }
  )
} 

/**
 * Current Files the Last Selected or the Active one
 * @param  {store} state
 * @param  {path: string} props
 * @ returns string
 */
export const getFocusedFileOf = (state, props) => {
  let lastestSelected = undefined
  let selection = Selection.selectors.getSelection(state, props)
  if(selection.get('root') == props.path) {
    lastestSelected = selection.get('files').last()
  }
  let openFile = Watch.selectors.getOpenFileOf(state, props)
  return lastestSelected || openFile
}


const getPath = (state, props) => props.path
