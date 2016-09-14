function renameSave(event) {
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

function renameCancel() {
    this.setState({
      fileName: this.props.file.get('displayName'),
      editing: false
    });
  }

function renameStart() {
  this.setState({
    fileName: this.props.file.get('displayName'),
    editing: true
  })

  // Focus
  var node = ReactDOM.findDOMNode<HTMLInputElement>(this.refs["editField"]);
  node.focus();
  node.setSelectionRange(0, node.value.length);
}

function renameKeyDown(event) {
  if (event.which === settings.key.escape) {
    this.renameCancel()
  } else if (event.which === settings.key.enter) {
    this.renameSave(event);
  }
}

function renameChange(event) {
  this.setState({fileName: event.target.value});
}