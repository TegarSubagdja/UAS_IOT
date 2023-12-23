import cv2
import numpy as np
import requests
from urllib import request
from io import BytesIO
import supervision as sv
from ultralytics import YOLO
import time

# Function to read an image from a URL
def read_image_from_url(url):
    response = requests.get(url)
    img_array = np.asarray(bytearray(response.content), dtype=np.uint8)
    img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    return img

url = "http://192.168.1.9/cam-hi.jpg"  # Replace with your image URL

model = YOLO("yolov8s.pt")  # Ensure you have the "yolov8s.pt" model file in the correct directory
bbox_annotator = sv.BoxAnnotator()

while True:
    frame = read_image_from_url(url)

    people_count = 0

    result = model(frame)[0]
    detections = sv.Detections.from_ultralytics(result)
    detections = detections[detections.confidence > 0.3]
    labels = [result.names[class_id] for class_id in detections.class_id]

    # Access the detection data from the Detections object
    frame = bbox_annotator.annotate(scene=frame, detections=detections, labels=labels)

    # Count the number of people detected
    people_count += labels.count("person")

    # Display the count on the frame
    cv2.putText(frame, f"People Count: {people_count}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    cv2.imshow("Frame", frame)

    time.sleep(0.5)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cv2.destroyAllWindows()
