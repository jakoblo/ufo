//@flow
import React from "react";
import classnames from "classnames";
import FsWrite from "../../filesystem/write/fs-write-index";
import { connect } from "react-redux";
import * as selectors from "../addon-bar-selectors";
import * as actions from "../addon-bar-actions";

const mapStateToProps = (state, props) => {
  return {
    currentView: selectors.getCurrentView(state)
  };
};
class AddonBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="addon-bar">
        <div className="addon-bar__icon-toolbar">
          {this.getViewIcon("fs-write")}
          {this.getViewIcon("settings")}
        </div>
        <div className="addon-bar__css-transition-group">
          {this.props.currentView
            ? <div className="addon-bar__view-container">
                {this.getCurrentView()}
              </div>
            : null}
        </div>
      </div>
    );
  }

  getCurrentView = () => {
    switch (this.props.currentView) {
      case "fs-write":
        return <FsWrite.component />;

      case "settings":
        return <div className="no-settings" />;

      default:
        return <div>Error</div>;
    }
  };

  getViewIcon = (type: string) => (
    <div
      className={classnames({
        ["addon-bar__icon-" + type]: true,
        ["addon-bar__icon-" + type + "--active"]: this.props.currentView == type
      })}
      onClick={() => {
        this.props.dispatch(actions.toggleView(type));
      }}
    />
  );
}

export default connect(mapStateToProps)(AddonBar);
