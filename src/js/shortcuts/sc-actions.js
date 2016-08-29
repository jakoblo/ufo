import FS from '../filesystem/fs-index'
import App from '../app/app-index'

const getActiveFileIndex = FS.selectors.makeGetActiveFileIndex()

export function navigateFileUp() {
  return function (dispatch, getState) {
    
    let state = getState() 
    let props = { path: '/Users/Wolf' }

    let activeFileIndex = getActiveFileIndex(state, props)
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