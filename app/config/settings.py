from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""
    app_name: str = "FastAPI Application"
    app_version: str = "1.0.0"
    debug: bool = False
    
    class Config:
        env_file = ".env"


settings = Settings()
