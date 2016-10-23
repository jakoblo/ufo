import * as ShortcutActions from './shortcut-actions.js'
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
// https://github.com/chrisui/react-hotkeys/blob/master/docs/getting-started.md#getting-started

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
  navUp: ShortcutActions.navigateFileUp,
  selectUp: ShortcutActions.addPrevFileToSelection,
  pathUp: App.actions.navigateToParentFolder,
  navDown: ShortcutActions.navigateFileDown,
  selectDown: ShortcutActions.addNextFileToSelection,
  navRight: Selection.actions.selectNextDir,
  navLeft: Selection.actions.selectPreviousDir,
  selectAll: Selection.actions.selectAll,
  rename: Rename.actions.renameSelected,
  moveToTrash: ShortcutActions.selectionToTrash
}