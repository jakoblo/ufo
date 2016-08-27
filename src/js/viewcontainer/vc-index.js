// import * as actions from './viewcontainer-actions'
import ViewContainer from './components/viewcontainer'
import View from './components/view'
import * as constants from './vc-constants'

const components = {
  parent: ViewContainer,
  child: View
}

export default { components, constants };