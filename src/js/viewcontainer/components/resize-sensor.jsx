var React = require('react');

var ResizeSensor = React.createClass({
  propTypes: {
    onResize: React.PropTypes.func.isRequired,
  },
  render: function () {
    return (
      <iframe ref="iframe" style={{
        height: '100%',
        width: '100%',
        border: 'none',
        background: 'transparent',
        position: 'absolute',
        zIndex: -1,
        top: 0,
        left: 0,
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