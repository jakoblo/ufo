//@flow
import React from "react";
import { connect } from "react-redux";
import * as Selectors from "../fs-write-selectors";
import WriteAction from "./fs-write-action";
import classnames from "classnames";
import { Map } from "immutable";

type Props = {
  fsWrite: any,
  dispatch: () => void
};

const mapStateToProps = (state, props) => {
  return {
    fsWrite: Selectors.getFSWrite(state)
  };
};

class DisplayList extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  render() {
    let actionList = "";
    if (this.props.fsWrite && this.props.fsWrite.size > 0) {
      actionList = this.props.fsWrite.valueSeq().map((writeAction, index) => {
        return (
          <WriteAction
            key={index}
            action={writeAction}
            dispatch={this.props.dispatch}
          />
        );
      });
    } else {
      actionList = <div className="noFileActions">No file movements</div>;
    }

    return (
      <div className="fs-write-overview">
        {actionList}
      </div>
    );
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.fsWrite !== this.props.fsWrite; // || nextState.data !== this.state.data;
  }
}
export default connect(mapStateToProps)(DisplayList);
