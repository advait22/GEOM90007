import flask
import pandas as pd
import json
from flask import request,jsonify
from geopy import distance
from datetime import date
from datetime import datetime
import re

app = flask.Flask(__name__)

def readFile():
    poi_data = pd.read_csv("data.csv",usecols=["name","description","longitude","latitude"])

    tram_data = pd.read_csv("tram_data.csv")
    train_data = pd.read_csv("train_data.csv")
    tram_location_data = pd.read_csv("tram_location_data.csv")
    train_location_data = pd.read_csv("train_location_data.csv")
    
    return  poi_data,tram_data,train_data,tram_location_data,train_location_data

poi_data,tram_data,train_data, tram_loacation_data, train_location_data = readFile()

#/apis/getLocation?name=tram&lat=-37.8290&long=144.9570&r=1
# name = bar/restaurants/train/tram etc.
# lat = latitude of current location
# long = longitude of current location
# r = radius
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
    center_point = (float(lat),float(long)) # current location of user
    if desc == "tram":
        location_details = tram_loacation_data
    elif desc == "train":
        location_details = train_location_data
    else:
        df = poi_data
        df["description"] = df["description"].str.lower()
        location_details = df.loc[df['description'].str.contains(desc)]
    result = []
    for i in range(len(location_details)):
        dict = {}
        long_t = str(location_details['longitude'].iloc[i])
        lat_t = str(location_details['latitude'].iloc[i])
        if long_t.strip() and lat_t.strip():
            # count and find place around given radius
            test_point = (float(lat_t),float(long_t))
            dis = distance.distance(center_point,test_point).km
            if(float(dis)<=float(radius)):
                if desc == "train" or desc == "tram":
                    dict.update({"name": location_details["name"].iloc[i], "direction" : location_details["direction"].iloc[i] ,"longitude": long_t, "latitude": lat_t})
                else:
                    dict.update({"name": location_details["name"].iloc[i],"description": location_details["description"].iloc[i], "longitude": long_t,"latitude": lat_t})
                result.append(dict)
    response = pd.DataFrame(result)
    response = json.dumps(json.loads(response.to_json(orient='records')), indent=2)
    return response

#/apis/getTimetable?type=train&name=southern cross railway station&direction=1
# type = train or tram
# name = selcted stop name
# direction = 1/0
@app.route('/apis/getTimetable',methods=['GET'])
def get_timetable():
    if 'name' in request.args:
        station_name = request.args['name'].lower()
    else:
        return "Error: No value for argument name"
    if 'type' in request.args:
        type = request.args['type']
    else:
        return "Error: No value for argument type"
    if 'direction' in request.args:
        direction = request.args['direction']
    else:
        return "Error: No value for argument direction"

    if type == "tram":
        station_name = re.sub(r" ?\([^)]+\)", "", station_name)
        df = tram_data
    else:
        df = train_data

    today = date.today().weekday()
    # 0 = Monday & 6 = Sunday
    df = df.loc[df.iloc[:, 5 + today] == 1]
    df = df.loc[df['stop_name'].str.contains(station_name)]
    df = df.loc[df['direction_id']==int(direction)]
    time = datetime.now().time().strftime("%H:%M")
    df = df.sort_values(by="departure_time")
    df = df.drop_duplicates(["metadata"])
    df = df[df["departure_time"] > time].head(3)
    response = json.dumps(json.loads(df.to_json(orient='records')), indent=2)
    return response



if __name__ == '__main__':
    app.run()
