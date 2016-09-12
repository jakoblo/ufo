import React from 'react'
import classnames from 'classnames'

export default class DisplayImage extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    let classes = classnames(
        'display',
        'image'
      )
    
    return(
      <div className={classes}>
        <div className="wrapper">
          <img src={this.props.path}></img>
        </div>
      </div>
    )
  }
}