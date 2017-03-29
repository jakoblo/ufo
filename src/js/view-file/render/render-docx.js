//@flow
import React from "react";
import classnames from "classnames";
import mammoth from "mammoth";

type Props = {
  path: string
};

type State = {
  html: string
};

export default class DisplayDocx extends React.Component {
  path: Props;
  state: State;
  constructor(props: Props) {
    super(props);
    this.state = {
      html: ""
    };
    this.docxtohtml();
  }

  docxtohtml() {
    var self = this;
    mammoth
      .convertToHtml({ path: this.props.path })
      .then(function(result) {
        self.setState({ html: result.value });
        var messages = result.messages; // Any messages, such as warnings during conversion
      })
      .done();
  }

  render() {
    let classes = classnames("display", "html");

    return (
      <div className={classes}>
        <iframe src={"data:text/html," + this.state.html} />
      </div>
    );
  }
}
