import React from 'react'
import ResizeSensor from './resize-sensor'
import classnames from 'classnames'

export default class View extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let styles = {
      left: this.props.cssLeft,
      width: this.props.initWidth
    }
    let classes = classnames('view', {
      ready: this.props.ready
    })
    return(
      <div className={classes} ref={(c) => this.refView = c}  style={styles}>
        {this.props.ready}
        {this.props.children}
        <ResizeSensor onResize={this.resizeHandle} />
      </div>
    )
  }

  resizeHandle = () => {
    this.props.onResize(this.props.path, this.refView.offsetWidth)
  }
}
