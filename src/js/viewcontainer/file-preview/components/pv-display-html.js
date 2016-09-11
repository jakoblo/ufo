import React from 'react'
import classnames from 'classnames'

export default class DisplayHTML extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    
    let classes = classnames(
        'display',
        'html'
      )
    
    return(
      <div className={classes}>
        <iframe src={this.props.baseFileObj.path.packed} />
      </div>
    )
  }
}