import React from 'react'
import { connect } from 'react-redux'
import { List } from 'immutable'
import { NAME } from '../vc-constants'
import View from './view'

@connect((store) => {
  return {
    viewList: store[NAME]
  }
})
export default class ViewContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {

    let views = this.props.viewList.map((viewObj, index) => {
      let leftDistance = index * 250
      return ( <View key={index} path={viewObj.get('path')} loading={viewObj.get('loading')} leftDistance={leftDistance} /> )
    })

    return(
      <section className="viewContainer">
        {views}
        {this.props.children}
      </section>
    )
  }
}
