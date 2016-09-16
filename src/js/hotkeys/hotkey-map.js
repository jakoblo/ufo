import * as HotKeyActions from './hotkey-actions.js'
import Selection from '../selection/sel-index'

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
  navDown: 'down',
  selectDown: 'shift+down',
  navRight: 'right',
  navLeft: 'left',
  selectAll: ['ctrl+a', 'command+a']
}

const rawHandlerMap = {
  navUp: HotKeyActions.navigateFileUp,
  selectUp: HotKeyActions.addPrevFileToSelection,
  navDown: HotKeyActions.navigateFileDown,
  selectDown: HotKeyActions.addNextFileToSelection,
  navRight: Selection.actions.selectNextDir,
  navLeft: Selection.actions.selectPreviousDir,
  selectAll: Selection.actions.selectA
}