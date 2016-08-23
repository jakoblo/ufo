import React from 'react'
import ResizeSensor from './resize-sensor'

export default class View extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let styles = {
      left: this.props.cssLeft
    }
    return(
      <div className="view" ref={(c) => this.refView = c}  style={styles}>
        {this.props.children}
        <ResizeSensor onResize={this.resizeHandle} />
      </div>
    )
  }

  resizeHandle = () => {
    this.props.onResize(this.props.id, this.refView.offsetWidth)
  }
}
