//@flow
"use strict";
import React from "react";
import classnames from "classnames";
import { FILE_ICON_TYPES } from "../file-item-constants";

const ANY_TYPE = "ANY";
const FOLDER_TYPE = "FOLDER";

type Props = {
  isDirectory: boolean,
  suffix: string
};

export default class Loading extends React.Component {
  props: Props;

  constructor(props: Props) {
    super(props);
  }

  render() {
    const iconClass = this.getTypeClassName(
      this.getIconType(this.props.isDirectory, this.props.suffix)
    );
    const classes = classnames("file-icon", "file-icon--" + iconClass);
    return <div className={classes} />;
  }

  shouldComponentUpdate(nextProps: Props) {
    return (
      nextProps.isDirectory != this.props.isDirectory ||
      nextProps.suffix != this.props.suffix
    );
  }

  getIconType = (isDirectory: boolean, suffix: string) => {
    if (isDirectory) {
      return FOLDER_TYPE;
    }
    suffix = suffix.toLowerCase();
    for (var TYPE in FILE_ICON_TYPES) {
      if (FILE_ICON_TYPES[TYPE].indexOf(suffix) > -1) {
        return TYPE;
      }
    }
    return ANY_TYPE;
  };

  getTypeClassName = (type: string) => {
    if (FOLDER_TYPE == type) {
      return "folder";
    }
    switch (FILE_ICON_TYPES[type]) {
      case FILE_ICON_TYPES.IMAGE:
        return "image";
      case FILE_ICON_TYPES.PDF:
        return "pdf";
      case FILE_ICON_TYPES.CODE:
        return "code";
      case FILE_ICON_TYPES.DOCUMENT:
        return "document";
      case FILE_ICON_TYPES.ZIP:
        return "zip";
      case FILE_ICON_TYPES.VIDEO:
        return "video";
      case FILE_ICON_TYPES.AUDIO:
        return "audio";
      default:
        return "any";
    }
  };
}
