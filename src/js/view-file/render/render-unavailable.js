import React from 'react'

import electron from 'electron'
const {app} = electron.remote
export default class DisplayUnavailable extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      previewImage: null
    }
    this.requestIcon(this.props.path)
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.path != nextProps.path) {
      this.requestIcon(nextProps.path)
    }
  }

  requestIcon = (path) => {
    console.log(path)
    app.getFileIcon(path, (error, image) => {
      this.setState({
        previewImage: 'data:image/png;base64,' + image.toPNG().toString('base64')
      })
    })
  }
  
  render() {

    return(
      <div className="render-unavailable">
          <img src={this.state.previewImage} />
      </div>
    )
  }
}