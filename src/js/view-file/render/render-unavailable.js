//@flow
import React from "react";

import electron from "electron";
const { app } = electron.remote;

type Props = {
  path: string
};

type State = {
  previewImage: string
};

export default class DisplayUnavailable extends React.Component {
  props: Props;
  state: State;
  constructor(props: Props) {
    super(props);
    this.state = {
      previewImage: ""
    };
    this.requestIcon(this.props.path);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.path != nextProps.path) {
      this.requestIcon(nextProps.path);
    }
  }

  requestIcon = (path: string) => {
    console.log(path);
    app.getFileIcon(path, (error, image) => {
      this.setState({
        previewImage: "data:image/png;base64," +
          image.toPNG().toString("base64")
      });
    });
  };

  render() {
    return (
      <div className="render-unavailable">
        <img src={this.state.previewImage} />
      </div>
    );
  }
}
