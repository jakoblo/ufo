import * as actions from './fs-watch-actions';
import * as actiontypes from './fs-watch-actiontypes';
import * as constants from './fs-watch-constants';
import watchhandler from './fs-watch-watcher'
import reducer from './fs-watch-reducer'
import * as selectors from './fs-watch-selectors'

export default {actions, actiontypes, selectors, reducer, constants, watchhandler}