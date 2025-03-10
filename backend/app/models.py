from sqlalchemy import Column, Integer, String, ForeignKey, Boolean, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime
from typing import Optional
from sqlalchemy.orm import Mapped, mapped_column

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)  # "user" or "collector"
    
    # Relationships
    requests_made = relationship("GarbageRequest", foreign_keys="[GarbageRequest.user_id]", back_populates="user")
    requests_collected = relationship("GarbageRequest", foreign_keys="[GarbageRequest.collector_id]", back_populates="collector")

class GarbageRequest(Base):
    __tablename__ = "garbage_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    collector_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now())
    location: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    #waste_type = Mapped[str] = mapped_column(String, nullable=False)  # ✅ New field
    #is_active = Mapped[bool] = mapped_column(Boolean, default=True)
    
    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="requests_made")
    collector = relationship("User", foreign_keys=[collector_id], back_populates="requests_collected", uselist=False)

"""class Collector(Base):
    __tablename__ = "collectors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)"""
    