import * as t from './sel-actiontypes'
import * as selectors from './sel-selectors'
import * as c from './sel-constants'
import FS from '../filesystem/watch/fs-watch-index'
import App from '../app/app-index'
import ViewFile from '../view-file/vf-index'
import nodePath from 'path'
import * as _ from 'lodash'
import {ipcRenderer} from 'electron'

/**
 * Sets set selection to the given file
 * used by all selecion actions
 * @param  {string[]} pathArray
 */
export function setSelection(pathArray) {
  return function (dispatch, getState) {
    let fileList = []
    let lastRoot = null

    pathArray.forEach((path) => {
      let root = nodePath.dirname(path)
      let filename = nodePath.basename(path)  
      if(lastRoot && lastRoot != root) {
        throw "Selection with different root folders is not possible"
      }
      lastRoot = root
      fileList.push(filename)
    })

    if(fileList.length > 1) {
      //Close Appending View if multiple files are selected
      dispatch( App.actions.changeAppPath(null, lastRoot) )
      dispatch( ViewFile.actions.closePreview() )
    }

    dispatch({
      type: t.SET_SELECTION,
      payload: {
        root: lastRoot,
        files: fileList
      }
    })
  }
}

/**
 * Adds the List of given paths to the selection
 * Ctrl Click on file & used by expandSelectionTo()
 * @param  {string[]} pathArray
 */
export function addToSelection(pathArray) {
  return function (dispatch, getState) {
    let previousRoot  = getState()[c.NAME].get('root')
    let selectedFiles = getState()[c.NAME].get('files').toJS().map((filename) => {
      return nodePath.join(previousRoot, filename)
    })
    pathArray.forEach((filePath, index) => {
      let root = nodePath.dirname(filePath)
      if(previousRoot != root) {
        // Reset Selection if root is differnt
        previousRoot = root,
        selectedFiles = []
      }
      if(selectedFiles.indexOf(filePath) < 0) { // skip is already exists
        selectedFiles.push(filePath)
      }
    })
    dispatch( setSelection( selectedFiles) )
  }  
}

/**
 * Shift Click on file
 * expands selection from the last selected file to the current one
 * @param  {string} path of file to expand
 */
export function expandSelectionTo(path) {
  return function (dispatch, getState) {

    let state = getState()

    let selection = state[c.NAME].toJS()
    let filename = nodePath.basename(path)
    let root = nodePath.dirname(path)

    if(selection.root == root) {

      let filesSeq = FS.selectors.getFilesSeq(state, {path: root})
      let lastSelectionIndex  = filesSeq.indexOf( _.last(selection.files) )
      let currentIndex        = filesSeq.indexOf( filename )
      let start, length
      if (lastSelectionIndex < currentIndex) { 
        start = lastSelectionIndex + 1
        length = currentIndex - lastSelectionIndex
      } else { 
        start = currentIndex
        length = lastSelectionIndex - currentIndex + 1
      }

      let newSelected = filesSeq.splice( start, length ).map((filename) => {
        return nodePath.join(root, filename)
      })

      dispatch( addToSelection( newSelected ) )
    } else {
      dispatch( addToSelection( [path] ) )
    }
  }
}

/**
 * used by arrow right/left navigation
 * selects active or first file in the folder
 * @param  {string} root path
 */
export function setSelectionToFolder(root) {
  return function (dispatch, getState) {
    let activeFile = FS.selectors.getActiveFile(getState(), {path: root})
    let firstFile =  FS.selectors.getFilesSeq(getState(), {path: root})[0]  
    if(activeFile) {
      dispatch( 
          setSelection( [nodePath.join( root, activeFile )] )
        )
    } else if(firstFile) {
      dispatch( App.actions.changeAppPath(null, nodePath.join(root, firstFile) ) )
    }
  }
}


/**
 * Base form current selection
 */
export function selectNextDir() {
  return function (dispatch, getState) {
    let currentSelection = selectors.getSelection(getState())
    let nextFolder = FS.selectors.getNextDir(getState(), {path: currentSelection.get('root')})
    if(nextFolder) dispatch( setSelectionToFolder( nextFolder ))
  }
}

/**
 * Base form current selection
 */
export function selectPreviousDir() {
  return function (dispatch, getState) {
    let currentSelection = selectors.getSelection(getState())
    let prevFolder = FS.selectors.getPreviousDir(getState(), {path: currentSelection.get('root')})
    if(prevFolder) dispatch( setSelectionToFolder( prevFolder ))
  }
}

/**
 * Base form current selection
 */
export function selectAll() {
  return function (dispatch, getState) {
    let state = getState()
    let root  = state[c.NAME].get('root')
    let allFiles = FS.selectors.getFilesSeq(state, {path: root}).map((filename) => {
      return nodePath.join(root, filename)
    })
    dispatch( setSelection( allFiles ) )
  }
}

export function startDragSelection() {
  return function (dispatch, getState) {
    let selection = selectors.getSelection(getState())
    let selectedFiles = selection.get('files').toJS().map((filename) => {
      return nodePath.join(selection.get('root'), filename)
    })
    ipcRenderer.send('ondragstart', selectedFiles)
  }
}