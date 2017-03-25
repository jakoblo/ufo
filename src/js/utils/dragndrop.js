//@flow

import * as FsWriteActions from "../filesystem/write/fs-write-actions";
import _ from "lodash";

let dragOverCache: string = "";

export function getFilePathArray(event: SyntheticDragEvent): Array<string> {
  return Object.keys(event.dataTransfer.files).map(
    key => event.dataTransfer.files[key].path
  );
}

/**
 * Copy or Moves (event modifier key) the files of the drag event
 * to the given Folder if possible
 */
export function executeFileDropOnDisk(
  event: SyntheticDragEvent,
  targetPath: string
): void {
  if (shouldAcceptDrop(event, [constants.TYPE_FILE])) {
    let pathArray = getFilePathArray(event);
    if (event.altKey) {
      FsWriteActions.copy(pathArray, targetPath);
    } else {
      FsWriteActions.move(pathArray, targetPath);
    }
  }
}

/**
 * Check if dataTransfer.types is in the given values
 * https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/types
 */
export function shouldAcceptDrop(
  event: SyntheticDragEvent,
  acceptableTypes: string | Array<string>
): boolean {
  if (typeof acceptableTypes == "string") {
    acceptableTypes = [acceptableTypes];
  }
  return _.intersection(event.dataTransfer.types, acceptableTypes).length > 0;
}

/**
 * Is the mouse cursor close to the upper or lower edge of the drop target
 */
function getCursorPosition(event: any): string {
  if (
    event.clientY - event.currentTarget.getBoundingClientRect().top >
    event.currentTarget.offsetHeight / 2
  ) {
    return constants.CURSOR_POSITION_BOTTOM;
  } else {
    return constants.CURSOR_POSITION_TOP;
  }
}

/**
 * Drag & Drop events are anoying...
 * This function will return drag & drop listeners which will handle the anoying things
 * and then call the given callbacks in a clean way
 */
export function getEnhancedDropZoneListener(
  options: {
    acceptableTypes: string | Array<string>,
    possibleEffects: string,
    dragHover: (event: SyntheticDragEvent, cursorPosition: string) => void,
    dragOut: (event: SyntheticDragEvent) => void,
    drop: (event: SyntheticDragEvent, cursorPosition: string) => void
  }
): {
  onDragOver: Function,
  onDragLeave: Function,
  onDrop: Function
} {
  const {
    acceptableTypes,
    possibleEffects,
    dragHover,
    dragOut,
    drop
  } = options;

  return {
    onDragOver: (event: SyntheticDragEvent) => {
      if (shouldAcceptDrop(event, acceptableTypes)) {
        event.preventDefault();
        event.stopPropagation();
        event.dataTransfer.dropEffect = getDropEffectByModifierKey(
          possibleEffects,
          event
        );

        const cursorPosition = getCursorPosition(event);
        if (cursorPosition != dragOverCache) {
          dragHover(event, cursorPosition);
          dragOverCache = cursorPosition;
        }
      }
    },

    onDragLeave: (event: any) => {
      const x = event.clientX,
        y = event.clientY,
        top = event.currentTarget.offsetTop,
        bottom = top + event.currentTarget.offsetHeight,
        left = event.currentTarget.offsetLeft,
        right = left + event.currentTarget.offsetWidth;
      if (y <= top || y >= bottom || x <= left || x >= right) {
        dragOverCache = "";
        dragOut(event);
      }
    },

    onDrop: (event: SyntheticDragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      dragOverCache = "";
      dragOut(event);
      drop(event, getCursorPosition(event));
    }
  };
}

export const constants = {
  TYPE_FILE: "Files",
  CURSOR_POSITION_TOP: "CURSOR_POSITION_TOP",
  CURSOR_POSITION_BOTTOM: "CURSOR_POSITION_BOTTOM",
  effects: {
    // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/effectAllowed
    NONE: "none",
    COPY: "copy",
    COPY_LINK: "copyLink",
    COPY_MOVE: "copyMove",
    LINK: "link",
    LINK_MOVE: "linkMove",
    MOVE: "move",
    ALL: "all"
  }
};

/**
 * dragEvent: dropEffect by modifier key
 * https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect
 */

export function getDropEffectByModifierKey(
  possibleEffects: string,
  event: SyntheticDragEvent
) {
  const { effects } = constants;

  // Handle special electron issue
  // The only allowed effect for File Drags is allways COPY
  // https://github.com/electron/electron/issues/7207
  if (shouldAcceptDrop(event, [constants.TYPE_FILE])) {
    return effects.COPY;
  }

  switch (possibleEffects) {
    case effects.COPY:
      return effects.COPY;

    case effects.MOVE:
      return effects.MOVE;

    case effects.LINK:
      return effects.LINK;

    case effects.NONE:
      return effects.NONE;

    case effects.COPY_MOVE:
      return event.altKey ? effects.COPY : effects.MOVE;

    case effects.COPY_LINK:
      return event.altKey ? effects.COPY : effects.LINK;

    case effects.LINK_MOVE:
      return event.ctrlKey || event.metaKey ? effects.LINK : effects.MOVE;

    case effects.ALL:
      if (event.ctrlKey || event.metaKey) {
        return effects.LINK;
      } else if (event.altKey) {
        return effects.COPY;
      } else {
        return effects.MOVE;
      }

    default:
      throw "No Valid allowed-drop-effect";
  }
}
