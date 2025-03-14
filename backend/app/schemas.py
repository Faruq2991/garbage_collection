from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from datetime import datetime
from sqlalchemy import Column, Integer, DateTime, func


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["user", "collector"]  # Restrict role values
    country: str
    state: str
    phone: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenData(BaseModel):
    access_token: str
    token_type: str


class GarbageRequestCreate(BaseModel):
    location: str
    description: str
    waste_type: str  # ✅ New field

class GarbageRequestResponse(BaseModel):
    id: int
    request_number: str
    user_id: int
    collector_id: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime
    location: str
    description: Optional[str] = None
    waste_type: str
    is_active: bool

    class Config:
        from_attributes = True  # Ensure ORM compatibility

class AssignCollectorRequest(BaseModel):
    request_id: int
    collector_id: int

class UpdateLocationSchema(BaseModel):
    latitude: float
    longitude: float
