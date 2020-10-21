import pandas as pd

def data_filter():
    df = pd.read_csv("dataset.csv",usecols=["Census year","Trading name", "Industry (ANZSIC4) description", "x coordinate", "y coordinate"])
    df.columns = ["year","name","description","longitude","latitude"]
    df["year"] = df["year"].fillna(2019)
    df["year"] = df["year"].astype('Int64')
    df = df.fillna(" ")
    location_details = df[df["year"]==2019]
    location_details.drop_duplicates(subset="name",inplace = True)
    location_details.to_csv("data.csv",index=False)

def gtfs_merge():
    trains = r'railway'
    trams = r'^([A-Z]*\d+[A-Z]*\-)'
    stop_time = pd.read_csv("./gtfs/stop_times.txt")
    stops = pd.read_csv("./gtfs/stops.txt")
    trips = pd.read_csv("./gtfs/trips.txt")
    calendar = pd.read_csv("./gtfs/calendar.txt")
    merged = pd.merge(stop_time, stops, on = "stop_id")
    merged = pd.merge(merged, trips, on = "trip_id")
    merged = pd.merge(merged, calendar, on = "service_id")
    trains = merged.loc[merged['stop_name'].str.contains(trains, case=False, regex=True)]
    trains = trains[["arrival_time", "departure_time", "stop_name", "stop_lat", "stop_lon", 
                            "trip_headsign", "direction_id", "monday", "tuesday",
                            "wednesday", "thursday", "friday", "saturday", "sunday"]]
    trains = trains.loc[~trains['stop_name'].str.contains(trams, case=False, regex=True)]
    trams = merged.loc[merged['stop_name'].str.contains(trams, case=False, regex=True)]
    trams = trams[["arrival_time", "departure_time", "stop_name", "stop_lat", "stop_lon", 
                            "trip_headsign", "direction_id", "monday", "tuesday",
                            "wednesday", "thursday", "friday", "saturday", "sunday"]]
    trains.to_csv('train_timetable.csv',index=False)
    trams.to_csv('tram_timetable.csv',index=False)

def readFile():
    poi_data = pd.read_csv("data.csv",usecols=["name","description","longitude","latitude"])

    tram_data_super = pd.read_csv("tram_timetable.csv")
    tram_data = tram_data_super[["arrival_time", "departure_time", "stop_name", "trip_headsign","direction_id","monday", "tuesday","wednesday", "thursday", "friday", "saturday", "sunday"]]
    tram_data =data_filter_timetable(tram_data)
    tram_data.to_csv('tram_data.csv',index=False)

    train_data_super = pd.read_csv("train_timetable.csv")
    train_data = train_data_super[["arrival_time", "departure_time", "stop_name", "trip_headsign", "direction_id", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]]
    train_data = data_filter_timetable(train_data)
    train_data.to_csv('train_data.csv',index=False)

    tram_location_data = tram_data_super[["stop_name", "stop_lat", "stop_lon","direction_id"]]
    train_location_data = train_data_super[["stop_name", "stop_lat", "stop_lon","direction_id"]]
    tram_location_data = data_filter_tram_train_location(tram_location_data)
    train_location_data = data_filter_tram_train_location(train_location_data)
    tram_location_data.to_csv('tram_location_data.csv',index=False)
    train_location_data.to_csv('train_location_data.csv',index=False)

    return  poi_data,tram_data,train_data,tram_location_data,train_location_data

def data_filter_tram_train_location(df):
    df.columns = ["name", "latitude", "longitude","direction"]
    df = df.dropna(subset=["name"])
    df["name"] = df["name"].str.lower()
    df["longitude"] = df["longitude"].astype(str)
    df["latitude"] = df["latitude"].astype(str)
    df["point"] = (df["latitude"] + '_' + df["longitude"])
    df = df.drop_duplicates(["point"])
    return df

def data_filter_timetable(df):
    df = df.dropna(subset=["stop_name"])
    df["stop_name"] = df["stop_name"].str.lower()
    df["metadata"] = (df["arrival_time"] + '_' + df["departure_time"] + '_' + df["stop_name"] + '_' + df["trip_headsign"])
    df['arrival_time'] = pd.to_datetime(df['arrival_time'])
    df['departure_time'] = pd.to_datetime(df['departure_time'])
    return df

if __name__ == '__main__':
    gtfs_merge()
    readFile()
    # data_filter_timetable("tram")
    # data_filter_timetable("train")
    # data_filter_tram_train_location()
    