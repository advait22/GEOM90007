import flask
import pandas as pd
import json
from flask import request,jsonify

app = flask.Flask(__name__)

#/apis/getLocation?name=Restaurants
@app.route('/apis/getLocation',methods=['GET'])
def get_location():
    keyword=""
    if 'name' in request.args:
        keyword = request.args['name']
    else:
        return "Error: No value for argument name "
    df = pd.read_csv("dataset.csv",usecols=["Trading name", "Industry (ANZSIC4) description", "x coordinate", "y coordinate"])
    df.columns = ["name","description","longitude","latitude"]
    df = df.fillna(" ")
    restaurants_details = df.loc[df['description'].str.contains(keyword)]
    result = json.dumps(json.loads(restaurants_details.to_json(orient='records')), indent=2)
    return result

if __name__ == '__main__':
    app.run()
