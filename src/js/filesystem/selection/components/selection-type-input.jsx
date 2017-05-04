//@flow
import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import classNames from "classnames";
import * as Selectors from "../sel-selectors";

type Props = {
  focused: boolean,
  input: string,
  dispatch: Function
};

const mapStateToProps = (state, props) => {
  return {
    focused: Selectors.isFocused(state, props.path),
    input: Selectors.getSelectTypeInput(state, props.path)
  };
};
class TypeInput extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div
        className={classNames({
          "filter-type": true,
          "filter-type--focused": this.props.focused,
          "filter-type--active": this.props.focused &&
            this.props.input != undefined &&
            this.props.input.length > 0
        })}
      >
        <label className="filter-type__label">Jump to</label>
        <input
          className="filter-type__input"
          readOnly={true}
          value={this.props.input || ""}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(TypeInput);
