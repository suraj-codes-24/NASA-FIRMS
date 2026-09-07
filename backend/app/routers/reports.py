from fastapi import APIRouter
from fastapi.responses import PlainTextResponse

router = APIRouter()

@router.post("/generate")
async def generate_report():
    """
    Mock report generation endpoint for hackathon demo.
    Returns a CSV string.
    """
    csv_content = (
        "id,latitude,longitude,severity,status,created_at\n"
        "1,19.0760,72.8777,HIGH,NEW,2026-09-08T00:00:00Z\n"
        "2,28.7041,77.1025,MEDIUM,ACKNOWLEDGED,2026-09-08T00:10:00Z\n"
        "3,12.9716,77.5946,CRITICAL,RESOLVED,2026-09-08T00:20:00Z\n"
    )
    return PlainTextResponse(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="ignis_report.csv"'}
    )
