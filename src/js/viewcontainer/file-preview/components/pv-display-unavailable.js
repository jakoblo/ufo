import React from 'react'
import FileObj from '../../file'

export class DisplayUnavailable extends React.Component {

  constructor(props) {
    super(props)
  }
  
  render() {
    return(
      <div className="display unavailable">
          <h4>Sorry, no preview possible</h4>
      </div>
    )
  }
}