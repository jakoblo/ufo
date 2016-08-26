import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { NAME, DEFAULT_VIEW_WIDTH } from '../vc-constants'
import View from './view'
import DisplayList from '../../display/list/display-list'

@connect((state) => {
  return {
    fs: state.fs
  }
})
export default class ViewContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      widthStorage: [] 
    }
  }

  render() {

    let views = null
    
    if(this.props.fs.size > 0) {

      let cssLeft = 0
      let prevFolder = null

      views = this.props.fs.map((folder, path) => {
        cssLeft = cssLeft + this.state.widthStorage[prevFolder] || 0
        prevFolder = path

        return (
          <View 
            key={path} 
            path={path} 
            initWidth={this.state.widthStorage[path] || DEFAULT_VIEW_WIDTH} 
            cssLeft={cssLeft} 
            onResize={this.resizeHandle}
            ready={folder.get('ready')}
          >
            <DisplayList path={path} />
          </View>
        )
      })
    }

    return(
      <section className="viewContainer">{views}</section>
    )
  }

  /**
   * View Child changes Size
   * Store that Size to the State
   */
  resizeHandle = (path, width) => {
    this.state.widthStorage[path] = width
    this.setState({
      widthStorage: this.state.widthStorage
    })
  }
}
