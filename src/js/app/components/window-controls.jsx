import React from 'react'
import {remote} from 'electron'

export default class WindowControls extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
     <div className="window-controls">
      <button key={1} className="window-controls__close" onClick={() => {
        remote.getCurrentWindow().close()
      }}/>
      <button key={2} className="window-controls__minimize" onClick={() => {
        remote.getCurrentWindow().minimize()
      }}/>
      <button key={3} className="window-controls__maximize" onClick={() => {
        remote.getCurrentWindow().maximize()
      }}/>
     </div>
    )
  }
}
