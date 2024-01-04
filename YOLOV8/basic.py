import cv2
import supervision as sv
from ultralytics import YOLO

video = cv2.VideoCapture("video.mp4")  # Replace "video.mp4" with the actual path to your video file
model = YOLO("yolov8s.pt")  # Ensure you have the "yolov8s.pt" model file in the correct directory
bbox_annotator = sv.BoxAnnotator()

while video.isOpened():
    ret, frame = video.read()

    people_count = 0

    if ret is True:
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

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    else:
        break

video.release()
cv2.destroyAllWindows()
