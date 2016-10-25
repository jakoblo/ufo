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
export const getFolderCombinedFactory = () => {

  let getFilteredFiles = getFilteredFilesFactory()
  let getProgressingForFolder = Write.selectors.getProgressingForFolderFactory()

  /**
   * Saved Selector
   * https://github.com/reactjs/reselect
   */
  return createSelector(  
    [
      getFilteredFiles, 
      Selection.selectors.getSelectionFor, 
      getProgressingForFolder,
      Rename.selectors.getRenamingForDirectory, 
      getPath
    ],
    (files, selection, write, renaming, path) => {

      // Merge Selection
      if(files && selection) {
        selection.get('files').forEach((selectedFile, index) => {
          if(files.get(selectedFile)) {
            files = files.setIn([selectedFile, 'selected'], true)
          } else {
            console.error('Try to set a File selected which does not exists in the FileSystem', files.toJS(), selectedFile)
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

const getPath = (state, props) => props.path


export const getFilteredFilesFactory = () => {

  let getFolderWithActive = Watch.selectors.getFolderWithActiveFactory()
  let getFiterForFolder = Filter.selectors.getFiterRegExForFolder_Factory()

  return createSelector(
    [getFolderWithActive, getFiterForFolder],
    (files, filters) => {

      console.log(filters)

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

