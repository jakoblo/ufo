import React from 'react'
import { changeAppPath } from '../../app/app-actions'
import { connect } from 'react-redux'
import {makeGetFolderWithActive} from '../../filemanager/fm-selectors'

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
      fileList = this.props.folder.get('files').map((file, index) => {
        let styles = {}
        if(file.get('active')) {
          styles = {
            fontWeight: 'bold'
          }
        }

        return ( <li style={styles} onClick={this.addPath.bind(this, file.get('path'))} key={index}>{file.get('base')}</li> )
      })
    }

    return(
      <ul>
        {fileList}
      </ul>
    )
  }
}
