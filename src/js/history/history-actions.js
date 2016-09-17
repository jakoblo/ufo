import * as Selectors from './history-selectors'
import App from '../app/app-index'

export function back() {
  return (dispatch, getState) => {
      dispatch( jump(-1) )
  }
}

export function forward() {
  return (dispatch, getState) => {
      dispatch( jump(+1) )
  }
}

function jump(direction) {
  return (dispatch, getState) => {
    let newPosition = getState().history.get('position') + direction
    let Sequence = getState().history.get('sequence')
    if(-1 < newPosition && newPosition < Sequence.size) {
      let newPath = Sequence.get(newPosition)
      dispatch( App.actions.changeAppPath( newPath.get('from'), newPath.get('to'), newPosition ))
    }
  }
}