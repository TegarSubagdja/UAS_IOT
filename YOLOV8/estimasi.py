import requests
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error

class PeopleCountPredictor:
    def __init__(self, api_url):
        self.api_url = api_url
        self.model = None

    def fetch_data(self):
        try:
            response = requests.get(self.api_url)
            response.raise_for_status()
            return response.json().get('sensorData')
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data: {e}")
            return None

    def train_model(self, data):
        df = pd.DataFrame(data)
        X = df[['temperature', 'humidity']]
        y = df['jumlah_orang']
        X.columns = ['temperature', 'humidity']
        X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42)
        model = LinearRegression()
        model.fit(X_train, y_train)
        self.model = model
        return model  # Return the trained model

    def predict_people_count(self, temperature, humidity):
        if self.model is not None:
            new_data = [[temperature, humidity]]
            predicted_people = self.model.predict(new_data)
            return predicted_people[0]
        else:
            print("Model not trained. Please train the model first.")

def main():
    api_url = 'http://localhost:8000/api/getEstimasi'
    predictor = PeopleCountPredictor(api_url)
    data = predictor.fetch_data()

    if data is not None:
        predictor.train_model(data)

        new_temperature = 25
        new_humidity = 60
        predicted_people = predictor.predict_people_count(new_temperature, new_humidity)
        print(f'Predicted People Count: {predicted_people}')