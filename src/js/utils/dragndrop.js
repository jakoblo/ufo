import * as FsWriteActions from '../filesystem/write/fs-write-actions'
import _ from 'lodash'

let dragOverCache

export function getFilePathArray(event) {
  return Object.keys(event.dataTransfer.files).map(key => event.dataTransfer.files[key].path)
}

export function executeFileDrop(event, targetPath) {
  if(shouldAcceptDrop(event, [constants.TYPE_FILE])) {
    let pathArray = getFilePathArray(event)
    if(event.altKey) {
      FsWriteActions.copy(pathArray, targetPath)
    } else {
      FsWriteActions.move(pathArray, targetPath)
    }
  }
}

export function shouldAcceptDrop(event, acceptableTypes) {
  return (_.intersection(event.dataTransfer.types, acceptableTypes).length > 0)
}

function getCursorPosition(event) {
  if(event.clientY - event.currentTarget.getBoundingClientRect().top > event.currentTarget.offsetHeight / 2) {
    return constants.CURSOR_POSITION_BOTTOM
  } else {
    return constants.CURSOR_POSITION_TOP
  }
}

export function getEnhancedDropZoneListener(options) {

  const {
    acceptableTypes,
    possibleEffects,
    dragHover,
    dragOut,
    drop
  } = options

  return {
    onDragOver: (event) => {
      if(shouldAcceptDrop(event, acceptableTypes)) {
        event.preventDefault()
        event.stopPropagation()
        event.dataTransfer.dropEffect = getDropEffectByModifierKey(possibleEffects, event)
        
        const cursorPosition = getCursorPosition(event)
        if(cursorPosition != dragOverCache) {
          dragHover(cursorPosition, ...arguments)
          dragOverCache = cursorPosition
        }
      }
    },

    onDragEnd: function(event) {
      dragOverCache = false
      dragOut(dragOverCache, ...arguments)
    },

    onDragLeave: function(event) {
      const x = event.clientX
        , y = event.clientY
        , top    = event.currentTarget.offsetTop
        , bottom = top + event.currentTarget.offsetHeight
        , left   = event.currentTarget.offsetLeft
        , right  = left + event.currentTarget.offsetWidth;
      if(y <= top || y >= bottom || x <= left || x >= right) { 
        dragOverCache = false
        dragOut(dragOverCache, ...arguments)
      }
    },
    
    onDrop: function (event) {
      event.preventDefault()
      event.stopPropagation()
      drop(getCursorPosition(event), ...arguments)
    }
  }
}

export const constants = {
  TYPE_FILE: 'Files',
  CURSOR_POSITION_TOP: "CURSOR_POSITION_TOP",
  CURSOR_POSITION_BOTTOM: "CURSOR_POSITION_BOTTOM",
  effects: { 
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/effectAllowed
    NONE: 'none',
    COPY: 'copy',
    COPY_LINK: 'copyLink',
    COPY_MOVE: 'copyMove',
    LINK: 'link',
    LINK_MOVE: 'linkMove',
    MOVE: 'move',
    ALL: 'all'
  }
}

/**
 * dragEvent: dropEffect by modifier key
 * https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
 */

export function getDropEffectByModifierKey(possibleEffects, event) {

  const {effects} = constants

  // Handle special electron issue
  // The only allowed effect for File Drags is allways COPY
  // https://github.com/electron/electron/issues/7207
  if(shouldAcceptDrop(event, [constants.TYPE_FILE])) {
    return effects.COPY
  }

  switch (possibleEffects) {
    case effects.COPY:
      return effects.COPY
    
    case effects.MOVE:
      return effects.MOVE
      
    case effects.LINK:
      return effects.LINK
      
    case effects.NONE:
      return effects.NONE
      
    case effects.COPY_MOVE:
      return (event.altKey) ? effects.COPY : effects.MOVE
    
    case effects.COPY_LINK:
      return (event.altKey) ? effects.COPY : effects.LINK

    case effects.LINK_MOVE:
      return (event.ctrlKey || event.metaKey)  ? effects.LINK : effects.MOVE

    case effects.ALL:
      if(event.ctrlKey || event.metaKey){ 
        return effects.LINK
      } 
      else if (event.altKey) {
        return effects.COPY
      } else {
        return effects.MOVE
      }
  
    default:
      console.log(allowedDropEffect)
      throw 'No Valid allowed-drop-effect'
  }
}