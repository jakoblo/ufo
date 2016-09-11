import storage from 'electron-json-storage'
import Immutable, { Map, List } from 'immutable'
import { remote } from 'electron'
import drivelist from 'drivelist'
import process from 'process'
import fs from '../filesystem/fs-index'
import Navbar from '../navbar/navbar-index'

export function loadStatefromStorage(windowID, callback) {
  storage.get('lastState'+windowID, function(error, data) {
  if (error) throw error;
  callback(data)
  });
}

export function loadNavbarfromStorage(callback) {
  storage.get('navbar', function(error, data) {
    if (error) throw error
    if(data.groupItems == undefined)
    data = loadDefaultUserFolders()
    callback(data)
  })
}

export function saveStatetoStorage(currentState, bwid, callback) {
  storage.set('navbar', currentState.navbar.present, function(error) {
    if (error) throw error
  })
  storage.set('lastState'+bwid, currentState, function(error) {
    if (error) throw error;
    callback()
  });
}

export function saveFavbartoStorage(currentState) {
  console.log(currentState)
  storage.set('navbar', currentState.navbar.present, function(error) {
    if (error) throw error
  })
}

function loadDefaultUserFolders() {
  const app = remote.app
  let navgroup = {
    title: "Favourites",
    items: [
      app.getPath('home'),
      app.getPath('desktop'),
      app.getPath('documents'),
      app.getPath('downloads'),
      app.getPath('music'),
      app.getPath('pictures'),
      app.getPath('videos')
    ]
  }
  let navbar = {groupItems: [navgroup]}
  return navbar
}

/**
 * 
 * Returns an Array of Path Strings
 * @export
 * @param {callback} fileUnlink
 * @param {callback} fileAdd
 * @param {callback} fileChange
 * @param {callback} watcherReady
 */
export function loadSystemVolumes(fileAdd, fileUnlink, fileChange, watcherReady) {
  const watcherSettings = {
    ignored: /[\/\\]\./,
    persistent: true,
    depth: 0,
    alwaysStat: true
  }

  if(process.platform == 'darwin') {
    fs.watchhandler.watch('/volumes/', watcherSettings,
    fileAdd,
    fileUnlink,
    fileChange,
    wready
    )

    function wready(path, files) {
      let items = []
      for (var key in files) {
        // skip loop if the property is from prototype
        if (!files.hasOwnProperty(key)) continue;
        var obj = files[key];
          items.push(obj.path)
        }
        watcherReady(Navbar.constants.DISKS_GROUP_NAME, items)
      }
    
  }
  drivelist.list(function(error, disks) {
      if (error) throw error;
      // console.log(disks);
  })
}