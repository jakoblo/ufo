import React from 'react'
import { connect } from 'react-redux'
import * as FsMergedSelector from  '../../filesystem/fs-merged-selectors'
import FileItem from '../../file-item/components/file-item'
import Selection from '../../filesystem/selection/sel-index'
import Filter from '../../filesystem/filter/filter-index'
import App from '../../app/app-index'
import classnames from 'classnames'
import _ from 'lodash'
import nodePath from 'path'
import { dragndrop } from '../../utils/utils-index'
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
// @DropTarget(NativeTypes.FILE, FolderDropTarget, (connect, monitor) => ({
//   connectDropTarget: connect.dropTarget(),
//   isOverCurrent: monitor.isOver({ shallow: true })
// }))
export default class DisplayList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      width: DEFAULT_WIDTH
    }
  }

  render() {

    return (
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
            className="view-folder__item-container"
            overscanRowCount={10}
            noRowsRenderer={() => (
              <div className="view-folder__empty-text">Folder is empty</div>
            )}
            rowCount={this.props.fileList.length}
            rowHeight={20}
            rowRenderer={({index, isScrolling, key, style}) => (
              <FileItem
                key={key}
                style={style}
                path={nodePath.join(this.props.path, this.props.fileList[index])}
                className="view-folder-item"
                dispatch={this.props.dispatch}
                onShiftClick={this.handleExpandSelection}
                onCtrlMetaClick={this.handleAddtoSelection}
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


  handleExpandSelection = (base, file) => {
    if(this.props.selected.size > 0) {
      
      const {fileList, selected, path} = this.props
      
      let lastSelectionIndex  = fileList.indexOf( selected.last() )
      let currentIndex        = fileList.indexOf( base )

      let start, end
      if (lastSelectionIndex < currentIndex) { 
        start = lastSelectionIndex + 1
        end = currentIndex + 1
      } else {
        start = currentIndex
        end = lastSelectionIndex
      }

      let newSelected = _.slice(fileList, start, end).map((base) => {
        return nodePath.join(path, base)
      })

      this.props.dispatch( Selection.actions.filesAdd( newSelected ) )
    } else {
      this.props.dispatch( Selection.actions.filesAdd( [nodePath.join(this.props.path, base)] ) )
    }
  }

  handleAddtoSelection = (base, file) => {
    this.props.dispatch( Selection.actions.filesAdd( [file.get('path')] ) )
  }
}
