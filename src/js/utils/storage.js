import storage from 'electron-json-storage'
import Immutable, { Map, List } from 'immutable'
import { remote } from 'electron'

export function loadStatefromStorage(windowID, callback) {
  storage.get('lastState'+windowID, function(error, data) {
  if (error) throw error;
  let lastState = data
  if(data.navbar == undefined) {
    lastState = loadDefaultUserFolders(data)
  }
  callback(lastState)
  });
}

export function saveStatetoStorage(data, bwid, callback) {
  storage.set('lastState'+bwid, data, function(error) {
    if (error) throw error;
    callback()
  });
}

export function loadDefaultUserFolders(lastState) {
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
  let present = {present: {
    groupItems: [navgroup]
  }}
  lastState.navbar = present
  return lastState
}