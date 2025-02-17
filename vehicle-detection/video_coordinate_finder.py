import cv2

def click_event(event, x, y, flags, params):
    if event == cv2.EVENT_LBUTTONDOWN:
        print(f"Clicked at: ({x}, {y})")

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

cap = cv2.VideoCapture(r"C:\SDA\vehicle-detection\data\cars.mp4")

while True:
    ret, frame = cap.read()

    if not ret:
        print("วิดีโอถึงตอนจบแล้ว กำลังเริ่มใหม่...")
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0) 
        continue

    # วาดเส้นบนเฟรม
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

    cv2.imshow('frame', frame)
    cv2.setMouseCallback('frame', click_event)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
