//@flow
import React from "react";

type Props = {
  path: string
};

export default class DisplayImage extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className="render-image__container">
        <div className="render-image__wrapper">
          <img
            className="render-image__img"
            src={"local://" + this.props.path}
          />
        </div>
      </div>
    );
  }
}
