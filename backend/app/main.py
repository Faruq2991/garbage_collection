from fastapi import FastAPI, BackgroundTasks, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from starlette.responses import JSONResponse
from app.routers import users, requests
from app.routers import collectors
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(requests.router, prefix="/requests", tags=["Garbage Requests"])
app.include_router(collectors.router, prefix="/collectors", tags=["collectors"])

# Rate limiter: Limits based on client IP
limiter = Limiter(key_func=get_remote_address)

# Register exception handler
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    response = await call_next(request)
    # Example: Add a header with the process time
    response.headers["X-Process-Time"] = str(0.1)  # Replace with actual process time calculation
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Change this to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
@limiter.limit("5/minute")
def home(request: Request):
    return {"message": "Welcome to the Garbage Collection System"}


# Run the app with: uvicorn app.main:app --reload