import Selection from '../filesystem/selection/sel-index'
import Rename from '../filesystem/rename/rename-index'
import App from '../app/app-index'

/**
 * Map dispatch to the raw handlerMap
 */
export function shortcutHandler(action, event) {
  if( event.target.tagName.toUpperCase() == 'INPUT' ) {
    return
  }
  if(rawHandlerMap[action]) {
    window.store.dispatch( rawHandlerMap[action]() )
  }
}


// React-Shortcuts
// https://github.com/avocode/react-shortcuts
export const keyMap = {
  global: {
    navUp: 'up',
    selectUp: 'shift+up',
    pathUp: ['ctrl+up', 'command+up'],
    navDown: 'down',
    selectDown: 'shift+down',
    navRight: 'right',
    navLeft: 'left',
    selectAll: {
      windows: 'ctrl+a',
      linux: 'ctrl+a',
      osx: 'command+a'
    },
    moveToTrash: {
      windows: 'del',
      linux: 'del',
      osx: 'command+backspace'
    },
    rename: {
      windows: 'F2', 
      linux: 'F2', 
      osx: 'enter'
    }
  },
  renameInput: {
    cancel: "esc",
    save: "enter"
  }
}

var rawHandlerMap = {
  navUp: Selection.actions.fileNavUp,
  selectUp: Selection.actions.fileAddUp,
  pathUp: App.actions.navigateToParentFolder,
  navDown: Selection.actions.fileNavDown,
  selectDown: Selection.actions.fileAddDown,
  navRight: Selection.actions.dirNext,
  navLeft: Selection.actions.dirPrevious,
  selectAll: Selection.actions.selectAll,
  rename: Rename.actions.renameSelected,
  moveToTrash: Selection.actions.toTrash
}