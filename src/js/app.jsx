import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {storeSetup} from './store/store-setup'
import {DevToolsSetup} from './tools/devtools-setup'
import Immutable from 'immutable'
import { List, Map } from 'immutable'
/* React Components */
import {Foundation} from './components/foundation'
import Sidebar from './components/sidebar'
import {Navbar} from './components/navbar'
import {ViewContainer} from './components/viewContainer'
import ToggleBar from './components/togglebar'


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

// TEST
window.store = store

ReactDOM.render(
      <Provider store={ store }>
      <Foundation>
        <Sidebar>
          <Navbar></Navbar>
          <ToggleBar></ToggleBar>
        </Sidebar>
        <ViewContainer></ViewContainer>
      </Foundation>
    </Provider>
  ,
  document.getElementById('app')
);
