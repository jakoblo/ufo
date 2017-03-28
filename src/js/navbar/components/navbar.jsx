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
import * as types from "../navbar-types";

let groupTopOffset = 0;

type Props = {
  navbar: any,
  dispatch: Function
};

type State = {
  dragOver: boolean,
  draggingGroup: types.groupDragData
};

const mapStateToProps = state => {
  return {
    navbar: state[constants.NAME]
  };
};
class Navbar extends React.Component {
  props: Props;
  state: State;
  constructor(props: Props) {
    super(props);

    props.dispatch(Actions.loadNavbarfromStorage());

    this.state = {
      dragOver: false,
      draggingGroup: false
    };
  }

  render() {
    const { navbar } = this.props;
    let classname = classnames({
      "nav-bar": true,
      "nav-bar--drop-target": this.state.dragOver
    });

    const groupsHeight = this.calcGroupsHeight();

    return (
      <div className={classname} {...this.dropZoneListener}>
        {navbar.get("groups").map(group => {
          return this.renderNavGroup(
            group,
            this.getTopOffset(group.id, groupsHeight)
          );
        })}
      </div>
    );
  }

  calcGroupsHeight = () => {
    return this.props.navbar
      .get("groups")
      .map(group => {
        const itemCount = group.get("items").size;
        const hidden = group.get("hidden");

        let height = constants.TITLE_HEIGHT + constants.GROUP_BUTTOM_PADDING;
        if (!hidden) {
          height = height + itemCount * constants.ITEM_HEIGHT;
        }
        return height;
      })
      .toJS();
  };

  getTopOffset = (id: number, groupsHeight: Array<number>) => {
    let offset = 0;
    const position = this.props.navbar.get("groupsOrder").indexOf(id);
    this.props.navbar.get("groupsOrder").forEach((id, index) => {
      if (index < position) {
        offset = offset + groupsHeight[id];
      }
    });
    return offset;
  };

  renderNavGroup = (group, offset) => {
    const position = this.props.navbar.get("groupsOrder").indexOf(group.id);
    return (
      <NavGroup
        key={group.id}
        group={group}
        position={position}
        top={offset}
        activeItem={this.props.navbar.get("activeItem")}
        dispatch={this.props.dispatch}
        draggingGroup={this.state.draggingGroup}
        setDraggingGroup={this.setDraggingGroup}
        clearDraggingGroup={this.clearDraggingGroup}
      />
    );
  };

  setDraggingGroup = (dragData: types.groupDragData) => {
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

    dragHover: event => {
      event.preventDefault();
      if (this.state.dragOver != true) {
        this.setState({
          dragOver: true
        });
      }
    },

    dragOut: event => {
      if (this.state.dragOver != false) {
        this.setState({
          dragOver: false
        });
      }
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
