import React from 'react'
import { connect } from 'react-redux'
import FS from  '../filesystem/fs-index'
import FileItem from '../file-item/file-item-component'
import * as fileEventHandler from '../file-item/file-item-event-handler'

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

        // Bind File Event Handler
        let boundFileEventHandler = {}
        Object.keys(fileEventHandler).forEach((key) => {
          if((typeof fileEventHandler[key] === "function")) {
            boundFileEventHandler[key] = fileEventHandler[key].bind(this, this.props.dispatch, file)
          }
        });

        return ( <FileItem
          key={index}
          file={file}
          {...boundFileEventHandler}
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
