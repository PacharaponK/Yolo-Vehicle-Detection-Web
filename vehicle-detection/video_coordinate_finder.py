import cv2

def click_event(event, x, y, flags, params):
    if event == cv2.EVENT_LBUTTONDOWN:
        print(f"Clicked at: ({x}, {y})")

first_entry_bw_lane = [1043, 607, 1822, 612]
first_exit_bw_lane = [973, 341, 1253, 344]
first_entry_fw_lane = [536, 347, 885, 345]
first_exit_fw_lane = [2, 580, 818, 580]

cap = cv2.VideoCapture(r"C:\SDA\vehicle-detection\data\cars.mp4")

while True:
    ret, frame = cap.read()

    if not ret:
        print("วิดีโอถึงตอนจบแล้ว กำลังเริ่มใหม่...")
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0) 
        continue

    # วาดเส้นบนเฟรม
    cv2.line(frame, (first_entry_bw_lane[0], first_entry_bw_lane[1]), (first_entry_bw_lane[2], first_entry_bw_lane[3]), (0, 0, 255), 2)
    cv2.line(frame, (first_exit_bw_lane[0], first_exit_bw_lane[1]), (first_exit_bw_lane[2], first_exit_bw_lane[3]), (0, 255, 0), 2)
    cv2.line(frame, (first_entry_fw_lane[0], first_entry_fw_lane[1]), (first_entry_fw_lane[2], first_entry_fw_lane[3]), (255, 0, 0), 2)
    cv2.line(frame, (first_exit_fw_lane[0], first_exit_fw_lane[1]), (first_exit_fw_lane[2], first_exit_fw_lane[3]), (255, 255, 0), 2)

    cv2.imshow('frame', frame)
    cv2.setMouseCallback('frame', click_event)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
