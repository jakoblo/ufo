/**
 * sets dragEvent: dropEffect by modifier key
 * https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
 */

export function isFileDrag(event) {
  return (event.dataTransfer.files.length > 0)
}

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