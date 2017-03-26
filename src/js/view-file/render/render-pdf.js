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
      <iframe
        className="renderer-pdf"
        src={
          "__dirname/../../../node_modules/pdfjs-dist-viewer-min/build/minified/web/viewer.html?file=" +
            this.props.path
        }
      />
    );
  }
}
