import React from 'react'
import ReactDOM from 'react-dom'
import {ipcRenderer} from 'electron'
import nodePath from 'path'

// import CodeMirror from 'codemirror'

// require("codemirror/addon/mode/loadmode")
// require("codemirror/mode/meta")
// require("codemirror/addon/mode/overlay") // Important for mdfile.js
// require("codemirror/addon/hint/show-hint"); // Important for mdfile.js


/**
 * Creates the TextCodeMirror which is able to Display and handle Files
 * Using SimpleMDE and Codemirror
 */

export default class Editor extends React.Component {
  
  constructor(props) {
    super(props)
    this.state = {
      value: "",
      conf: {
        value: "",
        lineWrapping: true,
        lineNumbers: false,
        theme: "mdn-like"
      }
    }
    // CodeMirror.modeURL = "codemirror/mode/%N/%N.js";
    // this.loadMode(nodePath.basename(this.props.path))
  }
  
  render() {
    
    let fileContent = this.loadFile()
    
    return (
      <div className="display editor">
        <div className="toolbar">toolbar</div>
        <textarea ref={(c) => this.refTextarea = c} defaultValue={fileContent} />
      </div>
    )
  }
  
  componentDidMount() {
    // this.codemirror = CodeMirror.fromTextArea(this.refTextarea, this.state.conf);
    // this.codemirror.setOption("mode", this.state.spec);
    // CodeMirror.autoLoadMode(this.codemirror, this.state.mode);
    // setTimeout(() => {
    //   this.codemirror.refresh();
    // },1);
  }
  
  shouldComponentUpdate(nextProps, nextState) {
    return false
  }
  
  loadFile() {
    if(this.props.baseFileObj) {
      return Utils.File.readFile(this.props.baseFileObj.path.packed)
    }
  }
  
  saveFile() {
    let fileContent = this.codemirror.getDoc().getValue()
    ipcRenderer.send('writeFile', this.props.baseFileObj.path.packed, fileContent)
  }
  
  loadMode(detectString) {  
    
    // https://codemirror.net/demo/loadmode.html
    
    var val = detectString, m;
    if (m = /.+\.([^.]+)$/.exec(val)) {
      var info = CodeMirror.findModeByExtension(m[1]);
      
      if (info) {
        this.state.mode = info.mode;
        this.state.spec = info.mime;
      }
    } else if (/\//.test(val)) {
      var info = CodeMirror.findModeByMIME(val);
      if (info) {
        this.state.mode = info.mode;
        this.state.spec = val;
      }
    } else {
      this.state.mode = this.state.spec = val;
    }
    if (this.state.mode) {
      this.setupMode(this.state.mode);
    } else {
      console.log("Preview Display Editor: Could not find a mode corresponding to " + val);
    }
  }
  
  setupMode(mode) {
    switch (mode) {
      default:
        this.state.conf.lineWrapping = true,
        this.state.conf.lineNumbers = true
        break;
    }
  }
}
