import React from 'react'
import { connect } from 'react-redux'
import nodePath from 'path'
import FS from '../../filesystem/watch/fs-watch-index'
import filesize from 'filesize' // https://www.npmjs.com/package/filesize
import classnames from 'classnames'
import getRenderer from '../render/get-renderer'

@connect(() => {
  return (state, props) => {
    return {
      file: FS.selectors.getFile(state, props)
    }
  }
})
export default class ViewFile extends React.Component {
  
  constructor(props) {
    super(props)
    this.monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  }

  render() {
    let file = this.props.file
    let FileRenderer = getRenderer( nodePath.extname(this.props.path) )

    return(
      <div className="view-file" style={this.props.styles}>
        <div className="view-file__top-toolbar">
          <div className="view-file__name">{ this.props.file.get('base') }</div>
          <div className="view-file__size">{ filesize( file.get('stats').size ) }</div>
        </div>
        <div className="view-file__renderer">
          <FileRenderer path={this.props.path} />
        </div>
        <div className="view-file__bottom-bar">
          {this.getFileTime( file.get('stats').mtime, "Modified" )}
          {this.getFileTime( file.get('stats').birthtime, "Created" )}
          {this.getFileTime( file.get('stats').atime, "Accessed" )}
        </div>
      </div>
    )
  }
  
  getFileTime(date, type) {
    return (
      <div className="file-time">
        <div className="file-time__type">{type}</div>
        <div className="file-time__date">
          {date.getDate()+' '+this.monthNames[date.getMonth()]+' '+date.getFullYear()}
        </div>
        <div className="file-time__clock">
          {date.toLocaleTimeString()}
        </div>
      </div>
    ) 
  }
}