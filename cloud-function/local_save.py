import requests
import json
import pandas as pd

def fetch_data():
    url = "https://alivefordie.life/api/vehicle/today"  
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data", "status_code": response.status_code}

def export_to_excel(forward_lane_list, backward_lane_list, filename="vehicle_data.xlsx"):
    # สร้าง DataFrame จากข้อมูล
    df_forward = pd.DataFrame(forward_lane_list)
    df_backward = pd.DataFrame(backward_lane_list)
    
    # เปลี่ยนชื่อคอลัมน์เป็นภาษาไทย
    df_forward.rename(columns={'yolo_id': "รหัสรถ", 'class': 'ชนิดรถ', 'lane_id': "ลำดับเลน", 'entry_time': "เวลาที่ตรวจจับ"}, inplace=True)
    df_backward.rename(columns={'yolo_id': "รหัสรถ", 'class': 'ชนิดรถ', 'lane_id': "ลำดับเลน", 'entry_time': "เวลาที่ตรวจจับ"}, inplace=True)

    # แปลงและแยกวันที่ - เวลา
    for df in [df_forward, df_backward]:
        if "เวลาที่ตรวจจับ" in df.columns:
            df["เวลาที่ตรวจจับ"] = pd.to_datetime(df["เวลาที่ตรวจจับ"])
            df["วันที่ตรวจจับ"] = df["เวลาที่ตรวจจับ"].dt.date.astype(str)
            df["เวลาที่ตรวจจับ"] = df["เวลาที่ตรวจจับ"].dt.time.astype(str)

    # ลบคอลัมน์ที่ไม่ต้องการ
    columns_to_remove = ["id", "exit_time", "lane_type"]  
    df_forward.drop(columns=[col for col in columns_to_remove if col in df_forward.columns], inplace=True)
    df_backward.drop(columns=[col for col in columns_to_remove if col in df_backward.columns], inplace=True)

    # Sort ข้อมูลตามลำดับเลน (จากน้อยไปมาก)
    df_forward = df_forward.sort_values(by="รหัสรถ")
    df_backward = df_backward.sort_values(by="รหัสรถ")

    # จัดเรียงลำดับคอลัมน์ตามที่ต้องการ
    desired_columns = ["รหัสรถ", "ลำดับเลน", "ชนิดรถ", "เวลาที่ตรวจจับ", "วันที่ตรวจจับ"]
    df_forward = df_forward[desired_columns]
    df_backward = df_backward[desired_columns]

    print(df_forward.head())
    print(df_backward.head())

    # บันทึกข้อมูลเป็นไฟล์ Excel โดยใช้หลายชีต
    with pd.ExcelWriter(filename) as writer:
        df_forward.to_excel(writer, sheet_name="Forward Lane", index=False)
        df_backward.to_excel(writer, sheet_name="Backward Lane", index=False)

    print(f"Exported data to {filename} successfully.")

def main():
    """Cloud Function Entry Point"""
    data_list = fetch_data()
    
    if "error" in data_list:
        print(json.dumps(data_list, indent=2))
        return
    
    forward_lane_list = []
    backward_lane_list = []

    for data in data_list["data"]:
        if data["lane_type"] == "forward":
            forward_lane_list.append(data)
        elif data["lane_type"] == "backward":
            backward_lane_list.append(data)

    # Export ข้อมูลเป็นไฟล์ Excel
    export_to_excel(forward_lane_list, backward_lane_list)

main()