import chokidar from 'chokidar'
import nodePath from 'path'
import {FILE, DIR} from '../constants/fs-types'

const logging = true

/* ChokidarHandler - creates usable ChokdiarFilewatcher */
class ChokidarHandler {
  constructor() {
    this.watcherStack = []
  }

/**
 * Create a new Watcher to watch a direcotry
 * @param  {string} path                            the folder to watch
 * @param  {object} settings                        settings for chokidar
 * @param  {callback} addCallback(fileObj)          for add-file and add-dir events
 * @param  {callback} unlinkCallback(fileObj)       for delete/remove of files and dirs
 * @param  {callback} changeCallback(fielObj)
 * @param  {callback} readyCallback(path, files[])  When the watcher is ready, argument path&folder all files of the folder
 * @return {ChokidarWatcher} ChokidarWatcher        Created watcher from Chokidar
 */
  watch = (path, settings, addCallback, unlinkCallback, changeCallback, readyCallback ) => {

    this._verify(path, settings)

    let watcher = chokidar.watch(path, settings)
    this.watcherStack[path] = {
      watcher: watcher,
      holdingLine: {},
      ready: false
    }

    let root = path

    if(addCallback) {
      watcher.on('add', this.handleEvent.bind(this, addCallback, root, FILE))
      watcher.on('addDir', this.handleEvent.bind(this, addCallback, root, DIR))
    }
    if(unlinkCallback) {
      watcher.on('unlink', this.handleEvent.bind(this, unlinkCallback, root, FILE))
      watcher.on('unlinkDir', this.handleEvent.bind(this, unlinkCallback, root, DIR))
    }
    if(changeCallback) {
      watcher.on('change', this.handleEvent.bind(this, changeCallback, root, FILE))
    }
    if(readyCallback) {
      watcher.on('ready', this.handleReady.bind(this, readyCallback, root))
    }
    if(logging) {
      watcher.on('ready', this._logging.bind(this, watcher, root))
    }

    return watcher
  }

  unwatch = (path) => {
    if(this.watcherStack[path]) {
      this.watcherStack[path].watcher.close()
      delete this.watcherStack[path]
    }
  }

  handleEvent(callback, root, type, path, stats) {

    let fileObj = {
      base: nodePath.basename(path),
      root: root,
      path: path,
      type: type,
      stats: stats
    }

    if(root == path) {
      return // the file is direcotry itself. Chokidar... i don't know why
    }

    if(this.watcherStack[root].ready) {
      callback(fileObj)
    } else {
      this.watcherStack[root].holdingLine[fileObj.base]= fileObj
    }
  }

  handleReady(readyCallback, root) {
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

export let fsWatcher = new ChokidarHandler()
