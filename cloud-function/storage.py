import requests
import json
import pandas as pd
import time
from google.cloud import storage
from io import BytesIO 
from datetime import datetime


def fetch_data():
    """ดึงข้อมูลจาก API พร้อมการ retry กรณีเจอ 500 Internal Server Error"""
    url = "https://alivefordie.life/api/vehicle/today"
    retries = 3  # จำนวนครั้งที่ retry
    for i in range(retries):
        try:
            response = requests.get(url)
            response.raise_for_status()  # ถ้ามี error (4xx, 5xx) จะเกิด exception ทันที
            return response.json()
        except requests.exceptions.HTTPError as http_err:
            print(f"HTTP error occurred: {http_err} - Status Code: {response.status_code}")
            print(f"Response Text: {response.text}")  # แสดงรายละเอียด response
            if response.status_code == 500 and i < retries - 1:
                print(f"Retrying... ({i+1}/{retries})")
                time.sleep(2)  # รอ 2 วินาทีก่อน retry
                continue
            break
        except requests.exceptions.RequestException as req_err:
            print(f"Request error occurred: {req_err}")
            break
    return {"error": "Failed to fetch data", "status_code": 500}

def upload_to_gcs(bucket_name, destination_blob_name, file_bytes):
    """อัปโหลดไฟล์ Excel ไปยัง Google Cloud Storage"""
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(destination_blob_name)

    blob.upload_from_file(file_bytes, content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")

    print(f"Uploaded to {bucket_name}/{destination_blob_name} successfully")

def export_to_gcs(forward_lane_list, backward_lane_list, bucket_name, destination_blob_name):
    """สร้างไฟล์ Excel และอัปโหลดขึ้น Google Cloud Storage"""
    df_forward = pd.DataFrame(forward_lane_list)
    df_backward = pd.DataFrame(backward_lane_list)

    # เปลี่ยนชื่อคอลัมน์เป็นภาษาไทย
    df_forward.rename(columns={'class': 'ชนิดรถ', 'yolo_id': "รหัสรถ", 'lane_type': "ชนิดเลน", 'lane_id': "ลำดับเลน", 'entry_time': "เวลาที่ตรวจจับ"}, inplace=True)
    df_backward.rename(columns={'class': 'ชนิดรถ', 'yolo_id': "รหัสรถ", 'lane_type': "ชนิดเลน", 'lane_id': "ลำดับเลน", 'entry_time': "เวลาที่ตรวจจับ"}, inplace=True)

    # แปลงและแยกวันที่ - เวลา
    for df in [df_forward, df_backward]:
        if "เวลาที่ตรวจจับ" in df.columns:
            df["เวลาที่ตรวจจับ"] = pd.to_datetime(df["เวลาที่ตรวจจับ"], errors='coerce')  # เผื่อมี format ที่ผิดพลาด
            df["วันที่ตรวจจับ"] = df["เวลาที่ตรวจจับ"].dt.date.astype(str)
            df["เวลาที่ตรวจจับ"] = df["เวลาที่ตรวจจับ"].dt.time.astype(str)

    # ลบคอลัมน์ที่ไม่ต้องการ
    columns_to_remove = ["id", "exit_time"]
    df_forward.drop(columns=[col for col in columns_to_remove if col in df_forward.columns], inplace=True)
    df_backward.drop(columns=[col for col in columns_to_remove if col in df_backward.columns], inplace=True)

    # สร้างไฟล์ Excel ในหน่วยความจำ
    excel_buffer = BytesIO()
    with pd.ExcelWriter(excel_buffer, engine="xlsxwriter") as writer:
        df_forward.to_excel(writer, sheet_name="Forward Lane", index=False)
        df_backward.to_excel(writer, sheet_name="Backward Lane", index=False)

    excel_buffer.seek(0)  # รีเซ็ตตำแหน่งของไฟล์ก่อนอัปโหลด

    # อัปโหลดไปยัง GCS
    upload_to_gcs(bucket_name, destination_blob_name, excel_buffer)

def vehicle_data_to_gcs(request):
    """Cloud Function Entry Point (HTTP Trigger)"""
    bucket_name = "dtect-bucket"
    current_datetime = datetime.now().strftime("%Y%m%d_%H%M%S")
    destination_blob_name = f"data/vehicle_data_{current_datetime}.xlsx"

    data_list = fetch_data()
    
    if "error" in data_list:
        return json.dumps(data_list), 500
    
    forward_lane_list = []
    backward_lane_list = []

    for data in data_list.get("data", []):  # ใช้ .get() ป้องกัน KeyError กรณีไม่มี key "data"
        if data.get("lane_type") == "forward":
            forward_lane_list.append(data)
        elif data.get("lane_type") == "backward":
            backward_lane_list.append(data)

    # Export และอัปโหลดขึ้น GCS
    export_to_gcs(forward_lane_list, backward_lane_list, bucket_name, destination_blob_name)

    return "File uploaded to GCS successfully", 200