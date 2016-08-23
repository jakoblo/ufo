import * as t from './config-actiontypes'
import App from '../app/app-index'
import Navbar from '../navbar/navbar-index'
import Utils from '../utils/utils-index'
import { List, Map } from 'immutable'

export function loadPreviousState() {

  return dispatch => {
    Utils.storage.loadStatefromStorage(function(data) {
      // if(data.navbar)
      data.navbar.groupItems.forEach((item, index) => {
        console.log(item)
        dispatch(Navbar.actions.addNavGroup(item.title, item.items))
      })

    })


    // dispatch(App.actions.changeAppPath())

    // dispatch(Navbar.actions.addNavGroup())
  }

}

