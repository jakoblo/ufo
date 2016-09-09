import React from 'react'
import FileObj from '../file'
import classnames from 'classnames'

export class DisplayHTML extends React.Component {

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