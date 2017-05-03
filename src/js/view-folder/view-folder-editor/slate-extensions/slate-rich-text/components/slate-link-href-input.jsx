// @flow

"use strict";
import React from "react";
import ReactDOM from "react-dom";

type Props = {
  href: string,
  handleFocus: () => void,
  handleBlur: () => void,
  handleHrefChange: (href: string) => void
};

export default class HrefInput extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <input
        ref="editField"
        className={this.props.className}
        placeholder="Enter Url"
        value={this.props.href}
        onChange={event => {
          this.props.handleChange(event.target.value);
        }}
        onFocus={this.props.handleFocus}
        onBlur={this.props.handleBlur}
        // Stop & Cancel events
        onMouseDown={this.stopEvent}
        onMouseUp={this.stopEvent}
        onSelect={this.stopEvent}
        onCopy={this.stopEvent}
        onKeyDown={this.stopEvent}
        onCut={this.stopEvent}
        onDragEnd={this.cancelEvent}
        onDragOver={this.cancelEvent}
        onClick={this.stopEvent}
        onDragStart={this.cancelEvent}
        onDrop={this.cancelEvent}
        onInput={this.stopEvent}
        onKeyUp={this.stopEvent}
        onPaste={this.stopEvent}
      />
    );
  }

  cancelEvent = event => {
    event.preventDefault();
    event.stopPropagation();
  };
  stopEvent = event => {
    event.stopPropagation();
  };
}
