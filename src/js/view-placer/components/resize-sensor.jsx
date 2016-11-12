import React from 'react'

var ResizeSensor = React.createClass({
  propTypes: {
    onResize: React.PropTypes.func.isRequired,
  },
  render: function () {
    return (
      <iframe ref="iframe" style={{
        border: 'none',
        background: 'transparent',
        height: 0,
        zIndex: -1,
      }} />
    );
  },

  componentDidMount: function () {
    this.refs.iframe.contentWindow.addEventListener('resize', this._handleResize);
  },

  componentWillUnmount: function () {
    this.refs.iframe.contentWindow.removeEventListener('resize', this._handleResize);
  },

  _handleResize: function () {
    window.requestAnimationFrame(this.props.onResize);
  }
});
export default ResizeSensor