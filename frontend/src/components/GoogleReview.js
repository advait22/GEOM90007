import React, { Component } from 'react';
import { Paper } from '@material-ui/core';

class GoogleReview extends Component {
    render() {
        console.log(this.props)
        return (
          <Paper style= {{width:400,height:400, opacity:1, position:'absolute',bottom:'50%',top:'20%',right:'35%',
        padding:10,overflow:"auto"}}>
            {/* <div style= {{width:'100%'}}><img src={"https://maps.googleapis.com/maps/api/place/photo?maxwidth=275&photoreference="+this.props.refs+'&key=AIzaSyBZHgvSAwAB3OmZ-GRX115M90gp81nQ-Ks'} alt= ""></img></div><br/> */}
           
            {/* <span className = "text-values">Name</span> <span className = "values">{this.props.googleReviews.name}</span> <br/>
            <span className = "text-values">Address</span> <span className = "values">{this.props.googleReviews.formatted_address}</span> <br/>
            <span className = "text-values">Business Status</span> <span className = "values">{this.props.googleReviews.business_status}</span><br/>
            <span className = "text-values">Open Now</span>
            {this.props.googleReviews.hasOwnProperty('opening_hours') ? <span> <span className = "values">
                {this.props.googleReviews.opening_hours.open_now ? 'Open':'Closed'}
            </span><br/>
            <span className = "text-values"> Opening hours </span><br/>
            <span>{this.props.googleReviews.opening_hours.weekday_text[0]}</span><br/>
            <span>{this.props.googleReviews.opening_hours.weekday_text[1]}</span><br/>
            <span>{this.props.googleReviews.opening_hours.weekday_text[2]}</span><br/>
            <span>{this.props.googleReviews.opening_hours.weekday_text[3]}</span><br/>
            <span>{this.props.googleReviews.opening_hours.weekday_text[4]}</span><br/>
            <span>{this.props.googleReviews.opening_hours.weekday_text[5]}</span><br/>
            <span>{this.props.googleReviews.opening_hours.weekday_text[6]}</span><br/>
            </span>: <span className = "values"> No Business Hours provided<br/></span>} 
            <span className = "text-values">Phone Number</span> <span>{this.props.googleReviews.formatted_phone_number} / {this.props.googleReviews.international_phone_number}</span><br/>
            <span className = "text-values">Price level</span> 
            {this.props.googleReviews.hasOwnProperty('price_level') ? <> 
             <span>{this.props.googleReviews.price_level === 1 ? '$' :
                <> {this.props.googleReviews.price_level === 2 ? '$$' : <> 
                {
                    this.props.googleReviews.price_level === 3? '$$$':''
                }</>}</>
            }</span>
            </>:' No data available'}<br/>
            <span className ="text-values">Rating</span> <span>
                {this.props.googleReviews.hasOwnProperty('rating') ? this.props.googleReviews.rating + ' / 5' : 'No rating available'}
                </span><br/>
            
            <span className = "text-values">Website</span> <span><a href={this.props.googleReviews.website}>{this.props.googleReviews.website}</a></span> <br/>
            <span className = "text-values">URL</span> <span><a href={this.props.googleReviews.url}>{this.props.googleReviews.url}</a></span> <br/> */}
          </Paper>
    
        );
    }
}

export default GoogleReview;