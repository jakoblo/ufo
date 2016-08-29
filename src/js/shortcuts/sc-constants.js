// Key: https://github.com/electron/electron/blob/master/docs/api/accelerator.md
import * as scActions from './sc-actions'

const shortcuts = [
  {
    key: 'Up',
    ipcAction: 'key/ARROW_UP',
    action: scActions.navigateFileUp
  },
  {
    key: 'Down',
    ipcAction: 'key/ARROW_DOWN',
    action: scActions.navigateFileUp
  }
]
export default shortcuts