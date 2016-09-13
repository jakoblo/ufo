"use strict"
import {remote, Menu, MenuItem} from 'electron'
import React from 'react'
import Icon from '../general-components/icon'
import classNames from 'classnames'
import {ipcRenderer} from 'electron'

export default class FileItemDisplay extends React.Component {

  constructor(props) {
    super(props)
    this.dragOverTimeout = null
    this.state = {
      fileName: this.props.file.get('base'),
      editing: false
    }
  }

  render() {
    return (
      <span
        className={classNames({
          'file-item': true,
          'edit': this.state.editing,
          'folder': this.props.file.get('type') == "DIR", //@todo constant
          'file': this.props.file.get('type') == "FILE", //@todo constant
          'active': this.props.file.get('active'),
          'selected': this.props.file.get('selected'),
          'drag-target': this.props.file.get('dragTarget')
        })}
      >
        <span className="flex-box">
          <Icon glyph={classNames({
            'folder': this.props.file.get('type') == "DIR", //@todo constant
            'file': this.props.file.get('type') == "FILE" //@todo constant
          })}/>
          <label>
            <span className="base">{this.props.file.get('name')}</span>
            <span className="suffix">{this.props.file.get('suffix')}</span>
          </label>
        </span>
        <span className="eventCatcher" 
          draggable={true}
          onContextMenu={this.contextmenu}
          onMouseDown={this.props.onMouseDown}
          onMouseUp={this.props.onMouseUp}
          onDoubleClick={this.dbclick}
          onDragStart={this.props.onDragStart}
          onDragEnter={this.props.onDragEnter}
          onDragLeave={this.props.onDragLeave}
        />
      </span>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return nextProps.file !== this.props.file;
  }

  renameSave(event) {
    if(this.state.editing) {
      var val = this.state.file.get('fileName').trim()
      if (val != this.props.file.get('displayName')) {
        this.setState({fileName: val, editing: false})
        alert('do rename')
        this.props.onRename(val)
      } else {
        // this.renameCancel()
      }
    }
  }

  renameCancel() {
    this.setState({
      fileName: this.props.file.get('displayName'),
      editing: false
    });
  }

  renameStart() {
    this.setState({
      fileName: this.props.file.get('displayName'),
      editing: true
    })

    // Focus
    var node = ReactDOM.findDOMNode<HTMLInputElement>(this.refs["editField"]);
    node.focus();
    node.setSelectionRange(0, node.value.length);
  }

  renameKeyDown(event) {
    if (event.which === settings.key.escape) {
      this.renameCancel()
    } else if (event.which === settings.key.enter) {
      this.renameSave(event);
    }
  }

  renameChange(event) {
    this.setState({fileName: event.target.value});
  }

  contextmenu(event) {
    // event.preventDefault()
    // event.stopPropagation()

    // let menu = new Menu();
    // if(this.props.fileObj) {
    //   // VALID FILE
    //   menu.append(new MenuItem({ label: 'Open "' + this.props.fileObj.path.base + '"', click: this.props.fileObj.open.bind(this.props.fileObj) }))
    //   menu.append(new MenuItem({ label: 'Rename', click: this.renameStart.bind(this) }))
      
    //   if(Utils.Path.suffixType(this.props.fileObj.path.ext) == 'image') {
    //     menu.append(new MenuItem({ type: 'separator' }));
    //     if(this.props.status.displayImage) {
    //       menu.append(new MenuItem({ label: 'Hide Image', click: this.props.onShowImage.bind(this, !this.props.status.displayImage) }))
    //     } else {
    //       menu.append(new MenuItem({ label: 'Show Image', click: this.props.onShowImage.bind(this, !this.props.status.displayImage) }))
    //     }
    //   }
      
    //   menu.append(new MenuItem({ type: 'separator' }));
    //   if(!this.props.fileObj.type.link) {
    //     menu.append(new MenuItem({ label: 'Move to Trash', click: this.props.fileObj.toTrash.bind(this.props.fileObj) }));
    //   }
    //   menu.append(new MenuItem({ type: 'separator' }));
    //   menu.append(new MenuItem({label: 'Add to FavBar', click: this.props.fileObj.addToFavBar.bind(this.props.fileObj)}))
    // }
    // if(!this.props.fileObj || this.props.fileObj.type.link) {
    //   // BROKEN FILE or Link
    //   menu.append(new MenuItem({ label: 'Remove', click: this.props.onRemove }));
    // }
    // menu.popup(remote.getCurrentWindow());
  }
}
