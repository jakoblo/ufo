"use strict";
import React from "react";
import ReactDOM from "react-dom";
import Config from "../../config/config-index";
import { connect } from "react-redux";
import { keyEventToActionMapper } from "../key-event-handler";
import { keyMap } from "../key-map";
import { windowActionHandler } from "../window-action-handler";

const globalEventHandler = keyEventToActionMapper(
  keyMap.global,
  windowActionHandler
);
const readOnlyEventHandler = keyEventToActionMapper(
  keyMap.readOnly,
  windowActionHandler
);

@connect(state => {
  return { readOnly: Config.selectors.getReadOnlyState(state) };
})
export default class EventCatcher extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="root-event-catcher" ref="eventCatcher">
        {this.props.children}
      </div>
    );
  }

  componentDidMount(prevProps, prevState) {
    // Focus to catch events
    // var node = ReactDOM.findDOMNode(this.refs["eventCatcher"]);
    // node.focus();

    window.addEventListener("keydown", event => {
      globalEventHandler(event);
      if (this.props.readOnly) {
        readOnlyEventHandler(event);
      }
    });
  }
}
