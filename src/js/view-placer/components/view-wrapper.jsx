"use strict";
import React from "react";
import ReactDOM from "react-dom";

export default class ViewWrapper extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className="view-wrapper"
        ref={ref => {
          this.container = ref;
        }}
        style={this.props.style}
      >
        {this.props.children}
      </div>
    );
  }
}
