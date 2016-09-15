export function onMouseDown(event) {
  event.stopPropagation();
}

export function onMouseUp(event) {
  event.stopPropagation();
}

export function onBlur(event) {
  renameSave.call(this, event)
}

export function onKeyDown(event) {
  if (event.which === 27) {  // Escape
    renameCancel.call(this, event)
  } else if (event.which === 13) { // Enter
    renameSave.call(this, event);
  }
}

export function onChange(event) {
  event.persist()
  console.log(event.target.value)
  this.setImmState((prevState) => (prevState.set('fileName', event.target.value)))
}

function renameSave(event) {
  if(this.state.data.get('editing')) {
    var val = this.state.data.get('fileName').trim()
    if (val != this.props.file.get('base')) {
      this.setImmState((prevState) => (
        prevState
        .set('fileName', val)
        .set('editing', false)
      ))
    } else {
      renameCancel.call(this, event)
    }
  }
}



function renameCancel() {
    this.setImmState((prevState) => (
      prevState
      .set('fileName', this.props.file.get('base'))
      .set('editing', false)
    ))
  }

// function renameStart() {
//   this.setState({
//     fileName: this.props.file.get('displayName'),
//     editing: true
//   })

//   // Focus
//   var node = ReactDOM.findDOMNode<HTMLInputElement>(this.refs["editField"]);
//   node.focus();
//   node.setSelectionRange(0, node.value.length);
// }