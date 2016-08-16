"use strict"
import React from 'react'
import { connect } from 'react-redux'
import {NavGroup} from './navgroup'

export class Navbar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const groups = [{name: "Favbar", items: ["Desktop", "Documents", "Pictures"]},
    {name: "Favbar 2", items: ["Desktop", "Documents", "Pictures"]}]
    let navgroups = []
    let key = 0
    for (var item in groups) {
      navgroups.push(<NavGroup key={key++}></NavGroup>)
    }
    return(
      <div className="nav-bar">
        {navgroups}
      </div>
    )
  }
}
