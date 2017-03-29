//@flow

import React from "react";
import ResizeSensor from "./resize-sensor";
import classnames from "classnames";

type Props = {
  ready: boolean,
  error: null | Object,
  children: Element
};

export default class ViewWrapper extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  render() {
    let classes = classnames("view-wrapper", {
      "view-wrapper--ready": this.props.ready
    });
    let loading;
    if (!this.props.ready && !this.props.error) {
      loading = null;
    }
    return (
      <div className={classes}>
        {loading}
        {this.props.children}
      </div>
    );
  }
}
