import React from "react";
import fs from "fs";

type Props = {
  path: string
};

type State = {
  content: string
};

export default class Editor extends React.Component {
  prop: Props;
  state: State;
  constructor(props: Props) {
    super(props);

    this.state = {
      content: "loading..."
    };

    this.loadFile(props.path);
  }

  render() {
    return (
      <code className="render-plain-text">
        {this.state.content}
      </code>
    );
  }

  componentWillReceiveProps = (nextProps: Props) => {
    this.loadFile(nextProps.path);
  };

  loadFile = (path: string) => {
    fs.readFile(path, "utf8", (err, data) => {
      this.setState({
        content: err || data
      });
    });
  };
}
