// https://www.npmjs.com/package/electron-localshortcut
import electronLocalshortcut from 'electron-localshortcut'
import shortcuts from './sc-constants'

export default function (window) {
  shortcuts.forEach((sc) => {
    electronLocalshortcut.register(window, sc.key, () => {
      window.webContents.send(sc.ipcAction)
    })
  })
}

