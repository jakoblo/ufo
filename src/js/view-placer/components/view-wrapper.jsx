import React from 'react'
import ResizeSensor from './resize-sensor'
import classnames from 'classnames'

export default class ViewWrapper extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let styles = {
      // left: this.props.cssLeft,
      width: this.props.initWidth
    }
    let classes = classnames('view-wrapper', {
      ready: this.props.ready
    })
    let loading
    if(!this.props.ready && !this.props.error) {
      loading = null
    }
    return(
      <div className={classes} ref={(c) => this.refView = c}  style={styles}>
        {loading}
        {this.props.children}
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
