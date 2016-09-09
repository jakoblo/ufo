import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { NAME, DEFAULT_VIEW_WIDTH } from './vc-constants'
import View from './vc-view'
import Error from '../general-components/error'
import DisplayList from './folder-display/list/display-list'
import Preview from './file-preview/pv-index'
import FS from '../filesystem/fs-index'

@connect((state) => {
  let dirs = FS.selectors.getDirectorySeq(state)
  return {
    fsList: dirs.map((dir, index) => {
      return FS.selectors.getDirState(state, {path: dir})
    }),
    preview: Preview.selectors.getPreview(state)
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
    return(
      <section className="viewContainer">
        {this.renderViews()}
        <div>
          {this.renderPreview()}
        </div>
      </section>
    )
  }

  renderPreview = () => {
    if(this.props.preview.get('path')) {
      debugger
      let PreviewComp = Preview.components.preview
      return <aside><PreviewComp path={this.props.preview.get('path')} /></aside>
    }
  }

  renderViews = () => {
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

    return views
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
