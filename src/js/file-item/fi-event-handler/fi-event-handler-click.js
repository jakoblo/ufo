import * as FileActions from '../fi-actions'
import {remote} from 'electron'
const {Menu, MenuItem} = remote

export function onMouseDown (event) {
  if(event.ctrlKey || event.metaKey) {
    this.props.dispatch( FileActions.addToSelection(this.props.file) )
  } else if(event.shiftKey) {
    this.props.dispatch( FileActions.expandSelection(this.props.file) )
  }
}

export function onMouseUp (event) {
  if(!event.ctrlKey && !event.metaKey && !event.shiftKey) {
    this.props.dispatch( FileActions.show(this.props.file) )
  }
}

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
