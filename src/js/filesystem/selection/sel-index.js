//@flow
import * as actions from "./sel-actions";
import * as actiontypes from "./sel-actiontypes";
import * as constants from "./sel-constants";
import reducer from "./sel-reducer";
import * as selectors from "./sel-selectors";
import TypeInput from "./components/selection-type-input";

export default {
  actions,
  actiontypes,
  selectors,
  reducer,
  constants,
  components: {
    TypeInput: TypeInput
  }
};
