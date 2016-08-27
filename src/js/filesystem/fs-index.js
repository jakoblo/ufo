import * as actions from './fs-actions';
import * as actiontypes from './fs-actiontypes';
import * as constants from './fs-constants';
import watchhandler from './fs-watch-handler'
import reducer from './fs-reducer'
import * as selectors from './fs-selectors'

export default {actions, actiontypes, selectors, reducer, constants, watchhandler}