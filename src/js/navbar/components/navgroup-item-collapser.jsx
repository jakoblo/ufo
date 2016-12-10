"use strict"
import React from 'react'

const ITEM_HEIGHT = 26;
const ANIMATION_TIME = 350;

export default class NavGroupItemCollapser extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      height: this.props.collapsed ? 0 : 'auto',
      animationInProgress: false
    }
    this.activeTimeout = null
  }

  render() {
    return(
      <div className="nav-bar-group__item-wrapper" style={{
        height: this.state.height,
        overflow: 'hidden',
        transition: this.state.animationInProgress ? 'height '+ANIMATION_TIME+'ms ease-out' : 'none'
      }}>
        {this.props.children}
      </div>
    )
  }

  componentWillReceiveProps(nextProps, nextState) {
    if(this.props.collapsed != nextProps.collapsed) {
      nextProps.collapsed ? 
        this.collapse() 
        : 
        this.expand()
      ;
    }
  }

  collapse = () => { 
    this.animate(this.props.itemCount * ITEM_HEIGHT, 0, 0)
  }

  expand = () => {
    this.animate(0, this.props.itemCount * ITEM_HEIGHT, 'auto')
  }

  animate = (startHeight, targetHeight, endHeight) => {
    requestAnimationFrame(() => {
      this.setState({
        height: startHeight,
        animationInProgress: false
      })
      requestAnimationFrame(() => {
        this.setState({
          height: targetHeight,
          animationInProgress: true
        })
      })

      clearTimeout(this.activeTimeout)
      this.activeTimeout = setTimeout(() => {
        requestAnimationFrame(() => {
          this.setState({
            height: endHeight,
            animationInProgress: false
          })
        })
      }, ANIMATION_TIME)
    })
  }
}
