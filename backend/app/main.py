from fastapi import FastAPI, BackgroundTasks, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from starlette.responses import JSONResponse
from app.routers import users, requests
from app.email import send_email
from app.routers import collectors
from fastapi.middleware.cors import CORSMiddleware




app = FastAPI()

app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(requests.router, prefix="/requests", tags=["Garbage Requests"])
app.include_router(collectors.router, prefix="/collectors", tags=["collectors"])

# Rate limiter: Limits based on client IP
limiter = Limiter(key_func=get_remote_address)

# Register exception handler
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    response = await call_next(request)
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Welcome to the Garbage Collection System"}


@app.get("/send-test-email/")
async def send_test_email(background_tasks: BackgroundTasks):
    subject = "Test Email"
    recipient = "your-email@example.com"  # Replace with your actual email
    body = "<h3>This is a test email from FastAPI-Mail</h3>"

    # Send email in the background
    background_tasks.add_task(send_email, subject, recipient, body)
    return {"message": "Test email sent! Check your inbox."}


# Run the app with: uvicorn app.main:app --reload
