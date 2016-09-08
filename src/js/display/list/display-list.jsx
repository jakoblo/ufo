import React from 'react'
import { changeAppPath } from '../../app/app-actions'
import { connect } from 'react-redux'
import FS from '../../filesystem/fs-index'
import Selection from '../../selection/sel-index'


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
          onMouseUp={this.handleOnMouseUp.bind(this, file.path)}
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

    // console.log(this, path, event)

    if(event.ctrlKey || event.metaKey) {
      this.props.dispatch( Selection.actions.addToSelection([path]) )
    } else if(event.shiftKey) {
      this.props.dispatch( Selection.actions.expandSelectionTo(path) )
    } else {
      this.props.dispatch( Selection.actions.setSelection([path]) )
    }
  }

  handleOnMouseUp = (path, event) => {
    if(!event.ctrlKey && !event.metaKey && !event.shiftKey) {
      this.props.dispatch( changeAppPath(null, path) )
    }
  }

}
