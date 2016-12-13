
export const keyMap = {
  global: {
    navUp: 'ArrowUp',
    selectUp: 'Shift+ArrowUp',
    pathUp: {
      windows: 'Control+ArrowUp', 
      linux: 'Control+ArrowUp', 
      darwin: 'Meta+ArrowUp'
    },
    navDown: 'ArrowDown',
    selectDown: 'Shift+ArrowDown',
    navRight: 'ArrowRight',
    navLeft: 'ArrowLeft',
    selectAll: {
      windows: 'Control+a',
      linux: 'Control+a',
      darwin: 'Meta+a'
    },
    moveToTrash: {
      windows: 'del',
      linux: 'del',
      darwin: 'Meta+Backspace'
    },
    rename: {
      windows: 'F2',
      linux: 'F2',
      darwin: 'Enter'
    },
    toggleHiddenFiles: {
      darwin: 'Shift+Meta+:',
      windows: 'Shift+Controle+:',
      linux: 'Shift+Controle+:'
    },
    clearFilter: "Escape",
    deleteFilter: "Backspace",
    filePreview: {
      darwin: ' '
    }
  },
  renameInput: {
    cancel: "Escape",
    save: "Enter"
  }
}