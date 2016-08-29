import FS from '../filesystem/fs-index'
import App from '../app/app-index'

export function navigateFileUp() {
  return function (dispatch, getState) {

    // have to know to much about the store...
    let state = getState() 
    let props = { path: '/Users/Wolf' }
    let indexedFiles = FS.selectors.getFilesSeq(state, props)

    let activeIndex = FS.selectors.getActiveFileIndex(state, props)
    let newActiveName = indexedFiles[activeIndex - 1]

    let newPath = state.fs.getIn([
        props.path, 
        'files', 
        newActiveName, 
        'path'
      ])

    dispatch( App.actions.changeAppPath(null, newPath) )

  }
}