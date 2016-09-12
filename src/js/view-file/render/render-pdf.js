import React from 'react'
import classnames from 'classnames'

export default class DisplayPDF extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    
    let classes = classnames('display', 'pdf')
    
    return(
      <div className={classes}>
        <iframe src={'__dirname/../../../library/pdfjs-gh-pages/web/viewer.html?file='+this.props.path} />
      </div>
    )
  }
}