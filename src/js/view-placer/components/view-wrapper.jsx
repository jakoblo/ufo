import React from 'react'
import ResizeSensor from './resize-sensor'
import classnames from 'classnames'

export default class ViewWrapper extends React.Component {
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
    let loading
    if(!this.props.ready && !this.props.error) {
      loading = <div className="loading-cube">
                  <div className="sk-cube1 sk-cube"></div>
                  <div className="sk-cube2 sk-cube"></div>
                  <div className="sk-cube4 sk-cube"></div>
                  <div className="sk-cube3 sk-cube"></div>
                </div>
    }
    return(
      <div className={classes} ref={(c) => this.refView = c}  style={styles}>
        {this.props.ready}
        {this.props.children}
        {loading}
        <ResizeSensor onResize={this.resizeHandle} />
      </div>
    )
  }

  resizeHandle = () => {
    if(this.refView) {
      this.props.onResize(this.props.path, this.refView.offsetWidth)
    }
  }
}
