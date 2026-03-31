from fastapi import FastAPI
from app.api.routes import (
    admin_routes,
    auth_routes,
    availability_slot_routes,
    host_routes,
    property_routes,
    request_routes,
)

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="OpenDoor API",
    description="API for the OpenDoor platform",
    version="0.1.0",
)

app.include_router(auth_routes.router)
app.include_router(host_routes.router)
app.include_router(property_routes.router)
app.include_router(request_routes.router)
app.include_router(admin_routes.router)
app.include_router(availability_slot_routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "OK"}

