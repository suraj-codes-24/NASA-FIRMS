import asyncio
import json
import httpx

BASE_URL = "https://nasa-firms-deployment.onrender.com"

results = []

def record(endpoint, method, status, note="", data_sample=None):
    results.append({
        "endpoint": endpoint,
        "method": method,
        "status": status,
        "note": note,
        "data_sample": data_sample
    })

async def run_tests():
    async with httpx.AsyncClient(timeout=30.0) as client:
        print("[INFO] Starting Live Endpoint Verification on Render...")

        # 1. Health
        try:
            r = await client.get(f"{BASE_URL}/health")
            record("/health", "GET", r.status_code, "Health check", r.json())
        except Exception as e:
            record("/health", "GET", 500, f"Error: {e}")

        # 2. Root
        try:
            r = await client.get(f"{BASE_URL}/")
            record("/", "GET", r.status_code, "Root info", r.json())
        except Exception as e:
            record("/", "GET", 500, f"Error: {e}")

        # 3. Auth Login
        token = None
        try:
            r = await client.post(f"{BASE_URL}/api/v1/auth/login", data={"username": "admin@example.com", "password": "adminpassword123"})
            record("/api/v1/auth/login", "POST", r.status_code, "Admin Login", "Token received" if r.status_code == 200 else r.text[:100])
            if r.status_code == 200:
                token = r.json().get("access_token")
        except Exception as e:
            record("/api/v1/auth/login", "POST", 500, f"Error: {e}")

        headers = {"Authorization": f"Bearer {token}"} if token else {}

        # 4. Auth Me
        if token:
            try:
                r = await client.get(f"{BASE_URL}/api/v1/auth/me", headers=headers)
                record("/api/v1/auth/me", "GET", r.status_code, "Authenticated user details", r.json())
            except Exception as e:
                record("/api/v1/auth/me", "GET", 500, f"Error: {e}")
        else:
            record("/api/v1/auth/me", "GET", 401, "Skipped due to login failure")

        # 5. Hotspots List
        sample_hotspot_id = None
        try:
            r = await client.get(f"{BASE_URL}/api/v1/hotspots?limit=5")
            record("/api/v1/hotspots", "GET", r.status_code, f"Returned {len(r.json()) if r.status_code==200 else 0} hotspots", r.json()[:1] if r.status_code==200 and r.json() else None)
            if r.status_code == 200 and r.json():
                sample_hotspot_id = r.json()[0]["id"]
        except Exception as e:
            record("/api/v1/hotspots", "GET", 500, f"Error: {e}")

        # 6. Hotspots Latest
        try:
            r = await client.get(f"{BASE_URL}/api/v1/hotspots/latest")
            record("/api/v1/hotspots/latest", "GET", r.status_code, f"Returned {len(r.json()) if r.status_code==200 else 0} latest hotspots")
        except Exception as e:
            record("/api/v1/hotspots/latest", "GET", 500, f"Error: {e}")

        # 7. Hotspots Heatmap
        try:
            r = await client.get(f"{BASE_URL}/api/v1/hotspots/heatmap")
            record("/api/v1/hotspots/heatmap", "GET", r.status_code, f"Heatmap points: {len(r.json()) if r.status_code==200 else 0}")
        except Exception as e:
            record("/api/v1/hotspots/heatmap", "GET", 500, f"Error: {e}")

        # 8. Single Hotspot Details
        if sample_hotspot_id:
            try:
                r = await client.get(f"{BASE_URL}/api/v1/hotspots/{sample_hotspot_id}")
                record(f"/api/v1/hotspots/{sample_hotspot_id}", "GET", r.status_code, f"Hotspot ID {sample_hotspot_id}", r.json())
            except Exception as e:
                record(f"/api/v1/hotspots/{sample_hotspot_id}", "GET", 500, f"Error: {e}")

            # 9. Hotspot History
            try:
                r = await client.get(f"{BASE_URL}/api/v1/hotspots/{sample_hotspot_id}/history")
                record(f"/api/v1/hotspots/{sample_hotspot_id}/history", "GET", r.status_code, f"History items: {len(r.json()) if r.status_code==200 else 0}")
            except Exception as e:
                record(f"/api/v1/hotspots/{sample_hotspot_id}/history", "GET", 500, f"Error: {e}")

            # 10. Nearest Facilities
            try:
                r = await client.get(f"{BASE_URL}/api/v1/hotspots/{sample_hotspot_id}/nearest-facilities")
                record(f"/api/v1/hotspots/{sample_hotspot_id}/nearest-facilities", "GET", r.status_code, f"Facilities near hotspot: {len(r.json()) if r.status_code==200 else 0}")
            except Exception as e:
                record(f"/api/v1/hotspots/{sample_hotspot_id}/nearest-facilities", "GET", 500, f"Error: {e}")

        # 11. Facilities List
        sample_facility_id = None
        try:
            r = await client.get(f"{BASE_URL}/api/v1/facilities?limit=5")
            record("/api/v1/facilities", "GET", r.status_code, f"Returned {len(r.json()) if r.status_code==200 else 0} facilities")
            if r.status_code == 200 and r.json():
                sample_facility_id = r.json()[0]["id"]
        except Exception as e:
            record("/api/v1/facilities", "GET", 500, f"Error: {e}")

        if sample_facility_id:
            try:
                r = await client.get(f"{BASE_URL}/api/v1/facilities/{sample_facility_id}")
                record(f"/api/v1/facilities/{sample_facility_id}", "GET", r.status_code, f"Facility ID {sample_facility_id}")
            except Exception as e:
                record(f"/api/v1/facilities/{sample_facility_id}", "GET", 500, f"Error: {e}")

            try:
                r = await client.get(f"{BASE_URL}/api/v1/facilities/{sample_facility_id}/hotspots")
                record(f"/api/v1/facilities/{sample_facility_id}/hotspots", "GET", r.status_code, f"Facility hotspots count: {len(r.json()) if r.status_code==200 else 0}")
            except Exception as e:
                record(f"/api/v1/facilities/{sample_facility_id}/hotspots", "GET", 500, f"Error: {e}")

        # 12. Analytics Summary
        try:
            r = await client.get(f"{BASE_URL}/api/v1/analytics/summary")
            record("/api/v1/analytics/summary", "GET", r.status_code, "Analytics Summary", r.json() if r.status_code==200 else None)
        except Exception as e:
            record("/api/v1/analytics/summary", "GET", 500, f"Error: {e}")

        # 13. Analytics Classification
        try:
            r = await client.get(f"{BASE_URL}/api/v1/analytics/classification")
            record("/api/v1/analytics/classification", "GET", r.status_code, f"Class counts: {r.json() if r.status_code==200 else None}")
        except Exception as e:
            record("/api/v1/analytics/classification", "GET", 500, f"Error: {e}")

        # 14. Analytics Timeline
        try:
            r = await client.get(f"{BASE_URL}/api/v1/analytics/timeline")
            record("/api/v1/analytics/timeline", "GET", r.status_code, f"Timeline points: {len(r.json()) if r.status_code==200 else 0}")
        except Exception as e:
            record("/api/v1/analytics/timeline", "GET", 500, f"Error: {e}")

        # 15. Analytics Top States
        try:
            r = await client.get(f"{BASE_URL}/api/v1/analytics/top-states")
            record("/api/v1/analytics/top-states", "GET", r.status_code, f"States: {r.json()[:3] if r.status_code==200 and r.json() else None}")
        except Exception as e:
            record("/api/v1/analytics/top-states", "GET", 500, f"Error: {e}")

        # 16. Analytics Persistence
        try:
            r = await client.get(f"{BASE_URL}/api/v1/analytics/persistence")
            record("/api/v1/analytics/persistence", "GET", r.status_code, f"Persistent thermal points: {len(r.json()) if r.status_code==200 else 0}")
        except Exception as e:
            record("/api/v1/analytics/persistence", "GET", 500, f"Error: {e}")

        # 17. Alerts List
        sample_alert_id = None
        try:
            r = await client.get(f"{BASE_URL}/api/v1/alerts")
            record("/api/v1/alerts", "GET", r.status_code, f"Alerts count: {len(r.json()) if r.status_code==200 else 0}")
            if r.status_code == 200 and r.json():
                sample_alert_id = r.json()[0]["id"]
        except Exception as e:
            record("/api/v1/alerts", "GET", 500, f"Error: {e}")

        if sample_alert_id:
            try:
                r = await client.put(f"{BASE_URL}/api/v1/alerts/{sample_alert_id}/acknowledge", headers=headers)
                record(f"/api/v1/alerts/{sample_alert_id}/acknowledge", "PUT", r.status_code, f"Alert ID {sample_alert_id} acknowledged")
            except Exception as e:
                record(f"/api/v1/alerts/{sample_alert_id}/acknowledge", "PUT", 500, f"Error: {e}")

        # 18. Settings
        try:
            r = await client.get(f"{BASE_URL}/api/v1/settings")
            record("/api/v1/settings", "GET", r.status_code, "System Settings", r.json() if r.status_code==200 else None)
        except Exception as e:
            record("/api/v1/settings", "GET", 500, f"Error: {e}")

        # 19. Reports Summary
        try:
            r = await client.get(f"{BASE_URL}/api/v1/reports/summary")
            record("/api/v1/reports/summary", "GET", r.status_code, "Report Summary Stats")
        except Exception as e:
            record("/api/v1/reports/summary", "GET", 500, f"Error: {e}")

    with open("scratch/test_report.json", "w") as f:
        json.dump(results, f, indent=2)
    print("[SUCCESS] Test execution complete. Results saved to scratch/test_report.json")

if __name__ == "__main__":
    asyncio.run(run_tests())
