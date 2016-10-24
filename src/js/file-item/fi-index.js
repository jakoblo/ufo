import * as actions from './fi-actions';
import * as eventHandler from './fi-event-handler/fi-event-handler-index'
import fileItem from './components/file-item'

export default {actions, eventHandler, components: {
  fileItem: fileItem
}}