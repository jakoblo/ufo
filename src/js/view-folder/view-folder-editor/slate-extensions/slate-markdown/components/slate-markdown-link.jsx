// @flow

import React from "react";
import { shell } from "electron";

type Props = {
  url: string
};

export default class Link extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <span
        className="slate-markdown__link"
        onMouseUp={(event: SyntheticMouseEvent) => {
          if (event.metaKey) {
            event.preventDefault();
            shell.openExternal(this.props.url);
          }
        }}
      >
        {this.props.children}
      </span>
    );
  }
}
