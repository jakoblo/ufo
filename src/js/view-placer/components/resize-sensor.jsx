//@flow
import React from "react";

type Props = {
  onResize: Function
};

export default class ResizeSensor extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <iframe
        ref="iframe"
        style={{
          border: "none",
          background: "transparent",
          height: 0,
          zIndex: -1
        }}
      />
    );
  }

  componentDidMount() {
    this.refs.iframe.contentWindow.addEventListener(
      "resize",
      this._handleResize
    );
  }

  componentWillUnmount() {
    this.refs.iframe.contentWindow.removeEventListener(
      "resize",
      this._handleResize
    );
  }

  _handleResize() {
    window.requestAnimationFrame(this.props.onResize);
  }
}
