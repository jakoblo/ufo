//@flow
import React from "react";
import ReactDOM from "react-dom";
import Config from "../../config/config-index";
import { connect } from "react-redux";
import { keyEventToActionMapper } from "../key-event-handler";
import { keyMap } from "../key-map";
import { windowActionHandler, filterHandler } from "../window-action-handler";

const globalEventHandler = keyEventToActionMapper(
  keyMap.global,
  windowActionHandler
);
const readOnlyEventHandler = keyEventToActionMapper(
  keyMap.readOnly,
  windowActionHandler,
  filterHandler
);

type Props = {
  readOnly: boolean,
  children?: Element
};

function stopEvent(e) {
  e.preventDefault();
  e.stopPropagation;
}

const mapStateToProps = state => {
  return { readOnly: Config.selectors.getReadOnlyState(state) };
};
class EventCatcher extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div
        className="root-event-catcher"
        ref="eventCatcher"
        // Avoid Focus move away from editor:
        onClick={stopEvent}
        onMouseDown={stopEvent}
        onFocus={stopEvent}
      >
        {this.props.children}
      </div>
    );
  }

  componentDidMount() {
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
export default connect(mapStateToProps)(EventCatcher);
