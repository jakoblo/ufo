import React from 'react'

export default class DisplayImage extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {    
    return(
      <div className="render-image__container">
        <div className="render-image__wrapper">
          <img className="render-image__img" src={this.props.path} />
        </div>
      </div>
    )
  }
}