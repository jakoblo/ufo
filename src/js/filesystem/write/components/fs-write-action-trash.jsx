"use strict";
import React from "react";
import ReactDOM from "react-dom";
import classNames from "classnames";
import * as c from "../fs-write-constants";
import * as t from "../fs-write-actiontypes";
import * as FsWriteActions from "../fs-write-actions";
import FsWriteActionItem from "./fs-write-action-item";
import ProgressArrow from "./fs-write-action-progress-arrow";
import ErrorMessages from "./fs-write-action-error-messages";

type Props = {
  action: any
};

export default class WriteActionTrash extends React.Component {
  props: Props;
  constructor(props) {
    super(props);
  }

  render() {
    let sourceItems = [];
    this.props.action.get("sources").forEach(source => {
      sourceItems.push(
        <FsWriteActionItem type="source" key={source} path={source} />
      );
    });

    return (
      <div className="fs-write-action__container">

        <div className="fs-write-action__title">To trash</div>
        <div className="fs-write-action__content">
          <ProgressArrow
            className="fs-write-action__progress-arrow"
            sourceCount={this.props.action.get("sources").size}
            progress="100"
            finished={this.props.action.get("finished")}
            error={this.props.action.get("errors").size > 0}
          />
          <div className="fs-write-action__item-container">
            {sourceItems}
            <FsWriteActionItem
              type="target"
              path={this.props.action.get("target")}
            />
          </div>
        </div>
        <ErrorMessages action={this.props.action} />
      </div>
    );
  }

  shouldComponentUpdate(nextProps: Props) {
    return nextProps.action !== this.props.action; // || nextState.data !== this.state.data;
  }
}
