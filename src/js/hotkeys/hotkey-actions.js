import fsWatch from '../filesystem/watch/fs-watch-index'
import fsWrite from '../filesystem/write/fs-write-index'
import Selection from '../filesystem/selection/sel-index'
import * as FileActions from '../file-item/fi-actions'
import Preview from '../view-file/vf-index'
import App from '../app/app-index'
import nodePath from 'path'

// Navigate
// Arrow Up and Down
// Base on current Selection the "next" file will be selected
export function navigateFileUp() {
  return navigateDirection(-1)
}
export function navigateFileDown() {
  return navigateDirection(+1)
}

function navigateDirection(direction) {
  return function (dispatch, getState) {
    let props = {
      path: Selection.selectors.getSelection( getState() ).get('root') || // selected Folder
            fsWatch.selectors.getDirectorySeq( getState() )[0] // or First Folder
    } 
    let indexedFiles =     fsWatch.selectors.getFilesSeq( getState() , props)
    let currentFileIndex = Selection.selectors.getCurrentFileIndex( getState() , props)
    let newActiveName =    indexedFiles[currentFileIndex + direction]
    if(newActiveName) {
      dispatch( FileActions.show(
        fsWatch.selectors.getFile( getState() , {path: nodePath.join(props.path, newActiveName)})
      ))
    }
  }
}

// Select
// Shift + ArrowUp/Down
export function addPrevFileToSelection() {
  return selectFileNextToCurrent(-1)
}
export function addNextFileToSelection() {
  return selectFileNextToCurrent(+1)
}

function selectFileNextToCurrent(direction) {
  return function (dispatch, getState) {
    let selection = Selection.selectors.getSelection( getState() )
    let props = { path: selection.get('root') }
    let indexedFiles = fsWatch.selectors.getFilesSeq( getState(), props )
    let currentFileIndex = Selection.selectors.getCurrentFileIndex( getState(), props )
    let newSelectedName = indexedFiles[currentFileIndex + direction]
    if(newSelectedName) {
      dispatch( 
        FileActions.addToSelection(
          fsWatch.selectors.getFile(getState(), {path: nodePath.join(props.path, newSelectedName)})
        )
      )
    }
  }
}

export function selectionToTrash() {
  return function (dispatch, getState) {
    fsWrite.actions.moveToTrash(
      Selection.selectors.getSelectionPathArray(getState())
    )
  }
}