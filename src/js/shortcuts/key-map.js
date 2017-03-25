// @flow
import type { KeyMap, keyEntry } from "./key-types.d.js";

export const keyMap: {
  [area: string]: KeyMap
} = {
  // Allways Enabled, but have to bubble to the root
  global: {
    pathUp: {
      windows: "Control+ArrowUp",
      linux: "Control+ArrowUp",
      darwin: "Meta+ArrowUp"
    },
    rename: {
      windows: "F2",
      linux: "F2"
    },

    // Does not work with editor
    // toggleHiddenFiles: {
    //   darwin: "Shift+Meta+:",
    //   windows: "Shift+Controle+:",
    //   linux: "Shift+Controle+:"
    // },
    toggleReadOnly: "Meta+e"
  },
  // Editor mode is readOnly, no text editing possible
  readOnly: {
    navUp: "ArrowUp",
    selectUp: "Shift+ArrowUp",
    navDown: "ArrowDown",
    selectDown: "Shift+ArrowDown",
    navRight: "ArrowRight",
    navLeft: "ArrowLeft",
    selectAll: {
      windows: "Control+a",
      linux: "Control+a",
      darwin: "Meta+a"
    },
    moveToTrash: {
      windows: "del",
      linux: "del",
      darwin: "Meta+Backspace"
    },
    rename: {
      windows: "F2",
      linux: "F2"
    },
    clearFilter: "Escape",
    deleteFilter: "Backspace",
    filePreview: {
      darwin: " "
    }
  },

  renameInput: {
    cancel: "Escape",
    save: "Enter"
  }
};
