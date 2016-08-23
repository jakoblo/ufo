import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { NAME } from '../vc-constants'
import View from './view'
import DisplayList from '../../display/list/display-list'

@connect((state) => {
  return {
    store: state[NAME]
  }
})
export default class ViewContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      viewWidth: [] 
    }
  }

  /**
   * Set width for every View
   */
  componentWillReceiveProps(nextProps) {
    this.state.viewWidth = this.props.store.get('views').toJS().map((v, index) => {
      return this.state.viewWidth[index] || 250
    })
  }

  render() {
    let cssLeft = 0
    let views = this.props.store.get('views').map((viewObj, index) => {
      cssLeft = cssLeft + this.state.viewWidth[index-1] || 0 
      return ( 
        <View key={index} id={index} cssLeft={cssLeft} onResize={this.resizeHandle}>
          <DisplayList path={viewObj.get('path')} loading={viewObj.get('loading')} />
        </View>
      )
    })

    return(
      <section className="viewContainer">{views}</section>
    )
  }

  /**
   * View Child changes Size
   * Store that Size to the State
   */
  resizeHandle = (id, width) => {
    this.state.viewWidth[id] = width
    this.setState({
      viewWith: this.state.viewWith
    })
  }
}
