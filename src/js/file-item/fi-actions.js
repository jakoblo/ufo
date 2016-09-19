import App from '../app/app-index'
import ViewFile from '../view-file/vf-index'
import Selection from '../selection/sel-index'
import nodePath from 'path'
import {ipcRenderer, shell} from 'electron'


/**
 * Open File or Directory or hole Selection
 */
export function open(file) {
  return (dispatch, getState) => {
    if(file.get('stats').isFile()) {
      if(file.get('selected')) {
        // Open hole Selection
        let selection = Selection.selectors.getSelectionPathArray(getState())
        selection.forEach((filePath) => {
          shell.openItem(filePath);
        })
      } else {
        // Open Single file
        shell.openItem(file.get('path'));
      }
    } else if (file.get('stats').isDirectory()) {
      shell.showItemInFolder(file.get('path')); // Open Folder in Finder/Explorer
    }
  }
}

/**
 * Opens view-folder for directory or view-file for file 
 */
export function show(file) {
  console.log("SHOW")
  return (dispatch, getState) => {
    if(file.get('stats').isFile()) {
      //@todo two actions? bad?
      dispatch( App.actions.changeAppPath(null, nodePath.dirname( file.get('path') )) )
      dispatch( ViewFile.actions.showPreview( file.get('path') ) )
    } else {
      dispatch( App.actions.changeAppPath(null, file.get('path' )))
    }
  }
}

/**
 * Ctrl Click
 */
export function addToSelection(file) {
  return (dispatch) => {
    dispatch( Selection.actions.addToSelection( [file.get('path')] ))
  }
}

/**
 * Shift Click
 */
export function expandSelection(file) {
  return (dispatch) => {
    dispatch( Selection.actions.expandSelectionTo( file.get('path') ))
  }
}


/**
 * Drag of the Single file or the Selection
 */
export function startDrag(file) {
  return (dispatch) => {
    if(file.get('selected')) {
      dispatch( Selection.actions.startDragSelection() )
    } else {
      ipcRenderer.send('ondragstart', [file.get('path')] )
    }
  }
}