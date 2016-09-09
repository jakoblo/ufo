// import $           from 'jquery'
import fs          from 'fs'
// import {shell} from 'electron'
// import Utils     from '../utils'
import React from 'react'
// import ButtonGroup from '../button-group'
// import Button from '../button'
// import FileObj from '../file'
// import Icon from '../icon'
// import filesize from 'filesize' // https://www.npmjs.com/package/filesize
// import Calendar from './preview-calendar'
// import classnames from 'classnames'
// import Tooltip from 'rc-tooltip'

import DisplayImage from './pv-display-image'
// import displayManager from './pv-display'

/**
* Class for displaying a PREVIEW for a selected FILE in a new View
*/
export default class Preview extends React.Component {
  
  constructor(props) {
    super(props)
    this.monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  }

  render() {
    // let stats = this.props.baseFileObj.stats
    // let Display = displayManager.getDisplayType(this.props.baseFileObj.path.ext)
    return(
      <div className="preview file">
        <DisplayImage path={this.props.path} />
      </div>
    )


    // return(
    //   <div className="preview file">
    //     <div className="view-toolbar">
    //       <ButtonGroup>
    //         <Button className="icon open" text="Open File"/>
    //         <Button className="icon finder" text="Show in Finder"/>
    //         <Button className="icon clipboard" text="Copy Path"/>
    //       </ButtonGroup>
    //     </div>
    //     <div className="file-title-wrapper">
    //       <div className="file-title">
    //         <h1 className="title"><Icon glyph="file" />{this.props.baseFileObj.path.base}</h1>
    //         <h3 className="file-size">{ filesize(stats.size) }</h3>
    //       </div>
    //     </div>
    //     <Display baseFileObj={this.props.baseFileObj} />
    //     <div className="file-times-wrapper">
    //       <div className="file-times-header">
    //         {this.getFileTime(stats.mtime, "Modified")}
    //         {this.getFileTime(stats.birthtime, "Created")}
    //         {this.getFileTime(stats.atime, "Accessed")}
    //       </div>
    //     </div>
    //   </div>
    // )
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