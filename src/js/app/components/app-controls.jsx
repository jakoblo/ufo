"use strict"
import React from 'react'
import History from '../../history/history-index'
import Button from '../../general-components/button'
import {remote} from 'electron'

export default class AppControls extends React.Component {
  constructor(props) {
    super(props)
  } 

  render() {
    return (
      <div className="app-controls">
        <WindowControls/>
        <History.components.HistoryActions />
      </div>
    )
  }
}

class WindowControls extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
     <div className="window-controls">
      <Button key={1} className="window-controls__close" onClick={() => {
        remote.getCurrentWindow().close()
      }}/>
      <Button key={2} className="window-controls__minimize" onClick={() => {
        remote.getCurrentWindow().minimize()
      }}/>
      <Button key={3} className="window-controls__maximize" onClick={() => {
        remote.getCurrentWindow().maximize()
      }}/>
     </div>
    )
  }
}
