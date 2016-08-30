import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { NAME, DEFAULT_VIEW_WIDTH } from '../vc-constants'
import View from './view'
import Error from '../../general-components/error'
import DisplayList from '../../display/list/display-list'
import FS from '../../filesystem/fs-index'

@connect((state) => {
  let dirs = FS.selectors.getDirectorySeq(state)
  return {
    fsList: dirs.map((dir, index) => {
      return FS.selectors.getDirState(state, {path: dir})
    })
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
    
    if(this.props.fsList.length > 0) {

      let cssLeft = 0
      let prevFolder = null

      views = this.props.fsList.map((dirState, index) => {
        cssLeft = cssLeft + this.state.widthStorage[prevFolder] || 0
        prevFolder = dirState.path
        
        let display = (dirState) => {
          if(dirState.error) {
            return <Error error={dirState.error} />
          } else {
            return <DisplayList path={dirState.path} />
          }
        }

        return (
          <View 
            key={dirState.path} 
            path={dirState.path} 
            initWidth={this.state.widthStorage[dirState.path] || DEFAULT_VIEW_WIDTH} 
            cssLeft={cssLeft} 
            onResize={this.resizeHandle}
            ready={dirState.ready}
            error={dirState.error}
          >
            {display(dirState)}
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
