import React from 'react'

export default class DisplayHTML extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return(
      <webview className="render-webview" src={this.props.path} />
    )
  }
}