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

var dragHoverTimeout = null
var dragInOutCount = 0

export function onDragEnter (dispatch, file, event) {
  event.preventDefault()
  if(file.get('stats').isDirectory()) {
    event.stopPropagation()
    let dropPossible = true
    for (let dropFile of event.dataTransfer.files) {
      if(dropFile.path == file.get('path')) {
        dropPossible = false
      }
    }
    if(dropPossible) {
      event.dataTransfer.dropEffect = "copy"
      dispatch( FileActions.dragEnter( file.get('path') ))
      dragInOutCount++
      clearTimeout(dragHoverTimeout)
      dragHoverTimeout = setTimeout(() => {
        dispatch( FileActions.show( file ) )
      }, 1000)
    } else {
      event.dataTransfer.dropEffect = "none"
    }
  }
}

export function onDragLeave (dispatch, file, event) {
  event.preventDefault()
  if(file.get('stats').isDirectory()) {
    console.log('clearTimeout')
    dragInOutCount--
    if(dragInOutCount == 0) clearTimeout(dragHoverTimeout)
    dispatch( FileActions.dragLeave( file.get('path') ))
  }
}