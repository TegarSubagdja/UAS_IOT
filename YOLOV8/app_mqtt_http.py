import cv2
import numpy as np
import requests
import base64
import paho.mqtt.client as mqtt
from io import BytesIO
import supervision as sv
from ultralytics import YOLO
import time

# MQTT Configuration
mqtt_broker = "broker.hivemq.com"
mqtt_port = 1883
mqtt_image_topic = "image-topic"
mqtt_people_count_topic = "sum-people"

# Function to read an image from a URL
def read_image_from_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raises HTTPError for bad responses
        img_array = np.asarray(bytearray(response.content), dtype=np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        return img
    except requests.exceptions.RequestException as e:
        print(f"Error reading image from URL: {e}")
        return None

# Function to encode an image to Base64
def encode_image_to_base64(image):
    _, buffer = cv2.imencode('.jpg', image)
    base64_encoded = base64.b64encode(buffer).decode('utf-8')
    return f"data:image/jpeg;base64,{base64_encoded}"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker.")
    else:
        print(f"Failed to connect to MQTT broker with return code {rc}")
        client.loop_stop()

client = mqtt.Client()
client.on_connect = on_connect

# Attempt to connect to the broker
try:
    client.connect(mqtt_broker, mqtt_port, 60)
    client.loop_start()  # Start the MQTT loop in the background
except Exception as e:
    print(f"Failed to connect to MQTT broker. Error: {e}")

url = "https://callsam.com/wp-content/uploads/2019/12/crosswalk-featured-1200x799.jpg"  # Replace with your image URL
model = YOLO("yolov8s.pt")  # Ensure you have the "yolov8s.pt" model file in the correct directory
bbox_annotator = sv.BoxAnnotator()

while True:
    # Capture an image
    frame = read_image_from_url(url)

    if frame is not None:
        people_count = 0

        result = model(frame)[0]
        detections = sv.Detections.from_ultralytics(result)
        detections = detections[detections.confidence > 0.3]
        labels = [result.names[class_id] for class_id in detections.class_id]

        # Access the detection data from the Detections object
        frame = bbox_annotator.annotate(scene=frame, detections=detections, labels=labels)

        # Count the number of people detected
        people_count += labels.count("person")

        # Encode the image to Base64 with the appropriate prefix
        base64_image = encode_image_to_base64(frame)

        # Publish Base64-encoded image to MQTT with image topic
        result_image = client.publish(mqtt_image_topic, base64_image)
        if result_image.rc == mqtt.MQTT_ERR_SUCCESS:
            print("Image successfully sent to MQTT broker.")
        else:
            print("Failed to send image to MQTT broker.")

        # Publish people count to MQTT with people count topic
        result_people_count = client.publish(mqtt_people_count_topic, str(people_count))
        if result_people_count.rc == mqtt.MQTT_ERR_SUCCESS:
            print(f"People count successfully sent to MQTT broker: {people_count}")
        else:
            print("Failed to send people count to MQTT broker.")

    # Wait for 1 second before capturing the next image
    time.sleep(1)

# Disconnect from MQTT broker
client.disconnect()
