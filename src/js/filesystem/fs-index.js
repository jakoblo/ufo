import * as actions from './fs-actions';
import * as actionTypes from './fs-actiontypes';
import * as constants from './fs-constants';
import reducer from './fs-reducer';
import FSTester from './fs-tester';
import watchHandler from './fs-watch-handler'

const components = {
    FSTester: FSTester
}

export default {actions, actionTypes, constants, components, reducer, watchHandler}