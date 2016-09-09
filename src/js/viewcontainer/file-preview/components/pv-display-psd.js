import React from 'react'
import ReactDOM from 'react-dom'
import FileObj from '../file'
import classnames from 'classnames'
import PsdJs from '../../../../library/psd.min'
var PSD = PsdJs('psd')

export class DisplayPSD extends React.Component {

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
    PSD.fromURL(this.props.baseFileObj.path.packed).then((psd) => {
      ReactDOM.findDOMNode(this.refs['imageContainer']).appendChild( psd.image.toPng() );
    });
  }
}