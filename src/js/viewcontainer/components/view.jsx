import React from 'react'
import { changeAppPath } from '../../app/app-actions'
import { connect } from 'react-redux'

@connect((store) => {
  return {fs: store.fs}
})
export default class View extends React.Component {
  constructor(props) {
    super(props)
  }

  addPath(path) {
    this.props.dispatch(changeAppPath(null, path) )
  }

  componentWillReceiveProps(nextProps) {
    console.log('props change', nextProps, nextProps.fs.toJS(), this.props.path)
  }

  render() {

    let styles = {
      left: this.props.leftDistance
    }

    console.log('render', this.props.fs.toJS(), this.props.path)
    console.log('loading', this.props.loading)

    let fileList = ""
    if(this.props.loading === false && this.props.fs.get(this.props.path)) {
      
      fileList = this.props.fs.get(this.props.path).toList().map((file, index) => {
        return ( <li onClick={this.addPath.bind(this, file.path)} key={index}>{file.base}</li> )
      })
    }

    return(
      <div className="view" style={styles}>
        {fileList}
      </div>
    )
  }
}
