import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { NAME, DEFAULT_VIEW_WIDTH } from '../vp-constants'
import ViewWrapper from './view-wrapper'
import Error from '../../general-components/error'
import ViewFolderList from '../../view-folder/view-folder-list'
import ViewDraftEditor from '../../view-draft/view-draft-editor'
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
        {this.renderViewFolders()}
        {this.renderViewFile()}
      </section>
    )
  }

  renderViewFile = () => {
    if(this.props.viewFilePath) {
      let styles = {left: 0}
      this.props.viewFolderList.forEach((dirState) => {
        styles.left = styles.left + this.state.widthStorage[dirState.path]
      })
      return <ViewFile.components.ViewFile styles={styles} path={this.props.viewFilePath} />
    }
  }

  renderViewFolders = () => {
    let views = null
    
    if(this.props.viewFolderList.length > 0) {

      let cssLeft = 0
      let prevFolder = null

      views = this.props.viewFolderList.map((dirState, index) => {
        cssLeft = cssLeft + this.state.widthStorage[prevFolder] || 0
        prevFolder = dirState.path
        
        let view = (dirState) => {
          if(dirState.error) {
            return <Error error={dirState.error} />
          } else {
            return <ViewDraftEditor path={dirState.path} />
            return <ViewFolderList path={dirState.path} />
          }
        }

        return (
          <ViewWrapper 
            key={dirState.path} 
            path={dirState.path} 
            initWidth={this.state.widthStorage[dirState.path] || DEFAULT_VIEW_WIDTH} 
            cssLeft={cssLeft} 
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
