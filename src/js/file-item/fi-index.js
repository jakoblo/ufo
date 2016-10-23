import * as actions from './fi-actions';
import * as eventHandler from './fi-event-handler/fi-event-handler-index'
<<<<<<< HEAD
import FileItem from './components/fi-component'

let components = {
  FileItem: FileItem
}

export {actions, eventHandler}
export {FileItem}
=======
import fileItem from './components/file-item'
import fileItemRename from './components/file-item-rename'

export default {actions, eventHandler, components: {
  fileItem: fileItem,
  fileItemRename: fileItemRename
}}
>>>>>>> master
