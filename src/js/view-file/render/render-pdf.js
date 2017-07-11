//@flow
import React from "react";

type Props = {
  path: string
};

export default class DisplayPDF extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div
        className="renderer-pdf"
        onMouseDown={e => {
          e.stopPropagation(); // avoid cancel events by Root Event Catcher
        }}
      >
        <webview
          src={"local://" + this.props.path}
          style={{
            width: "100%"
          }}
        />
      </div>
    );
  }
}
