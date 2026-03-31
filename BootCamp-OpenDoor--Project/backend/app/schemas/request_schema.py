from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from app.models.booking_request import RequestStatus
from app.schemas.user_schema import FamilyShortBooking


class BookingRequestCreate(BaseModel):
    availability_slot_id: int
    requested_start_date: date
    requested_end_date: date
    requested_capacity: int
    family_message: str | None = None

    model_config = ConfigDict(from_attributes=True)


class BookingRequestResponse(BaseModel):
    id: int
    availability_slot_id: int
    family_id: int
    requested_start_date: date
    requested_end_date: date
    requested_capacity: int
    family_message: str | None
    request_status: RequestStatus
    created_at: datetime
    responded_at: datetime | None = None
    host_response: Optional[str] | None = None

    model_config = ConfigDict(from_attributes=True)


class BookingRequestStatusUpdate(BaseModel):
    request_status: RequestStatus
    host_response: Optional[str] | None = None

    model_config = ConfigDict(from_attributes=True)
