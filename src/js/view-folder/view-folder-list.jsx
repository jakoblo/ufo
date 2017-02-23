import React from 'react'
import { connect } from 'react-redux'
import * as FsMergedSelector from  '../filesystem/fs-merged-selectors'
import FileItem from '../file-item/components/file-item'
import FilterTypeInput from '../filesystem/filter/components/filter-type-input'
import Selection from '../filesystem/selection/sel-index'
import Filter from '../filesystem/filter/filter-index'
import App from '../app/app-index'
import classnames from 'classnames'
import _ from 'lodash'
import nodePath from 'path'
import {Map} from 'immutable'
import Button from '../general-components/button'
import fsWrite from '../filesystem/write/fs-write-index'
import { dragndrop } from '../utils/utils-index'
import { DropTarget } from 'react-dnd'
import { NativeTypes } from 'react-dnd-html5-backend'
import { List, AutoSizer, WindowScroller } from 'react-virtualized'

const DEFAULT_WIDTH = 235
const PADDING_TOP = 50
const PADDING_BOTTOM = 30

const FolderDropTarget = {
  // reactDnD drop not useable
  // No modifer keys available
  // https://github.com/gaearon/react-dnd/issues/512
}

@connect(() => {
  const getFiltedBaseArrayOfFolder = FsMergedSelector.getFiltedBaseArrayOfFolder_Factory()
  return (state, props) => {
    const {path} = props
    return {
      focused: Filter.selectors.isFocused(state, path),
      fileList: getFiltedBaseArrayOfFolder(state, path),
      selected: Selection.selectors.getSelectionOfFolder(state, path)
    }
  }
})
@DropTarget(NativeTypes.FILE, FolderDropTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOverCurrent: monitor.isOver({ shallow: true })
}))
export default class DisplayList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      width: DEFAULT_WIDTH
    }
  }

  render() {
    return this.props.connectDropTarget(
      <div className={
          classnames({
            'folder-display-list': true,
            'folder-display-list--drop-target': this.props.isOverCurrent,
            'folder-display-list--focused': this.props.focused
          })
        }
        onDrop={e => dragndrop.handleFileDrop(e, this.props.path)}
      >
        <div className="folder-display-list__toolbar-top">
          <div className="folder-display-list__name">
            {nodePath.basename(this.props.path)}
          </div>
        </div>
            <AutoSizer>
              {({ width, height }) => (
                <List
                  height={(height - PADDING_TOP - PADDING_BOTTOM)}
                  width={width}
                  style={{
                    // I overwrite the box-sizing to content-box to able to use the height without the padding
                    boxSizing: 'content-box',
                    // now we add padding and the file height of the list, will be the same as the Autosizer
                    paddingTop: PADDING_TOP,
                    paddingBottom: PADDING_BOTTOM
                  }}
                  containerStyle={{position: 'relative'}} // With position relative, the items position themselves at the innercontainer
                  className="folder-display-list__item-container"
                  overscanRowCount={10}
                  noRowsRenderer={() => (
                    <div className="folder-display-list__empty-text">Folder is empty</div>
                  )}
                  rowCount={this.props.fileList.length}
                  rowHeight={20}
                  rowRenderer={({index, isScrolling, key, style}) => (
                    <FileItem
                      key={key}
                      style={style}
                      path={nodePath.join(this.props.path, this.props.fileList[index])}
                      className="folder-list-item"
                      dispatch={this.props.dispatch}
                    />
                  )}
                  scrollToIndex={ (this.props.selected) ? 
                    this.props.fileList.indexOf( this.props.selected.last() ) : undefined 
                  }
                  tabIndex={-1}
                  forceToUpdate={Date.now()}
                />
            )}
            </AutoSizer>
        <div className="folder-display-list__toolbar-bottom">
          <button
            className="folder-display-list__button-add-folder" 
            onClick={() => {
              this.props.dispatch( fsWrite.actions.newFolder(this.props.path) )
            }}
          />
          <FilterTypeInput path={this.props.path} />
        </div>
      </div>  
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return (
      nextProps.fileList !== this.props.fileList || 
      nextProps.focused !== this.props.focused
    )
  }
  
  setImmState(fn) {
    // https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state
    return this.setState(({data}) => ({
      data: fn(data)
    }));
  }

  /**
   * focus
   * @memberOf DisplayList
   * A click in the "Whitespace" of a Folderview 
   * "Focus" the Folder show that one as the last one
   * (behaviour from finder)
   */
  focus = (event) => {
    this.props.dispatch( App.actions.changeAppPath(null, this.props.path) )
  }
}
