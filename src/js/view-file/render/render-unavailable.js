import React from 'react'

export default class DisplayUnavailable extends React.Component {

  constructor(props) {
    super(props)
  }
  
  render() {
    return(
      <div className="render-unavailable">
          Sorry, no preview possible 
      </div>
    )
  }
}