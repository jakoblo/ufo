import * as FsWriteActions from '../filesystem/write/fs-write-actions'

export function isFileDrag(event) {
  return (event.dataTransfer.files.length > 0)
}

/**
 * sets dragEvent: dropEffect by modifier key
 * https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
 */
export function setDropEffect(event) {
  event.dataTransfer.dropEffect = this.getDropEffect(event)
}

export function getDropEffect(event) {
  if(event.altKey) {
    return "copy"
  } else if(event.ctrlKey || event.metaKey) {
    return "link"
  } else {
    return "move"
  }
}

export function handleFileDrop(event, targetPath) {
  if(isFileDrag(event)) {
    let pathArray = Object.keys(event.dataTransfer.files).map(key => event.dataTransfer.files[key].path)
    if(event.altKey) {
      FsWriteActions.copy(pathArray, targetPath)
    } else {
      FsWriteActions.move(pathArray, targetPath)
    }
  }
}