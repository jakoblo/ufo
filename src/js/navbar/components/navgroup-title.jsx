"use strict"
import React from 'react'
import classnames from 'classnames'
import Button from '../../general-components/button'
import { DragSource } from 'react-dnd'
import { DnDTypes } from '../navbar-constants'
 /**
const groupSource = {
  canDrag(props) {
    // You can disallow drag based on props
    return !props.isDiskGroup;
  },

  isDragging(props, monitor) {
    // If your component gets unmounted while dragged
    // (like a card in Kanban board dragged between lists)
    // you can implement something like this to keep its
    // appearance dragged:
    return monitor.getItem().id === props.id;
  },

  beginDrag(props, monitor, component) {
    // Return the data describing the dragged item
    const item = { groupID: props.groupID, index: props.index }
    return item
  },

  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      return;
    }

    // When dropped on a compatible target, do something.
    // Read the original dragged item from getItem():
    const item = monitor.getItem();

    // You may also read the drop result from the drop target
    // that handled the drop, if it returned an object from
    // its drop() method.
    const dropResult = monitor.getDropResult();

    // This is a good place to call some Flux action
   // CardActions.moveCardToList(item.id, dropResult.listId);
  }
}
*/
const groupSource = {
  beginDrag(props) {
    return {
      id: props.groupID,
      index: props.index
    };
  }
};

@DragSource(DnDTypes.NAVGROUP, groupSource, (connect, monitor) => ({
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDragSource: connect.dragSource(),
  // You can ask the monitor about the current drag state:
  isDragging: monitor.isDragging()
}))
export default class NavGroupTitle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {editGroupTitle: false}
  }

   render() {
   let title = <span className="nav-group-text" 
   onDoubleClick={!this.props.isDiskGroup && this.handleDoubleClick}
   onContextMenu={this.props.onContextMenu}
   >{this.props.title}</span>
   
   if(this.state.editGroupTitle) {
     title = <input ref="input" onBlur={this.handleOnBlur} defaultValue={this.props.title} onKeyDown={this.handleKeyDown}></input>
   }
  const connectDragSource = this.props.connectDragSource
  return connectDragSource(
      <div className="nav-group-title">
        {title}
        <Button className="nav-group-hide" onClick={this.props.onToggleGroup} text={this.props.hideButtonText}/>
      </div>
    )
  }

  componentDidUpdate(prevProps, prevState) {
    this.refs.input && this.refs.input.focus();
  }

  handleDoubleClick = () => {
    this.setState({editGroupTitle: true})
  }

  changeTitle(e) {
    if(e.keyCode === 13 || e.type === 'blur') {
      if(this.props.title != e.target.value && e.target.value != '') {
      this.props.onGroupTitleChange(e.target.value)
      }
      this.setState({editGroupTitle: false})
    }
  }

  handleKeyDown = (e) => {
    this.changeTitle(e)
  }

  handleOnBlur = (e) => {
    this.changeTitle(e)
  }

}
