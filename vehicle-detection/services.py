import requests
import threading

services = {
    "create_vehicle_url": "http://localhost:3001/api/vehicle",
    "update_vehicle_url": "http://localhost:3001/api/vehicle{}",
    "create_video_url": "http://localhost:3001/api/video"
}

def post_video(data): 
    data = { "data" : data }
    response = requests.post(services["create_video_url"], json=data)
    return response.json()

def post_task(data):
    response = requests.post(services["create_vehicle_url"], json=data)
    return response.json()


def update_task(data, query):
    print(data, query)
    response = requests.put(services["update_vehicle_url"].format(query), json=data)
    return response.json()

def fire_and_forget(data):
    threading.Thread(target=post_task, args=(data,)).start()

def update_and_forget(data, query):
    threading.Thread(target=update_task, args=(data, query)).start()