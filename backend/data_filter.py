import pandas as pd
import re

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
    pattern = r'railway|^([A-Z]*\d+[A-Z]*\-)'
    stop_time = pd.read_csv("./gtfs/stop_times.txt")
    stops = pd.read_csv("./gtfs/stops.txt")
    trips = pd.read_csv("./gtfs/trips.txt")
    # routes = pd.read_csv("./gtfs/routes.txt")
    calendar = pd.read_csv("./gtfs/calendar.txt")
    # calendar_dates = pd.read_csv("./gtfs/calendar_dates.txt")
    # shapes = pd.read_csv("./gtfs/shapes.txt")
    merged = pd.merge(stop_time, stops, on = "stop_id")
    merged = pd.merge(merged, trips, on = "trip_id")
    # merged = pd.merge(merged, routes, on = "route_id")
    merged = pd.merge(merged, calendar, on = "service_id")
    # merged = pd.merge(merged, calendar_dates, on = "service_id")
    # merged = merged.drop(['route_type', 'route_color', 'route_text_color'])
    # merged = pd.merge(merged, shapes, on = "shape_id")
    # filtered = merged.loc[merged['trip_headsign'].str.lower().str.contains("melbourne")]
    filtered = merged.loc[merged['stop_name'].str.contains(pattern, case=False, regex=True)]
    print(filtered)
    filtered.to_csv('victoria_tram_train_timetable.csv',index=False)
    
if __name__ == '__main__':
    # data_filter()
    gtfs_merge()