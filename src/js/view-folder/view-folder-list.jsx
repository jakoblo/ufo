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

const FolderDropTarget = {
  // reactDnD drop not useable
  // No modifer keys available
  // https://github.com/gaearon/react-dnd/issues/512
}

@connect(() => {
  const getFilesMergedOf = FsMergedSelector.getFilesMergedOf_Factory()
  return (state, props) => {
    return {
      focused: Filter.selectors.isFocused(state, props),
      folder: getFilesMergedOf(state, props),
      selected: Selection.selectors.getSelectionOf(state, props)
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
        
          {(this.props.ready) ?
            // <WindowScroller scrollElement={this.scrollWrapper}>
            //   {({ height, isScrolling, scrollTop }) => {
            //     return (
                <AutoSizer>
                  {({ width, height }) => (
                    <List
                      height={height}
                      width={width}
                      overscanRowCount={10}
                      noRowsRenderer={() => (
                        <div className="folder-display-list__empty-text">Folder is empty</div>
                      )}
                      rowCount={this.props.folder.size}
                      rowHeight={20}
                      rowRenderer={({index, isScrolling, key, style}) => (
                        <FileItem
                          key={key}
                          style={style}
                          file={this.props.folder.valueSeq().get(index)}
                          className="folder-list-item"
                          dispatch={this.props.dispatch}
                        />
                      )}
                      scrollToIndex={ (this.props.selected) ? 
                        this.props.folder.keySeq().indexOf( this.props.selected.last() ) : undefined 
                      }
                      containerStyle={{
                        marginTop: 40,
                        marginBottom: 40,
                        position: 'relative'
                      }}
                      className="folder-display-list__item-container"
                      // scrollTop={scrollTop}
                      tabIndex={-1}
                      forceToUpdate={Date.now()}
                    />
                  )}
                </AutoSizer>
            //   )}
            // }
            // </WindowScroller>
          :
            null
          }
        
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
      nextProps.folder !== this.props.folder || 
      nextProps.focused !== this.props.focused || 
      nextProps.ready !== this.props.ready
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
