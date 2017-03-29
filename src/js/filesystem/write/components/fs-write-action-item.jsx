//@flow

import React from "react";
import classnames from "classnames";
import nodePath from "path";

type Props = {
  path: string
};

export default class FsWriteActionItem extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div
        className={classnames({
          "fs-write-action__item": true,
          "fs-write-action__item--theme-file": nodePath.extname(
            this.props.path
          ).length > 0,
          "fs-write-action__item--theme-folder": !nodePath.extname(
            this.props.path
          )
        })}
      >
        <div className="fs-write-action__item__filename">
          {nodePath.basename(this.props.path)}
        </div>
      </div>
    );
  }
}
