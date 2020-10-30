import React, { Component } from 'react'
import { Dropdown } from 'semantic-ui-react'
import './dropdown.css'
export default class DropDown extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: null
    }
  }
  // get and pass on the selected value from catergory dropdown to the parent component
  getSelectedValue = (event) => {
    this.props.onvalueChange(event.target.textContent)
    this.setState({value:event.target.textContent})
}
  render() {
    return (
      <div style = {{width:'20rem'}}>
      <Dropdown
      placeholder='Select Category'
      selection
      options={this.props.data}
      onChange={this.getSelectedValue}
      value = {this.state.value}


  />
      </div>
    )
  }
}
