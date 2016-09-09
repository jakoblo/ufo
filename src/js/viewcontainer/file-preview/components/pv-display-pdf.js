import React from 'react'
import FileObj from '../file'
import classnames from 'classnames'

export class DisplayPDF extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    
    let classes = classnames('display', 'pdf')
    
    return(
      <div className={classes}>
        <iframe src={'__dirname/../../../library/pdfjs-gh-pages/web/viewer.html?file='+this.props.baseFileObj.path.packed} />
      </div>
    )
  }
}