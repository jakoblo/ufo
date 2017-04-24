// @flow

import React from "react";
import { connect } from "react-redux";
import TypeInput from "../filesystem/selection/components/selection-type-input";
import Filter from "../filesystem/filter/filter-index";
import App from "../app/app-index";
import classnames from "classnames";
import nodePath from "path";
import Button from "../general-components/button";
import Loading from "../general-components/loading";
import Error from "../general-components/error";
import fsWrite from "../filesystem/write/fs-write-index";
import Selection from "../filesystem/selection/sel-index";

// import ViewFolderList from "./view-folder-list/view-folder-list";
import ViewFolderEditor from "./view-folder-editor/components/folder-editor";

import { dragndrop } from "../utils/utils-index";

const PADDING_TOP = 50;
const PADDING_BOTTOM = 30;

type Props = {
  path: string,
  focused: boolean,
  viewSettings: any,
  style: Object,
  displayType: string,
  error: Object,
  fsWatchState: any,
  dispatch: () => void
};

const mapStateToProps = (state, props) => {
  const { path } = props;
  return {
    viewSettings: App.selectors.getViewSettings(state, path),
    displayType: App.selectors.getDisplayType(state, path)
  };
};
class DisplayList extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  render() {
    // const typeToggleClasses = classnames({
    //   "view-folder__type-toggle": true,
    //   "view-folder__type-toggle--editor": this.props.viewSettings.get("type") ==
    //     App.constants.FOLDER_VIEW_EDITOR,
    //   "view-folder__type-toggle--list": this.props.viewSettings.get("type") ==
    //     App.constants.FOLDER_VIEW_LIST
    // });
    //
    // const displayToggleClasses = classnames({
    //   "view-folder__display-toggle": true,
    //   "view-folder__display-toggle--single": this.props.displayType ==
    //     App.constants.DISPLAY_TYPE_SINGLE,
    //   "view-folder__display-toggle--columns": this.props.displayType ==
    //     App.constants.DISPLAY_TYPE_COLUMNS
    // });
    return (
      <div
        className={classnames({
          "view-folder": true,
          "view-folder--drop-target": false,
          "view-folder--focused": this.props.focused
        })}
        onDrop={e => dragndrop.executeFileDropOnDisk(e, this.props.path)}
        onClick={event => {
          // Focus typeSelection & Scroll to
          this.props.dispatch(Selection.actions.focusDir(this.props.path));
        }}
      >
        <div className="view-folder__toolbar-top">
          <div className="view-folder__name">
            {nodePath.basename(this.props.path)}
          </div>

          {/*  Disable View Features, maybe use in future
            <div className={typeToggleClasses} onClick={this.toggleViewType}>
              <div className="view-folder__type-toggle__bullet" />
            </div>
            <div
              className={displayToggleClasses}
              onClick={this.toggleDisplayType}
            /> */}
        </div>
        {this.renderViewType()}
        <div className="view-folder__toolbar-bottom">
          <button
            className="view-folder__button-add-folder"
            onClick={() => {
              this.props.dispatch(fsWrite.actions.newFolder(this.props.path));
            }}
          />
          <TypeInput path={this.props.path} />
        </div>
      </div>
    );
  }

  renderViewType = () => {
    const { fsWatchState } = this.props;
    const test = this.props.fsWatchState;

    if (!fsWatchState.ready) return <Loading />;
    if (fsWatchState.error) return <Error error={fsWatchState.error} />;
    switch (this.props.viewSettings.get("type")) {
      case App.constants.FOLDER_VIEW_EDITOR:
        return <ViewFolderEditor path={this.props.path} />;
      // case App.constants.FOLDER_VIEW_LIST:
      //   return <ViewFolderList path={this.props.path} />;


      default:
        throw "No valid folder view type";
    }
  };

  toggleViewType = () => {
    this.props.dispatch(App.actions.viewTypeToggle(this.props.path));
  };

  toggleDisplayType = () => {
    this.props.dispatch(App.actions.toggleDisplayType());
  };
}
export default connect(mapStateToProps)(DisplayList);
