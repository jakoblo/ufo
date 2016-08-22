import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {storeSetup} from './store-setup'
import {DevToolsSetup} from './tools/devtools-setup'
import Immutable from 'immutable'
import { List, Map } from 'immutable'
import os from 'os'
import App from './app/app-index'
/* React Components */
import {Foundation} from './general-components/foundation'
import Sidebar from './general-components/sidebar'
// import {Navbar} from './components/navbar'
import Navbar from './navbar/navbar-index'
import ViewContainer from './viewcontainer/vc-index'
import FileSystem from './filesystem/fs-index'
import ToggleBar from './general-components/togglebar'

window.fs = FileSystem

if (process.env.NODE_ENV !== 'production') {
  // execute window.devToolsSetup() on the developer console to install them
  window.devToolsSetup = DevToolsSetup
  require('electron-connect').client.create()
}

const initialState = Immutable.fromJS({
  config: {windowWidth: 600, windowHeight: 800},
  navbar: {groupItems: [
      {name: "Favbar 1", items: ["/Users/jakoblo/Applications", "/Users/jakoblo/Desktop"]},
      {name: "Favbar 2", items: ["/Users/jakoblo/Documents", "/Users/jakoblo/Downloads"]}
    ]
  }
})

const store = storeSetup();

// INIT APP PATH
store.dispatch(App.actions.changeAppPath(os.homedir(), os.homedir()))

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
