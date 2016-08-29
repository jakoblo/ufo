/// <reference path="../typings/typings.d.ts" />
"use strict"
import {remote, Menu, MenuItem} from 'electron'
import React from 'react'
import Icon from '../../general-components/icon'
import classNames from 'classnames'
import {ipcRenderer} from 'electron'

export default class FileItemDisplay extends React.Component {

  constructor(props) {
    super(props)
    this.dragOverTimeout = null
    this.state = {
      fileName: this.props.base,
      editing: false
    }
  }

  render() {
    let classes = classNames({
      'file-item': true,
      'processed': true,
      'edit': this.state.editing,
      'folder': this.props.type == "DIR",
      'file': this.props.type == "FILE",
      'selected': this.props.selected || this.props.active,
      'dragging': this.props.dragging
    })

    let prefixIconClass = classNames({
      'folder': this.props.type == "DIR",
      'file': this.props.type == "FILE"
    })

    return (
      <span
        className={classes}
        draggable={true}
        onMouseDown={this.mousedown.bind(this)}
        onMouseUp={this.mouseup.bind(this)}
        onDoubleClick={this.dbclick.bind(this)}
        onContextMenu={this.contextmenu.bind(this)}
        onDragStart={this.onDragStart.bind(this)}
      >
        <span className="flex-box">
          <Icon glyph={prefixIconClass}/>
          <label>
            <span className="base">{this.props.name}</span>
            <span className="suffix">{this.props.suffix}</span>
          </label>
          <input
            ref="editField"
            className="edit"
            onMouseDown={this.stopEvent} // prevent select function: cm focus = blur
            onMouseUp={this.stopEvent}   // prevent select function: cm focus = blur
            value={this.state.fileName}
            onChange={ e => this.renameChange(e) }
            onBlur={ e => this.renameSave(e) }
            onKeyDown={ e => this.renameKeyDown(e) }
          />
        </span>
      </span>
    )
  }

  onDragStart(e) {
    e.preventDefault()
    ipcRenderer.send('ondragstart', this.props.path)
  }

  renameSave(event) {
    if(this.state.editing) {
      var val = this.state.fileName.trim()
      if (val != this.props.displayName) {
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
      fileName: this.props.displayName,
      editing: false
    });
  }

  renameStart() {
    this.setState({
      fileName: this.props.displayName,
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

  /**
   * Open View
   */
  mouseup(event) {
    if(event.button === 0 && !this.state.editing) {
      if(!event.metaKey && !event.shiftKey && !event.crtlKey) {
        
      }
    }
  }

  /**
   * Select
   */
  mousedown(event) {
    
    if(event.button === 0) { // Left Mouse Button
      let reset
      if(this.props.selected === false && !event.metaKey && !event.shiftKey && !event.crtlKey) {
        // Not already a part of the selection an no modifier key, clear selection
        reset = true
      } else {
        reset = false
      }
      this.props.onClick()
    }
  }

  /**
   * Open File/Folder
   */
  dbclick(event) {
    if(this.props.fileObj && !this.state.editing) {
      // this.props.fileObj.open()
    }
  }

  addToFavBar(path) {
    // let config = Configuration
    // config.saveSettings('favbar',path)
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
