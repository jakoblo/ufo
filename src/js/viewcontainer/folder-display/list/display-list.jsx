import React from 'react'
import { connect } from 'react-redux'
import {ipcRenderer} from 'electron' //@todo try to remove that
import App from '../../../app/app-index'
import FS from  '../../../filesystem/fs-index'
import Selection from '../../../selection/sel-index'
import Preview from '../../file-preview/pv-index'
import FileItem from './file-item'

@connect(() => {
  const getFolderCombined = FS.selectors.getFolderCombinedFactory()
  return (state, props) => {
    return {
      folder: getFolderCombined(state, props)
    }
  }
})
export default class DisplayList extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    let fileList = ""
    if(this.props.folder) {
      fileList = this.props.folder.map((file, index) => {
        file = file.toJS()
        return ( <FileItem
          {...file}
          key={index} 
          onMouseDown={this.handleOnMouseDown.bind(this, file.path)}
          onMouseUp={this.handleOnMouseUp.bind(this, file.path, file.type)}
          onDragStart={this.handleOnDragStart.bind(this, file.selected, file.path)}
        /> )
      })
    }

    return(
      <div className="display-list">
        {fileList}
      </div>
    )
  }

  handleOnMouseDown = (path, event) => {
    if(event.ctrlKey || event.metaKey) {
      this.props.dispatch( Selection.actions.addToSelection([path]) )
    } else if(event.shiftKey) {
      this.props.dispatch( Selection.actions.expandSelectionTo(path) )
    }
  }

  handleOnMouseUp = (path, type, event) => {
    if(!event.ctrlKey && !event.metaKey && !event.shiftKey) {
      // No Selection
      if(type == 'DIR') {  //@todo constant
        this.props.dispatch( App.actions.changeAppPath(null, path) )
      } else {
        this.props.dispatch( Preview.actions.showPreview(path) )
      }
    }
  }

  handleOnDragStart = (fileSelected, filePath, e) => {
    e.preventDefault()
    if(fileSelected) {
      this.props.dispatch( Selection.actions.startDragSelection() )
    } else {
      //@todo try find a better place for that file-actions.js or something like that
      ipcRenderer.send('ondragstart', [filePath])
    }
  }
}
