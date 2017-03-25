//@flow
import React from "react";

type Props = {
  path: string
};

export default class DisplayHTML extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  render() {
    return <webview className="render-webview" src={this.props.path} />;
  }
}
