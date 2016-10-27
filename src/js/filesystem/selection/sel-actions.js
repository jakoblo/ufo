import * as t from './sel-actiontypes'
import * as selectors from './sel-selectors'
import * as c from './sel-constants'
import fsWatch from '../watch/fs-watch-index'
import fsWrite from '../write/fs-write-index'
import * as fsMergedSelector from '../fs-merged-selectors'
import App from '../../app/app-index'
import ViewFile from '../../view-file/vf-index'
import nodePath from 'path'
import * as FileActions from '../../file-item/fi-actions'
import * as _ from 'lodash'
import {ipcRenderer} from 'electron'

/**
 * Sets set selection to the given file
 * used by all selecion actions
 * @param  {string[]} pathArray
 */
export function set(pathArray) {
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
 * Ctrl Click on file & used by expandToFile()
 * @param  {string[]} pathArray
 */
export function filesAdd(pathArray) {
  return function (dispatch, getState) {

    console.log('files add')

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
    dispatch( set( selectedFiles) )
  }  
}

/**
 * Shift Click on file
 * expands selection from the last selected file to the current one
 * @param  {string} path of file to expand
 */
export function expandToFile(path) {
  return function (dispatch, getState) {

    let state = getState()

    let selection = state[c.NAME].toJS()
    let filename = nodePath.basename(path)
    let root = nodePath.dirname(path)

    if(selection.root == root) {
      // @TODO Use Existing Factory somehow
      let filesSeq = fsMergedSelector.getFiltedFilesSeq_Factory()(state, {path: root})
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

      dispatch( filesAdd( newSelected ) )
    } else {
      dispatch( filesAdd( [path] ) )
    }
  }
}



/**
 * Base on current selection
 */
export function dirNext() {
  return function (dispatch, getState) {
    let currentSelection = selectors.getSelection(getState())
    let nextFolder = fsWatch.selectors.getDirNext(getState(), {path: currentSelection.get('root')})
    if(nextFolder) dispatch( dirSet( nextFolder ))
  }
}

/**
 * Base on current selection
 */
export function dirPrevious() {
  return function (dispatch, getState) {
    let currentSelection = selectors.getSelection(getState())
    let prevFolder = fsWatch.selectors.getDirPrevious(getState(), {path: currentSelection.get('root')})
    if(prevFolder) dispatch(  dirSet( prevFolder ))
  }
}

/**
 * used by arrow right/left navigation
 * selects active or first file in the folder
 * @param  {string} root path
 */
export function dirSet(root) {
  return function (dispatch, getState) {
    let openFile = fsWatch.selectors.getOpenFileOf(getState(), {path: root})
    // @TODO Use Existing Factory somehow
    let firstFile =  fsMergedSelector.getFiltedFilesSeq_Factory()(getState(), {path: root})[0]  
    if(openFile) {
      dispatch( set( [nodePath.join( root, openFile )] ))
    } else if(firstFile) {
      dispatch( App.actions.changeAppPath(null, nodePath.join(root, firstFile) ) )
    } else {
      dispatch({
        type: t.SET_SELECTION,
        payload: {
          root: root,
          files: []
        }
      })
    }
  }
}

/**
 * Base on current selection
 */
export function selectAll() {
  return function (dispatch, getState) {
    let state = getState()
    let root  = state[c.NAME].get('root')
    // @TODO Use Existing Factory somehow
    let allFiles = fsMergedSelector.getFiltedFilesSeq_Factory()(state, {path: root}).map((filename) => {
      return nodePath.join(root, filename)
    })
    dispatch( set( allFiles ) )
  }
}


// Navigate
// Arrow Up and Down
// Base on current Selection the "next" file will be selected
export let fileNavUp = () => fileNav(-1)
export let fileNavDown = () => fileNav(+1)
function fileNav(direction) {
  return function (dispatch, getState) {
    let props = {
      path: selectors.getSelection( getState() ).get('root') || // selected Folder
            fsWatch.selectors.getDirSeq( getState() )[0] // or First Folder
    } 
    // @TODO Use Existing Factory somehow
    let indexedFiles =     fsMergedSelector.getFiltedFilesSeq_Factory()( getState() , props)
    let currentFileIndex = fsMergedSelector.getFocusedFileIndexOf_Factory()( getState() , props)
    
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
export let fileAddUp = () => filesAddFromCurrent(-1)
export let fileAddDown = () => filesAddFromCurrent(+1)
function filesAddFromCurrent(direction) {
  return function (dispatch, getState) {
    console.log('addfromCurrent')
    let selection = selectors.getSelection( getState() )
    let props = { path: selection.get('root') }
    let indexedFiles = fsMergedSelector.getFiltedFilesSeq_Factory()( getState(), props )
    let currentFileIndex = fsMergedSelector.getFocusedFileIndexOf_Factory()( getState(), props )
    let newSelectedName = indexedFiles[currentFileIndex + direction]
    if(newSelectedName) {
      dispatch( filesAdd([nodePath.join(props.path, newSelectedName)] ))
    }
  }
}

export function toTrash() {
  return function (dispatch, getState) {
    fsWrite.actions.moveToTrash(
      selectors.getSelectionPathArray(getState())
    )
  }
}

export function startDrag() {
  return function (dispatch, getState) {
    let selection = selectors.getSelection(getState())
    let selectedFiles = selection.get('files').toJS().map((filename) => {
      return nodePath.join(selection.get('root'), filename)
    })
    ipcRenderer.send('ondragstart', selectedFiles)
  }
}