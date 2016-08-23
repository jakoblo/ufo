import storage from 'electron-json-storage'
import Immutable, { Map, List } from 'immutable'

export function loadStatefromStorage(callback) {
  storage.get('lastState', function(error, data) {
  if (error) throw error;
  callback(data)
  });
}

export function saveStatetoStorage(data) {
  storage.set('lastState', data, function(error) {
    if (error) throw error;
  });
}