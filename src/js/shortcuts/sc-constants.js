// Key: https://github.com/electron/electron/blob/master/docs/api/accelerator.md
import * as scActions from './sc-actions'
import Selection from '../selection/sel-index'

const shortcuts = [
  {
    key: 'Up',
    ipcAction: 'key/ARROW_UP',
    action: scActions.navigateFileUp
  },
  {
    key: 'Shift+Up',
    ipcAction: 'key/SHIFT+ARROW_UP',
    action: scActions.addPrevFileToSelection
  },
  {
    key: 'Down',
    ipcAction: 'key/ARROW_DOWN',
    action: scActions.navigateFileDown
  },
  {
    key: 'Shift+Down',
    ipcAction: 'key/SHIFT+ARROW_DOWN',
    action: scActions.addNextFileToSelection
  },
  {
    key: 'Right',
    ipcAction: 'key/ARROW_RIGHT',
    action: Selection.actions.selectNextDir
  },
  {
    key: 'Left',
    ipcAction: 'key/ARROW_LEFT',
    action: Selection.actions.selectPreviousDir
  },
  {
    key: 'CommandOrControl+A',
    ipcAction: 'key/Ctrl-A',
    action: Selection.actions.selectAll
  }
]
export default shortcuts