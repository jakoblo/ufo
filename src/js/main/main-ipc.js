import { BrowserWindow, ipcMain } from 'electron'

export default function ipcListener(handleNewWindow) {

  ipcMain.on('ondragstart', (event, filePath) => {
    event.sender.startDrag({
      files: filePath,
      icon: appBasePath + '/../../themes/default/img/multiDragPlaceholder.png'
    })
  })

  ipcMain.on('closeWindow', function(event, bwid) {
      let bw = BrowserWindow.fromId(bwid)
      bw.close()
  })

  ipcMain.on('global.newWindow', function(event, path) {
    console.log('global.ipcMain.newWindow: '+path);
      windowManager.newWindow()
  })

}

// Not needed right now:
// ipcMain.on('writeFile', function(event, path, content) {
//   console.log('writeFile: '+path);
//   let pathObj = Utils.Path.createPathObj(path)

//   fs.access(pathObj.dir, (error) => {
//       if(!error) {
//         fs.writeFileSync(path, content)
//       } else {
//         console.log(error)
//       }
//     }
//   )
// })