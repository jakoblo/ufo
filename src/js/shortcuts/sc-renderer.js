import {ipcRenderer} from 'electron'
import shortcuts from './sc-constants'

export default function (store) {
  shortcuts.forEach((sc) => {

    console.log('setup shortcut', sc)

    ipcRenderer.on(sc.ipcAction, function(event) {
      store.dispatch( sc.action() )
    })
  })
}





