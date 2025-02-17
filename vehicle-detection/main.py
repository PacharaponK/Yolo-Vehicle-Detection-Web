import cv2
from sort import *
import math
import numpy as np
from ultralytics import YOLO
import cvzone
import datetime
from services import update_and_forget, fire_and_forget, post_video
import os

now = datetime.datetime.now()
current_date = now.date()
current_time = now.time()

services = {
    "create_vehicle_url": "http://localhost:3001/api/vehicle",
    "update_vehicle_url": "http://localhost:3001/api/vehicle/{}",
}

# C:\SDA\vehicle-detection\cars2.mp4
# C:\Users\ballx\Downloads\road_training.mp4

video_path = r"C:\SDA\vehicle-detection\data\cars.mp4"
cap = cv2.VideoCapture(video_path)
video_name = os.path.basename(video_path)

post_video_response = post_video({"title": video_name})
print(post_video_response)
video_id = post_video_response["data"]["id"]
print(video_id)

model = YOLO('yolov8n.pt')

classnames = []
with open('classes.txt', 'r') as f:
    classnames = f.read().splitlines()

# ปรับค่า max_age, min_hits และ iou_threshold เพื่อเพิ่มความแม่นยำ
tracker = Sort(max_age=30, min_hits=3, iou_threshold=0.25)

first_entry_fw_lane = [536, 347, 696, 345]
second_entry_fw_lane = [696, 345, 778, 345]
third_entry_fw_lane = [778, 345, 885, 345]

first_exit_fw_lane = [2, 581, 384, 581]
second_exit_fw_lane = [384, 581, 572, 581]
third_exit_fw_lane = [572, 581, 817, 581]

first_entry_bw_lane = [1822, 611, 1446, 610]
second_entry_bw_lane = [1446, 610, 1267, 608]
third_entry_bw_lane = [1267, 608, 1043, 609]

first_exit_bw_lane = [1255, 343, 1129, 344]
second_exit_bw_lane = [1129, 344, 1058, 343]
third_exit_bw_lane = [1058, 343, 975, 342]

first_fw_lane_entry_counter = []
second_fw_lane_entry_counter = []
third_fw_lane_entry_counter = []
first_fw_lane_exit_counter = []
second_fw_lane_exit_counter = []
third_fw_lane_exit_counter = []

first_bw_lane_entry_counter = []
second_bw_lane_entry_counter = []
third_bw_lane_entry_counter = []
first_bw_lane_exit_counter = []
second_bw_lane_exit_counter = []
third_bw_lane_exit_counter = []

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
    cv2.line(frame, (first_entry_fw_lane[0], first_entry_fw_lane[1]), (first_entry_fw_lane[2], first_entry_fw_lane[3]), (0, 0, 255), 4)
    cv2.line(frame, (second_entry_fw_lane[0], second_entry_fw_lane[1]), (second_entry_fw_lane[2], second_entry_fw_lane[3]), (0, 255, 0), 4)
    cv2.line(frame, (third_entry_fw_lane[0], third_entry_fw_lane[1]), (third_entry_fw_lane[2], third_entry_fw_lane[3]), (255, 0, 0), 4)

    cv2.line(frame, (first_exit_fw_lane[0], first_exit_fw_lane[1]), (first_exit_fw_lane[2], first_exit_fw_lane[3]), (0, 0, 255), 4)
    cv2.line(frame, (second_exit_fw_lane[0], second_exit_fw_lane[1]), (second_exit_fw_lane[2], second_exit_fw_lane[3]), (0, 255, 0), 4)
    cv2.line(frame, (third_exit_fw_lane[0], third_exit_fw_lane[1]), (third_exit_fw_lane[2], third_exit_fw_lane[3]), (255, 0, 0), 4)

    cv2.line(frame, (first_entry_bw_lane[0], first_entry_bw_lane[1]), (first_entry_bw_lane[2], first_entry_bw_lane[3]), (0, 0, 255), 4)
    cv2.line(frame, (second_entry_bw_lane[0], second_entry_bw_lane[1]), (second_entry_bw_lane[2], second_entry_bw_lane[3]), (0, 255, 0), 4)
    cv2.line(frame, (third_entry_bw_lane[0], third_entry_bw_lane[1]), (third_entry_bw_lane[2], third_entry_bw_lane[3]), (255, 0, 0), 4)

    cv2.line(frame, (first_exit_bw_lane[0], first_exit_bw_lane[1]), (first_exit_bw_lane[2], first_exit_bw_lane[3]), (0, 0, 255), 4)
    cv2.line(frame, (second_exit_bw_lane[0], second_exit_bw_lane[1]), (second_exit_bw_lane[2], second_exit_bw_lane[3]), (0, 255, 0), 4)
    cv2.line(frame, (third_exit_bw_lane[0], third_exit_bw_lane[1]), (third_exit_bw_lane[2], third_exit_bw_lane[3]), (255, 0, 0), 4)


    for results in track_result:
        x1, y1, x2, y2, id, classindex = results
        # print(f'track object: {results}')
        x1, y1, x2, y2, id, classindex = int(x1), int(y1), int(x2), int(y2), int(id), int(classindex)
        
        w, h = x2 - x1, y2 - y1
        cx, cy = x1 + w // 2, y2

        # ใช้ค่าเฉลี่ยจากเฟรมก่อนหน้าเพื่อลดการเปลี่ยนแปลง ID
        if id in previous_positions:
            prev_cx, prev_cy = previous_positions[id]
            cx = int((cx + prev_cx) / 2)
            cy = int((cy + prev_cy) / 2)

        previous_positions[id] = (cx, cy)

        cv2.circle(frame, (cx, cy), 6, (0, 0, 255), -1)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (127, 0, 255), 3)
        cvzone.putTextRect(frame, f'{id}', [x1 + 8, y1 - 12], thickness=2, scale=1.5)

        # ตรวจจับถนนขาเข้าเฟรมรถเข้าเลนแรก
        if first_entry_fw_lane[0] < cx < first_entry_fw_lane[2] and first_entry_fw_lane[1] - 10 < cy < first_entry_fw_lane[1] + 10:
            cv2.line(frame, (first_entry_fw_lane[0], first_entry_fw_lane[1]), (first_entry_fw_lane[2], first_entry_fw_lane[3]), (0, 0, 0), 8)
            if id not in first_fw_lane_entry_counter:
                if id not in detected_objects:
                    entry_datetime = datetime.datetime.combine(datetime.datetime.now().date(), datetime.datetime.now().time())
                    detected = {
                        "id": id,
                        "class": classnames[classindex],
                        "lane_type": "forward",
                        "lane_id": 1
                    }

                    on_send_data = {
                        'data' : {
                            "yolo_id": id,
                            "class": classnames[classindex],
                            "entry_time": entry_datetime.isoformat(),
                            "exit_time": None,
                            "lane_type": "forward",
                            "lane_id": 1,
                            "video_id": video_id
                        }
                    }
                    response = fire_and_forget(on_send_data)
                    detected_objects.append([detected])
                    first_fw_lane_entry_counter.append(id)

        # ตรวจจับถนนขาเข้าเฟรมรถออกเลนแรก
        if first_exit_fw_lane[0] < cx < first_exit_fw_lane[2] and first_exit_fw_lane[1] - 10 < cy < first_exit_fw_lane[1] + 10:
            cv2.line(frame, (first_exit_fw_lane[0], first_exit_fw_lane[1]), (first_exit_fw_lane[2], first_exit_fw_lane[3]), (0, 0, 0), 8)
            if id not in first_fw_lane_exit_counter:
                entry_datetime = datetime.datetime.combine(datetime.datetime.now().date(), datetime.datetime.now().time())
                first_fw_lane_exit_counter.append(id)
                for detected in detected_objects:
                    if detected[0]["id"] == id:
                        detected[0]["exit_time"] = datetime.datetime.now().time()
                        data = {
                            "data": {
                                "exit_time": entry_datetime.isoformat()
                            }
                        }
                        query = f'?yolo_id={id}&video_name={video_name}'
                        response = update_and_forget(data, query)
        
        # ตรวจจับถนนขาเข้าเฟรมรถเข้าเลนที่สอง
        if second_entry_fw_lane[0] < cx < second_entry_fw_lane[2] and second_entry_fw_lane[1] - 10 < cy < second_entry_fw_lane[1] + 10:
            cv2.line(frame, (second_entry_fw_lane[0], second_entry_fw_lane[1]), (second_entry_fw_lane[2], second_entry_fw_lane[3]), (0, 0, 0), 8)
            if id not in second_fw_lane_entry_counter:
                if id not in detected_objects:
                    entry_datetime = datetime.datetime.combine(datetime.datetime.now().date(), datetime.datetime.now().time())
                    detected = {
                        "id": id,
                        "class": classnames[classindex],
                        "lane_type": "forward",
                        "lane_id": 2
                    }

                    on_send_data = {
                        'data' : {
                            "yolo_id": id,
                            "class": classnames[classindex],
                            "entry_time": entry_datetime.isoformat(),
                            "exit_time": None,
                            "lane_type": "forward",
                            "lane_id": 2,
                            "video_id": video_id
                        }
                    }
                    response = fire_and_forget(on_send_data)
                    detected_objects.append([detected])
                    second_fw_lane_entry_counter.append(id)
        
        # ตรวจจับถนนขาเข้าเฟรมรถออกเลนที่สอง
        if second_exit_fw_lane[0] < cx < second_exit_fw_lane[2] and second_exit_fw_lane[1] - 10 < cy < second_exit_fw_lane[1] + 10:
            cv2.line(frame, (second_exit_fw_lane[0], second_exit_fw_lane[1]), (second_exit_fw_lane[2], second_exit_fw_lane[3]), (0, 0, 0), 8)
            if id not in first_fw_lane_exit_counter:
                entry_datetime = datetime.datetime.combine(datetime.datetime.now().date(), datetime.datetime.now().time())
                second_fw_lane_exit_counter.append(id)
                for detected in detected_objects:
                    if detected[0]["id"] == id:
                        detected[0]["exit_time"] = datetime.datetime.now().time()
                        data = {
                            "data": {
                                "exit_time": entry_datetime.isoformat()
                            }
                        }
                        query = f'?yolo_id={id}&video_name={video_name}'
                        response = update_and_forget(data, query)
        
        # ตรวจจับถนนขาเข้าเฟรมรถเข้าเลนที่สอง
        if third_entry_fw_lane[0] < cx < third_entry_fw_lane[2] and third_entry_fw_lane[1] - 10 < cy < third_entry_fw_lane[1] + 10:
            cv2.line(frame, (third_entry_fw_lane[0], third_entry_fw_lane[1]), (third_entry_fw_lane[2], third_entry_fw_lane[3]), (0, 0, 0), 8)
            if id not in third_fw_lane_entry_counter:
                if id not in detected_objects:
                    entry_datetime = datetime.datetime.combine(datetime.datetime.now().date(), datetime.datetime.now().time())
                    detected = {
                        "id": id,
                        "class": classnames[classindex],
                        "lane_type": "forward",
                        "lane_id": 3
                    }

                    on_send_data = {
                        'data' : {
                            "yolo_id": id,
                            "class": classnames[classindex],
                            "entry_time": entry_datetime.isoformat(),
                            "exit_time": None,
                            "lane_type": "forward",
                            "lane_id": 3,
                            "video_id": video_id
                        }
                    }
                    response = fire_and_forget(on_send_data)
                    detected_objects.append([detected])
                    third_fw_lane_entry_counter.append(id)
        
        # ตรวจจับถนนขาเข้าเฟรมรถออกเลนที่สาม
        if third_exit_fw_lane[0] < cx < third_exit_fw_lane[2] and third_exit_fw_lane[1] - 10 < cy < third_exit_fw_lane[1] + 10:
            cv2.line(frame, (third_exit_fw_lane[0], third_exit_fw_lane[1]), (third_exit_fw_lane[2], third_exit_fw_lane[3]), (0, 0, 0), 8)
            if id not in first_fw_lane_exit_counter:
                third_fw_lane_exit_counter.append(id)
                entry_datetime = datetime.datetime.combine(datetime.datetime.now().date(), datetime.datetime.now().time())
                for detected in detected_objects:
                    if detected[0]["id"] == id:
                        detected[0]["exit_time"] = datetime.datetime.now().time()
                        data = {
                            "data": {
                                "exit_time": entry_datetime.isoformat()
                            }
                        }
                        query = f'?yolo_id={id}&video_name={video_name}'
                        response = update_and_forget(data, query)

        # ตรวจจับถนนขาออกเฟรมรถเข้าเลนแรก
        if first_entry_bw_lane[2] < cx < first_entry_bw_lane[0] and first_entry_bw_lane[1] - 10 < cy < first_entry_bw_lane[1] + 10:
            cv2.line(frame, (first_entry_bw_lane[0], first_entry_bw_lane[1]), (first_entry_bw_lane[2], first_entry_bw_lane[3]), (0, 0, 0), 8)
            if id not in first_bw_lane_entry_counter:
                if id not in detected_objects:
                    entry_datetime = datetime.datetime.combine(datetime.datetime.now().date(), datetime.datetime.now().time())
                    detected = {
                        "id": id,
                        "class": classnames[classindex],
                        "lane_type": "backward",
                        "lane_id": 1
                    }

                    on_send_data = {
                        'data' : {
                            "yolo_id": id,
                            "class": classnames[classindex],
                            "entry_time": entry_datetime.isoformat(),
                            "exit_time": None,
                            "lane_type": "backward",
                            "lane_id": 1,
                            "video_id": video_id
                        }
                    }
                    response = fire_and_forget(on_send_data)
                    detected_objects.append([detected])
                    first_bw_lane_entry_counter.append(id)


        # ตรวจจับถนนขาออกเฟรมรถออกเลนแรก
        if first_exit_bw_lane[2] < cx < first_exit_bw_lane[0] and first_exit_bw_lane[1] - 10 < cy < first_exit_bw_lane[1] + 10:
            cv2.line(frame, (first_exit_bw_lane[0], first_exit_bw_lane[1]), (first_exit_bw_lane[2], first_exit_bw_lane[3]), (0, 0, 0), 8)
            if id not in first_bw_lane_exit_counter:
                first_bw_lane_exit_counter.append(id)

                for detected in detected_objects:
                    entry_datetime = datetime.datetime.combine(datetime.datetime.now().date(), datetime.datetime.now().time())
                    if detected[0]["id"] == id:
                        detected[0]["exit_time"] = datetime.datetime.now().time()
                        data = {
                            "data": {
                                "exit_time": entry_datetime.isoformat()
                            }
                        }
                        query = f'?yolo_id={id}&video_name={video_name}'
                        response = update_and_forget(data, query)
        
        # ตรวจจับถนนขาออกเฟรมรถเข้าเลนที่สอง
        if second_entry_bw_lane[2] < cx < second_entry_bw_lane[0] and second_entry_bw_lane[1] - 10 < cy < second_entry_bw_lane[1] + 10:
            cv2.line(frame, (second_entry_bw_lane[0], second_entry_bw_lane[1]), (second_entry_bw_lane[2], second_entry_bw_lane[3]), (0, 0, 0), 8)
            if id not in second_bw_lane_entry_counter:
                if id not in detected_objects:
                    entry_datetime = datetime.datetime.combine(datetime.datetime.now().date(), datetime.datetime.now().time())
                    detected = {
                        "id": id,
                        "class": classnames[classindex],
                        "lane_type": "backward",
                        "lane_id": 2
                    }

                    on_send_data = {
                        'data' : {
                            "yolo_id": id,
                            "class": classnames[classindex],
                            "entry_time": entry_datetime.isoformat(),
                            "exit_time": None,
                            "lane_type": "backward",
                            "lane_id": 2,
                            "video_id": video_id
                        }
                    }
                    response = fire_and_forget(on_send_data)
                    detected_objects.append([detected])
                    second_bw_lane_entry_counter.append(id)

        # ตรวจจับถนนขาออกเฟรมรถออกเลนที่สอง
        if second_exit_bw_lane[2] < cx < second_exit_bw_lane[0] and second_exit_bw_lane[1] - 10 < cy < second_exit_bw_lane[1] + 10:
            cv2.line(frame, (second_exit_bw_lane[0], second_exit_bw_lane[1]), (second_exit_bw_lane[2], second_exit_bw_lane[3]), (0, 0, 0), 8)
            if id not in second_bw_lane_exit_counter:
                second_bw_lane_exit_counter.append(id)
                entry_datetime = datetime.datetime.combine(datetime.datetime.now().date(), datetime.datetime.now().time())

                for detected in detected_objects:
                    if detected[0]["id"] == id:
                        detected[0]["exit_time"] = datetime.datetime.now().time()
                        data = {
                            "data": {
                                "exit_time": entry_datetime.isoformat()
                            }
                        }
                        query = f'?yolo_id={id}&video_name={video_name}'
                        response = update_and_forget(data, query)
        
        # ตรวจจับถนนขาออกเฟรมรถเข้าเลนที่สอง
        if third_entry_bw_lane[2] < cx < third_entry_bw_lane[0] and third_entry_bw_lane[1] - 10 < cy < third_entry_bw_lane[1] + 10:
            cv2.line(frame, (third_entry_bw_lane[0], third_entry_bw_lane[1]), (third_entry_bw_lane[2], third_entry_bw_lane[3]), (0, 0, 0), 8)
            if id not in third_bw_lane_entry_counter:
                if id not in detected_objects:
                    entry_datetime = datetime.datetime.combine(datetime.datetime.now().date(), datetime.datetime.now().time())
                    detected = {
                        "id": id,
                        "class": classnames[classindex],
                        "lane_type": "backward",
                        "lane_id": 3
                    }

                    on_send_data = {
                        'data' : {
                            "yolo_id": id,
                            "class": classnames[classindex],
                            "entry_time": entry_datetime.isoformat(),
                            "exit_time": None,
                            "lane_type": "backward",
                            "lane_id": 3,
                            "video_id": video_id
                        }
                    }
                    response = fire_and_forget(on_send_data)
                    detected_objects.append([detected])
                    third_bw_lane_entry_counter.append(id)


        # ตรวจจับถนนขาออกเฟรมรถออกเลนที่สอง
        if third_exit_bw_lane[2] < cx < third_exit_bw_lane[0] and third_exit_bw_lane[1] - 10 < cy < third_exit_bw_lane[1] + 10:
            cv2.line(frame, (third_exit_bw_lane[0], third_exit_bw_lane[1]), (third_exit_bw_lane[2], third_exit_bw_lane[3]), (0, 0, 0), 8)
            if id not in third_bw_lane_exit_counter:
                third_bw_lane_exit_counter.append(id)
                entry_datetime = datetime.datetime.combine(datetime.datetime.now().date(), datetime.datetime.now().time())

                for detected in detected_objects:
                    if detected[0]["id"] == id:
                        detected[0]["exit_time"] = datetime.datetime.now().time()
                        data = {
                            "data": {
                                "exit_time": entry_datetime.isoformat()
                            }
                        }
                        query = f'?yolo_id={id}&video_name={video_name}'
                        response = update_and_forget(data, query)

    cvzone.putTextRect(frame, f'1st_fw_lane_entry_count = {len(first_fw_lane_entry_counter)}', [10, 30], thickness=1, scale=1.0, border=1)
    cvzone.putTextRect(frame, f'1st_fw_lane_exit_count = {len(first_fw_lane_exit_counter)}', [10, 60], thickness=1, scale=1.0, border=1)
    cvzone.putTextRect(frame, f'2nd_fw_lane_entry_count = {len(second_fw_lane_entry_counter)}', [10, 90], thickness=1, scale=1.0, border=1)
    cvzone.putTextRect(frame, f'2nd_fw_lane_exit_count = {len(second_fw_lane_exit_counter)}', [10, 120], thickness=1, scale=1.0, border=1)
    cvzone.putTextRect(frame, f'3rd_fw_lane_entry_count = {len(third_fw_lane_entry_counter)}', [10, 150], thickness=1, scale=1.0, border=1)
    cvzone.putTextRect(frame, f'3rd_fw_lane_exit_count = {len(third_fw_lane_exit_counter)}', [10, 180], thickness=1, scale=1.0, border=1)
    cvzone.putTextRect(frame, f'1st_bw_lane_entry_count = {len(first_bw_lane_entry_counter)}', [10, 210], thickness=1, scale=1.0, border=1)
    cvzone.putTextRect(frame, f'1st_bw_lane_exit_count = {len(first_bw_lane_exit_counter)}', [10, 240], thickness=1, scale=1.0, border=1)
    cvzone.putTextRect(frame, f'2nd_bw_lane_entry_count = {len(second_bw_lane_entry_counter)}', [10, 270], thickness=1, scale=1.0, border=1)
    cvzone.putTextRect(frame, f'2nd_bw_lane_exit_count = {len(second_bw_lane_exit_counter)}', [10, 300], thickness=1, scale=1.0, border=1)
    cvzone.putTextRect(frame, f'3rd_bw_lane_entry_count = {len(third_bw_lane_entry_counter)}', [10, 330], thickness=1, scale=1.0, border=1)
    cvzone.putTextRect(frame, f'3rd_bw_lane_exit_count = {len(third_bw_lane_exit_counter)}', [10, 360], thickness=1, scale=1.0, border=1)

    cv2.imshow('frame', frame)
    cv2.waitKey(1)

cap.release()
cv2.destroyAllWindows()