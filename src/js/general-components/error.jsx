"use strict"
import React from 'react'
export default class Button extends React.Component {

  constructor(props) {
    super(props)
  }

 render() {

   let styles = {
     color: '#f00',
     padding: '20px'
   }

    return (
      <div style={styles}>
        <pre>
          {JSON.stringify(this.props.error, null, 2) }
        </pre>
      </div>
    )
  }
}
