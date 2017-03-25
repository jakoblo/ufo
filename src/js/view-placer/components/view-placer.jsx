import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { List } from "immutable";
import classnames from "classnames";
import { NAME, DEFAULT_VIEW_WIDTH } from "../vp-constants";
import ViewFolder from "../../view-folder/view-folder";
import Error from "../../general-components/error";
import App from "../../app/app-index";
import ViewFile from "../../view-file/vf-index";
import Selection from "../../filesystem/selection/sel-index";
import FS from "../../filesystem/watch/fs-watch-index";
import _ from "lodash";

@connect(() => {
  return (state, props) => {
    let dirs = FS.selectors.getDirSeq(state);
    return {
      viewFolderList: dirs.map((dir, index) => {
        return FS.selectors.getDirState(state, dir);
      }),
      viewFilePath: ViewFile.selectors.getViewFilePath(state),
      selectionRoot: Selection.selectors.getSelectionRoot(state),
      displayType: App.selectors.getDisplayType(state)
    };
  };
})
export default class ViewPlacer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const classes = classnames({
      "view-placer": true,
      "view-placer--display-columns": this.props.displayType ==
        App.constants.DISPLAY_TYPE_COLUMNS,
      "view-placer--display-single": this.props.displayType ==
        App.constants.DISPLAY_TYPE_SINGLE
    });

    return (
      <section ref="viewPlacer" className={classes}>
        {this.renderViewFolders()}
        {this.renderViewFile()}
      </section>
    );
  }

  componentDidUpdate = prevProps => {
    this.ajustHorizonalScrollPosition(this.props, prevProps);
  };

  renderViewFile = () => {
    if (this.props.viewFilePath) {
      return <ViewFile.components.ViewFile path={this.props.viewFilePath} />;
    }
  };

  renderViewFolders = () => {
    if (!this.props.viewFolderList.length > 0) return null;
    let views = this.props.viewFolderList.map((dirState, index) => {
      return (
        <ViewFolder
          key={dirState.path}
          path={dirState.path}
          error={dirState.error}
          fsWatchState={dirState}
        />
      );
    });
    if (this.props.displayType == App.constants.DISPLAY_TYPE_SINGLE) {
      return _.last(views);
    } else {
      return views;
    }
  };

  ajustHorizonalScrollPosition = (currentProps, prevProps) => {
    if (
      !_.isEqual(currentProps.viewFolderList, prevProps.viewFolderList) ||
      !_.isEqual(currentProps.viewFilePath, prevProps.viewFilePath)
    ) {
      // The Views have been changed, Show the last of them
      // We need this, because last view is maybe not the focused one
      this.scrollToLastView();
    } else {
      // Views are the same, by the focus as maybe changed, (arrow key navigation)
      this.scrollFocusedViewInVisibleArea(currentProps, prevProps);
    }
  };

  scrollToLastView = () => {
    // Just scroll to the right end
    let element = ReactDOM.findDOMNode(this.refs["viewPlacer"]);
    let elementRect = element.getBoundingClientRect();
    element.scrollLeft = elementRect.width;
  };

  scrollFocusedViewInVisibleArea = (currentProps, prevProps) => {
    const selectionHasChangedView = currentProps.selectionRoot !=
      prevProps.selectionRoot;
    const focusedViewIndex = (() => {
      for (var k in currentProps.viewFolderList) {
        if (currentProps.viewFolderList[k].path == currentProps.selectionRoot) {
          var selectionRootedIndex = k;
        }
      }
      return selectionRootedIndex;
    })();

    if (selectionHasChangedView && focusedViewIndex) {
      this.scrollViewInVisibleArea(focusedViewIndex);
    }
  };

  scrollViewInVisibleArea = viewIndex => {
    const SCROLL_OFFSET = 20;
    const viewPlacerDOM = ReactDOM.findDOMNode(this.refs["viewPlacer"]);
    const viewPlacerDOMRect = viewPlacerDOM.getBoundingClientRect();

    const focusedView = viewPlacerDOM.childNodes[viewIndex];
    // if(!focusedView) { return }
    const focusViewRect = focusedView.getBoundingClientRect();

    const outOfView = {
      // Negative value is outside
      leftSide: focusViewRect.left - viewPlacerDOMRect.left,
      rightSide: viewPlacerDOMRect.right - focusViewRect.right
    };

    // viewPlacerDOM.scrollLeft is current horizontal scroll value: 0+
    // Lets add the outOfView value to the current scroll position to bring the view in the Visible Area

    if (outOfView.leftSide < 0) {
      viewPlacerDOM.scrollLeft = viewPlacerDOM.scrollLeft +
        outOfView.leftSide -
        SCROLL_OFFSET;
    }
    if (outOfView.rightSide < 0) {
      viewPlacerDOM.scrollLeft = viewPlacerDOM.scrollLeft +
        -outOfView.rightSide +
        SCROLL_OFFSET;
    }
  };
}
