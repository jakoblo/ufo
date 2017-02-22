import * as actions from './folder-editor-actions'
import * as constants from './folder-editor-constants'
import * as actiontypes from './folder-editor-actiontypes'
import editorComponent from './components/folder-editor'
import reducer from './folder-editor-reducer'

export default { actions, reducer, actiontypes, constants, components: {
  editor: editorComponent
}};
