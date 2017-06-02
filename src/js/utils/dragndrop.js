//@flow

import * as FsWriteActions from "../filesystem/write/fs-write-actions";
import _ from "lodash";

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
 *
 * you have to event.preventDefault(); in the dragHover callback if you want to get drop
 * Or not, if you want to pass the drop to children (used by navbar-items)
 */
export function getEnhancedDropZoneListener(options: {
  acceptableTypes: string | Array<string>,
  possibleEffects: string,
  dragHover: (event: SyntheticDragEvent, cursorPosition: string) => void,
  dragOut: (event: SyntheticDragEvent) => void,
  drop: (event: SyntheticDragEvent, cursorPosition: string) => void
}): {
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
        if (event.isDefaultPrevented()) {
          dragOut(event);
          return;
        }

        event.dataTransfer.dropEffect = getDropEffectByModifierKey(
          possibleEffects,
          event
        );

        const cursorPosition = getCursorPosition(event);
        dragHover(event, cursorPosition);
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
        dragOut(event);
      }
    },

    onDrop: (event: SyntheticDragEvent) => {
      if (shouldAcceptDrop(event, acceptableTypes)) {
        dragOut(event);
        drop(event, getCursorPosition(event));
      }
    }
  };
}
/**
 * Drag & Drop events are anoying...
 * This function will return drag & drop listeners which will handle the anoying things
 * and then call the given callbacks in a clean way
 *
 * you have to event.preventDefault(); in the hoverEventProcessor callback if you want to get drop
 * Or not, if you want to pass the drop to children (used by navbar-items)
 */
export function getPerformantDropZoneListener(options: {
  acceptableTypes: string | Array<string>,
  possibleEffects: string, // see constants.effects

  // The EventProcess handels the event (preventDefault, stopPropagation etc.)
  // And can return a render callback wich is called with performance improvments
  hoverEventProcessor: (
    event: SyntheticDragEvent
  ) => (cursorPosition: string) => any,
  outEventProcessor: (event: SyntheticDragEvent) => () => any,

  drop: (event: SyntheticDragEvent, cursorPosition: string) => void
}): {
  onDragOver: Function,
  onDragLeave: Function,
  onDrop: Function
} {
  const {
    acceptableTypes,
    possibleEffects,
    hoverEventProcessor,
    outEventProcessor,
    drop
  } = options;

  const clear = event => {
    const outRender = outEventProcessor(event);
    enterTimeStamp = 0;
    if (outRender && hover) {
      hover = false;
      requestAnimationFrame(() => {
        if (hover == false) {
          // Check if still out, (maybe onDragOver way called since the requestAnimationFrame)
          outRender();
        }
      });
    }
  };

  let enterTimeStamp = 0;
  let hover = false;
  return {
    onDragOver: (event: SyntheticDragEvent) => {
      if (shouldAcceptDrop(event, acceptableTypes)) {
        if (event.isDefaultPrevented()) {
          // Child Element is catching the drop
          // call out to
          clear(event);
          return;
        }

        event.dataTransfer.dropEffect = getDropEffectByModifierKey(
          possibleEffects,
          event
        );

        const hoverRender = hoverEventProcessor(event);

        if (enterTimeStamp == 0) {
          // First Hover Event. Lets wait for the next events, before render
          enterTimeStamp = event.timeStamp;
          return;
        }

        if (hoverRender && enterTimeStamp + 25 < event.timeStamp) {
          // Waited long enough, lets render
          enterTimeStamp = event.timeStamp;
          hover = true;
          const cursorPosition = getCursorPosition(event);
          requestAnimationFrame(() => {
            if (hover) {
              // Check if still hover, (maybe onDragLeave way called since the requestAnimationFrame)
              hoverRender(cursorPosition);
            }
          });
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
        clear(event);
      }
    },

    onDrop: (event: SyntheticDragEvent) => {
      if (shouldAcceptDrop(event, acceptableTypes)) {
        clear(event);
        drop(event, getCursorPosition(event));
      }
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
