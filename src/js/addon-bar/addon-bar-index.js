import * as actions from './addon-bar-actions'
import * as constants from './addon-bar-constants'
import * as actiontypes from './addon-bar-actiontypes'
import reducer from './addon-bar-reducer'
import addonBarComponent from './components/addon-bar'

const components = {
  addonBar: addonBarComponent
}

export default { actions, reducer, actiontypes, constants, components};
