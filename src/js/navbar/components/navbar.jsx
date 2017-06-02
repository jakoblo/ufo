//@flow
import React from "react";
import { connect } from "react-redux";
import * as Actions from "../navbar-actions";
import * as constants from "../navbar-constants";
import NavGroup from "./navgroup";
import nodePath from "path";
import AppControls from "../../app/components/app-controls";
import ReadOnlyToggle from "../../app/components/read-only-toggle";

import _ from "lodash";
import { remote } from "electron";
import classnames from "classnames";
import * as dragndrop from "../../utils/dragndrop";
import * as types from "../navbar-types";
import { TransitionMotion, spring } from "react-motion";

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
  groupsHeight: Array<number>;
  constructor(props: Props) {
    super(props);

    this.state = {
      dragOver: false,
      draggingGroup: false
    };
  }

  render() {
    const { navbar } = this.props;
    let classes = classnames({
      sidebar: true,
      "sidebar--drop-target": this.state.dragOver
    });

    this.groupsHeight = this.calcGroupsHeight();

    return (
      <section className={classes} {...this.dropZoneListener}>
        <AppControls />
        <div className="nav-bar">
          <TransitionMotion
            defaultStyles={this.getDefaultStyles()}
            styles={this.getStyles()}
            willLeave={this.willLeave}
            willEnter={this.willEnter}
          >
            {groupConfig => {
              return (
                <div>
                  {groupConfig.map(({ key, data, style }, position) => (
                    <NavGroup
                      key={data.group.id}
                      group={data.group}
                      position={position}
                      style={style}
                      activeItem={this.props.navbar.get("activeItem")}
                      dispatch={this.props.dispatch}
                      draggingGroup={this.state.draggingGroup}
                      setDraggingGroup={this.setDraggingGroup}
                      clearDraggingGroup={this.clearDraggingGroup}
                      onGroupMove={this.handleGroupMove}
                    />
                  ))}
                </div>
              );
            }}
          </TransitionMotion>
        </div>
        <ReadOnlyToggle />
        <div className="sidebar__drop-zone">
          Drop it here to create a new group
        </div>
      </section>
    );
  }

  // actual animation-related logic
  getDefaultStyles = () => {
    return this.props.navbar
      .get("groups")
      .map((group, position) => {
        return {
          key: group.id,
          data: { group, position },
          style: {
            height: this.groupsHeight[position],
            opacity: 1,
            top: this.getTopOffset(position)
          }
        };
      })
      .toJS();
  };

  getStyles = () => {
    return this.props.navbar
      .get("groups")
      .map((group, position) => {
        return {
          key: group.id,
          data: { group, position },
          style: {
            height: spring(this.groupsHeight[position]),
            opacity: spring(1),
            top: spring(this.getTopOffset(position))
          }
        };
      })
      .toJS();
  };

  willEnter = (config: any) => {
    return {
      height: 0,
      opacity: 1,
      top: this.getTopOffset(config.data.position)
    };
  };

  willLeave = (config: any) => {
    return {
      height: spring(0),
      opacity: spring(0),
      top: this.getTopOffset(config.data.position)
    };
  };

  calcGroupsHeight = (): Array<number> => {
    return this.props.navbar
      .get("groups")
      .map(group => {
        const itemCount = group.items.size;
        const hidden = group.hidden;

        let height = constants.TITLE_HEIGHT + constants.GROUP_BUTTOM_PADDING;
        if (!hidden) {
          height = height + itemCount * constants.ITEM_HEIGHT;
        }
        return height;
      })
      .toJS();
  };

  getTopOffset = (position: number): number => {
    let offset = 0;
    this.props.navbar.get("groups").forEach((group, index) => {
      if (index < position) {
        offset = offset + this.groupsHeight[index];
      }
    });
    return offset;
  };

  setDraggingGroup = (dragData: types.groupDragData) => {
    this.setState({ draggingGroup: dragData });
  };

  clearDraggingGroup = () => {
    this.setState({
      draggingGroup: false
    });
  };

  dropZoneListener = dragndrop.getPerformantDropZoneListener({
    acceptableTypes: [dragndrop.constants.TYPE_FILE],
    possibleEffects: dragndrop.constants.effects.ALL,

    hoverEventProcessor: (event): any => {
      event.preventDefault();
      if (this.state.dragOver != true) {
        return () => {
          this.setState({
            dragOver: true
          });
        };
      }
    },

    outEventProcessor: (event): any => {
      if (this.state.dragOver != false) {
        return () => {
          this.setState({
            dragOver: false
          });
        };
      }
    },

    drop: (event, cursorPosition) => {
      const fileList = dragndrop.getFilePathArray(event);

      if (fileList.length > 0) {
        let title = _.last(
          _.split(nodePath.dirname(fileList[0]), nodePath.sep)
        );
        this.props.dispatch(Actions.groupCreate__fileList(title, fileList));
      }
    }
  });

  handleGroupMove = (targetPosition, cursorPosition) => {
    const { draggingGroup } = this.state;
    if (!draggingGroup) return; // no needed data, jet
    const draggingOriginPosition = this.props.navbar
      .get("groups")
      .findIndex(group => {
        return group.get("id") == this.state.draggingGroup.groupId;
      });

    if (draggingOriginPosition === targetPosition) return; // Don't replace items with themselves
    if (
      draggingOriginPosition < targetPosition &&
      cursorPosition == dragndrop.constants.CURSOR_POSITION_TOP
    ) {
      return; // Not over 50% Group height downwards, do nothing for now
    }
    if (
      draggingOriginPosition > targetPosition &&
      cursorPosition == dragndrop.constants.CURSOR_POSITION_BOTTOM
    ) {
      return; // Not over 50% Group height upwards, do nothing for now
    }

    this.props.dispatch(
      Actions.groupMove(draggingOriginPosition, targetPosition)
    );
  };
}
export default connect(mapStateToProps)(Navbar);
