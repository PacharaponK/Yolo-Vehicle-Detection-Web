import cv2
from sort import *
import math
import numpy as np
from ultralytics import YOLO
import cvzone
import mysql.connector
import datetime

now = datetime.datetime.now()

current_date = now.date()
current_time = now.time()


# mydb = mysql.connector.connect(
#     host="34.44.80.130",
#     user="forthree",
#     password="fortree",
#     database="test"
# )

# print(mydb)


# C:\SDA\vehicle-detection\cars2.mp4
# C:\Users\ballx\Downloads\road_training.mp4

cap = cv2.VideoCapture(r"C:\SDA\vehicle-detection\data\cars.mp4")
model = YOLO('yolov8n.pt')

classnames = []
with open('classes.txt', 'r') as f:
    classnames = f.read().splitlines()

# ปรับค่า max_age, min_hits และ iou_threshold เพื่อเพิ่มความแม่นยำ
tracker = Sort(max_age=30, min_hits=3, iou_threshold=0.25)
first_entry_bw_lane = [1043, 607, 1822, 612]
first_exit_bw_lane = [973, 341, 1253, 344]
first_entry_fw_lane = [536, 347, 885, 345]
first_exit_fw_lane = [2, 580, 818, 580]
entry_counter = []
exit_counter = []

detected_objects = []
on_send_data = []
previous_positions = {}

while True:
    ret, frame = cap.read()

    if not ret:
        cap = cv2.VideoCapture(r"C:\SDA\vehicle-detection\vehicles.mp4")
        continue

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

    frame_height, frame_width = frame.shape[:2]
    if frame_width > 1920 or frame_height > 1080:
        scale = min(1920 / frame_width, 1080 / frame_height)
        frame = cv2.resize(frame, (int(frame_width * scale), int(frame_height * scale)), interpolation=cv2.INTER_AREA)
    
    detections = np.empty((0, 6))
    result = model(frame, stream=True, classes=[0, 2, 7])

    
    for info in result:
        boxes = info.boxes
        for box in boxes:
            x1, y1, x2, y2 = box.xyxy[0]
            conf = box.conf[0]
            classindex = box.cls[0]
            conf = math.ceil(conf * 100)
            classindex = int(classindex)
            objectdetect = classnames[classindex]

            if objectdetect in ['car', 'truck'] and conf > 40:
                x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
                new_detections = np.array([x1, y1, x2, y2, conf, classindex])
                # print(f'detect object: {new_detections}')
                detections = np.vstack((detections, new_detections))
                # print(f'detect object: {box}')

    track_result = tracker.update(detections)
    cv2.line(frame, (first_entry_fw_lane[0], first_entry_fw_lane[1]), (first_entry_fw_lane[2], first_entry_fw_lane[3]), (0, 255, 255), 4)
    cv2.line(frame, (first_exit_fw_lane[0], first_exit_fw_lane[1]), (first_exit_fw_lane[2], first_exit_fw_lane[3]), (0, 255, 255), 4)
    cv2.line(frame, (first_entry_bw_lane[0], first_entry_bw_lane[1]), (first_entry_bw_lane[2], first_entry_bw_lane[3]), (0, 255, 255), 4)
    cv2.line(frame, (first_exit_bw_lane[0], first_exit_bw_lane[1]), (first_exit_bw_lane[2], first_exit_bw_lane[3]), (0, 255, 255), 4)

    for results in track_result:
        x1, y1, x2, y2, id, classindex = results
        # print(f'track object: {results}')
        x1, y1, x2, y2, id, classindex = int(x1), int(y1), int(x2), int(y2), int(id), int(classindex)
        
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

        #ตรวจจับขาเข้าเลนแรก
        if first_entry_fw_lane[0] < cx < first_entry_fw_lane[2] and first_entry_fw_lane[1] - 20 < cy < first_entry_fw_lane[1] + 20:
            cv2.line(frame, (first_entry_fw_lane[0], first_entry_fw_lane[1]), (first_entry_fw_lane[2], first_entry_fw_lane[3]), (0, 0, 255), 8)
            if id not in entry_counter:
                if id not in detected_objects:
                    print(f"New object detected: {results[4]} ({classnames[classindex]})")
                    print(f"Coordinates: ({cx}, {cy}), Lane: Forward Entry")
                    print(f"Timestamp: {datetime.datetime.now()}")

                    sql = "INSERT INTO vehicle_data (class, date, time) VALUES (%s, %s, %s)"
                    val = (classnames[classindex], current_date, datetime.datetime.now().time())
                    # mycursor.execute(sql, val)
                    # mydb.commit()

                    detected = {
                        "id": id,
                        "class": classnames[classindex],
                        "date": current_date,
                        "entry_time": datetime.datetime.now(),
                        "exit_time": None,
                        "lane": "forward"
                    }

                    detected_objects.append([detected])
                    on_send_data.append(detected)
                    entry_counter.append(id)
                    print(f"Object {id} entered the first forward lane.")
                    # print(f"Entry details: ID={id}, Class={classnames[classindex]}, Time={current_time}")

        # ตรวจจับขาออกเลนแรก
        if first_exit_fw_lane[0] < cx < first_exit_fw_lane[2] and first_exit_fw_lane[1] - 20 < cy < first_exit_fw_lane[1] + 20:
            cv2.line(frame, (first_exit_fw_lane[0], first_exit_fw_lane[1]), (first_exit_fw_lane[2], first_exit_fw_lane[3]), (0, 0, 255), 8)
            if id not in exit_counter:
                exit_counter.append(id)
                print(f"Object {id} exited the first forward lane.")
                print(f"Coordinates: ({cx}, {cy}), Lane: Forward Exit")
                print(f"Exit details: ID={id}, Time={datetime.datetime.now()}")

                for detected in detected_objects:
                    if detected[0]["id"] == id:
                        detected[0]["exit_time"] = datetime.datetime.now().time()  # Set exit time
                        # print(f"Exit time updated for object {id}: {detected[0]['exit_time']}")

        # ตรวจจับขาเข้าเลนที่สอง
        if first_entry_bw_lane[0] < cx < first_entry_bw_lane[2] and first_entry_bw_lane[1] - 20 < cy < first_entry_bw_lane[1] + 20:
            cv2.line(frame, (first_entry_bw_lane[0], first_entry_bw_lane[1]), (first_entry_bw_lane[2], first_entry_bw_lane[3]), (0, 0, 255), 8)
            if id not in entry_counter:
                entry_counter.append(id)
                print(f"Object {id} entered the second forward lane.")
                print(f"Coordinates: ({cx}, {cy}), Lane: Forward Entry")
                print(f"Entry details: ID={id}, Time={datetime.datetime.now()}")
                detected = {
                        "id": id,
                        "class": classnames[classindex],
                        "date": current_date,
                        "entry_time": datetime.datetime.now(),
                        "exit_time": None,
                        "lane": "exit"
                    }

                detected_objects.append([detected])

        # ตรวจจับขาออกเลนที่สอง
        if first_exit_bw_lane[0] < cx < first_exit_bw_lane[2] and first_exit_bw_lane[1] - 20 < cy < first_exit_bw_lane[1] + 20:
            cv2.line(frame, (first_exit_bw_lane[0], first_exit_bw_lane[1]), (first_exit_bw_lane[2], first_exit_bw_lane[3]), (0, 0, 255), 8)
            if id not in exit_counter:
                exit_counter.append(id)
                print(f"Object {id} exited the second forward lane.")
                print(f"Coordinates: ({cx}, {cy}), Lane: Forward Exit")
                print(f"Exit details: ID={id}, Time={datetime.datetime.now()}")

                for detected in detected_objects:
                    if detected[0]["id"] == id:
                        detected[0]["exit_time"] = datetime.datetime.now().time()  # Set exit time
                        print(f"Exit time updated for object {id}: {detected[0]['exit_time']}")



    cvzone.putTextRect(frame, f'entry_count = {len(entry_counter)}', [10, 34], thickness=4, scale=2.3, border=2)
    cvzone.putTextRect(frame, f'exit_count = {len(exit_counter)}', [10, 100], thickness=4, scale=2.3, border=2)

    cv2.imshow('frame', frame)
    cv2.waitKey(1)

print(detected_objects)
cap.release()
cv2.destroyAllWindows()
