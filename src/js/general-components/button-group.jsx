import React from "react";

export default class ButtonGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="btn-group">
        {this.props.children}
      </div>
    );
  }
}
