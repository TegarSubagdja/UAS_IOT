from estimasi import PeopleCountPredictor

def main():
    api_url = 'http://localhost:8000/api/get'
    predictor = PeopleCountPredictor(api_url)

    # Fetch data and train the model
    data = predictor.fetch_data()
    if data is not None:
        predictor.train_model(data)

        # Make predictions
        predicted_people = predictor.predict_people_count(31, 48)
        print(f'Predicted People Count: {predicted_people}')

# Entry point of the script
if __name__ == "__main__":
    main()