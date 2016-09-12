import React from 'react'
import ReactDOM from 'react-dom'
import classnames from 'classnames'
import PsdJs from '../../../../library/psd.min'
var PSD = PsdJs('psd')

export default class DisplayPSD extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    let classes = classnames('display', 'psd', 'image')
    return(
      <div className={classes}>
        <div ref="imageContainer" className="wrapper"></div>
      </div>
    )
  }
  
  componentDidMount() {
    PSD.fromURL(this.props.path).then((psd) => {
      ReactDOM.findDOMNode(this.refs['imageContainer']).appendChild( psd.image.toPng() );
    });
  }
}