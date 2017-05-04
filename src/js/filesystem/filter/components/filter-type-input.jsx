//@flow
import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import classNames from "classnames";
import * as c from "../filter-constants";
import * as t from "../filter-actiontypes";
import * as FilterSelectors from "../filter-selectors";

type Props = {
  focused: boolean,
  input: string,
  dispatch: Function
};

const mapStateToProps = (state, props) => {
  return {
    focused: FilterSelectors.isFocused(state, props.path),
    input: FilterSelectors.getUserInput(state, props.path)
  };
};
class FilterTypeInput extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div
        className={classNames({
          "filter-type": true,
          "filter-type--active": this.props.focused &&
            this.props.input != undefined &&
            this.props.input.length > 0
        })}
      >
        <label className="filter-type__label">Filter By</label>
        <input
          className="filter-type__input"
          readOnly={true}
          value={this.props.input || ""}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(FilterTypeInput);
