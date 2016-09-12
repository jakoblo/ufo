import React from 'react'
import { connect } from 'react-redux'
import nodePath from 'path'
import FS from '../../filesystem/fs-index'
import ButtonGroup from '../../general-components/button-group'
import Button from '../../general-components/button'
import Icon from '../../general-components/icon'
import filesize from 'filesize' // https://www.npmjs.com/package/filesize
import Calendar from './calendar'
import classnames from 'classnames'
import Tooltip from 'rc-tooltip'
import fs from 'fs'
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
    let Display = getRenderer( nodePath.extname(this.props.path) )

    return(
      <div className="preview file" style={this.props.styles}>
        <div className="view-toolbar">
          <ButtonGroup>
            <Button className="icon open" text="Open File"/>
            <Button className="icon finder" text="Show in Finder"/>
            <Button className="icon clipboard" text="Copy Path"/>
          </ButtonGroup>
        </div>
        <div className="file-title-wrapper">
          <div className="file-title">
            <h1 className="title"><Icon glyph="file" />{ this.props.file.get('base') }</h1>
            <h3 className="file-size">{ filesize( file.get('stats').size ) }</h3>
          </div>
        </div>
        <Display path={this.props.path} />
        <div className="file-times-wrapper">
          <div className="file-times-header">
            {this.getFileTime( file.get('stats').mtime, "Modified" )}
            {this.getFileTime( file.get('stats').birthtime, "Created" )}
            {this.getFileTime( file.get('stats').atime, "Accessed" )}
          </div>
        </div>
      </div>
    )
  }
  
  getFileTime(date, title) {
    
    let classes = classnames({
      'file-time': true
    })
    
    let tooltipContent =  <div className="file-times-tooltip">
                            <h4>{this.monthNames[date.getMonth()]} {date.getFullYear()}</h4>
                            <Calendar date={date} />
                          </div>
    
    return (
      <Tooltip 
        placement="top" 
        overlay={tooltipContent}
        trigger="hover"
      >
        <div className={classes}>
          <h4>{title}</h4>
          <div className="file-time-content">
            <div className="file-time-col day">{date.getDate()}</div>
            <div className="file-time-col">
              <div className="file-time-row date">
                <div className="month">{this.monthNames[date.getMonth()]}</div>
                <div className="yeah">{date.getFullYear()}</div>
              </div>
              <div className="file-time-row time">{date.toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </Tooltip>
    ) 
  }
}