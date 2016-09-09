import React from 'react'
import DisplayImage from './pv-display-image'

export default class Preview extends React.Component {
  
  constructor(props) {
    super(props)
  }

  render() {
    return <DisplayImage path={this.props.path} />
  }
} 