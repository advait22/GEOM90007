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

if __name__ == '__main__':
    data_filter()