import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import './dropdown.css'
export default class DropDown extends Component {

  getSelectedValue = (event) => {
    this.props.onvalueChange(event.target.textContent)
}
  render() {
    return (
      <div style = {{width:'20rem'}}>
      <Dropdown
      placeholder='Select Cateogry'
      selection
      options={this.props.data}
      onChange={this.getSelectedValue}


  />
      </div>
    )
  }
}
