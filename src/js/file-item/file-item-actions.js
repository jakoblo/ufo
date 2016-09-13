import App from '../app/app-index'
import ViewFile from '../view-file/vf-index'
import Selection from '../selection/sel-index'
import nodePath from 'path'
import {ipcRenderer} from 'electron'

export function show(file) {
  return (dispatch, getState) => {
    if(file.get('stats').isFile()) {  //@todo constant
      //@todo two actions? bad?
      dispatch( App.actions.changeAppPath(null, nodePath.dirname( file.get('path') )) )
      dispatch( ViewFile.actions.showPreview( file.get('path') ) )
    } else {
      dispatch( App.actions.changeAppPath(null, file.get('path' )))
    }
  }
}

export function addToSelection(file) {
  return (dispatch) => {
    dispatch( Selection.actions.addToSelection( [file.get('path')] ))
  }
}

export function expandSelection(file) {
  return (dispatch) => {
    dispatch( Selection.actions.expandSelectionTo( file.get('path') ))
  }
}

export function startDrag(file) {
  return (dispatch) => {
    if(file.get('selected')) {
      dispatch( Selection.actions.startDragSelection() )
    } else {
      ipcRenderer.send('ondragstart', [file.get('path')] )
    }
  }
}