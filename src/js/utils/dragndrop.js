import * as FsWriteActions from '../filesystem/write/fs-write-actions'
import _ from 'lodash'

let dragOverCache

/**
 * @param  {DragEvent} event
 * @returns {Array<string>} - full file paths
 */
export function getFilePathArray(event) {
  return Object.keys(event.dataTransfer.files).map(key => event.dataTransfer.files[key].path)
}


/**
 * Copy or Moves (event modifier key) the files of the drag event
 * to the given Folder if possible
 * 
 * @param {DragEvent} event
 * @param {string} targetPath - full folder path
 */
export function executeFileDropOnDisk(event, targetPath) {
  if(shouldAcceptDrop(event, [constants.TYPE_FILE])) {
    let pathArray = getFilePathArray(event)
    if(event.altKey) {
      FsWriteActions.copy(pathArray, targetPath)
    } else {
      FsWriteActions.move(pathArray, targetPath)
    }
  }
}


/**
 * Check if dataTransfer.types is in the given values
 * https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
 * 
 * @param {DragEvent} event
 * @param {Array<string> || string} acceptableTypes
 * @returns {boolean}
 */
export function shouldAcceptDrop(event, acceptableTypes) {
  if(typeof acceptableTypes == "string") {
    acceptableTypes = [acceptableTypes]
  }
  return (_.intersection(event.dataTransfer.types, acceptableTypes).length > 0)
}


/**
 * Is the mouse cursor close to the upper or lower edge of the drop target 
 * 
 * @param {DragEvent} event
 * @returns {CURSOR_POSITION_BOTTOM || CURSOR_POSITION_TOP}
 */
function getCursorPosition(event) {
  if(event.clientY - event.currentTarget.getBoundingClientRect().top > event.currentTarget.offsetHeight / 2) {
    return constants.CURSOR_POSITION_BOTTOM
  } else {
    return constants.CURSOR_POSITION_TOP
  }
}



/**
 * Drag & Drop events are anoying...
 * This function will return drag & drop listeners which will handle the anoying things 
 * and then call the given callbacks in a clean way
 * 
 * @param {Object}        options
 * @param {Array<string>} options.acceptableTypes - e.g. constants.TYPE_FILE
 * @param {string}        options.possibleEffects - see constants.effects
 * @param {dragCallback}  options.dragHover - normalized dragEnter, calls again if the cursor position changes
 * @param {dragCallback}  options.dragOut - normalized dragLeave
 * @param {dragCallback}  options.drop - onDrop with cursorPosition
 * @returns {Object<Listeners>}
 */
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
          dragHover(event, cursorPosition)
          dragOverCache = cursorPosition
        }
      }
    },

    onDragLeave: (event) => {
      const x = event.clientX
        , y = event.clientY
        , top    = event.currentTarget.offsetTop
        , bottom = top + event.currentTarget.offsetHeight
        , left   = event.currentTarget.offsetLeft
        , right  = left + event.currentTarget.offsetWidth;
      if(y <= top || y >= bottom || x <= left || x >= right) { 
        dragOverCache = false
        dragOut(dragOverCache, event)
      }
    },
    
    onDrop: (event) => {
      event.preventDefault()
      event.stopPropagation()
      dragOverCache = false
      dragOut(dragOverCache, event)
      drop(event, getCursorPosition(event))
    }
  }
}

/**
 * @callback dragCallback
 * @param {string} cursorPosition
 * @param {DragEvent} event
 */

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