import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {storeSetup} from './store-setup'
import {DevToolsSetup} from './utils/devtools-setup'
import Config from './config/config-index'
import { ipcRenderer, remote  } from 'electron'
// React
import EventCatcher from './app/components/root-event-catcher'
import ActionBar from './general-components/actionbar'
import Sidebar from './general-components/sidebar'
import Navbar from './navbar/navbar-index'
import ViewPlacer from './view-placer/vp-index'
import FsWrite from './filesystem/write/fs-write-index'
import ToggleBar from './general-components/togglebar'
import * as Utils from './utils/utils-index'

if (process.env.NODE_ENV !== 'production') {
  // execute window.devToolsSetup() on the developer console to install them
  window.devToolsSetup = DevToolsSetup
  require('electron-connect').client.create()
}
const windowID = remote.getCurrentWindow().id
const store = storeSetup();


store.dispatch(Config.actions.loadPreviousState(windowID))
window.store = store
window.utils = Utils.storage
ipcRenderer.on('saveState', function(event) {
  Utils.storage.saveStatetoStorage(store.getState(), windowID, function() {
    ipcRenderer.send('closeWindow', windowID)
  })
})

ReactDOM.render(
  <Provider store={ store }>
    <EventCatcher>
      <Sidebar>
        <ActionBar/>
        <Navbar.components.parent/>
        <ToggleBar/>
      </Sidebar>
      <ViewPlacer.components.parent/>
      <FsWrite.component />
    </EventCatcher>
  </Provider>
  ,
  document.getElementById('app')
);
