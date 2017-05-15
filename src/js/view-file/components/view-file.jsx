//@flow
import React from "react";
import { connect } from "react-redux";
import nodePath from "path";
import FS from "../../filesystem/watch/fs-watch-index";
import filesize from "filesize"; // https://www.npmjs.com/package/filesize
import classnames from "classnames";
import getRenderer from "../render/get-renderer";
import Loading from "../../general-components/loading";

type Props = {
  file: any,
  path: string
};

const mapStateToProps = (state, props) => {
  return {
    file: FS.selectors.getFile(state, props.path)
  };
};
class ViewFile extends React.Component {
  props: Props;
  container: any;
  monthNames: Array<string>;
  constructor(props: Props) {
    super(props);
    this.monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
  }

  render() {
    let file = this.props.file;
    if (!file) return <Loading />;
    let FileRenderer = getRenderer(nodePath.extname(this.props.path));
    return (
      <div
        ref={ref => {
          this.container = ref;
        }}
        className="view-file"
      >
        <div className="view-file__top-toolbar">
          <div className="view-file__name">
            {this.props.file.get("base")}
            <div className="view-file__size">
              {filesize(file.get("stats").size)}
            </div>
          </div>
        </div>
        <FileRenderer path={this.props.path} />

        <div className="view-file__bottom-bar">
          <div className="view-file__time-container">
            {this.getFileTime(file.get("stats").mtime, "Modified")}
            {this.getFileTime(file.get("stats").birthtime, "Created")}
            {this.getFileTime(file.get("stats").atime, "Accessed")}
          </div>
        </div>
      </div>
    );
  }

  getFileTime(date: Date, type: string) {
    return (
      <div className="file-time">
        <div className="file-time__type">{type}</div>
        <div className="file-time__date">
          {date.getDate() +
            " " +
            this.monthNames[date.getMonth()] +
            " " +
            date.getFullYear()}
        </div>
        <div className="file-time__clock">
          {date.toLocaleTimeString()}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ViewFile);
