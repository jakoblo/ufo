// From https://github.com/wangzuo
// Github https://github.com/wangzuo/react-progress-label

/**
 * Copyright (c) Jahr (vierstellig), Name der Firma oder Person

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

var React = require('react');

export default React.createClass({
  displayName: 'ProgressLabel',

  propTypes: {
    size: React.PropTypes.number,
    startDegree: React.PropTypes.number,
    endDegree: React.PropTypes.number,
    borderWith: React.PropTypes.number,
    progress: React.PropTypes.number,
    className: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      startDegree: 0,
      progress: 0,
      borderWith: 1,
      size: 200,
      className: 'progress-pie'
    };
  },

  getPoint(r, degree) {
    var size = this.props.size;
    var d = degree/180 * Math.PI;

    return {
      x: r * Math.sin(d) + size/2,
      y: this.props.size/4 + r * (1 - Math.cos(d))
    };
  },

  render() {
    var size = this.props.size;
    var progress = this.props.progress;
    var r = size/2 - this.props.size/4;
    var startDegree = this.props.startDegree;
    var endDegree = startDegree + progress * 360 / 100;
    var s = this.getPoint(r, this.props.startDegree);
    var e = this.getPoint(r, endDegree);

    var progressPath = null;
    if(progress < 50) {
      progressPath = `M ${s.x} ${s.y} A ${r} ${r}, 0, 0, 1, ${e.x},${e.y}`;
    } else {
      var m = this.getPoint(r, startDegree + 180);
      progressPath =
        `M ${s.x} ${s.y} A ${r} ${r}, 0, 0, 1, ${m.x},${m.y}
        M ${m.x} ${m.y} A ${r} ${r}, 0, 0, 1, ${e.x},${e.y}`;
    }

    var progressStyle = {
      strokeWidth: this.props.size / 2
    };

    var trackStyle = {
      strokeWidth: this.props.borderWith
    };

    return (
      <svg width={size} height={size} className={this.props.className} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size/2}
          cy={size/2}
          r={size/2 - (this.props.borderWith / 2)}
          className={this.props.className+"__background"}
          style={trackStyle}
        />

        {progress > 0 ?
        <path
          className={this.props.className+"__progress"}
          d={progressPath}
          style={progressStyle}
        /> : null}

        {this.props.children}
      </svg>
    );
  }
});