import requests

api_post = "http://127.0.0.1:8000/api/store"

try:
    suhu_value = "24"  # Ganti dengan nilai yang sesuai
    temp_value = "60"  # Ganti dengan nilai yang sesuai
    jumlah_value = "19"  # Ganti dengan nilai yang sesuai

    data = {
        "temperature": suhu_value,
        "humidity": temp_value,
        "sum": jumlah_value
    }

    response = requests.post(api_post, data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
    response.raise_for_status()

    print("Data successfully sent to the server.")
except requests.exceptions.RequestException as e:
    print(f"Failed to send data to the server. Error: {e}")
