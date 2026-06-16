# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install                 # Install dependencies
npm start                   # Run in development mode (electron-forge start)
npm run package             # Package the app
npm run make                # Build distributable
npm run build:test          # Build for E2E testing (electron-forge package → .webpack/)
npm run test:e2e            # Run Playwright E2E tests (requires build:test first)
```

E2E tests must be built before running: `npm run build:test && npm run test:e2e`. Tests live in `e2e/` and target the compiled `.webpack/main/index.js`.

DevTools: `Ctrl+Shift+I` toggles the Electron DevTools panel at runtime.

Logs: written to `{userData}/logs/ufo.log` via electron-log. The log path is printed to stdout on startup.

## Architecture

UFO is an **Electron desktop file manager** where users can annotate folders with rich-text notes. It uses React + Redux in the renderer process and communicates with the main process via Electron IPC.

### Process split

**Main process** (`src/js/main/`):
- `main.js` — app entry point; creates the BrowserWindow, registers the `local://` protocol (for serving local images), sets up the `Ctrl+Shift+I` DevTools shortcut, and calls `ipcListener()`
- `main-ipc.js` — IPC handlers: `ondragstart` (native drag-and-drop) and `writeFile` (file save from renderer)
- `logger.js` — configures electron-log, patches `console.*` in main, and relays `ufo-log` IPC messages from the renderer into the same log file

**Renderer process** (`src/js/`):
- `renderer.js` — webpack entry; imports the LESS theme and `app.jsx`; forwards uncaught errors to the main process via `ipcRenderer.send("ufo-log", ...)`
- `app.jsx` — creates the Redux store, calls `Storage.loadAll`, mounts `<Provider>` with `<Navbar>`, `<ViewPlacer>`, and `<AddonBar>`; exposes `window.store` for debugging

### Redux state shape

All reducers are combined in `src/js/reducerIndex.js`:

| Slice key | Module | Responsibility |
|---|---|---|
| `FolderEditor` | `view-folder/view-folder-editor` | Slate editor state per open folder |
| `ViewFile` | `view-file` | State for the file viewer panel |
| `Selection` | `filesystem/selection` | Currently selected/focused path |
| `fsWatch` | `filesystem/watch` | Chokidar watchers and directory contents |
| `fsWrite` | `filesystem/write` | Copy/move/trash operations with progress |
| `fsRename` | `filesystem/rename` | In-place rename state |
| `Filter` | `filesystem/filter` | File type filtering |
| `Config` | `config` | User config (read-only mode, etc.) |
| `Navbar` | `navbar` | Left-sidebar navigation tree |
| `App` | `app` | Application-level state |
| `AddonBar` | `addon-bar` | Bottom add-on bar |

### Feature module pattern

Every feature module exports a consistent shape from its `*-index.js`:
```js
export default { actions, selectors, reducer, actiontypes, constants, components }
```
Components import peer features by their index, never directly into internals.

### Slate editor

The folder editor uses **Slate v0.19** (old imperative API — `Raw`, `Editor`, `state`). Rich-text types are defined in `slate-extensions/rich-text-types.js`. Folder notes are serialized to markdown and saved as an `.index` file inside each folder (see `folder-editor-constants.js` for `INDEX_BASE_NAME`). Saves are debounced 5 s after the last edit, and forced on unmount.

### Persistence

`src/js/utils/storage.js` — modules call `Storage.register(name, fetchFromStore, dispatchToStore)` to opt into automatic save/load. State is written as JSON to `{userData}/{name}.json` on `window.onbeforeunload` and read back on startup.

### Filesystem watching

`src/js/filesystem/watch/fs-watch-watcher.js` wraps Chokidar in a `ChokidarHandler` singleton. Key behavior: files accumulate in a `holdingLine` map until the `ready` event fires, then the batch is dispatched. Symlinks are intentionally ignored to avoid Windows crashes. Depth is fixed at 0 (one level only).

### Styling

Single LESS theme at `src/themes/light/less/style.less`, which imports all other `.less` files. Compiled by webpack via `less-loader → css-loader → style-loader`.
