import {ipcMain} from 'electron'
import * as constants from './fs-write-constants'
import mv from 'mv'

ipcMain.on(constants.IPC_FS_MOVE, (event, action) => {
  // mv(action.source, action.destination, {clobber: false}, function(err) {
  //   // done. it tried fs.rename first, and then falls back to 
  //   // piping the source file to the dest file and then unlinking 
  //   // the source file.
  //   console.log('done', err) 
  // });
})