import React from 'react'
import { changeAppPath } from '../../app/app-actions'
import { connect } from 'react-redux'
import {makeGetFolderWithActive} from '../../filemanager/fm-selectors'
import FileItem from './file-item'

@connect(() => {
  const getFolderWithActive = makeGetFolderWithActive()
  return (state, props) => {
    return {
      folder: getFolderWithActive(state, props)
    }
  }
})
export default class DisplayList extends React.Component {
  constructor(props) {
    super(props)
  }

  addPath(path) {
    this.props.dispatch(changeAppPath(null, path) )
  }

  render() {

    let fileList = ""
    if(this.props.folder) {
      fileList = this.props.folder.map((file, index) => {
        file = file.toJS()
        return ( <FileItem
          {...file}
          key={index} 
          onClick={this.addPath.bind(this, file.path)} 
        /> )
      })
    }

    return(
      <div className="display-list">
        {fileList}
      </div>
    )
  }
}
