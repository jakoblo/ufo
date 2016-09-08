import FS from '../filesystem/fs-index'
import Selection from '../selection/sel-index'
import App from '../app/app-index'
import nodePath from 'path'



// Navigate

export function navigateFileUp() {
  return navigateDirection(-1)
}
export function navigateFileDown() {
  return navigateDirection(+1)
}

function navigateDirection(direction) {
  return function (dispatch, getState) {
    let state = getState()
    let props = { path: Selection.selectors.getSelection(state).get('root') }
    let indexedFiles = FS.selectors.getFilesSeq(state, props)
    let currentFileIndex = Selection.selectors.getCurrentFileIndex(state, props)
    let newActiveName = indexedFiles[currentFileIndex + direction]
    if(newActiveName) dispatch( App.actions.changeAppPath(null, nodePath.join(props.path, newActiveName)) )
  }
}


// Select

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
    let indexedFiles = FS.selectors.getFilesSeq( getState(), props )
    let currentFileIndex = Selection.selectors.getCurrentFileIndex( getState(), props )
    let newSelectedName = indexedFiles[currentFileIndex + direction]
    if(newSelectedName) {
      dispatch( 
        Selection.actions.addToSelection([
          nodePath.join(props.path, newSelectedName)
        ])
      )
    }
  }
}