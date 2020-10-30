import React, { Component } from 'react'
import ReactMapGL, { Marker} from "react-map-gl";
import { Button, Icon } from 'semantic-ui-react';
import DropdownExampleSearchSelection from './dropdown';
import './Map.css'
import {DROP_DOWN} from './constants'
import Grid from '@material-ui/core/Grid';
import Loader from 'react-loader-spinner';
import { Paper } from '@material-ui/core';
import {RADIUS} from './constants'
import RadiusDropDown from './radius';
import Markers from './Marker'
import Modal from '@material-ui/core/Modal';

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
             image :null,
             openModal:false,
             timetable:[],
             openTrainModal:false,
             statsClicked:false,
             openStatsModal:false,
             stats:[]
          };
    }
  // get the selected value from catergory dropdown
    getSelectedValue = (value) => {
        this.setState({selectedCategory:null,requestedData:[]},()=>{
            this.setState({selectedCategory:value.toLowerCase()})
        })
        
    }

    // API call to show stats to on the frontend on click of the info button
    showStats = () =>{
        if(this.state.selectedCategory !== null & this.state.radius !== null & this.state.requestedData.length > 0){
            setInterval(
                fetch('https://shielded-bastion-90356.herokuapp.com/apis/getCounter?r=1').then(
                    res => 
                       res.json()
                ).then(data => {
                    this.setState({stats:data, statsClicked:true,
                        openStatsModal:true}, ()=> {

                    })
                }).catch(err =>{console.log(err)})
                , 5000);
        }
        else {
        }
    }

    // API call to get the live data from google places and details api
    getDataFromGoogle = (value) => {
        fetch('https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input='+value+
        '&inputtype=textquery&fields=photos,formatted_address,name,rating,place_id,geometry,price_level,user_ratings_total,opening_hours/open_now&key=AIzaSyBZHgvSAwAB3OmZ-GRX115M90gp81nQ-Ks').then(res => res.json()).then(data => this.setState({markerClicked:true,openModal:true,placeId:data.candidates[0].place_id,ref:null}, 
            ()=>{
                
                fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id='+this.state.placeId+'&fields=address_component,adr_address,business_status,formatted_address,geometry,icon,name,photo,url,vicinity,formatted_phone_number,international_phone_number,opening_hours,website,price_level,rating&key=AIzaSyBZHgvSAwAB3OmZ-GRX115M90gp81nQ-Ks').then(res => res.json()).then(data => this.setState({googleReview:data.result},()=>{
                    console.log(this.state)
                    if(this.state.googleReview.hasOwnProperty('photos')){
                     this.setState({ref:this.state.googleReview.photos[0].photo_reference})
                }else {
                    this.setState({ref:null})
                }
                    }

            )).catch(err => {alert('Refresh the page, sorry for inconvinience')})

            })
            ).catch(er => {alert('Refresh the page, sorry for inconvinience')})
    }

    // close the popover when clicked outside the modal popup
    closeMarker = () => {
        this.setState({googleReview:{},placeId:null,markerClicked:false,openModal:false,
        openTrainModal:false,openStatsModal:false}, ()=>{
            
        })
    }

    // get radius value from child component 
    getRadiusValue = (value) => {
       this.setState({radius:value.split(" ")[0]}, ()=>{
          
       })
    }

    // API call to backend to get the data to display on the map
    getData = () =>{ 
        if(this.state.radius !== null & this.state.selectedCategory !== null) {
        this.setState({isLoading:true}, () => {
        fetch('https://shielded-bastion-90356.herokuapp.com/apis/getLocation?name='+
        this.state.selectedCategory+'&lat='+this.state.userLocation.latitude+'&long='+Number(this.state.userLocation.longitude)+'&r='+this.state.radius).then(
                res => res.json()).then(
                    data => this.setState({requestedData:data,isLoading:false}, () => {
                        this.setState(prevState =>({
                            viewport:{
                                ...prevState.viewport,
                                latitude:this.state.userLocation.latitude,
                                longitude:this.state.userLocation.longitude,
                                zoom:13.7
                            }
                        }),()=>{
                        })
                    })          
                    ).catch(err => alert('Refresh the page, sorry for inconvinience'))
        })
    }
    else {
        alert('please select a radius and category')
    }
    }

    // API call to backend to get the timetable data to display on the map

    getTimetableData = (value,category,direction) => {
        fetch('https://shielded-bastion-90356.herokuapp.com/apis/getTimetable?type='+category+'&name='+
        value+'&direction='+direction).then(res => res.json()).then(
            data => this.setState({
                timetable:data,
                openTrainModal:true,
                markerClicked:true
            }, ()=>{
                   
            })
        ).catch(err => {alert('Refresh the page, sorry for inconvinience')})
    }

    // get user location when they logon to the website
    componentDidMount() {
        let self = this
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(function(position) {
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
                            zoom:13.5
                        }
                    }))
                })
            });
          }  
    }
    
  render() {
      console.log(this.state)
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
          <ReactMapGL {...this.state.viewport} mapStyle= "mapbox://styles/jabanto/ckgj9myqo0qzz1arr8axy8t0m"  
            mapboxApiAccessToken = "pk.eyJ1IjoiamFiYW50byIsImEiOiJja2VrbHlqZ2MxajZ5MnVvNzliYjgwZ3ZqIn0.op32x_RIIs9tx7aM3NBhkw"
            onViewportChange={viewport => this.setState({ viewport })}>
            {this.state.userLocation.latitude ? <Marker latitude = {Number(this.state.userLocation.latitude)} 
                longitude = {Number(this.state.userLocation.longitude)} className = "custom-pin">
            {/* <div style={{fontWeight:900,fontSize:11}}>You are here</div> */}
            <Icon name='user circle' size='small' onMouseEnter = {()=>this.setState({popupInfoUserLoc: true})}
            onMouseLeave={()=>this.setState({popupInfoUserLoc: null})}
            />
            <div style = {{fontSize:10,position:'absolute',margin:5,fontWeight:'bolder',inlineSize:'max-content'}}>You are here</div>
            </Marker> : '' }
        {this.state.requestedData.length > 0 ?
            <Markers requestedData = { this.state.requestedData} selectedCategory = {this.state.selectedCategory}
            getDataForGoogle = {this.getDataFromGoogle}
            getDataForTransport = {this.getTimetableData}/>
            :''
            }
      </ReactMapGL>
      <Grid item xs = {4}>
    {this.state.markerClicked & (this.state.selectedCategory !== "train" & this.state.selectedCategory !== "tram" ) ? <Modal
        open={this.state.openModal}
        onClose={this.closeMarker}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
          <Paper style= {{width:550,height:400, opacity:1, position:'absolute',bottom:'50%',top:'20%',right:'30%',
        padding:10,overflow:"auto"}}>
            <div style= {{width:'100%'}}><img src={"https://maps.googleapis.com/maps/api/place/photo?maxwidth=275&photoreference="+this.state.ref+'&key=AIzaSyBZHgvSAwAB3OmZ-GRX115M90gp81nQ-Ks'} alt= "Sorry no data available"></img></div><br/>
           
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
            <span className = "text-values">Phone Number </span> <span>{this.state.googleReview.hasOwnProperty('formatted_phone_number') ? 
            this.state.googleReview.formatted_phone_number : 'No phone number provided'} </span><span> / </span><span>{this.state.googleReview.hasOwnProperty('international_phone_number') ?  <span>{this.state.googleReview.international_phone_number}</span> :'No International phone number provided'}</span><br/>
            <span className = "text-values">Price level</span> 
            {this.state.googleReview.hasOwnProperty('price_level') ? <> 
             <span>{this.state.googleReview.price_level === 1 ? '$' :
                <> {this.state.googleReview.price_level === 2 ? '$$' : <> 
                {
                    this.state.googleReview.price_level === 3? '$$$':'No price level available'
                }</>}</>
            }</span>
            </>:' No data available'}<br/>
            <span className ="text-values">Rating</span> <span>
                {this.state.googleReview.hasOwnProperty('rating') ? this.state.googleReview.rating + ' / 5' : 'No ratings available'}
                </span><br/>
            
            <span className = "text-values">Website</span> <span>{this.state.googleReview.hasOwnProperty('website') ? <a href={this.state.googleReview.website}>
                {this.state.googleReview.website}</a>:'Website URL not provided'}</span> <br/>
            <span className = "text-values">URL</span> <span>{this.state.googleReview.hasOwnProperty('url') ?
            <a href={this.state.googleReview.url}>{this.state.googleReview.url}</a>:'No URL provided'}</span> <br/>
          </Paper>
      </Modal>: this.state.markerClicked & (this.state.selectedCategory === "train" | this.state.selectedCategory === "tram") & this.state.timetable.length > 0 ? <Modal
        open={this.state.openTrainModal}
        onClose={this.closeMarker}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
         <Paper style= {{width:500,height:400, opacity:1, position:'absolute',bottom:'50%',top:'20%',right:'30%',
        padding:10,overflow:"auto"}}>
            {this.state.timetable.map((value,index) => {
                
        return(<div key={index}>
           <span className="text-values">Stop Name:</span> <span>{value.stop_name}</span><br/>
           <span className="text-values">Arrival Time:</span> <span>{value.arrival_time}</span><br/>
           <span className="text-values">Departure Time:</span> <span>{value.departure_time}</span><br/>
           <span className="text-values">Going Towards:</span> <span>{value.trip_headsign}</span><br/>
           <span className="text-values">Runs on:</span><br/>
           {value.monday === 1 ? <span>Monday</span>:'No trips on Monday'}<br/>
           {value.tuesday === 1 ? <span>Tuesday</span>:'No trips on Tuesday'}<br/>
           {value.wednesday === 1 ? <span>Wednesday</span>:'No trips on Wednesday'}<br/>
           {value.thursday === 1 ? <span>Thursday</span>:'No trips on Thursday'}<br/>
           {value.friday === 1 ? <span>Friday</span>:'No trips on Friday'}<br/>
           {value.saturday === 1 ? <span>Saturday</span>:'No trips on Saturday'}<br/>
           {value.sunday === 1 ? <span>Sunday</span>:'No trips on Sunday'}<br/>
           <br/>
        </div>)})}

        </Paper>
      </Modal> :<Modal
        open={this.state.openTrainModal}
        onClose={this.closeMarker}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
          <Paper style= {{width:500,height:400, opacity:1, position:'absolute',bottom:'50%',top:'20%',right:'35%',
        padding:10,overflow:"auto"}}>
            <h3 style={{textAlign:'center',textTransform:'capitalize'}}>Unfortunately, No data is available</h3>
        </Paper>
          </Modal>}


      </Grid>
      
      </Grid>
      <Grid item xs= {4}>
      <div style= {{marginTop:20,display:'flex'}}>
        <span id ="radius"><RadiusDropDown data = {RADIUS} onSelectedRadiusValue = {this.getRadiusValue}/></span>
        <span style={{width: '14rem'}}><DropdownExampleSearchSelection data ={DROP_DOWN} onvalueChange = {this.getSelectedValue}/></span>
        <Button primary style={{position: 'fixed',right:'5%',width:'9.5rem'}} onClick = {() => {this.getData()}}>Get Data</Button>
        <Button style ={{position: 'fixed',right:'0%'}} primary animated='vertical' 
        disabled = {this.state.requestedData.length > 0 ? false: true} onClick = {()=> {this.showStats()}}>
            <Button.Content hidden style={{color:'white'}}>info</Button.Content>
            <Button.Content visible>
            <Icon name='info' />
        </Button.Content>
    </Button>
        </div>
      </Grid>
      </Grid>
      
      </div>
        }
        {this.state.statsClicked ? <Modal
        open={this.state.openStatsModal}
        onClose={this.closeMarker}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
          <Paper style= {{width:258,height:275, opacity:1, position:'absolute',bottom:'50%',top:'20%',right:'35%',
        padding:10,overflow:"auto"}}>
            <h4>Most Searched Categories in {this.state.radius} KM radius are :</h4>
            <span className="text-values">Bars</span> <span>{this.state.stats.bars}</span> <br/>
            <span className="text-values">Hotels</span> <span>{this.state.stats.hotel}</span><br/>
            <span className="text-values">restaurants</span> <span>{this.state.stats.restaurants}</span><br/>
            <span className="text-values">tram</span> <span>{this.state.stats.tram}</span><br/>
            <span className="text-values">train</span> <span>{this.state.stats.train}</span><br/>
            <span className="text-values">Museum</span> <span>{this.state.stats.museum}</span><br/>
        
        </Paper>
          </Modal>:''}
        </div>
    )
  }
}