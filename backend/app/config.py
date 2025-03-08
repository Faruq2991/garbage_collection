from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str 
    MAIL_USERNAME: str = "faruqadam.92@gmail.com"
    MAIL_PASSWORD: str = "mandzukic"
    MAIL_FROM: str = "danauta387@gmail.com"
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    MAIL_TLS: bool = True  
    USE_CREDENTIALS: bool = True  

    class Config:
        env_file = ".env"

settings = Settings()
