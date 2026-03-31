from app.db.session import get_db
from app.api.dependencies import BookingServiceDep, EvacueeDep, HostDep
from app.schemas.request_schema import (
    BookingRequestCreate,
    BookingRequestResponse,
    BookingRequestStatusUpdate,
)
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import APIRouter, Depends

from app.core.handel_exceptions_decorator import handle_exceptions

router = APIRouter(prefix="/api/v1", tags=["Requests"])


@handle_exceptions()
@router.post("/requests", response_model=BookingRequestResponse)
async def create_request(
    new_booking_request: BookingRequestCreate,
    current_evacuee: EvacueeDep,
    booking_service: BookingServiceDep,
    session: AsyncSession = Depends(get_db),
):
    created_booking = await booking_service.create_booking_request(
        session, new_booking_request, current_evacuee
    )
    return created_booking


@handle_exceptions()
@router.get("/host/booking_request", response_model=list[BookingRequestResponse])
async def list_my_requests(
    current_host: HostDep,
    booking_service: BookingServiceDep,
    session: AsyncSession = Depends(get_db),
):
    host_profile_id = int(current_host.get("id"))
    pending_requests = await booking_service.get_host_requests(
        session, host_profile_id
    )
    return pending_requests


@handle_exceptions()
@router.patch("/requests/{request_id}/status", response_model=BookingRequestResponse)
async def update_request_status(
    request_id: int,
    request_data: BookingRequestStatusUpdate,
    current_host: HostDep,
    booking_service: BookingServiceDep,
    session: AsyncSession = Depends(get_db),
):
    user_id = int(current_host.get("id"))

    return await booking_service.update_request_status(
        session=session,
        user_id=user_id,
        request_id=request_id,
        new_status=request_data.request_status,
        host_response=request_data.host_response,
    )

@handle_exceptions()
@router.get("/family/requests/{request_id}", response_model=BookingRequestResponse)
async def get_request(
    request_id: int,
    current_evacuee: EvacueeDep,
    booking_service: BookingServiceDep,
    session: AsyncSession = Depends(get_db),
):
    user_id = int(current_evacuee.get("id"))

    return await booking_service.get_family_request_by_id(
        session=session,
        user_id=user_id,
        request_id=request_id,
    )


@handle_exceptions()
@router.patch("/requests/{request_id}/cancel", response_model=BookingRequestResponse)
async def cancel_request(
    request_id: int,
    current_evacuee: EvacueeDep,
    booking_service: BookingServiceDep,
    session: AsyncSession = Depends(get_db),
):

    user_id = int(current_evacuee.get("id"))

    return await booking_service.cancel_family_request(
        session=session,
        user_id=user_id,
        request_id=request_id,
    )

@handle_exceptions()
@router.get("/family/booking_request", response_model=list[BookingRequestResponse])
async def list_my_family_requests(
    current_family: EvacueeDep,
    booking_service: BookingServiceDep,
    session: AsyncSession = Depends(get_db),
):
    user_id = int(current_family.get("id"))
    requests = await booking_service.get_family_requests(
        session=session,
        user_id=user_id,
    )
    return requests
