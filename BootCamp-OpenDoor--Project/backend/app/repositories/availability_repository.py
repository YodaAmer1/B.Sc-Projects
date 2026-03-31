from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.availability_slot import AvailabilitySlot
from app.repositories.base_repository import BaseRepository
from app.models.property import Property
from app.models.host_profile import HostProfile


class AvailabilityRepository(BaseRepository[AvailabilitySlot]):
    def __init__(self) -> None:
        super().__init__(AvailabilitySlot)

    async def get_property_for_host_user(
        self,
        session: AsyncSession,
        property_id: int,
        user_id: int,
    ) -> Property | None:
        result = await session.execute(
            select(Property)
            .join(HostProfile, Property.host_profile_id == HostProfile.id)
            .where(
                Property.id == property_id,
                HostProfile.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    async def get_slot_by_id_for_host_user(
        self,
        session: AsyncSession,
        slot_id: int,
        user_id: int,
    ) -> AvailabilitySlot | None:
        stmt = (
            select(AvailabilitySlot)
            .join(AvailabilitySlot.property)
            .join(Property.host_profile)
            .where(AvailabilitySlot.id == slot_id)
            .where(Property.host_profile.has(user_id=user_id))
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_property_id(
        self,
        session: AsyncSession,
        property_id: int,
    ) -> list[AvailabilitySlot]:
        stmt = select(AvailabilitySlot).where(
            AvailabilitySlot.property_id == property_id
        )
        result = await session.execute(stmt)
        return list(result.scalars().all())
