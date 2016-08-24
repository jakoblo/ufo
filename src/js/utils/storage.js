import storage from 'electron-json-storage'
import Immutable, { Map, List } from 'immutable'
import { remote } from 'electron'

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

export function saveStatetoStorage(data, bwid, callback) {
  storage.set('navbar', data.navbar.present, function(error) {
    if (error) throw error
  })
  storage.set('lastState'+bwid, data, function(error) {
    if (error) throw error;
    callback()
  });
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