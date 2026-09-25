import requests
import datetime

url = "http://localhost:8000/api/v1/hotspots/ingest"
now = datetime.datetime.utcnow().isoformat()

payload = [
    {
        "latitude": 21.7516,
        "longitude": 83.8474, # Near Belpahar Coal Mine
        "brightness": 400.0,
        "bright_t31": 300.0,
        "frp": 350.0, # CRITICAL (>200)
        "confidence": 100,
        "satellite": "Terra",
        "instrument": "MODIS",
        "daynight": "D",
        "scan": 1.0,
        "track": 1.0,
        "pixel_area": 1.0,
        "acq_date": now
    }
]

response = requests.post(url, json=payload)
print(response.json())
