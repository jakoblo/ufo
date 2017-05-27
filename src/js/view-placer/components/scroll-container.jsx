//@flow
import React from "react";
import classnames from "classnames";

type Props = {
  scrollLeft: number,
  scrollable: boolean,
  className: string,
  children?: Element
};

export default class ScrollContainer extends React.Component {
  scroller: any;
  props: Props;
  constructor(props: Props) {
    super(props);
  }

  getScrollPosition = () => {
    return this.scroller.scrollLeft;
  };

  render() {
    let classes = classnames(this.props.className, {
      [this.props.className + "--scroll"]: this.props.scrollable
    });

    return (
      <div
        className={classes}
        ref={ref => {
          this.scroller = ref;
        }}
      >
        {this.props.children}
      </div>
    );
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.scrollLeft !== this.props.scrollLeft) {
      this.scroller.scrollLeft = this.props.scrollLeft;
    }
  }
}
