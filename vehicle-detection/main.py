import cv2
from sort import *
import math
import numpy as np
from ultralytics import YOLO
import cvzone
import mysql.connector

mydb = mysql.connector.connect(
    host="35.240.191.105",
    user="root",
    password="root",
    database="test"
)

print(mydb)


# C:\SDA\vehicle-detection\cars2.mp4
# C:\Users\ballx\Downloads\road_training.mp4

cap = cv2.VideoCapture(r"C:\SDA\vehicle-detection\cars2.mp4")
model = YOLO('yolov8n.pt')

classnames = []
with open('classes.txt', 'r') as f:
    classnames = f.read().splitlines()

# ปรับค่า max_age, min_hits และ iou_threshold เพื่อเพิ่มความแม่นยำ
tracker = Sort(max_age=10, min_hits=2, iou_threshold=0.35)
line = [320, 350, 620, 350]
counter = []
detected_objects = []
previous_positions = {}

while True:
    ret, frame = cap.read()

    if not ret:
        cap = cv2.VideoCapture(r"C:\SDA\vehicle-detection\cars2.mp4")
        continue

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    detections = np.empty((0, 5))
    result = model(frame, stream=True)
    
    for info in result:
        boxes = info.boxes
        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            conf = box.conf[0]
            classindex = box.cls[0]
            conf = math.ceil(conf * 100)
            classindex = int(classindex)
            objectdetect = classnames[classindex]

            if objectdetect in ['car', 'bus', 'truck'] and conf > 60:
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                new_detections = np.array([x1, y1, x2, y2, conf])
                detections = np.vstack((detections, new_detections))
                # print(f'detect object: {box}')

    track_result = tracker.update(detections)
    cv2.line(frame, (line[0], line[1]), (line[2], line[3]), (0, 255, 255), 7)

    track_result_with_type = []

    for results in track_result:
        x1, y1, x2, y2, id = results
        x1, y1, x2, y2, id = int(x1), int(y1), int(x2), int(y2), int(id)

        # ตรวจสอบว่า id เป็นไอดีใหม่หรือไม่
        if id not in detected_objects:
            print("new object detected")
            detected_objects.append(id)  # เพิ่มไอดีใหม่ลงในรายการ
        
        w, h = x2 - x1, y2 - y1
        cx, cy = x1 + w // 2, y1 + h // 2

        # ใช้ค่าเฉลี่ยจากเฟรมก่อนหน้าเพื่อลดการเปลี่ยนแปลง ID
        if id in previous_positions:
            prev_cx, prev_cy = previous_positions[id]
            cx = int((cx + prev_cx) / 2)
            cy = int((cy + prev_cy) / 2)

        previous_positions[id] = (cx, cy)

        cv2.circle(frame, (cx, cy), 6, (0, 0, 255), -1)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 3)
        cvzone.putTextRect(frame, f'{id}', [x1 + 8, y1 - 12], thickness=2, scale=1.5)

        if line[0] < cx < line[2] and line[1] - 20 < cy < line[1] + 20:
            cv2.line(frame, (line[0], line[1]), (line[2], line[3]), (0, 0, 255), 15)
            if id not in counter:  # ใช้ not in แทน .count(id) == 0 (เร็วกว่า)
                counter.append(id)


    cvzone.putTextRect(frame, f'count = {len(counter)}', [290, 34], thickness=4, scale=2.3, border=2)

    cv2.imshow('frame', frame)
    cv2.waitKey(1)

cap.release()
cv2.destroyAllWindows()
