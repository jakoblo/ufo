//@flow
import React from "react";
import { connect } from "react-redux";
import Config from "../../config/config-index";
import * as selectors from "../../config/config-selectors";
import { List } from "immutable";
import classnames from "classnames";

type Props = {
  readOnly: boolean,
  dispatch: Function
};

const mapStateToProps = state => {
  return { readOnly: selectors.getReadOnlyState(state) };
};
class ReadOnlyToggle extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  render() {
    let classes = classnames("read-only-toggle", {
      "read-only-toggle--read-only": this.props.readOnly
    });

    return (
      <div className={classes} onClick={this.toggle}>
        <div className="read-only-toggle__bullet" />
      </div>
    );
  }

  toggle = () => {
    this.props.dispatch(Config.actions.toggleReadOnly());
  };
}
export default connect(mapStateToProps)(ReadOnlyToggle);
