import * as FileActions from '../fi-actions'
import {dragndrop} from '../../utils/utils-index'

var dragHoverTimeout = null
var dragInOutCount = 0

export function onDragStart (event) {
  event.preventDefault()
  this.props.dispatch( FileActions.startDrag(this.props.file) )
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

    // Timeout
    dragInOutCount--
    if(dragInOutCount < 1) clearTimeout(dragHoverTimeout)

    // Reset State
    this.setImmState((prevState) => (
      prevState
      .set('dropTarget', false)
      .set('dropBlocked', false)
    ))
  }
}

export function onDrop (event) {
  if( shouldHandleDrop(event, this.props.file) ) {
    event.preventDefault()
    event.stopPropagation()
    console.log('MOVE FILE DO SOMETHING', event.dataTransfer.dropEffect)
  }
}

function shouldHandleDrop(event, file) {
  return (dragndrop.isFileDrag(event) && file.get('stats').isDirectory())
}

function dropAllowed(event, file) {
  let allowed = true
  for (let dropFile of event.dataTransfer.files) {
    if(dropFile.path == file.get('path')) {
      allowed = false // Drop on Itself
    }
  }
  return allowed
}
