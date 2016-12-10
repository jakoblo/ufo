"use strict"
import React from 'react'
import classnames from 'classnames'

const itemHeight = 24
const arrowWidth = 17
const topSpacing = 11
const bottomSpacing = 9
const mainColor = '#3A606F';
const errorColor = '#D1335B';
const sallowColor = '#E1E1E1';
const bgColor = '#FFFFFF';

export default class ProgressArrow extends React.Component {

  constructor(props) {
    super(props)
  }

 render() {
  let arrow = null

  if(this.props.error) {
    arrow = this.renderArrow( errorColor, 100, false, this.props.error )
  } else if (this.props.finished) {
    arrow = this.renderArrow( mainColor, 100, this.props.finished, this.props.error )
  } else {
    arrow = <g>
              {this.renderArrow( sallowColor, 100 )} 
              {this.renderArrow( mainColor, this.props.progress )}
            </g>
  }

  return (
    <div className={this.props.className} style={{
      height: itemHeight * (this.props.sourceCount + 1),
      width: arrowWidth
    }}>
      {arrow}
    </div>
    )
  }

  renderArrow = (color, progress, finished, error) => {

    let height = itemHeight * (this.props.sourceCount + 1)
    let progressHeight = (height-topSpacing-bottomSpacing) * (progress / 100) + topSpacing;
    let betweenParts = []
    for (var index = 1; index < this.props.sourceCount; index++) {
      betweenParts.push( this.arrowPartBetween(6, index*itemHeight, color) )
    }

    return <svg width={arrowWidth+'px'} height={height+'px'} viewBox={"0 0 "+arrowWidth+' '+height} style={{
      fillRule: 'evenodd',
      clipRule: 'evenodd',
      strokeLinejoin: 'round',
      strokeMiterlimit: 1.41421
      }}>
        <clipPath id="clip"><rect x="0" y="0" width={arrowWidth} height={progressHeight}/></clipPath>
        <g clipPath="url(#clip)">
          {this.arrowPartStart(6, 0, color)}
          {betweenParts}
          {this.arrowPartEnd(6, itemHeight*(this.props.sourceCount), color)}
          {(finished) ? 
            this.checkIcon(0, itemHeight*(this.props.sourceCount) - 6, color, bgColor)
          : null} 
          {(error) ? 
            this.errorIcon(0, itemHeight*(this.props.sourceCount) - 6, color, bgColor)
          : null} 
        </g>
      </svg>
  }


  arrowPartStart = (x, y, color) => {
    let styles = {fill: color}
    return (
      <path 
        d={
          "M"+x+","+(y+16.858)+"l0.002,-0.112c0.024,-0.737 0.174,-1.463 0.462,-2.144c0.296,-0.699 0.727,-1.338 1.263,-1.874c0.605,-0.605 1.34,-1.076 2.143,-1.37c0.65,-0.238 1.334,-0.354 2.025,-0.358l2.735,0c0,0.667 0,1.333 0,2c-0.961,0 -1.922,-0.028 -2.883,0.003c-0.083,0.004 -0.166,0.009 -0.248,0.017c-0.448,0.049 -0.884,0.168 -1.29,0.364c-0.908,0.437 -1.626,1.228 -1.973,2.174c-0.151,0.414 -0.227,0.849 -0.236,1.29c-0.01,1.665 -0.021,4.248 -0.028,7.152l-1.972,0l0,-7.142Z"
        } 
        style={styles}
      />
    )
  }

  arrowPartBetween = (x, y, color) => {
    let styles = {fill: color}
    return (
      <path 
        key={y}
        d={
          "M"+(x+1.972)+","+y+"c-0.01,4.091 -0.014,8.817 -0.005,12.501c0.555,-0.496 1.204,-0.887 1.903,-1.143c0.65,-0.238 1.334,-0.354 2.025,-0.358l2.735,0c0,0.667 0,1.333 0,2c-0.961,0 -1.922,-0.028 -2.883,0.003c-0.083,0.004 -0.166,0.009 -0.248,0.017c-0.448,0.049 -0.884,0.168 -1.29,0.364c-0.908,0.437 -1.626,1.228 -1.973,2.174c-0.151,0.414 -0.227,0.849 -0.236,1.29c-0.001,0.13 -0.013,3.32 -0.023,7.152l-2.038,0c-0.003,-8.915 0.003,-17.89 0.02,-24l2.013,0Z"
        }
        style={styles}
      />
    )
  }

  arrowPartEnd = (x, y, color) => {
    let styles = {fill: color}
    return (
      <path 
        d={
          "M"+(x+1.973)+","+y+"c-0.001,2.553 0.005,5.193 0.028,7.078c0.015,0.396 0.082,0.784 0.216,1.158c0.195,0.543 0.516,1.037 0.934,1.435c0.373,0.355 0.82,0.63 1.305,0.804c0.285,0.102 0.582,0.169 0.883,0.199c0.097,0.009 0.5,-0.003 0.597,0l0,-2.999l5,4l-5,4l0,-3.001c-0.163,-0.003 -0.632,0.006 -0.795,-0.01c-0.417,-0.041 -0.83,-0.129 -1.228,-0.261c-0.797,-0.263 -1.532,-0.705 -2.141,-1.283c-0.609,-0.58 -1.087,-1.295 -1.39,-2.08c-0.167,-0.434 -0.281,-0.888 -0.339,-1.35c-0.023,-0.187 -0.034,-0.374 -0.041,-0.562c-0.013,-1.013 -0.024,-3.582 -0.033,-7.128l2.004,0Z"
        }
        style={styles}
      />
    )
  }

  checkIcon = (x, y, color, bgColor) => {
    let stylesCheck = {fill: color}
    let stylesBg = {fill: bgColor}
    return (
      <g>
        <rect x={x} y={y} width="13" height="13" style={stylesBg}/>
        <path 
          d={
            "M"+(x+6.5)+","+(y+12)+"c-3.038,0 -5.5,-2.462 -5.5,-5.5c0,-3.037 2.462,-5.5 5.5,-5.5c3.037,0 5.5,2.463 5.5,5.5c0,3.038 -2.463,5.5 -5.5,5.5Zm2.897,-7.454c-0.282,-0.27 -0.738,-0.27 -1.02,0l-2.564,2.435l-0.732,-0.682c-0.282,-0.269 -0.738,-0.269 -1.02,0c-0.281,0.271 -0.281,0.709 0,0.979l1.242,1.17c0.282,0.27 0.738,0.27 1.02,0l3.074,-2.924c0.281,-0.27 0.281,-0.708 0,-0.978Z"
          } 
          style={stylesCheck}/>
      </g>
    )
  }

  errorIcon = (x, y, color, bgColor) => {
    let stylesCheck = {fill: color}
    let stylesBg = {fill: bgColor}
    return (
      <g>
        <rect x={x} y={y} width="13" height="13" style={stylesBg}/>
        <path 
          d={
            "M"+(x+9.876)+","+(y+3.124)+"c-0.462,-0.461 -1.21,-0.461 -1.672,0l-1.704,1.704l-1.704,-1.704c-0.462,-0.461 -1.21,-0.461 -1.672,0c-0.461,0.462 -0.461,1.21 0,1.671l1.704,1.705l-1.704,1.704c-0.461,0.461 -0.461,1.21 0,1.672c0.462,0.462 1.21,0.462 1.672,0l1.704,-1.704l1.704,1.704c0.462,0.462 1.21,0.462 1.672,0c0.461,-0.462 0.461,-1.211 0,-1.672l-1.704,-1.704l1.704,-1.705c0.461,-0.461 0.461,-1.209 0,-1.671Z"
          } 
          style={stylesCheck}
        />
      </g>
    )
  }
}