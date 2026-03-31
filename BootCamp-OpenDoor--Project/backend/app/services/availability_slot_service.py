import logging
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    AvailabilitySlotError,
    ForbiddenAvailabilitySlotError,
    PropertyNotFoundError,
)
from app.models.availability_slot import AvailabilitySlot, SlotStatus
from app.repositories.availability_repository import AvailabilityRepository
from app.schemas.availability_slot_schema import (
    AvailabilitySlotCreateDTO,
    AvailabilitySlotResponseDTO,
    AvailabilitySlotUpdateDTO,
)

logger = logging.getLogger(__name__)


def _slot_to_dto(slot: AvailabilitySlot) -> AvailabilitySlotResponseDTO:
    return AvailabilitySlotResponseDTO.model_validate(slot)


class AvailabilityService:
    def __init__(
        self,
        repo: Optional[AvailabilityRepository] = None,
    ) -> None:
        self.repo = repo or AvailabilityRepository()

    async def create_availability_slot(
        self,
        session: AsyncSession,
        current_host_id: int,
        data: AvailabilitySlotCreateDTO,
    ) -> AvailabilitySlotResponseDTO:
        logger.info(f"Creating availability slot for property_id={data.property_id}")

        async with session.begin():
            property_obj = await self.repo.get_property_for_host_user(
                session=session,
                property_id=data.property_id,
                user_id=current_host_id,
            )

            if property_obj is None:
                raise PropertyNotFoundError("Property not found")

            slot = AvailabilitySlot(
                property_id=data.property_id,
                start_date=data.start_date,
                end_date=data.end_date,
                slot_status=data.slot_status or SlotStatus.AVAILABLE,
            )

            result = await self.repo.create(session, slot)

        return _slot_to_dto(result)

    async def update_availability_slot(
        self,
        session: AsyncSession,
        slot_id: int,
        current_host_id: int,
        data: AvailabilitySlotUpdateDTO,
    ) -> AvailabilitySlotResponseDTO:
        logger.info(f"Updating availability slot with id={slot_id}")

        async with session.begin():
            slot = await self.repo.get_slot_by_id_for_host_user(
                session=session,
                slot_id=slot_id,
                user_id=current_host_id,
            )

            if slot is None:
                raise AvailabilitySlotError("Availability slot not found")
            if data.start_date is not None:
                slot.start_date = data.start_date

            if data.end_date is not None:
                slot.end_date = data.end_date

            if data.slot_status is not None:
                slot.slot_status = data.slot_status

            updated = await self.repo.update(session, slot)

        return _slot_to_dto(updated)

    async def delete_availability_slot(
        self,
        session: AsyncSession,
        slot_id: int,
        current_host_id: int,
    ) -> None:
        logger.info(f"Deleting availability slot with id={slot_id}")

        async with session.begin():
            slot = await self.repo.get_slot_by_id_for_host_user(
                session=session,
                slot_id=slot_id,
                user_id=current_host_id,
            )

            if slot is None:
                raise AvailabilitySlotError("Availability slot not found")

            await self.repo.delete(session, slot.id)

    async def get_available_slots(
        self,
        session: AsyncSession,
        property_id: int,
    ) -> list[AvailabilitySlotResponseDTO]:
        async with session.begin():
            slots = await self.repo.get_by_property_id(
                session=session,
                property_id=property_id,
            )
        return [_slot_to_dto(slot) for slot in slots]
