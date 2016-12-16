import * as FileActions from '../fi-actions'
import * as fsWriteActions from '../../filesystem/write/fs-write-actions'

/**
 * Adding file to Selection
 */
export function onMouseDown (event) {
  event.stopPropagation()
  if(!this.props.file.get('progress')) {
    if(event.ctrlKey || event.metaKey) {
      this.props.dispatch( FileActions.addToSelection(this.props.file) )
    } else if(event.shiftKey) {
      this.props.dispatch( FileActions.expandSelection(this.props.file) )
    }
  }
}

/**
 * Show Folder or File in Preview
 */
export function onMouseUp (event) {
  event.stopPropagation()
  if(!this.props.file.get('progress')) {
    if(!event.ctrlKey && !event.metaKey && !event.shiftKey) {
      if(!this.props.file.get('selected')) {
        this.props.dispatch( FileActions.show(this.props.file) )
      }
    }
  }
}

/**
 * Open File in Default Application
 */
export function onDoubleClick (event) {
  if(!this.props.file.get('progress') && this.props.file.get('stats').isFile()) {

    // Open
    this.props.dispatch( FileActions.open(this.props.file) )

    // CSS Animation @todo react css transitions
    this.setImmState((prevState) => (prevState.set('openAnimation', true)))
    setTimeout(() => {
      this.setImmState((prevState) => (prevState.set('openAnimation', false)))
    }, 1000);

  }
}

/**
 * Right Click menu
 */
export function onContextMenu(event) {
  event.preventDefault()
  event.stopPropagation()
  if(!this.props.file.get('progress')) {
    this.props.dispatch( 
      FileActions.showContextMenu(
        this.props.file,
        this.renameStart
      ))
  }
}
