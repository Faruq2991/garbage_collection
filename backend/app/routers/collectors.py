from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import GarbageRequest, User
from app.schemas import AssignCollectorRequest, UpdateLocationSchema
from app.routers.users import get_current_user
from math import radians, cos, sin, sqrt, atan2

router = APIRouter()

# 🛠 Fix 2: Ensure collector is not already assigned
@router.post("/assign/")
def assign_collector(
    data: AssignCollectorRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not hasattr(user, "role") or user.role != "collector":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only collectors can be assigned requests")

    request = db.query(GarbageRequest).filter(GarbageRequest.id == data.request_id).first()
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Garbage request not found")

    # Check if collector is already assigned
    existing_assignment = db.query(GarbageRequest).filter(
        GarbageRequest.collector_id == data.collector_id, 
        GarbageRequest.status == "assigned"
    ).first()

    if existing_assignment:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Collector is already assigned to another request")

    request.collector_id = data.collector_id
    request.status = "assigned"
    db.commit()

    return {"message": f"Collector {data.collector_id} assigned to request {data.request_id}"}


def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    return R * c

# 🛠 Fix 3: Sort collectors by distance
@router.get("/nearby/")
def get_nearby_collectors(
    user_lat: float = Query(...),
    user_lon: float = Query(...),
    db: Session = Depends(get_db)
):
    collectors = db.query(User).filter(
        User.role == "collector",
        User.latitude.isnot(None),
        User.longitude.isnot(None)
    ).all()

    nearby_collectors = [
        {"id": c.id, "name": c.name, "distance": round(haversine(user_lat, user_lon, c.latitude, c.longitude), 2)}
        for c in collectors
        if haversine(user_lat, user_lon, c.latitude, c.longitude) <= 10
    ]

    # Sort collectors by nearest distance
    nearby_collectors.sort(key=lambda c: c["distance"])

    return {"nearby_collectors": nearby_collectors}

# 🛠 Fix 1: Explicitly update the user instance from DB


@router.put("/update-location/")
def update_collector_location(
    data: UpdateLocationSchema,  # ✅ Expect JSON body, not query params
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if not hasattr(user, "role") or user.role != "collector":
        raise HTTPException(status_code=403, detail="Only collectors can update their location.")

    db_user = db.query(User).filter(User.id == user.id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found.")

    db_user.latitude = data.latitude  # ✅ Use request body data
    db_user.longitude = data.longitude

    db.commit()
    db.refresh(db_user)

    return {"message": "Location updated successfully!", "latitude": db_user.latitude, "longitude": db_user.longitude}
