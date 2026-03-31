from sqlalchemy import select
from typing import Type

from sqlalchemy.orm import selectinload
from app.models.availability_slot import AvailabilitySlot
from app.models.booking_request import BookingRequest, RequestStatus
from app.models.host_profile import HostProfile
from app.models.property import Property
from app.repositories.base_repository import BaseRepository


class BookingRepository(BaseRepository[BookingRequest]):
    def __init__(self, model_type: Type[BookingRequest] = BookingRequest) -> None:
        super().__init__(model_type)

    async def get_booking_requests_for_host(self, session, user_id: int):
        statement = (
            select(BookingRequest)
            .join(BookingRequest.availability_slot)
            .join(AvailabilitySlot.property)
            .join(Property.host_profile)
            .where(
                HostProfile.user_id == user_id,
                
            )
            .options(
                selectinload(BookingRequest.availability_slot).selectinload(
                    AvailabilitySlot.property
                ),
                selectinload(BookingRequest.family),
            )
        )

        result = await session.execute(statement)
        return result.scalars().all()

    async def get_family_by_user_id(self, session, user_id: int):
        from app.models.evacuee_family import EvacueeFamily

        statement = select(EvacueeFamily).where(EvacueeFamily.user_id == user_id)
        result = await session.execute(statement)
        return result.scalars().first()

    async def get_slot_by_id(self, session, slot_id: int):
        statement = select(AvailabilitySlot).where(AvailabilitySlot.id == slot_id)
        result = await session.execute(statement)
        return result.scalars().first()

    async def create_booking_request(self, session, booking_in, family_id):
        new_booking = BookingRequest(
            availability_slot_id=booking_in.availability_slot_id,
            family_id=family_id,
            requested_start_date=booking_in.requested_start_date,
            requested_end_date=booking_in.requested_end_date,
            requested_capacity=booking_in.requested_capacity,
            family_message=booking_in.family_message,
            request_status=RequestStatus.PENDING,
        )
        session.add(new_booking)
        await session.flush()
        return new_booking


    async def create_multiple_slots(self, session, slots: list[AvailabilitySlot]):
        session.add_all(slots)
        await session.flush()


    async def get_booking_requests_for_family(self, session, family_id: int):
        statement = (
            select(BookingRequest)
            .where(BookingRequest.family_id == family_id)
            .options(
                selectinload(BookingRequest.availability_slot).selectinload(
                    AvailabilitySlot.property
                ),
                selectinload(BookingRequest.family),
            )
        )
        result = await session.execute(statement)
        return result.scalars().all()

    async def get_booking_request_by_id(
        self,
        session,
        request_id: int,
    ):
        statement = (
            select(BookingRequest)
            .where(BookingRequest.id == request_id)
            .options(
                selectinload(BookingRequest.availability_slot)
                .selectinload(AvailabilitySlot.property)
                .selectinload(Property.host_profile),
                selectinload(BookingRequest.family),
            )
        )

        result = await session.execute(statement)
        return result.scalars().first()

    async def cancel_booking_request(
        self,
        session,
        booking_request: BookingRequest,
    ):
        booking_request.request_status = RequestStatus.CANCELLED
        await session.flush()
        return booking_request
