import React from 'react'
import fs from 'fs'

export default class Editor extends React.Component {
  
  constructor(props) {
    super(props)

    this.state = {
      content: 'loading...'
    }

    this.loadFile(this.props.path)  
  }
  
  render() {
    return (
      <code className="render-plain-text">
        {this.state.content}
      </code>
    )
  }

  componentWillReceiveProps = (nextProps) => {
    this.loadFile(nextProps.path)
  }

  loadFile = (path) => {
    fs.readFile(path, 'utf8', (err, data) => {
      console.log('done')
      this.setState({
        content: err || data
      })
    });
  }

}
