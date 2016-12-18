import { fromJS, Map } from 'immutable'
import App from '../app/app-index'
import _ from 'lodash'

const INITIAL_STATE = fromJS({
  history: {
    position: null,
    sequence: []
  }
})

export default function appReducer(state = INITIAL_STATE, action = { type: '' }) {

  switch (action.type) {

    case App.actiontypes.APP_CHANGE_PATH:
      
      if(Number.isInteger(action.payload.historyJump)) {
        
        // History Jump
        return state.setIn(['history', 'position'], action.payload.historyJump)

      } else {

        // Add History Entry to Sequence
        let seq = state.getIn(['history', 'sequence']).splice( state.getIn(['history', 'position']) + 1 )
        seq = seq.push( Map({
          from: _.first(action.payload.pathRoute),
          to: _.last(action.payload.pathRoute)
        }))
        state = state
                  .setIn(['history', 'sequence'], seq)
                  .setIn(['history', 'position'], seq.size -1)
      }

      return state

    default:
      return state;
  }

}
