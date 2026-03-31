from datetime import date

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.host_profile import HostProfile
from app.models.property import Property, PropertyStatus
from app.repositories.base_repository import BaseRepository
from app.models.availability_slot import AvailabilitySlot, SlotStatus


class PropertyRepository(BaseRepository[Property]):
    def __init__(self) -> None:
        super().__init__(Property)

    async def get_properties_for_host_user(
        self,
        session: AsyncSession,
        user_id: int,
    ) -> list[Property]:
        stmt = (
            select(Property)
            .join(HostProfile, Property.host_profile_id == HostProfile.id)
            .where(HostProfile.user_id == user_id)
        )
        result = await session.execute(stmt)
        return list(result.scalars().all())

    async def get_property_for_host_user(
        self,
        session: AsyncSession,
        property_id: int,
        user_id: int,
    ) -> Property | None:
        stmt = (
            select(Property)
            .join(HostProfile, Property.host_profile_id == HostProfile.id)
            .where(
                Property.id == property_id,
                HostProfile.user_id == user_id,
            )
        )
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_property_by_id(
        self,
        session: AsyncSession,
        property_id: int,
    ) -> Property | None:
        stmt = select(Property).where(Property.id == property_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_host_profile_id_for_user(
        self,
        session: AsyncSession,
        user_id: int,
    ) -> int | None:
        stmt = select(HostProfile.id).where(HostProfile.user_id == user_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_all_public(self, session: AsyncSession) -> list[Property]:
        stmt = select(Property)
        result = await session.execute(stmt)
        return result.scalars().all()

    async def get_filtered_public_properties(
        self,
        session: AsyncSession,
        from_date: date | None = None,
        to_date: date | None = None,
        city: str | None = None,
        tags: list[str] | None = None,
    ) -> list[Property]:
        stmt = select(Property).where(
            Property.status == PropertyStatus.ACTIVE,
        )

        if city:
            stmt = stmt.where(Property.city == city)

        if tags:
            for tag in tags:
                stmt = stmt.where(
                    Property.specific_tags.ilike(f"%{tag}%"),
                )

        if from_date and to_date:
            stmt = stmt.join(AvailabilitySlot).where(
                AvailabilitySlot.slot_status == SlotStatus.AVAILABLE,
                AvailabilitySlot.start_date <= from_date,
                AvailabilitySlot.end_date >= to_date,
            )

        result = await session.execute(stmt)
        return list(result.scalars().unique().all())
