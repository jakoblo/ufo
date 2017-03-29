//@flow

import React from "react";
import classNames from "classnames";
import nodePath from "path";
import * as c from "../fs-write-constants";
import * as t from "../fs-write-actiontypes";
import * as FsWriteActions from "../fs-write-actions";

type PropsMessages = {
  action: any
};

export default class ErrorMessages extends React.Component {
  props: PropsMessages;
  constructor(props: PropsMessages) {
    super(props);
  }

  render() {
    let messages = [];
    this.props.action
      .get("errors")
      .keySeq()
      .forEach((errorCode: string, index: number) => {
        messages.push(
          <Message
            key={index}
            errorCode={errorCode}
            action={this.props.action}
          />
        );
      });

    return <div className="errors">{messages}</div>;
  }
}

type PropsMessage = {
  errorCode: string,
  action: any
};

class Message extends React.Component {
  props: PropsMessage;
  constructor(props: PropsMessage) {
    super(props);
  }

  render() {
    // let errorList = this.props.action.getIn(['errors'])

    let errorMessage, tryAgain = false;

    return (
      <div className="fs-write-action__error-container">
        <div className="fs-write-action__error-files">
          {this.errorFiles(
            this.props.action.getIn(["errors", this.props.errorCode])
          )}
        </div>
        <div className="fs-write-action__error-message">
          {this.errorText(
            this.props.errorCode,
            this.props.action.getIn(["errors", this.props.errorCode])
          )}
        </div>
        {this.errorAction(this.props.errorCode)}
      </div>
    );
  }

  errorText = (errorCode, errors) => {
    switch (errorCode) {
      case c.ERROR_NOT_EXISTS:
        return "Source or target folder are not existing. How did you create that error?";

      case c.ERROR_NO_ACCESS:
        return "I don't have the permission to do that.";

      case c.ERROR_RENAME_CROSS_DEVICE:
        return "Can't rename from One device to an other. You should never see this Message. Else something is wrong with FileFlow.";

      case c.ERROR_DEST_ALREADY_EXISTS:
        return "already exists.";

      case c.ERROR_MOVE_IN_IT_SELF:
        return "How should I move a folder in to it self? Thats impossible...";

      default:
        return "Error: code " + errorCode + "\n" + JSON.stringify(errors);
    }
  };

  errorFiles = errors => {
    return errors.map((error, index) => {
      if (error.get("path")) {
        return <div key={index}>{nodePath.basename(error.get("path"))}</div>;
      }
    });
  };

  errorAction = errorCode => {
    switch (errorCode) {
      case c.ERROR_DEST_ALREADY_EXISTS:
        return this.renderOverwrite();

      case c.ERROR_MOVE_IN_IT_SELF:
        return null;

      default:
        return this.renderTryAgain();
    }
  };

  renderTryAgain = () => {
    return (
      <div className="fs-write-action__error-button-container">
        <button
          className="fs-write-action__error-button-try-again"
          onClick={() => {
            console.log(this.props.action.get("id"));
            FsWriteActions.startFsWorker({
              id: this.props.action.get("id"),
              sources: this.props.action.get("sources"),
              target: this.props.action.get("target"),
              type: this.props.action.get("type"),
              clobber: this.props.action.get("clobber")
            });
          }}
        >
          Try Again
        </button>
      </div>
    );
  };

  renderOverwrite = () => {
    return (
      <div className="fs-write-action__error-button-container">
        <button
          className="fs-write-action__error-button-overwrite"
          onClick={() => {
            console.log(this.props.action.get("id"));

            FsWriteActions.startFsWorker({
              id: this.props.action.get("id"),
              sources: this.props.action.get("sources").toJS(),
              target: this.props.action.get("target"),
              type: this.props.action.get("type"),
              clobber: true
            });
          }}
        >
          Move to trash and try again
        </button>

        <button
          className="fs-write-action__error-button-cancel"
          onClick={() => {
            window.store.dispatch(
              FsWriteActions.removeAction(this.props.action.get("id"))
            );
          }}
        >
          Cancel
        </button>
      </div>
    );
  };
}
