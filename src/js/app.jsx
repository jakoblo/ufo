import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {storeSetup} from './store-setup'
import {DevToolsSetup} from './tools/devtools-setup'
import Immutable from 'immutable'
import { List, Map } from 'immutable'
import os from 'os'
import App from './app/app-index'
import Config from './config/config-index'
/* React Components */
import {Foundation} from './general-components/foundation'
import Sidebar from './general-components/sidebar'
// import {Navbar} from './components/navbar'
import Navbar from './navbar/navbar-index'
import ViewContainer from './viewcontainer/vc-index'
import FileSystem from './filesystem/fs-index'
import ToggleBar from './general-components/togglebar'
import Utils from './utils/utils-index'

window.fs = FileSystem

if (process.env.NODE_ENV !== 'production') {
  // execute window.devToolsSetup() on the developer console to install them
  window.devToolsSetup = DevToolsSetup
  require('electron-connect').client.create()
}

const store = storeSetup();

// INIT APP PATH
store.dispatch(App.actions.changeAppPath(os.homedir()))
store.dispatch(Config.actions.loadPreviousState())
window.store = store
// setTimeout(function(){ store.dispatch(Navbar.actions.addNavGroup("Favbar", [])) }, 3000);

ReactDOM.render(
      <Provider store={ store }>
      <Foundation>
        <Sidebar>
          <App.components.actionbar></App.components.actionbar>
          <Navbar.components.parent></Navbar.components.parent>
          <ToggleBar></ToggleBar>
        </Sidebar>
        <ViewContainer.components.parent>
          <FileSystem.components.FSTester/>
        </ViewContainer.components.parent>
      </Foundation>
    </Provider>
  ,
  document.getElementById('app')
);
