import App from '../app/app-index'
import FileSystem from '../filesystem/fs-index'
import Immutable from 'immutable'
import { List, Map } from 'immutable'

const INITIAL_STATE = Map({
  displayType: 'list',
  views: List([])
})

export default function viewContainerReducer(state = INITIAL_STATE, action = { type: '' }) {
  switch (action.type) {
    case App.actiontypes.APP_CHANGE_PATH:
      let listTemplate = action.payload.pathRoute.map((path, index) => {
        return Map({
          path: path,
          loading: state.getIn('views', path, 'loading') || true
        })
      })
      return state.set('views', List(listTemplate))

    // case FileSystem.actiontypes.WATCHER_READING:
    //   return _setLoadingForPath(state, action.payload.path, true)

    case FileSystem.actiontypes.WATCHER_READY:
      return _setLoadingForPath(state, action.payload.path, false)

    default:
      return state;
  }
}

/**
 * @param  {Object} state
 * @param  {string} path
 * @param  {Boolean} loadingValue
 * @return {Object} state
 */
function _setLoadingForPath(state, path, loadingValue) {
  let index = state.get('views').findKey((viewObj, key) => {
    return (viewObj.get('path') == path)
  })
  if(index > -1) {
    return state.setIn(['views', index, 'loading'], loadingValue)
  } else {
    return state
  }
}
