from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import GarbageRequest
from app.schemas import AssignCollectorRequest
from app.routers.users import get_current_user

router = APIRouter()

@router.post("/assign/")
def assign_collector(
    data: AssignCollectorRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    if user.role != "collector":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only collectors can be assigned requests")

    request = db.query(GarbageRequest).filter(GarbageRequest.id == data.request_id).first()
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Garbage request not found")

    request.collector_id = data.collector_id
    request.status = "assigned"
    db.commit()

    return {"message": f"Collector {data.collector_id} assigned to request {data.request_id}"}
