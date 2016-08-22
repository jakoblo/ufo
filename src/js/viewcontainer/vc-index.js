// import * as actions from './viewcontainer-actions'
import ViewContainer from './components/viewcontainer'
import reducer from './vc-reducer'
import * as constants from './vc-constants'

const components = {
  parent: ViewContainer
}

export default { components, constants, reducer };