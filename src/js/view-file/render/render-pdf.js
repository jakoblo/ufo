import React from 'react'

export default class DisplayPDF extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    
    return(
        <iframe className="renderer-pdf" src={'__dirname/../../../library/pdfjs-gh-pages/web/viewer.html?file='+this.props.path} />
    )
  }
}