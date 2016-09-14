import * as FileActions from '../fi-actions'
import {remote} from 'electron'
const {Menu, MenuItem} = remote


/**
 * Adding file to Selection
 */
export function onMouseDown (event) {
  if(event.ctrlKey || event.metaKey) {
    this.props.dispatch( FileActions.addToSelection(this.props.file) )
  } else if(event.shiftKey) {
    this.props.dispatch( FileActions.expandSelection(this.props.file) )
  }
}

/**
 * Show Folder or File in Preview
 */
export function onMouseUp (event) {
  if(!event.ctrlKey && !event.metaKey && !event.shiftKey) {
    if(!this.props.file.get('selected')) {
      this.props.dispatch( FileActions.show(this.props.file) )
    }
  }
}

/**
 * Open File in Default Application
 */
export function onDoubleClick (event) {
  if(this.props.file.get('stats').isFile()) {

    // Open
    this.props.dispatch( FileActions.open(this.props.file) )

    // CSS Animation
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

  let menu = new Menu();
  menu.append(new MenuItem({ label: 'Open "' + file.get('base') + '"', click: null }))
  menu.append(new MenuItem({ label: 'Rename', click: null }))
  
  menu.append(new MenuItem({ type: 'separator' }));
  menu.append(new MenuItem({ label: 'Move to Trash', click: null }));
  menu.append(new MenuItem({ type: 'separator' }));
  menu.append(new MenuItem({label: 'Add to FavBar', click: null }))

  menu.popup(remote.getCurrentWindow());
}
