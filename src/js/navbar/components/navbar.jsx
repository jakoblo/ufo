//@flow
import React from "react";
import { connect } from "react-redux";
import * as Actions from "../navbar-actions";
import * as constants from "../navbar-constants";
import NavGroup from "./navgroup";
import nodePath from "path";
import _ from "lodash";
import { remote } from "electron";
import classnames from "classnames";
import * as dragndrop from "../../utils/dragndrop";

type Props = {
  navbar: any,
  dispatch: Function
};

type State = {
  dragOver: boolean,
  draggingGroup: boolean
};

const mapStateToProps = state => {
  return {
    navbar: state[constants.NAME],
    state: state
  };
};
class Navbar extends React.Component {
  props: Props;
  state: State;
  constructor(props: Props) {
    super(props);
    this.state = {
      dragOver: false,
      draggingGroup: false
    };
  }

  render() {
    let navgroups = null;
    if (this.props.navbar.has("groupItems"))
      navgroups = this.props.navbar
        .get("groupItems")
        .toJS()
        .map(this.createNavGroup);

    let classname = classnames({
      "nav-bar": true,
      "nav-bar--drop-target": this.state.dragOver
    });

    return (
      <div className={classname} {...this.dropZoneListener}>
        {navgroups}
      </div>
    );
  }

  createNavGroup = (item, index) => {
    return (
      <NavGroup
        key={item.id}
        index={index}
        groupID={item.id}
        activeItem={this.props.navbar.get("activeItem")}
        title={item.title}
        items={item.items}
        hidden={item.hidden}
        isDiskGroup={item.id === 0 ? true : false} // Devices/Disk Group-ID is always 0
        dispatch={this.props.dispatch}
        draggingGroup={this.state.draggingGroup}
        setDraggingGroup={this.setDraggingGroup}
        clearDraggingGroup={this.clearDraggingGroup}
      />
    );
  };

  setDraggingGroup = dragData => {
    this.setState({ draggingGroup: dragData });
  };

  clearDraggingGroup = () => {
    this.setState({
      draggingGroup: false
    });
  };

  dropZoneListener = dragndrop.getEnhancedDropZoneListener({
    acceptableTypes: [dragndrop.constants.TYPE_FILE],
    possibleEffects: dragndrop.constants.effects.ALL,

    dragHover: () => {
      this.setState({
        dragOver: true
      });
    },

    dragOut: () => {
      this.setState({
        dragOver: false
      });
    },

    drop: (event, cursorPosition) => {
      const fileList = dragndrop.getFilePathArray(event);

      if (fileList.length > 0) {
        let title = _.last(
          _.split(nodePath.dirname(fileList[0]), nodePath.sep)
        );
        this.props.dispatch(Actions.addNavGroup(title, fileList));
      }
    }
  });
}
export default connect(mapStateToProps)(Navbar);
