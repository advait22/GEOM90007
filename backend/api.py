import flask
import pandas as pd
import json
from flask import request,jsonify
from geopy import distance
from datetime import date
from datetime import datetime
import re

app = flask.Flask(__name__)

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
    if desc ==  "train" or desc =="tram":
        # load and pre process the data
        df = pd.read_csv("timetable.csv", usecols=["stop_name", "stop_lat", "stop_lon"])
        df.columns = ["name", "latitude", "longitude"]
        df["name"] = df["name"].str.lower()
        df = df.dropna(subset=["name"])
        df["longitude"] = df["longitude"].astype(str)
        df["latitude"] = df["latitude"].astype(str)
        df["point"] = (df["latitude"] + '_' + df["longitude"])
        if desc == "tram":
            location_details = df.loc[df['name'].str.contains("-")]
        else:
            location_details = df.loc[~df['name'].str.contains("-")]
        location_details = location_details.drop_duplicates(["point"])
    else:
        df = pd.read_csv("data.csv",usecols=["name","description","longitude","latitude"])
        df["description"] = df["description"].str.lower()
        location_details = df.loc[df['description'].str.contains(desc)]
    result = []
    for i in range(len(location_details)):
        dict = {}
        long_t = location_details['longitude'].iloc[i]
        lat_t = location_details['latitude'].iloc[i]
        if long_t.strip() and lat_t.strip():
            # count and find place around given radius
            test_point = (float(lat_t),float(long_t))
            dis = distance.distance(center_point,test_point).km
            if(float(dis)<=float(radius)):
                if desc == "train" or desc == "tram":
                    dict.update({"name": location_details["name"].iloc[i], "longitude": long_t, "latitude": lat_t})
                else:
                    dict.update({"name": location_details["name"].iloc[i],"description": location_details["description"].iloc[i], "longitude": long_t,"latitude": lat_t})
                result.append(dict)
    response = pd.DataFrame(result)
    response = json.dumps(json.loads(response.to_json(orient='records')), indent=2)
    return response

#/apis/getTimetable?type=train&name=southern cross railway station
# type = train or tram
# name = selcted stop name
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
    df = pd.read_csv("timetable.csv", usecols=["arrival_time","departure_time","stop_name","trip_headsign","monday","tuesday","wednesday","thursday","friday","saturday","sunday"])
    df = df.dropna(subset=["stop_name"])
    df["stop_name"] = df["stop_name"].str.lower()
    df["metadata"] = (df["arrival_time"] + '_' + df["departure_time"]+'_'+df["stop_name"]+'_'+df["trip_headsign"])
    if type == "tram":
        station_name = re.sub(r" ?\([^)]+\)", "", station_name)
        df = df.loc[df['stop_name'].str.contains("-")]
    else:
        df = df.loc[~df['stop_name'].str.contains("-")]
    today = date.today().weekday()
    # 0 = Monday & 6 = Sunday
    df = df.loc[df.iloc[:, 4 + today] == 1]
    df = df.loc[df['stop_name'].str.contains(station_name)]
    time = datetime.now().time().strftime("%H:%M")
    df['arrival_time'] = pd.to_datetime(df['arrival_time'])
    df['departure_time'] = pd.to_datetime(df['departure_time'])
    df = df.sort_values(by="departure_time")
    df = df.drop_duplicates(["metadata"])
    df = df[df["departure_time"] > time].head(5)
    response = json.dumps(json.loads(df.to_json(orient='records')), indent=2)
    return response



if __name__ == '__main__':
    app.run()
