import chokidar from 'chokidar'
import nodePath from 'path'
import fs from 'fs'
import {TYPE_FILE, TYPE_DIR} from './fs-watch-constants'

const logging = false

/* ChokidarHandler - creates usable ChokdiarFilewatcher */
class ChokidarHandler {
  constructor() {
    this.watcherStack = []
  }
  
  /**
   * Create a new Watcher to watch a direcotry
   * 
   * @param  {String} path
   * @param  {Object} settings
   * @param  {Function} addCallback
   * @param  {Function} unlinkCallback
   * @param  {Function} changeCallback
   * @param  {Function} readyCallback
   * @param  {Function} errorCallback
   * @returns {Object}
   */
  watch = (
      path, 
      settings, 
      addCallback, 
      unlinkCallback, 
      changeCallback, 
      readyCallback, 
      errorCallback
    ) => {

    this._verify(path, settings)

    let watcher = chokidar.watch(path, settings)
    this.watcherStack[path] = {
      watcher: watcher,
      holdingLine: {},
      ready: false
    }
    let root = path

    // Check if folder exists and is readable / chokidar doesn't do that
    fs.access(path, fs.constants.R_OK || fs.constants.W_OK, (err) => {
      if(err) {
        if(errorCallback) { errorCallback(err, root) }
        this.unwatch(root)
      }
    })

    if(addCallback) {
      watcher.on('add', this._handleEventAdd.bind(this, addCallback, root, TYPE_FILE))
      watcher.on('addDir', this._handleEventAdd.bind(this, addCallback, root, TYPE_DIR))
    }
    if(unlinkCallback) {
      watcher.on('unlink', this._handleEventDelete.bind(this, unlinkCallback, root, TYPE_FILE))
      watcher.on('unlinkDir', this._handleEventDelete.bind(this, unlinkCallback, root, TYPE_DIR))
    }
    if(changeCallback) {
      watcher.on('change', this._handleEventOther.bind(this, changeCallback, root, TYPE_FILE))
    }
    if(readyCallback) {
      watcher.on('ready', this._handleReady.bind(this, readyCallback, root))
    }
    if(errorCallback) {
      watcher.on('error', errorCallback.bind(this, root))
    }
    if(logging) {
      watcher.on('ready', this._logging.bind(this, watcher, root))
    }
    return watcher
  }
  /**
   * @param  {string} path
   */
  unwatch = (path) => {
    if(this.watcherStack[path]) {
      this.watcherStack[path].watcher.close()
      delete this.watcherStack[path]
    }
  }

  _handleEventOther(callback, root, type, path, stats) {
    let fileObj = this._createFileObj(...arguments)
    callback(fileObj)
  }

  _handleEventDelete(callback, root, type, path, stats) {
    if(path == root) {
      console.error('chokikar wants to remove "', path, '" which is prevented, should be wrong.')
      return
    }
    let fileObj = this._createFileObj(...arguments)
    callback(fileObj, this.watcherStack)
  }


  _handleEventAdd(callback, root, type, path, stats) {
    let fileObj = this._createFileObj(...arguments)
    if(root == path) {
      return // the file is direcotry itself. Chokidar... i don't know why
    }
    if(stats.isSymbolicLink()) {
      return // Ignore Symbolic Links, they are anoying... and can crash node/chokidar on windows
    }
    if(this.watcherStack[root].ready) {
      callback(fileObj)
    } else {
      this.watcherStack[root].holdingLine[fileObj.base]= fileObj
    }
  }

  _handleReady(readyCallback, root) {
    readyCallback(root, this.watcherStack[root].holdingLine)
    this.watcherStack[root].ready = true
    delete this.watcherStack[root].holdingLine
  }

  _verify = (path, settings) => {
    if(this.watcherStack[path] != undefined) {
      throw "Try to watch the same directory again!";
    }
    if(settings.alwaysStat == false) {
      throw "Chokidar Settings 'alwaysStat' should be true"
    }
  }

  _createFileObj(callback, root, type, path, stats) {
    let pathObj = nodePath.parse(path)
    return {
      base: pathObj.base,
      suffix: pathObj.ext,
      name: pathObj.name,
      root: root,
      path: path,
      type: type,
      stats: stats
    }
  }

  _logging(watcher, root) {
    watcher
    .on('add', path => console.log(`File ${path} has been added`, root))
    .on('change', path => console.log(`File ${path} has been changed`, root))
    .on('unlink', path => console.log(`File ${path} has been removed`, root))
    .on('addDir', path => console.log(`Directory ${path} has been added`, root))
    .on('unlinkDir', path => console.log(`Directory ${path} has been removed`, root))
    .on('error', error => console.log(`Watcher error: ${error}`, root))
    .on('ready', () => console.log('Initial scan complete. Ready for changes', root))
  }
}

export default new ChokidarHandler()
