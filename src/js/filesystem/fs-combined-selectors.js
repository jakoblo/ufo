import { createSelector } from 'reselect'
import nodePath from 'path'
import Watch from './watch/fs-watch-index'
import Write from './write/fs-write-index'
import Selection from './selection/sel-index'

/**
 * Main Selector to get all Files with all Information 
 * which are need to display the current Folder State
 * @return selector(state, {path: string}) => Immuteable Map of Files
 */
export const getFolderCombinedFactory = () => {
  let getFolderWithActive = Watch.selectors.getFolderWithActiveFactory()
  let getProgressingForFolder = Write.selectors.getProgressingForFolderFactory()

  return createSelector(
    [getFolderWithActive, Selection.selectors.getSelectionFor, getProgressingForFolder, getProps],
    (files, selection, write, props) => {
      if(files && selection) {
        selection.get('files').forEach((selectedFile, index) => {
          if(files.get(selectedFile)) {
            files = files.setIn([selectedFile, 'selected'], true)
          } else {
            console.error('Try to set a File selected which does not exists in the FileSystem', files.toJS(), selectedFile)
          }
        })
      }
      if(files && write) {
        write.forEach((progressingFile) => {
          files = files.setIn([nodePath.basename(progressingFile.get('destination')), 'progress'], progressingFile.get('progress'))
        })
      }
      return files
  })
}

const getProps = (state, props) => props