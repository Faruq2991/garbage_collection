from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserLogin, TokenData, UpdateLocationSchema
from app.auth import create_access_token, verify_token
from datetime import timedelta


router = APIRouter()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# ✅ User Registration (Signup)
@router.post("/register/")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    db_user = User(name=user.name, email=user.email, password=hashed_password, role=user.role, country=user.country, state=user.state, phone=user.phone)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"message": "User created successfully"}

# ✅ User Login & JWT Token Generation
@router.post("/login/")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not pwd_context.verify(login_data.password, user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    token = create_access_token(data={"sub": user.email, "role": user.role}, expires_delta=timedelta(minutes=30))
    return {"access_token": token, "token_type": "bearer"}


# ✅ Retrieve Current User from Token
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    email = payload.get("sub")
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user

# ✅ Protected Route Example
@router.get("/me/")
def get_me(user: User = Depends(get_current_user)):
    return {"name": user.name, "email": user.email, "role": user.role}



@router.put("/users/update-location/")
def update_location(
    location: UpdateLocationSchema, 
    db: Session = Depends(get_db), 
    user: User = Depends(get_current_user)
):
    if user.role != "collector":
        return {"error": "Only collectors can update location"}

    user.latitude = location.latitude
    user.longitude = location.longitude
    db.commit()
    db.refresh(user)
    
    return {"message": "Location updated successfully"}
