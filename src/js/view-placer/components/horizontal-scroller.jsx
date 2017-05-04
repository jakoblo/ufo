//@flow
import React from "react";
import { Motion, spring, presets } from "react-motion";
import ScrollPositionContainer from "./scroll-container";

type Props = {
  scrollPosition: number,
  innerWidth: number,
  className: string,
  children?: Element
};

type State = {
  currentScrollPosition: number
};

const springSettings = {
  stiffness: 300,
  damping: 25,
  precision: 0.1
};

export default class Scroller extends React.Component {
  props: Props;
  state: State;
  scrollContainer: any;
  defaultStyle: Object;
  constructor(props: Props) {
    super(props);
    this.defaultStyle = {
      innerWidth: this.props.innerWidth,
      scrollPosition: 0
    };
    this.state = {
      currentScrollPosition: 0
    };
  }

  componentWillReceiveProps() {
    this.setState({
      currentScrollPosition: this.scrollContainer.getScrollPosition()
    });
  }

  render() {
    return (
      <Motion
        defaultStyle={{
          ...this.defaultStyle,
          scrollPosition: this.state.currentScrollPosition
        }}
        style={{
          scrollPosition: spring(this.props.scrollPosition, springSettings),
          innerWidth: spring(this.props.innerWidth, springSettings)
        }}
      >
        {value => {
          return (
            <ScrollPositionContainer
              ref={ref => {
                this.scrollContainer = ref;
              }}
              className={this.props.className}
              scrollLeft={value.scrollPosition}
              scrollable={
                this.state.currentScrollPosition > 0 ||
                  this.props.scrollPosition > 0
              }
            >
              <div
                className={this.props.className + "__scroll-width"}
                style={{
                  width: value.innerWidth
                }}
              >
                {this.props.children}
              </div>
            </ScrollPositionContainer>
          );
        }}
      </Motion>
    );
  }
}
