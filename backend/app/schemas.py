from pydantic import BaseModel, EmailStr
from typing import Optional, Literal
from datetime import datetime
from sqlalchemy import Column, Integer, DateTime, func


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Literal["user", "collector"]  # Restrict role values


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenData(BaseModel):
    access_token: str
    token_type: str


class GarbageRequestCreate(BaseModel):
    location: str
    description: str

class GarbageRequestResponse(BaseModel):
    id: int
    user_id: int
    collector_id: Optional[int] = None
    status: str
    created_at: datetime
    updated_at: datetime
    location: str
    description: Optional[str] = None

    class Config:
        from_attributes = True  # Ensure ORM compatibility

class AssignCollectorRequest(BaseModel):
    request_id: int
    collector_id: int


