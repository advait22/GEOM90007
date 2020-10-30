import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import './radius.css'
export default class RadiusDropDown extends Component {
  // get and pass on the selected value from radius dropdown to the parent component

    onSelectRadius = (event) => {
        this.props.onSelectedRadiusValue(event.target.textContent)
}
  render() {
    return (
      <div style = {{width:'10rem'}}>
      <Dropdown
      placeholder='Select Radius'
      selection
      options={this.props.data}
      onChange={this.onSelectRadius}


  />
      </div>
    )
  }
}
