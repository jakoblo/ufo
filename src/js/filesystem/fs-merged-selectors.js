import { createSelector } from 'reselect'
import nodePath from 'path'
import Watch from './watch/fs-watch-index'
import Write from './write/fs-write-index'
import Selection from './selection/sel-index'
import Rename from './rename/rename-index'
import Filter from './filter/filter-index'

export const getFile_Factory = () => {

  const getProgressOfFile = Write.selectors.getProgressOfFile__Factory()
  const isFileSelected = Selection.selectors.isFileSelected__Factory()

  return createSelector(
    [
      Watch.selectors.getFile, 
      Watch.selectors.isFileOpen,
      isFileSelected,
      getProgressOfFile,
      Rename.selectors.isFileRenaming
    ],
    (
      file, 
      open,
      selected,
      progress,
      renaming
    ) => {
      return file
        .set('active', open)
        .set('selected', selected)
        .set('progress', progress)
        .set('renaming', renaming)
    }
  )
}


export const getFiltedBaseArrayOfFolder_Factory = () => {
  let getFilteredFiles = getFilteredFilesOfFolder_Factory()
  return createSelector(
    [getFilteredFiles], files => {
      return (files) ? files.keySeq().toJS() : []
    }
  )
}

const getFilteredFilesOfFolder_Factory = () => {
   
  let getFiterOfFolder = Filter.selectors.getFiterRegExOfFolder_Factory()

  return createSelector(
    [Watch.selectors.getFilesOfFolder, getFiterOfFolder],
    (files, filters) => {
      if(filters.length == 0) {
        return files
      }
      return files.filter((file) => {
        let filename = file.get('base')
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


/**
 * Index of File which is opend in the next View
 */
export const getOpenFileIndex_Factory = () => {
  
  let getFilesSeq = getFiltedBaseArrayOfFolder_Factory()

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
  
  let getFilesSeq = getFiltedBaseArrayOfFolder_Factory()

  return createSelector(
    [getFilesSeq, getFocusedFileOf],
    (filesSeq, focusedFile) => {
      return filesSeq.indexOf(focusedFile)
    }
  )
}

/**
 * Current Files the Last Selected or the Active one
 * 
 * @param  {Store} state
 * @param  {path: string} props
 * @returns string
 */
const getFocusedFileOf = (state, props) => {
  let lastestSelected = undefined
  let selection = Selection.selectors.getSelection(state, props)
  if(selection.get('root') == props.path) {
    lastestSelected = selection.get('files').last()
  }
  let openFile = Watch.selectors.getOpenFileOf(state, props)
  return lastestSelected || openFile
}
