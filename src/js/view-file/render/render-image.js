import React from 'react'

export default class DisplayImage extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {    
    return(
      <div className="render-image__container">
        <img className="render-image__img" src={this.props.path} />
      </div>
    )
  }
}