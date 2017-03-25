//@flow
import React from "react";

type Props = {
  error: Object
};

export default class Button extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  render() {
    let styles = {
      color: "#f00",
      padding: "20px"
    };

    return (
      <div style={styles}>
        <pre>
          {JSON.stringify(this.props.error, null, 2)}
        </pre>
      </div>
    );
  }
}
