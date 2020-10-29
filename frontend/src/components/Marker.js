import React, { Component } from 'react'
import { Icon } from 'semantic-ui-react';
import { Marker} from "react-map-gl";


export default class Markers extends Component {

  getMarkerName = (name,category,direction) => {
      if(category !== "tram" & category !== "train" & direction === undefined){
          this.props.getDataForGoogle(name)
      }
      else{
          this.props.getDataForTransport(name,category,direction)
      }
  }

  render() {
      return (
        <>
        {this.props.requestedData.map((marker,index) => {
        return(<div key={index} className = "custom-pin">
            <Marker key = {index} longitude = {Number(marker.longitude)} latitude = {Number(marker.latitude)} >
            <Icon name= 
            {this.props.selectedCategory === "bars" ? "beer" : this.props.selectedCategory === "restaurants" ? "food" :
            this.props.selectedCategory === "theatre" ? "film" : this.props.selectedCategory === "hotel" ? "hotel" :
            this.props.selectedCategory === "tram" ? "train" : this.props.selectedCategory === "train" ? "train" : this.props.selectedCategory === "museum" ? "building" : "user times"}
            size='small'
            onClick = {
            () => {this.getMarkerName(marker.name,this.props.selectedCategory,marker.direction)}}
            />
            {/* <div style={{fontSize:8}}>{marker.name}</div> */}
            </Marker>
            
        </div>)})}
        </>
    )
}
}

