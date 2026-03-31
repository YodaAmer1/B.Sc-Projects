from datetime import date, datetime, timezone

from fastapi import APIRouter
from pydantic import BaseModel

from app.api.dependencies import HostDep
from app.schemas.user_schema import HostCreateRequest
from app.services.host_service import HostService

router = APIRouter(prefix="/api/v1", tags=["hosts"])
SERVICE = HostService()


# class BookingRequestMockDTO(BaseModel):
#     id: int
#     availability_slot_id: int
#     family_id: int
#     requested_start_date: date
#     requested_end_date: date
#     requested_capacity: int
#     family_message: str | None
#     request_status: str


class AvailabilitySlotMockDTO(BaseModel):
    id: int
    property_id: int
    start_date: date
    end_date: date
    slot_status: str
    created_at: datetime


@router.post("/hosts")
async def create_host(current_host_data: HostCreateRequest):
    await SERVICE.create_host_profile(
        documents_url=current_host_data.documents_url,
        email=current_host_data.email,
        password=current_host_data.password,
        full_name=current_host_data.full_name,
        phone_number=current_host_data.phone_number,
    )
    return {"message": "created host profile successfully"}


# @router.get(
#     "/host/booking_request",
#     response_model=list[BookingRequestMockDTO],
# )
# async def list_host_booking_requests_mock(_current_host: HostDep):
#     """Mock: three sample booking requests for host dashboard (replace with DB later)."""
#     return [
#         BookingRequestMockDTO(
#             id=1,
#             availability_slot_id=10,
#             family_id=101,
#             requested_start_date=date(2026, 4, 1),
#             requested_end_date=date(2026, 4, 5),
#             requested_capacity=3,
#             family_message="Looking for quiet space near schools.",
#             request_status="Pending",
#         ),
#         BookingRequestMockDTO(
#             id=2,
#             availability_slot_id=11,
#             family_id=102,
#             requested_start_date=date(2026, 4, 10),
#             requested_end_date=date(2026, 4, 12),
#             requested_capacity=2,
#             family_message=None,
#             request_status="Approved",
#         ),
#         BookingRequestMockDTO(
#             id=3,
#             availability_slot_id=12,
#             family_id=103,
#             requested_start_date=date(2026, 5, 1),
#             requested_end_date=date(2026, 5, 7),
#             requested_capacity=4,
#             family_message="Need accessibility-friendly access.",
#             request_status="Rejected",
#         ),
#     ]


@router.get(
    "/host/{property_id}/available_slots",
    response_model=list[AvailabilitySlotMockDTO],
)
async def list_property_available_slots_mock(
    property_id: int,
    _current_host: HostDep,
):
    """Mock: three sample availability slots for a property (replace with DB later)."""
    base = datetime(2026, 3, 1, 12, 0, 0, tzinfo=timezone.utc)
    return [
        AvailabilitySlotMockDTO(
            id=101,
            property_id=property_id,
            start_date=date(2026, 4, 1),
            end_date=date(2026, 4, 7),
            slot_status="Available",
            created_at=base,
        ),
        AvailabilitySlotMockDTO(
            id=102,
            property_id=property_id,
            start_date=date(2026, 4, 10),
            end_date=date(2026, 4, 15),
            slot_status="Blocked",
            created_at=base,
        ),
        AvailabilitySlotMockDTO(
            id=103,
            property_id=property_id,
            start_date=date(2026, 5, 1),
            end_date=date(2026, 5, 10),
            slot_status="Booked",
            created_at=base,
        ),
    ]
