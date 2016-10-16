import * as HotKeyActions from './hotkey-actions.js'
import Selection from '../filesystem/selection/sel-index'
import App from '../app/app-index'

/**
 * Map dispatch to the raw handlerMap
 */
export function handlerMapper(dispatch) {
  let handlerMapped = {}
  Object.keys(rawHandlerMap).forEach((key, index) => {
    handlerMapped[key] = (event) => {
        dispatch( rawHandlerMap[key](event) )
    }
  })
  return handlerMapped
}


// React-HotKeys
// https://github.com/chrisui/react-hotkeys/blob/master/docs/getting-started.md#getting-started

export const keyMap = {
  navUp: 'up',
  selectUp: 'shift+up',
  pathUp: ['ctrl+up', 'command+up'],
  navDown: 'down',
  selectDown: 'shift+down',
  navRight: 'right',
  navLeft: 'left',
  selectAll: ['ctrl+a', 'command+a'],
  moveToTrash: ['del', 'command+backspace'],
  rename: ['F2', 'enter']
}

export const bindRenameAction = (callback) => {
  console.log('do bind')
  rawHandlerMap.rename = callback
}

export const unbindRenameAction = (callback) => {
  if(rawHandlerMap.rename === callback) {
    console.log('do unbind')
    rawHandlerMap.rename = () => () => {}
  }
}

var rawHandlerMap = {
  navUp: HotKeyActions.navigateFileUp,
  selectUp: HotKeyActions.addPrevFileToSelection,
  pathUp: App.actions.navigateToParentFolder,
  navDown: HotKeyActions.navigateFileDown,
  selectDown: HotKeyActions.addNextFileToSelection,
  navRight: Selection.actions.selectNextDir,
  navLeft: Selection.actions.selectPreviousDir,
  selectAll: Selection.actions.selectAll,
  moveToTrash: HotKeyActions.selectionToTrash
}