import cv2

def click_event(event, x, y, flags, params):
    if event == cv2.EVENT_LBUTTONDOWN:
        print(f"Clicked at: ({x}, {y})")

cap = cv2.VideoCapture(r"C:\SDA\vehicle-detection\data\cars.mp4")

while True:
    ret, frame = cap.read()

    if not ret:
        print("วิดีโอถึงตอนจบแล้ว กำลังเริ่มใหม่...")
        cap.set(cv2.CAP_PROP_POS_FRAMES, 0) 
        continue

    cv2.imshow('frame', frame)

    cv2.setMouseCallback('frame', click_event)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
