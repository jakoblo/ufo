import React from 'react'
import ReactDOM from 'react-dom'
import {Counter} from './components/counter'
import {Provider} from 'react-redux'
import {configureStore} from './store/configure-store'
import {DevToolsSetup} from './tools/devtools-setup'


if (process.env.NODE_ENV !== 'production') {
  // execute window.devToolsSetup() on the developer console to install them
  window.devToolsSetup = DevToolsSetup
  require('electron-connect').client.create()
}

const store = configureStore({});

ReactDOM.render(
    <Provider store={ store }>
      <Counter/>
    </Provider>
  ,
  document.getElementById('app')
);
