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

def data_filter_timetable(arg):
    df = pd.read_csv("timetable.csv",usecols=["arrival_time", "departure_time", "stop_name", "trip_headsign", "monday", "tuesday",
                              "wednesday", "thursday", "friday", "saturday", "sunday"])
    df = df.dropna(subset=["stop_name"])
    df["stop_name"] = df["stop_name"]
    df["metadata"] = (df["arrival_time"] + '_' + df["departure_time"] + '_' + df["stop_name"] + '_' + df["trip_headsign"])
    if arg=="tram":
        df = df.loc[df['stop_name'].str.contains("-")]
        df.to_csv("trams.csv", index=False)
    else:
        df = df.loc[~df['stop_name'].str.contains("-")]
        df.to_csv("trains.csv", index=False)

def data_filter_tram_train_location():
    df = pd.read_csv("timetable.csv", usecols=["stop_name", "stop_lat", "stop_lon"])
    df.columns = ["name", "latitude", "longitude"]
    df = df.dropna(subset=["name"])
    df["longitude"] = df["longitude"].astype(str)
    df["latitude"] = df["latitude"].astype(str)
    df["point"] = (df["latitude"] + '_' + df["longitude"])
    df = df.drop_duplicates(["point"])
    df.to_csv("train_tram_location.csv", index=False)

if __name__ == '__main__':
    data_filter_timetable("tram")
    data_filter_timetable("train")
    data_filter_tram_train_location()
