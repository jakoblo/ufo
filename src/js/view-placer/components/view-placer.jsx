//@flow
import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { List } from "immutable";
import classnames from "classnames";
import { remote } from "electron";

import {
  FOLDER_DEFAULT_WIDTH,
  FOLDER_MIN_WIDTH,
  FILE_MIN_WIDTH
} from "../vp-constants";
import ViewFolder from "../../view-folder/view-folder";
import Error from "../../general-components/error";
import App from "../../app/app-index";
import ViewFile from "../../view-file/vf-index";
import ViewWrapper from "./view-wrapper";
import Selection from "../../filesystem/selection/sel-index";
import FS from "../../filesystem/watch/fs-watch-index";
import { Resizable } from "react-resizable";
import ResizeSensor from "./resize-sensor";
import HorizontalScroller from "./horizontal-scroller";
import Measure from "react-measure";
import { TransitionMotion, spring } from "react-motion";
import _ from "lodash";

const TYPE_FOLDER = "TYPE_FOLDER";
const TYPE_FILE = "TYPE_FILE";

const springSettings = {
  stiffness: 300,
  damping: 25,
  precision: 0.1
};

type Props = {
  viewFolderList: any,
  viewFilePath: string,
  focusedView: string,
  dispatch: Function
};

type State = {
  foldersWidth: Array<number>,
  fileWidth: number,
  containerWidth: number,
  innerWidth: number
};

const mapStateToProps = (state, props: Props) => {
  let dirs = FS.selectors.getDirSeq(state);
  return {
    viewFolderList: dirs.map((dir, index) => {
      return FS.selectors.getDirState(state, dir);
    }),
    focusedView: Selection.selectors.getFocused(state),
    viewFilePath: ViewFile.selectors.getViewFilePath(state)
  };
};

class ViewPlacer extends React.Component {
  props: Props;
  state: State;
  constructor(props: Props) {
    super(props);
    this.state = {
      foldersWidth: [],
      fileWidth: 0,
      containerWidth: 0,
      innerWidth: 0
    };
    this.state = { ...this.state, ...this.calcStateByProps(props) };

    remote.getCurrentWindow().on("resize", () => {
      // Calcualte everything again if the Windows is getting resized
      this.setState(this.calcStateByProps(this.props));
    });
  }

  render() {
    return (
      <Measure
        onMeasure={dimensions => {
          this.setState({
            containerWidth: dimensions.width
          });
        }}
      >
        <TransitionMotion
          styles={this.getStyles()}
          willEnter={this.willEnter}
          willLeave={this.willLeave}
        >
          {views => (
            <HorizontalScroller
              className="view-placer"
              innerWidth={this.state.innerWidth} // The innerContainer has a fixed and Calculated with, to allow smooth transitions, if it shrinks
              scrollPosition={this.getScrollPosition()}
            >
              {views.map((view, position) => {
                if (view.data.type == TYPE_FILE) {
                  return (
                    <ViewWrapper
                      style={view.style}
                      scrollToTrigger={view.data.path}
                    >
                      <ViewFile.components.ViewFile path={view.data.path} />
                    </ViewWrapper>
                  );
                } else {
                  return (
                    <Resizable
                      minConstraints={[FOLDER_MIN_WIDTH]}
                      key={position}
                      width={view.style.width}
                      onResize={(event, data) => {
                        this.applyResizeToState(event, data, position, view);
                      }}
                      axis="x"
                    >
                      <ViewWrapper
                        style={view.style}
                        scrollToTrigger={view.data.focused}
                      >
                        <ViewFolder
                          key={view.data.position}
                          path={view.data.dirState.path}
                          error={view.data.dirState.error}
                          fsWatchState={view.data.dirState}
                          focused={view.data.focused}
                          renderContent={true /*view.style.marginLeft > -10*/}
                        />
                      </ViewWrapper>
                    </Resizable>
                  );
                }
              })}
            </HorizontalScroller>
          )}
        </TransitionMotion>
      </Measure>
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState(this.calcStateByProps(nextProps));
  }

  /**
   * scrollLeft Only
   */
  getScrollPosition = () => {
    const { viewFolderList, focusedView } = this.props;
    const { innerWidth, foldersWidth, containerWidth } = this.state;
    const focusedIndex = viewFolderList.findIndex(view => {
      return view.path == focusedView;
    });
    const minScrollPosition = 0;
    const maxScrollPosition = innerWidth - containerWidth;

    if (focusedIndex == viewFolderList.length - 1) {
      return maxScrollPosition; // Last view, go the end
    }

    if (focusedIndex == 0) {
      return minScrollPosition; // First View, go to start
    }

    let focusedCenterOffset = (() => {
      let calcOffset = 0;
      for (var i = 0; i < focusedIndex; i++) {
        // add Previous View widths
        calcOffset = calcOffset + foldersWidth[i];
      }

      //Add the half of the current, to get the final center offset
      calcOffset = calcOffset + foldersWidth[focusedIndex] / 2;
      return calcOffset;
    })();

    let centerScrollPosition = focusedCenterOffset - containerWidth / 2;

    return centerScrollPosition; // Center foused View in container
  };

  calcStateByProps(props) {
    // Calcualte Folder View Widths
    const foldersWidth = this.buildViewSizes(props);

    // Calc File Preview Width
    const fileViewOffset = _.sum(foldersWidth);
    const calculatedFileWidth = this.state.containerWidth - fileViewOffset;
    var fileWidth = 0;
    if (props.viewFilePath) {
      fileWidth = calculatedFileWidth < FILE_MIN_WIDTH
        ? FILE_MIN_WIDTH
        : calculatedFileWidth;
    }
    const innerWidth = fileViewOffset + fileWidth;

    return {
      foldersWidth,
      fileWidth,
      innerWidth
    };
  }

  // Distance from left border of the container
  // css absolute positioned > left
  getOffsetOfView = positon => {
    var offset = 0;
    this.state.foldersWidth.forEach((width, index) => {
      if (index < positon) {
        offset = offset + width;
      }
    });
    return offset;
  };

  applyResizeToState = (event, { element, size }, position, config) => {
    this.state.foldersWidth[position] = size.width;
    this.setState({ foldersWidth: this.state.foldersWidth });
  };

  buildViewSizes = props => {
    return props.viewFolderList.map((view, index) => {
      return this.state.foldersWidth[index] || FOLDER_DEFAULT_WIDTH;
    });
  };

  // React Motion Transition
  // https://github.com/chenglou/react-motion#transitionmotion-

  getStyles = () => {
    const styles = this.props.viewFolderList.map((dirState, position) => {
      return {
        key: position,
        data: {
          dirState,
          position,
          type: TYPE_FOLDER,
          focused: this.props.focusedView == dirState.path
        },
        style: {
          left: this.getOffsetOfView(position),
          zIndex: position * -1,
          width: this.state.foldersWidth[position],
          opacity: spring(1, springSettings)
        }
      };
    });

    if (this.props.viewFilePath) {
      const position = this.props.viewFolderList.length;
      const fileOffset = this.getOffsetOfView(position);
      styles.push({
        key: "FILE",
        data: {
          path: this.props.viewFilePath,
          type: TYPE_FILE
        },
        style: {
          left: fileOffset,
          zIndex: position * -1,
          width: this.state.fileWidth,
          opacity: spring(1, springSettings)
        }
      });
    }
    return styles;
  };

  // Fadein
  willEnter = (config: any) => {
    return {
      ...config.style,
      opacity: 0
    };
  };

  // Fadeout
  willLeave = (config: any) => {
    return {
      ...config.style,
      opacity: spring(0, springSettings)
    };
  };
}

export default connect(mapStateToProps)(ViewPlacer);
