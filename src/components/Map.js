import React, { Component } from 'react'
import ReactMapGL, { Marker,Popup } from "react-map-gl";
import { Button, Icon } from 'semantic-ui-react';
import DropdownExampleSearchSelection from './dropdown';
import './Map.css'
import {DROP_DOWN} from './constants'
import Grid from '@material-ui/core/Grid';
import Loader from 'react-loader-spinner';
import { Paper } from '@material-ui/core';
import {RADIUS} from './constants'
import RadiusDropDown from './radius';

export default class Map extends Component {
    constructor(props) {
        super(props)
        this.state = {
            viewport: {
               width: "100vw",
               height: "100vh",
               latitude: -37.8142,
               longitude: 144.9632,
               zoom: 11,
               overflow:'hidden'
             },
             isClicked : false,
             userLocation: {
                 latitude:null,
                 longitude: null
             }
             ,popupInfoUserLoc: null,
             selectedCategory: null,
             requestedData : [],
             zoom : 10,
             googleReview: {},
             isLoading:false,
             markerClicked:false,
             placeId:null,
             radius:null,
             image :null
          };
    }

    getSelectedValue = (value) => {
       
        this.setState({selectedCategory:value},()=>{
        })
        
    }

    getDataFromGoogle = (value) => {
        fetch('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+value+
        '&inputtype=textquery&fields=photos,formatted_address,name,rating,place_id,geometry,price_level,user_ratings_total,opening_hours/open_now&key=AIzaSyBZHgvSAwAB3OmZ-GRX115M90gp81nQ-Ks').then(res => res.json()).then(data => this.setState({markerClicked:true,placeId:data.candidates[0].place_id}, 
            ()=>{
                fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id='+this.state.placeId+'&fields=address_component,adr_address,business_status,formatted_address,geometry,icon,name,photo,url,vicinity,formatted_phone_number,international_phone_number,opening_hours,website,price_level,rating&key=AIzaSyBZHgvSAwAB3OmZ-GRX115M90gp81nQ-Ks').then(res => res.json()).then(data => this.setState({googleReview:data.result},()=>{
                    if(this.state.googleReview.hasOwnProperty('photo_reference')){
                        fetch('https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference='+this.state.googleReview.candidates[0].photos[0].photo_reference+'&key=AIzaSyBZHgvSAwAB3OmZ-GRX115M90gp81nQ-Ks').then(res => {
                            console.log(res)
                        }).catch(err =>{ alert('Refresh the page, sorry for inconvinience')})    
                    }
                    else {
                        this.setState({image:'No Images Provided'}, () => {
                            console.log('')
                        })
                    }

            })).catch(err => {alert('Refresh the page, sorry for inconvinience')})

            })
            ).catch(er => {alert('Refresh the page, sorry for inconvinience')})
    }

    closeMarker = () => {
        this.setState({googleReview:{},placeId:null,markerClicked:false}, ()=>{
            console.log('')
        })
    }

    getRadiusValue = (value) => {
        let radiusValue = value.split(" ")[0]
        console.log(radiusValue) 
       this.setState({radius:radiusValue}, ()=>{})
    }

    getData = () =>{ 
        this.setState({isLoading:true}, () => {
        fetch('https://shielded-bastion-90356.herokuapp.com/apis/getLocation?name='+
        this.state.selectedCategory+'&lat='+this.state.userLocation.latitude+'&long='+this.state.userLocation.longitude+'&r='+this.state.radius).then(
                res => res.json()).then(
                    data => this.setState({requestedData:data,isLoading:false}, () => {
                        console.log(this.state)
                        this.setState(prevState =>({
                            viewport:{
                                ...prevState.viewport,
                                latitude:this.state.userLocation.latitude,
                                longitude:this.state.userLocation.longitude,
                                zoom:14
                            }
                        }))
                    })          
                    ).catch(err => alert('Refresh the page, sorry for inconvinience'))
        })
    }

    componentDidMount() {
        let self = this
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                let newUserLocation = {
                    latitude :Number(position.coords.latitude),
                    longitude : Number(position.coords.longitude)
                }
                self.setState({userLocation:newUserLocation},()=>{
                self.setState(prevState =>({
                        viewport:{
                            ...prevState.viewport,
                            latitude:self.state.userLocation.latitude,
                            longitude:self.state.userLocation.longitude,
                            zoom:13
                        }
                    }))
                })
            });
          }  
    }
    
  render() {
    return (<div>
        {this.state.isLoading ? 
            <div
        style={{
          width: "100%",
          height: "100%",
          display:'flex',
          justifyContent: "center",
          alignItems: "center",
          position: 'absolute',

        }}
      >
        <Loader type="TailSpin" color="#2185D0" height="100" width="100" />
      </div>:
      <div style = {{flexGrow:1}}>
      
      <Grid container >
      <Grid item xs = {8} >
          {/* {process.env.REACT_APP_MAPBOX_KEY} 
          "pk.eyJ1IjoieW91bmdraW0iLCJhIjoiY2prajlmdTRrNXQwcTNybWw5d3ZkcWdqNiJ9.rnHLI-KndMeksoZT2cCjSg"*/}

        {/* mapbox://styles/youngkim/ckeun7ycaa92e19n1a9a8chl4
         "mapbox://styles/mapbox/light-v10"
 */}
          <ReactMapGL {...this.state.viewport} mapStyle= "mapbox://styles/mapbox/light-v10"  
            mapboxApiAccessToken = {process.env.REACT_APP_MAPBOX_KEY}
            onViewportChange={viewport => this.setState({ viewport })}>
            {this.state.userLocation.latitude ? <Marker latitude = {Number(this.state.userLocation.latitude)} 
                longitude = {Number(this.state.userLocation.longitude)} className = "custom-pin">
            {/* <div style={{fontWeight:900,fontSize:11}}>You are here</div> */}
            <Icon name='user circle' size='large' onMouseEnter = {()=>this.setState({popupInfoUserLoc: true})}
            onMouseLeave={()=>this.setState({popupInfoUserLoc: null})}
            />
            </Marker> : '' }
        {this.state.requestedData.length > 0 ?
            this.state.requestedData.map((marker,index) => {
                return(<div key={index} className = "custom-pin">
                    <Marker key = {index} longitude = {Number(marker.longitude)} latitude = {Number(marker.latitude)} >
                     {/* <div style={{fontWeight:900,fontSize:11,marginLeft:-40}}>{marker.name}</div> */}
                    <Icon name= 
                    {this.state.selectedCategory === "Bars" ? "beer" : this.state.selectedCategory === "Restaurants" ? "food" :
                    this.state.selectedCategory === "Theatre" ? "film" : this.state.selectedCategory === "Hotel" ? "hotel" :
                    this.state.selectedCategory === "Tram" ? "train" : this.state.selectedCategory === "Train" ? "train" : "user times"}
                    size='small' onClick = {() => {this.getDataFromGoogle(marker.name)}}/>
                    </Marker>
                </div>)
                
            })
            :''
            
    
    }
      </ReactMapGL>
      <Grid item xs = {4}>
    {this.state.markerClicked ? <div>
          <Paper style= {{width:400,height:400, opacity:1, position:'absolute',bottom:'50%',top:'20%',right:'35%',
        padding:10}}>
            <button style={{float: 'right',border:0, background:'transparent'}} onClick = {()=>{this.closeMarker()}}>X</button>
            <span className = "text-values">Name</span> <span className = "values">{this.state.googleReview.name}</span> <br/>
            <span className = "text-values">Address</span> <span className = "values">{this.state.googleReview.formatted_address}</span> <br/>
            <span className = "text-values">Business Status</span> <span className = "values">{this.state.googleReview.business_status}</span><br/>
            <span className = "text-values">Open Now</span>
            {this.state.googleReview.hasOwnProperty('opening_hours') ? <span> <span className = "values">
                {this.state.googleReview.opening_hours.open_now ? 'Open':'Closed'}
            </span><br/>
            <span className = "text-values"> Opening hours </span><br/>
            <span>{this.state.googleReview.opening_hours.weekday_text[0]}</span><br/>
            <span>{this.state.googleReview.opening_hours.weekday_text[1]}</span><br/>
            <span>{this.state.googleReview.opening_hours.weekday_text[2]}</span><br/>
            <span>{this.state.googleReview.opening_hours.weekday_text[3]}</span><br/>
            <span>{this.state.googleReview.opening_hours.weekday_text[4]}</span><br/>
            <span>{this.state.googleReview.opening_hours.weekday_text[5]}</span><br/>
            <span>{this.state.googleReview.opening_hours.weekday_text[6]}</span><br/>
            </span>: <span className = "values"> No Business Hours provided<br/></span>} 
            <span className = "text-values">Phone Number</span> <span>{this.state.googleReview.formatted_phone_number} / {this.state.googleReview.international_phone_number}</span><br/>
            <span className = "text-values">Price level</span> 
            {this.state.googleReview.hasOwnProperty('price_level') ? <> 
             <span>{this.state.googleReview.price_level === 1 ? '$' :
                <> {this.state.googleReview.price_level === 2 ? '$$' : <> 
                {
                    this.state.googleReview.price_level === 3? '$$$':''
                }</>}</>
            }</span>
            </>:' No data available'}<br/>
            <span className ="text-values">Rating</span> <span>
                {this.state.googleReview.hasOwnProperty('rating') ? this.state.googleReview.rating + ' / 5' : 'No rating available'}
                </span><br/>
            
            <span className = "text-values">Website</span> <span><a href={this.state.googleReview.website}>{this.state.googleReview.website}</a></span> <br/>
            <span className = "text-values">URL</span> <span><a href={this.state.googleReview.url}>{this.state.googleReview.url}</a></span> <br/>
          </Paper>
      </div>:''}


      </Grid>
      
      </Grid>
      <Grid item xs= {4}>
      <div style= {{marginTop:20,display:'flex'}}>
        <span id ="radius"><RadiusDropDown data = {RADIUS} onSelectedRadiusValue = {this.getRadiusValue}/></span>
        <span style={{width: '14rem'}}><DropdownExampleSearchSelection data ={DROP_DOWN} onvalueChange = {this.getSelectedValue}/></span>
        <Button primary style={{position: 'fixed',right:'0%',width:'14rem'}} onClick = {() => {this.getData()}}>Get Data</Button>

        </div>
      </Grid>
      </Grid>
      
      </div>
        }
        </div>
    )
  }
}