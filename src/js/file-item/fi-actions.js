import App from '../app/app-index'
import ViewFile from '../view-file/vf-index'
import Selection from '../filesystem/selection/sel-index'
import fsWrite from '../filesystem/write/fs-write-index'
import fsRename from '../filesystem/rename/rename-index'
import nodePath from 'path'
import {ipcRenderer, shell, remote} from 'electron'
const {Menu, MenuItem} = remote


/**
 * Open File or Directory or hole Selection
 */
export function open(file) {
  return (dispatch, getState) => {
    getPathArray(file, getState).forEach((filePath) => {
      shell.openItem(filePath);
    })
  }
}

/**
 * Opens view-folder for directory or view-file for file 
 */
export function show(file, peakInFolder = false) {
  return (dispatch, getState) => {
    if(file.get('stats').isFile()) {
      //@TODO is Dirty
      dispatch( App.actions.changeAppPath(null, nodePath.dirname( file.get('path') ), false, false) )
      dispatch( ViewFile.actions.showPreview( file.get('path') ) )
    } else {
      dispatch( App.actions.changeAppPath(null, file.get('path' ), false, peakInFolder))
    }
  }
}

/**
 * Ctrl Click
 */
export let addToSelection = (file) => Selection.actions.filesAdd( [file.get('path')] )

/**
 * Shift Click
 */
export let expandSelection = (file) => Selection.actions.expandToFile( file.get('path') )

/**
 * Drag of the Single file or the Selection
 */
export function startDrag(file) {
  return (dispatch, getState) => {
    ipcRenderer.send('ondragstart', getPathArray(file, getState ))
  }
}

export function showContextMenu(file, startRename) {
  return (dispatch, getState) => {

    let filePathArray = getPathArray(file, getState)
    let title = (filePathArray.length > 1) ? filePathArray.length+' items' : ""  

    let menu = new Menu();
    menu.append(new MenuItem({ 
      label: 'Open ' + title, 
      click: () => {
        dispatch(open(file))
      }
    }))
    menu.append(new MenuItem({
      label: 'Rename: '+'"' + file.get('base') + '"', 
      click: () => {
        dispatch(fsRename.actions.renameStart(file.get('path')))
      }
    }))
    menu.append(new MenuItem({ type: 'separator' }));
    menu.append(new MenuItem({ label: 'Move '+title+' to Trash', 
      click: () => {fsWrite.actions.moveToTrash(filePathArray) } 
    }));
    menu.popup(remote.getCurrentWindow());
  }
}

function getPathArray(file, getState) {
  if(file.get('selected')) {
    return Selection.selectors.getSelectionPathList(getState()).toJS()
  } else {
    return [file.get('path')]
  }
}