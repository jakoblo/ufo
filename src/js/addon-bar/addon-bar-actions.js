import * as t from './addon-bar-actiontypes'
import * as c from './addon-bar-constants'
import * as selectors from './addon-bar-selectors'
import _ from 'lodash'

export function toggleView(type) {
  return (dispatch, getState) => {
    dispatch({
      type: t.SET_VIEW,
      payload: {
        type : (selectors.getCurrentView(getState()) == type ) ? null : type
      }
    })
  }
}
