import fsWrite from '../../filesystem/write/fs-write-index'
import nodePath from 'path'

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
      fsWrite.actions.rename(
        this.props.file.get('path'),
        nodePath.join(this.props.file.get('root'), val) 
      )
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