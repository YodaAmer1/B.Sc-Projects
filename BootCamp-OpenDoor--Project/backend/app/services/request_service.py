from datetime import datetime, timedelta
from fastapi import HTTPException, status
from typing import Optional
from app.schemas.request_schema import BookingRequestCreate
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import SessionLocal
from app.repositories.request_repository import BookingRepository
from app.core.exceptions import (
    BookingRequestNotFoundError,
    ForbiddenBookingRequestError,
    InvalidBookingRequestStateError,
    PropertyNotFoundError,
)
from app.models.booking_request import RequestStatus
from app.models.availability_slot import AvailabilitySlot, SlotStatus
from app.models import booking_request


class BookingService:
    def __init__(
        self,
        session_maker: Optional[AsyncSession] = None,
        booking_repository: Optional[BookingRepository] = None,
    ) -> None:
        self._session_maker = session_maker or SessionLocal
        self.booking_repository = booking_repository or BookingRepository()

    async def get_host_requests(self, session: AsyncSession, user_id: int):
        async with session.begin():
            return await self.booking_repository.get_booking_requests_for_host(
                session=session, user_id=user_id
            )


    async def create_booking_request(
        self, session: AsyncSession, booking_request: BookingRequestCreate, current_user
    ):
        async with session.begin():
            family = await self.booking_repository.get_family_by_user_id(
                session, current_user["id"]
            )
            if not family:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Evacuee family profile not found",
                )

            slot = await self.booking_repository.get_slot_by_id(
                session, booking_request.availability_slot_id
            )
            if not slot:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Slot not found"
                )

            if (booking_request.requested_start_date < slot.start_date or 
                booking_request.requested_end_date > slot.end_date):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Requested dates are outside the available slot dates",
                )

            new_booking = await self.booking_repository.create_booking_request(
                session=session, booking_in=booking_request, family_id=family.id
            )

            await session.refresh(new_booking)
            return new_booking

    async def get_family_requests(
        self,
        session: AsyncSession,
        user_id: int,
    ):
        async with session.begin():
            family = await self.booking_repository.get_family_by_user_id(
                session=session,
                user_id=user_id,
            )
            if not family:
                raise PropertyNotFoundError("Evacuee family profile not found")

            return await self.booking_repository.get_booking_requests_for_family(
                session=session,
                family_id=family.id,
            )

    async def get_family_request_by_id(
        self,
        session: AsyncSession,
        user_id: int,
        request_id: int,
    ):
        async with session.begin():
            family = await self.booking_repository.get_family_by_user_id(
                session=session,
                user_id=user_id,
            )
            if not family:
                raise BookingRequestNotFoundError("Evacuee family profile not found")

            booking_request = await self.booking_repository.get_booking_request_by_id(
                session=session,
                request_id=request_id,
            )
            if not booking_request:
                raise BookingRequestNotFoundError("Booking request not found")

            if booking_request.family_id != family.id:
                raise ForbiddenBookingRequestError(
                    "You are not allowed to access this booking request",
                )

            return booking_request

    async def cancel_family_request(
        self,
        session: AsyncSession,
        user_id: int,
        request_id: int,
    ):
        async with session.begin():
            family = await self.booking_repository.get_family_by_user_id(
                session=session,
                user_id=user_id,
            )
            if not family:
                raise BookingRequestNotFoundError(
                    "Evacuee family profile not found",
                )

            booking_request = await self.booking_repository.get_booking_request_by_id(
                session=session,
                request_id=request_id,
            )
            if not booking_request:
                raise BookingRequestNotFoundError("Booking request not found")

            if booking_request.family_id != family.id:
                raise ForbiddenBookingRequestError(
                    "You are not allowed to cancel this booking request",
                )

            if booking_request.request_status != RequestStatus.PENDING:
                raise InvalidBookingRequestStateError(
                    "Only pending booking requests can be cancelled",
                )

            return await self.booking_repository.cancel_booking_request(
                session=session,
                booking_request=booking_request,
            )

    async def update_request_status(
        self,
        session: AsyncSession,
        user_id: int,
        request_id: int,
        new_status: RequestStatus,
        host_response: str | None = None,
    ):
        if new_status not in {RequestStatus.APPROVED, RequestStatus.REJECTED}:
            raise InvalidBookingRequestStateError(
                "Host can only update request status to Approved or Rejected"
            )

        async with session.begin():
            booking_request = await self.booking_repository.get_booking_request_by_id(
                session=session,
                request_id=request_id,
            )

            if not booking_request:
                raise BookingRequestNotFoundError("Booking request not found")

            property_obj = booking_request.availability_slot.property

            if property_obj.host_profile.user_id != user_id:
                raise ForbiddenBookingRequestError(
                    "You are not allowed to update this booking request"
                )

            if booking_request.request_status != RequestStatus.PENDING:
                raise InvalidBookingRequestStateError(
                    "Only pending booking requests can be approved or rejected"
                )
            
            booking_request.request_status = new_status
            booking_request.host_response = host_response
            booking_request.responded_at = datetime.now()

            if new_status == RequestStatus.APPROVED:
                slot = booking_request.availability_slot
                r_start = booking_request.requested_start_date
                r_end = booking_request.requested_end_date
                slot_request_start = slot.start_date
                slot_request_end = slot.end_date

                new_slots_to_add = []

                if r_start > slot_request_start:
                    new_slots_to_add.append(
                        AvailabilitySlot(
                            property_id=slot.property_id,
                            start_date=slot_request_start,
                            end_date=r_start,
                            slot_status=SlotStatus.AVAILABLE
                        )
                    )

                if r_end < slot_request_end:
                    new_slots_to_add.append(
                        AvailabilitySlot(
                            property_id=slot.property_id,
                            start_date=r_end,
                            end_date=slot_request_end,
                            slot_status=SlotStatus.AVAILABLE
                        )
                    )

                slot.start_date = r_start
                slot.end_date = r_end
                slot.slot_status = SlotStatus.BOOKED

                if new_slots_to_add:
                    await self.booking_repository.create_multiple_slots(session, new_slots_to_add)

   
        await session.flush()
        await session.refresh(booking_request)

        return booking_request