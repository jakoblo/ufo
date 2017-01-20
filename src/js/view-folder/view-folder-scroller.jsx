import React from 'react'
import classnames from 'classnames'
import _ from 'lodash'
import nodePath from 'path'

import Scroll from 'react-scroll';

var Link       = Scroll.Link;
var Element    = Scroll.Element;
var Events     = Scroll.Events;
var scroll     = Scroll.animateScroll;
var scrollSpy  = Scroll.scrollSpy;

export default class ViewFolderScroller extends React.Component {
  constructor(props) {
    super(props)
  }
  // componentDidMount = () => {

  //   Events.scrollEvent.register('begin', function(to, element) {
  //     console.log("begin", arguments);
  //   });

  //   Events.scrollEvent.register('end', function(to, element) {
  //     console.log("end", arguments);
  //   });

  //   scrollSpy.update();

  // }

  // componentWillUnmount = () => {
  //   Events.scrollEvent.remove('begin');
  //   Events.scrollEvent.remove('end');
  // }

  render() {

    if(this.props.scrollTo) { 
      console.log(this.props.scrollTo)
      scroll.scrollTo(this.props.scrollTo)
    }

    return <div className="folder-display-list__item-container"> 
            {this.props.children}
           </div>
  }
}
