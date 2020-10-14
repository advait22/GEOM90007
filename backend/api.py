import flask
import pandas as pd
import json
from flask import request,jsonify
from geopy import distance

app = flask.Flask(__name__)

#/apis/getLocation?name=Bar&lat=-37.86667&long=144.66667&r=25
@app.route('/apis/getLocation',methods=['GET'])
def get_location():
    if 'name' in request.args:
        desc = request.args['name']
    else:
        return "Error: No value for argument name "
    if 'lat' in request.args:
        lat = request.args['lat']
    else:
        return "Error: No value for argument latitude "
    if 'long' in request.args:
        long = request.args['long']
    else:
        return "Error: No value for argument longitude "
    if 'r' in request.args:
        radius = request.args['r']
    else:
        return "Error: No value for argument radius "
    center_point = (lat,long)

    df = pd.read_csv("data.csv",usecols=["name","description","longitude","latitude"])
    location_details = df.loc[df['description'].str.contains(desc)]
    result = []
    for i in range(len(location_details)):
        dict = {}
        long_t = location_details['longitude'].iloc[i]
        lat_t = location_details['latitude'].iloc[i]
        test_point = (lat_t,long_t)
        dis = distance.distance(center_point,test_point).km
        if(dis<=int(radius)):
            dict.update({"name" : location_details["name"].iloc[i], "description" : location_details["description"].iloc[i], "longitude": long_t,"latitude":lat_t})
            result.append(dict)
    response = pd.DataFrame(result)
    response = json.dumps(json.loads(response.to_json(orient='records')), indent=2)
    return response

if __name__ == '__main__':
    app.run()
