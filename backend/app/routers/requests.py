from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import GarbageRequest, User
from app.schemas import GarbageRequestCreate, GarbageRequestResponse
from app.routers.users import get_current_user
from app.email import send_email
from typing import List  

router = APIRouter()

# User creates a garbage pickup request
@router.post("/", response_model=GarbageRequestResponse)
def request_pickup(
    request: GarbageRequestCreate, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    if user.role != "user":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only users can request pickups")
    
    # Create the request object
    new_request = GarbageRequest(
        user_id=user.id,
        location=request.location,
        description=request.description,
        status="pending"
    )

    # ✅ Add to the database
    db.add(new_request)
    db.commit()  # ✅ Save the record to the database
    db.refresh(new_request)  # ✅ Fetch auto-generated fields (like created_at, id)

    # Send email notification
    subject = "Garbage Pickup Request Created"
    body = f"Hello {user.name}, your garbage pickup request has been created and is pending collection."
    background_tasks.add_task(send_email, subject, user.email, body)

    return new_request  # ✅ Now it will return the saved record

@router.get("/", response_model=List[GarbageRequestResponse])
def get_requests(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.role != "collector":
        raise HTTPException(status_code=403, detail="Only collectors can view requests")
    return db.query(GarbageRequest).all()

@router.get("/{request_id}/", response_model=GarbageRequestResponse)
def get_request(request_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    request = db.query(GarbageRequest).filter(GarbageRequest.id == request_id).first()
    
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    return request


# Collector accepts a request
@router.put("/{request_id}/accept/")
def accept_request(
    request_id: int,
    background_tasks: BackgroundTasks,  # ✅ Move this before db and user
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    if user.role != "collector":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only collectors can accept requests")

    request = db.query(GarbageRequest).filter(GarbageRequest.id == request_id, GarbageRequest.status == "pending").first()
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found or already assigned")

    request.collector_id = user.id
    request.status = "accepted"
    db.commit()

    # Notify user
    user = db.query(User).filter(User.id == request.user_id).first()
    subject = "Your Garbage Pickup Request Has Been Accepted"
    body = f"Hello {user.name}, your garbage pickup request has been accepted by a collector."
    background_tasks.add_task(send_email, subject, user.email, body)

    return {"message": "Request accepted"}

# Collector marks a request as completed
@router.put("/{request_id}/complete/")
def complete_request(
    request_id: int,
    background_tasks: BackgroundTasks,  # ✅ Move this before db and user
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    request = db.query(GarbageRequest).filter(GarbageRequest.id == request_id, GarbageRequest.collector_id == user.id).first()
    if not request:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found or unauthorized")

    request.status = "completed"
    db.commit()

    # Notify user
    user = db.query(User).filter(User.id == request.user_id).first()
    subject = "Your Garbage Pickup Request Has Been Completed"
    body = f"Hello {user.name}, your garbage pickup request has been successfully completed."
    background_tasks.add_task(send_email, subject, user.email, body)

    return {"message": "Request completed"}
