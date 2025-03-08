'''from slowapi import Limiter
from slowapi.util import get_remote_address
from fastapi import Depends, APIRouter
from app.logging import log_security_event


router = APIRouter()

class UserLogin(BaseModel):
    email: str
    password: str


limiter = Limiter(key_func=get_remote_address)

@router.post("/login/")
@limiter.limit("5/minute")  # Limit to 5 login attempts per minute
async def login(email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    
    if not user or not verify_password(password, user.password):
        log_security_event(f"Failed login attempt for {email}")
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "Login successful"}
'''