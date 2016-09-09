// import * as actions from './viewcontainer-actions'
import ViewContainer from './vc-component'
import View from './vc-view'
import * as constants from './vc-constants'

const components = {
  parent: ViewContainer,
  child: View
}

export default { components, constants };