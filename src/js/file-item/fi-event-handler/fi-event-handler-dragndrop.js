import * as FileActions from '../fi-actions'
import {dragndrop} from '../../utils/utils-index'

var dragHoverTimeout = null
var dragInOutCount = 0

export function onDragStart (event) {
  event.preventDefault()
  if(!this.props.file.get('progress')) {
    this.props.dispatch( FileActions.startDrag(this.props.file) )
  }
}

/** 
 * Set DropHover State
 * Start show Timeout
 */
export function onDragEnter (event) {
  if( shouldHandleDrop(event, this.props.file) ) {
    
    event.preventDefault()
    event.stopPropagation()
    
    // Hover Timeout
    dragInOutCount++
    clearTimeout(dragHoverTimeout)

    if(dropAllowed(event, this.props.file)) {
      this.setImmState((prevState) => (prevState.set('dropTarget', true)))
      dragHoverTimeout = setTimeout(() => {
        this.props.dispatch( FileActions.show( this.props.file ) )
      }, 1000)
    } else {
      this.setImmState((prevState) => (prevState.set('dropBlocked', true)))
      event.dataTransfer.dropEffect = "none"
    }
  }
}

/**
 * Set dropEffect for the right mousecursor
 * https://github.com/electron/electron/issues/7207
 */
export function onDragOver (event)  {
  if( shouldHandleDrop(event, this.props.file) ) {
    event.preventDefault()
    event.stopPropagation()
    if(dropAllowed(event, this.props.file)) {
      event.dataTransfer.dropEffect = "copy"
    } else {
      event.dataTransfer.dropEffect = "none"
    }
  }
}

/**
 * Reset DropHover State Changes & clear timeout
 */
export function onDragLeave (event) {
  if( shouldHandleDrop(event, this.props.file) ) {
    event.preventDefault()
    clearHoverState.bind(this)()

    // Timeout
    dragInOutCount--
    if(dragInOutCount < 1) { clearTimeout(dragHoverTimeout) }
  }
}

export function onDrop (event) {
  clearTimeout(dragHoverTimeout)
  clearHoverState.bind(this)()
  if( shouldHandleDrop(event, this.props.file) ) {
    event.preventDefault()
    event.stopPropagation()
    dragndrop.handleFileDrop(event, this.props.file.get('path'))
  }
}

/**
 * Is a file in Drag & is the target a directory?
 */
function shouldHandleDrop(event, file) {
  return (dragndrop.isFileDrag(event) && !file.get('progress') && file.get('stats').isDirectory())
}

/**
 * Prevent Drop on Itself
 */
function dropAllowed(event, file) {
  let allowed = true
  for (let dropFile of event.dataTransfer.files) {
    if(dropFile.path == file.get('path')) {
      allowed = false // Drop on Itself
    }
  }
  return allowed
}

function clearHoverState() {
  this.setImmState((prevState) => (
      prevState
      .set('dropTarget', false)
      .set('dropBlocked', false)
    ))
}