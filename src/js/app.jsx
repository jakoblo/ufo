import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {storeSetup} from './store-setup'
import {DevToolsSetup} from './utils/devtools-setup'
import App from './app/app-index'
import Config from './config/config-index'
import { ipcRenderer, remote  } from 'electron'
/* React Components */
import Foundation from './general-components/foundation'
import ShortcutManagerSetup from './general-components/shortcutmanager-setup'
import ActionBar from './general-components/actionbar'
import Sidebar from './general-components/sidebar'
import Navbar from './navbar/navbar-index'
import ViewPlacer from './view-placer/vp-index'
import FsWrite from './filesystem/write/fs-write-index'
import ToggleBar from './general-components/togglebar'
import * as Utils from './utils/utils-index'
import {keyMap, shortcutHandler} from './shortcuts/shortcut-map.js'
import { ShortcutManager, Shortcuts } from 'react-shortcuts'

if (process.env.NODE_ENV !== 'production') {
  // execute window.devToolsSetup() on the developer console to install them
  window.devToolsSetup = DevToolsSetup
  require('electron-connect').client.create()
}
const windowID = remote.getCurrentWindow().id
const store = storeSetup();

// INIT APP PATH

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
      <ShortcutManagerSetup shortcutManager={new ShortcutManager(keyMap)}> 
        <Shortcuts name="global" global={true} handler={shortcutHandler}>
          <Foundation>
            <Sidebar>
              <ActionBar/>
              <Navbar.components.parent/>
              <ToggleBar/>
            </Sidebar>
            <ViewPlacer.components.parent/>
            <FsWrite.component />
          </Foundation>
        </Shortcuts>
      </ShortcutManagerSetup>
    </Provider>
  ,
  document.getElementById('app')
);
