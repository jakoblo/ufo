import * as FileActions from './file-item-actions'
import nodePath from 'path'

export function onMouseDown (dispatch, file, event) {
  if(event.ctrlKey || event.metaKey) {
    dispatch( FileActions.addToSelection(file) )
  } else if(event.shiftKey) {
    dispatch( FileActions.expandSelection(file) )
  }
}

export function onMouseUp (dispatch, file, event) {
  if(!event.ctrlKey && !event.metaKey && !event.shiftKey) {
    dispatch( FileActions.show(file) )
  }
}

export function onDragStart (dispatch, file, event) {
  event.preventDefault()
  dispatch( FileActions.startDrag(file) )
}