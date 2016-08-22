import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {storeSetup} from './store-setup'
import {DevToolsSetup} from './tools/devtools-setup'
import Immutable from 'immutable'
import { List, Map } from 'immutable'
import os from 'os'
import {changeAppPath} from './actions/appActions'
/* React Components */
import {Foundation} from './components/foundation'
import Sidebar from './components/sidebar'
// import {Navbar} from './components/navbar'
import Navbar from './navbar/navbar-index'
import {ViewContainer} from './components/viewContainer'
import FileSystem from './filesystem/fs-index'
import ToggleBar from './components/togglebar'
import ActionBar from './components/actionbar'

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
store.dispatch(changeAppPath(os.homedir(), os.homedir()))

ReactDOM.render(
      <Provider store={ store }>
      <Foundation>
        <Sidebar>
          <ActionBar></ActionBar>
            <Navbar.Container></Navbar.Container>
          <ToggleBar></ToggleBar>
        </Sidebar>
        <ViewContainer>
          <FileSystem.components.FSTester/>
        </ViewContainer>
      </Foundation>
    </Provider>
  ,
  document.getElementById('app')
);
