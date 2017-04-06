"use strict";
import React from "react";
import ReactDOM from "react-dom";
import scrollIntoView from "scroll-into-view";

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

  componentDidMount() {
    this.scrollIntoView();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.scrollToTrigger === false && nextProps.scrollToTrigger === true
    ) {
      this.scrollIntoView();
    }
  }

  scrollIntoView = () => {
    console.log("scroll to");
    const element: any = ReactDOM.findDOMNode(this.container);
    scrollIntoView(element, {
      time: 300
    });
  };
}
