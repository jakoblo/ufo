//@flow
import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { List } from "immutable";
import classnames from "classnames";
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
import Measure from "react-measure";
import { TransitionMotion, spring } from "react-motion";
import _ from "lodash";

const TYPE_FOLDER = "TYPE_FOLDER";
const TYPE_FILE = "TYPE_FILE";
const springSettings = {
  stiffness: 210,
  damping: 20
};

type Props = {
  viewFolderList: any,
  viewFilePath: string,
  selectionRoot: string,
  // displayType: string,
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
    viewFilePath: ViewFile.selectors.getViewFilePath(state),
    selectionRoot: Selection.selectors.getSelectionRoot(state)
    // displayType: App.selectors.getDisplayType(state)
  };
};

class ViewPlacer extends React.Component {
  props: Props;
  state: State;
  viewPlacerComp: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      foldersWidth: [],
      fileWidth: 0,
      containerWidth: 0,
      innerWidth: 0
    };
    this.state = { ...this.state, ...this.calcStateByProps(props) };
  }

  render() {
    const classes = classnames({
      "view-placer": true
      // "view-placer--display-columns": this.props.displayType ==
      //   App.constants.DISPLAY_TYPE_COLUMNS,
      // "view-placer--display-single": this.props.displayType ==
      //   App.constants.DISPLAY_TYPE_SINGLE
    });

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
            <section
              ref={ref => {
                this.viewPlacerComp = ref;
              }}
              className={classes}
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
                        this.resizeToState(event, data, position, view);
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
                        />
                      </ViewWrapper>
                    </Resizable>
                  );
                }
              })}
            </section>
          )}
        </TransitionMotion>
      </Measure>
    );
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState(this.calcStateByProps(nextProps));
  }

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
  getLeftOffset = positon => {
    var offset = 0;
    this.state.foldersWidth.forEach((width, index) => {
      if (index < positon) {
        offset = offset + width;
      }
    });
    return offset;
  };

  resizeToState = (event, { element, size }, position, config) => {
    this.state.foldersWidth[position] = size.width;
    this.setState({ foldersWidth: this.state.foldersWidth });
  };

  buildViewSizes = props => {
    return props.viewFolderList.map((view, index) => {
      return this.state.foldersWidth[index] || FOLDER_DEFAULT_WIDTH;
    });
  };

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
          left: this.getLeftOffset(position),
          width: this.state.foldersWidth[position],
          opacity: spring(1)
        }
      };
    });

    if (this.props.viewFilePath) {
      const position = this.props.viewFolderList.length;
      const fileOffset = this.getLeftOffset(position);
      styles.push({
        key: "FILE",
        data: {
          path: this.props.viewFilePath,
          type: TYPE_FILE
        },
        style: {
          left: fileOffset,
          width: this.state.fileWidth,
          opacity: spring(1)
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
  // Needed that not every change of a view triggers a new enter Animation
  // Don't really know why
  willLeave = (config: any) => {
    return {
      ...config.style,
      opacity: spring(0)
    };
  };
}

export default connect(mapStateToProps)(ViewPlacer);
