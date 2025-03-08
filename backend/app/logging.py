from loguru import logger

logger.add("logs/security.log", format="{time} {level} {message}", level="INFO", rotation="1 week")

def log_security_event(event: str):
    logger.info(event)
