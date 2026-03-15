from fastapi import FastAPI
from app.controllers import health_controller, stock_controler
from app.config.settings import settings
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title=settings.app_name,
    description="A FastAPI application with proper structure and Swagger documentation",
    version=settings.app_version
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_controller.router)
app.include_router(stock_controler.router)


__all__ = ["app"]
