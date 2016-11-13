import React from 'react'
import ResizeSensor from './resize-sensor'
import classnames from 'classnames'

export default class ViewWrapper extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let classes = classnames('view-wrapper', {
      'view-wrapper--ready': this.props.ready
    })
    let loading
    if(!this.props.ready && !this.props.error) {
      loading = null
    }
    return(
      <div className={classes} ref={(c) => this.refView = c}>
        {loading}
        {this.props.children}
      </div>
    )
  }
}
