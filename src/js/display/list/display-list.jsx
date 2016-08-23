import React from 'react'
import { changeAppPath } from '../../app/app-actions'
import { connect } from 'react-redux'

@connect((store) => {
  return {fm: store.fm}
})
export default class DisplayList extends React.Component {
  constructor(props) {
    super(props)
  }

  addPath(path) {
    this.props.dispatch(changeAppPath(null, path) )
  }

  render() {
    let fileList = ""
    let active = this.props.fm.getIn([this.props.path, 'active'])
    if(this.props.loading === false && this.props.fm.getIn([this.props.path, 'files'])) {
      fileList = this.props.fm.getIn([this.props.path, 'files']).map((file, index) => {
        let styles = {}
        if(active && file.base == active) {
          styles = {
            fontWeight: 'bold'
          }
        }
        return ( <li style={styles} onClick={this.addPath.bind(this, file.path)} key={index}>{file.base}</li> )
      })
    }

    return(
      <ul>
        {fileList}
      </ul>
    )
  }
}
