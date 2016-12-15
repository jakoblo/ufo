import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { NAME, DEFAULT_VIEW_WIDTH } from '../vp-constants'
import ViewWrapper from './view-wrapper'
import Error from '../../general-components/error'
import ViewFolderList from '../../view-folder/view-folder-list'
import ViewDraftEditor from '../../view-folder/view-folder-editor'
import ViewFile from '../../view-file/vf-index'
import FS from '../../filesystem/watch/fs-watch-index'

@connect((state) => {
  let dirs = FS.selectors.getDirSeq(state)
  return {
    viewFolderList: dirs.map((dir, index) => {
      return FS.selectors.getDirState(state, {path: dir})
    }),
    viewFilePath: ViewFile.selectors.getViewFilePath(state)
  }
})
export default class ViewPlacer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <section ref="viewPlacer" className="view-placer">
        {this.renderViewFolders()}
        {this.renderViewFile()}
      </section>
    )
  }

  componentDidUpdate = () => {
    // Scroll to Right end
    var element = ReactDOM.findDOMNode(this.refs['viewPlacer']);
    var elementRect = element.getBoundingClientRect();
    element.scrollLeft = elementRect.width;
  }

  renderViewFile = () => {
    if(this.props.viewFilePath) {
      return <ViewFile.components.ViewFile path={this.props.viewFilePath} />
    }
  }

  renderViewFolders = () => {
    let views = null
    
    if(this.props.viewFolderList.length > 0) {

      let prevFolder = null

      views = this.props.viewFolderList.map((dirState, index) => {
        prevFolder = dirState.path
        
        let view = (dirState) => {
          if(dirState.error) {
            return <Error error={dirState.error} />
          } else {
            return <ViewDraftEditor path={dirState.path} ready={dirState.ready} />
          }
        }

        return ( 
          <ViewWrapper 
            key={dirState.path} 
            path={dirState.path}
            onResize={this.resizeHandle}
            ready={dirState.ready}
            error={dirState.error}
          >
            {view(dirState)}
          </ViewWrapper>
        )
      })
    }

    return views
  }
}
