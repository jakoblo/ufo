"use strict"
import React from 'react'
import { changeAppPath } from '../actions/appActions'
import { connect } from 'react-redux'

@connect((store) => {
  return {fs: store.fs}
})
export class FSTester extends React.Component {

  constructor(props) {
    super(props)
  }

  addPath(path) {
    this.props.dispatch(changeAppPath(null, path) )
  }

  render() {
    let fileList = ""
    let ulClass = {
      float: 'left',
      border: '1px solid #ccc',
      height: 500,
      width: 350,
      overflow: 'scroll'
    }

    fileList = this.props.fs.map((folder, index) => {
      let files = folder.map((file, index2) => {
        let elementKey = index +'-'+index2
        return ( <li onClick={this.addPath.bind(this, file.path)} key={elementKey}>{file.base}</li> )
      })
      return <ul style={ulClass}>{files}</ul>
    })

    return(
      <div>
        <h2>FS-TESTER</h2>
        <div>
          {fileList}
        </div>
      </div>
    )
  }
}
