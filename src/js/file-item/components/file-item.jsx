//@flow
import { remote, Menu, MenuItem } from "electron";
const { app } = remote;
import React from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import classNames from "classnames";
import { Map } from "immutable";
import RenameInput from "../../filesystem/rename/components/rename-input";
import ProgressPie from "../../general-components/progress-pie";
import FileItemUnkown from "./file-item-unknown";
import * as DnD from "../../utils/dragndrop";
import * as FileActions from "../fi-actions";
import Selection from "../../filesystem/selection/sel-index";
import scrollIntoView from "dom-scroll-into-view";

import * as FsMergedSelector from "../../filesystem/fs-merged-selectors";

type Props = {
  file: any,
  path: string,
  asImage?: boolean,
  toggleImageCallback?: Function,
  // isFocused: boolean,
  className: string,
  onDrop: Function,
  dispatch: Function
};

type State = {
  data: Map<string, any>
};

const mapStateToProps = (state, props) => {
  const getFile = FsMergedSelector.getFile_Factory();
  return (state, props) => {
    return {
      file: getFile(state, props.path)
    };
  };
};

class FileItemComp extends React.Component {
  props: Props;
  state: State;
  element: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      data: Map({
        openAnimation: false,
        dropTarget: false,
        renaming: false,
        openAnimation: false,
        icon: null
      })
    };
    // this.requestIcon(this.props.file.get("path"));
  }

  render() {
    const { className, file } = this.props;
    const immState = this.state.data;

    if (file.get("type") == "unknown") {
      return <FileItemUnkown className={className} />;
    }

    return (
      <div
        className={classNames({
          [className]: true,
          [className + "--renaming"]: file.get("renaming"),
          [className + "--theme-folder"]: file.get("stats").isDirectory(),
          [className + "--theme-file"]: file.get("stats").isFile(),
          [className + "--theme-image"]: this.props.asImage,
          [className + "--active"]: file.get("active"),
          [className + "--selected"]: file.get("selected"),
          // [className + "--is-focused"]: isFocused,
          [className + "--drop-target"]: file.get("stats").isDirectory() &&
            immState.get("dropTarget"),
          [className + "--drop-target-top"]: immState.get("dropTarget") ==
            DnD.constants.CURSOR_POSITION_TOP,
          [className + "--drop-target-bottom"]: immState.get("dropTarget") ==
            DnD.constants.CURSOR_POSITION_BOTTOM,
          [className + "--open-animation"]: immState.get("openAnimation"),
          [className + "--in-progress"]: file.get("progress")
        })}
        ref={ref => {
          this.element = ref;
        }}
      >
        <div className={className + "__underlay"} />

        {file.get("progress")
          ? <ProgressPie
              className={className + "__progress-pie"}
              progress={file.get("progress")}
              size={16}
            />
          : this.props.asImage
              ? <div className={className + "__image-container"}>
                  <img
                    className={className + "__image"}
                    src={this.props.file.get("path")}
                  />
                </div>
              : <div
                  className={className + "__icon"}
                  style={
                    immState.get("icon")
                      ? {
                          backgroundImage: 'url("' + immState.get("icon") + '")'
                        }
                      : null
                  }
                />}

        <div className={className + "__name-base"}>{file.get("name")}</div>
        <div className={className + "__name-suffix"}>{file.get("suffix")}</div>
        {file.get("renaming")
          ? <RenameInput
              className={className + "__rename-input"}
              path={file.get("path")}
              dispatch={this.props.dispatch}
            />
          : <div
              className={className + "__event-catcher"}
              draggable={true}
              onDragStart={this.onDragStart}
              onMouseDown={this.onMouseDown}
              onClick={this.onClick}
              onContextMenu={this.onContextMenu}
              onDoubleClick={this.onDoubleClick}
              {...this.enhancedDropZoneListener}
            />}
      </div>
    );
  }

  setImmState(fn: Function) {
    // https://github.com/facebook/immutable-js/wiki/Immutable-as-React-state
    return this.setState(({ data }) => ({
      data: fn(data)
    }));
  }

  componentWillReceiveProps = (nextProps: Props) => {
    if (
      this.props.file.get("selected") == false &&
      nextProps.file.get("selected") == true
    ) {
      this.scrollIntoView();
    }
  };

  scrollIntoView = () => {
    const element: any = ReactDOM.findDOMNode(this.element);
    const scrollWrapper = element.closest(".view-folder__editor-container");
    scrollIntoView(element, scrollWrapper, {
      onlyScrollIfNeeded: true,
      offsetTop: 55, // Folder Title Bar
      offsetBottom: 30 // Bottom Button, add Folder
    });
  };

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      nextProps.file !== this.props.file ||
      // nextProps.isFocused !== this.props.isFocused ||
      nextState.data !== this.state.data ||
      this.props.asImage != nextProps.asImage
    );
  }

  requestIcon = (path: string) => {
    if (
      this.props.file &&
      this.props.file.get("stats") &&
      this.props.file.get("stats").isFile()
    ) {
      app.getFileIcon(path, { size: "small" }, (error, image) => {
        if (!error) {
          this.setImmState(prevState =>
            prevState.set(
              "icon",
              "data:image/png;base64," + image.toPNG().toString("base64")
            )
          );
        }
      });
    }
  };

  onDragStart = (event: SyntheticDragEvent) => {
    event.preventDefault();
    if (!this.props.file.get("progress")) {
      this.props.dispatch(FileActions.startDrag(this.props.file));
    }
  };

  enhancedDropZoneListener = DnD.getEnhancedDropZoneListener({
    acceptableTypes: [DnD.constants.TYPE_FILE],
    possibleEffects: DnD.constants.effects.COPY_MOVE,

    dragHover: (event, cursorPosition) => {
      event.preventDefault();
      event.stopPropagation();
      this.startPeakTimeout();
      this.setImmState(prevState =>
        prevState.set("dropTarget", cursorPosition)
      );
    },

    dragOut: event => {
      event.preventDefault();
      event.stopPropagation();
      this.cancelPeakTimeout();
      this.setImmState(prevState => prevState.set("dropTarget", false));
    },

    drop: (event, cursorPosition) => {
      if (this.props.onDrop) {
        this.props.onDrop(event, cursorPosition);
      }
    }
  });

  dragOverTimeout = null;

  startPeakTimeout = () => {
    if (
      this.props.file.get("stats").isDirectory() &&
      this.dragOverTimeout == null
    ) {
      this.dragOverTimeout = setTimeout(() => {
        this.props.dispatch(FileActions.show(this.props.file));
      }, 1000);
    }
  };

  cancelPeakTimeout = () => {
    clearTimeout(this.dragOverTimeout);
    this.dragOverTimeout = null;
  };

  onMouseDown = (event: SyntheticMouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Cmd Click adds the file to selection
      // This cant be handeled by the editor
      // The editor has only one selection
      event.preventDefault();
      event.stopPropagation();
      this.props.dispatch(
        Selection.actions.filesAdd([this.props.file.get("path")])
      );
    }
  };

  //Show Folder or File in Preview
  onClick = (event: SyntheticMouseEvent) => {
    // event.stopPropagation()
    if (!this.props.file.get("progress")) {
      if (!event.ctrlKey && !event.metaKey && !event.shiftKey) {
        // if(!this.props.file.get('selected')) {
        this.props.dispatch(FileActions.show(this.props.file));
        // }
      }
    }
  };

  //Open File in Default Application
  onDoubleClick = (event: SyntheticMouseEvent) => {
    if (
      !this.props.file.get("progress") &&
      this.props.file.get("stats").isFile()
    ) {
      // Open
      this.props.dispatch(FileActions.open(this.props.file));

      this.setImmState(prevState => prevState.set("openAnimation", true));
      setTimeout(() => {
        this.setImmState(prevState => prevState.set("openAnimation", false));
      }, 1000);
    }
  };

  //Right Click menu
  onContextMenu = (event: SyntheticMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (!this.props.file.get("progress")) {
      this.props.dispatch(
        FileActions.showContextMenu(
          this.props.file,
          this.props.asImage,
          this.props.toggleImageCallback
        )
      );
    }
  };
}

export default connect(mapStateToProps)(FileItemComp);
