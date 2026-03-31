from datetime import date
import logging
import math
from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import (
    FamilyNotFoundError,
    ForbiddenPropertyError,
    PropertyNotFoundError,
    PropertyValidationError,
)
from app.models.property import Property
from app.repositories.property_repository import PropertyRepository
from app.schemas.property_schema import (
    PropertyCreateDTO,
    PropertyResponseDTO,
    PropertyUpdateDTO,
)
from app.core.constants import Role
from app.repositories.evacuee_family_repository import EvacueeFamilyRepository

logger = logging.getLogger(__name__)


def _property_to_dto(property_obj: Property) -> PropertyResponseDTO:
    return PropertyResponseDTO.model_validate(property_obj)


def _distance_km(
    lat1: float,
    lon1: float,
    lat2: float,
    lon2: float,
) -> float:
    earth_radius_km = 6371.0

    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    delta_lat = lat2_rad - lat1_rad
    delta_lon = lon2_rad - lon1_rad

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
    )
    c = 2 * math.asin(math.sqrt(a))

    return earth_radius_km * c


class PropertyService:
    def __init__(
        self,
        repo: Optional[PropertyRepository] = None,
    ) -> None:
        self.repo = repo or PropertyRepository()
        self.family_repo = EvacueeFamilyRepository()

    async def create_property(
        self,
        session: AsyncSession,
        current_host_id: int,
        data: PropertyCreateDTO,
    ) -> PropertyResponseDTO:
        logger.info(f"Creating property for current_host_id={current_host_id}")

        if data.capacity <= 0:
            raise PropertyValidationError("Capacity must be greater than 0")

        async with session.begin():
            host_profile = await self.repo.get_host_profile_id_for_user(
                session=session,
                user_id=current_host_id,
            )

            if host_profile is None:
                raise ForbiddenPropertyError("Host profile not found")

            property_obj = Property(
                host_profile_id=host_profile,
                name=data.name,
                street_address=data.street_address,
                city=data.city,
                capacity=data.capacity,
                specific_tags=data.specific_tags,
                status=data.status,
                latitude=data.latitude,
                longitude=data.longitude,
            )

            result = await self.repo.create(session, property_obj)

        return _property_to_dto(result)

    async def get_my_properties(
        self,
        session: AsyncSession,
        current_host_id: int,
    ) -> list[PropertyResponseDTO]:
        logger.info(f"Fetching properties for current_host_id={current_host_id}")

        properties = await self.repo.get_properties_for_host_user(
            session=session,
            user_id=current_host_id,
        )

        return [_property_to_dto(p) for p in properties]

    async def get_property_by_id(
        self,
        session: AsyncSession,
        property_id: int,
    ) -> PropertyResponseDTO:
        logger.info(f"Fetching property by id={property_id}")

        property_obj = await self.repo.get_property_by_id(
            session=session,
            property_id=property_id,
        )

        if property_obj is None:
            raise PropertyNotFoundError("Property not found")

        return _property_to_dto(property_obj)

    async def update_property(
        self,
        session: AsyncSession,
        property_id: int,
        current_user: dict,
        data: PropertyUpdateDTO,
    ) -> PropertyResponseDTO:
        logger.info(
            f"Updating property_id={property_id} for current_user_id={current_user['id']}"
        )

        async with session.begin():
            property_obj = None

            if current_user["role"] == Role.ADMIN:
                property_obj = await self.repo.get(
                    session=session,
                    item_id=property_id,
                )

                if property_obj is None:
                    raise PropertyNotFoundError("Property not found")

            else:
                property_obj = await self.repo.get_property_for_host_user(
                    session=session,
                    property_id=property_id,
                    user_id=current_user["id"],
                )

                if property_obj is None:
                    raise ForbiddenPropertyError(
                        "Property not found or not owned by current host"
                    )

            if data.name is not None:
                property_obj.name = data.name

            if data.street_address is not None:
                property_obj.street_address = data.street_address

            if data.city is not None:
                property_obj.city = data.city

            if data.capacity is not None:
                if data.capacity <= 0:
                    raise PropertyValidationError("Capacity must be greater than 0")
                property_obj.capacity = data.capacity

            if data.specific_tags is not None:
                property_obj.specific_tags = data.specific_tags

            if data.status is not None:
                property_obj.status = data.status
            if data.latitude is not None:
                property_obj.latitude = data.latitude
            if data.longitude is not None:
                property_obj.longitude = data.longitude

            updated = await self.repo.update(session, property_obj)

            return _property_to_dto(updated)

    async def delete_property(
        self,
        session: AsyncSession,
        property_id: int,
        current_host_id: int,
    ) -> dict[str, str]:
        logger.info(
            f"Deleting property_id={property_id} for current_host_id={current_host_id}"
        )

        async with session.begin():
            property_obj = await self.repo.get_property_for_host_user(
                session=session,
                property_id=property_id,
                user_id=current_host_id,
            )

            if property_obj is None:
                raise ForbiddenPropertyError(
                    "Property not found or not owned by current host"
                )

            await self.repo.delete(session, property_obj.id)

        return {"message": "Property deleted successfully"}

    async def get_properties_public(
        self,
        session: AsyncSession,
        from_date: date | None = None,
        to_date: date | None = None,
        city: str | None = None,
        tags: list[str] | None = None,
        current_user_id: int | None = None,
        radius_km: float | None = None,
    ) -> list[PropertyResponseDTO]:
        logger.info("Fetching public properties with optional filters")

        if from_date and to_date and from_date > to_date:
            raise PropertyValidationError("fromDate cannot be after toDate")

        normalized_tags: list[str] | None = None
        if tags:
            normalized_tags = []
            for item in tags:
                normalized_tags.extend(
                    [part.strip() for part in item.split(",") if part.strip()],
                )
        async with session.begin():
            properties = await self.repo.get_filtered_public_properties(
                session=session,
                from_date=from_date,
                to_date=to_date,
                city=city,
                tags=normalized_tags,
            )
           
            if radius_km is None:
                return [_property_to_dto(property_obj) for property_obj in properties]

            if radius_km <= 0:
                raise PropertyValidationError("radius_km must be greater than 0")

            family = await self.family_repo.get_family_by_user_id(
                session=session,
                user_id=current_user_id,
            )

            if not family:
                raise FamilyNotFoundError("Family profile not found")

            if family.latitude is None or family.longitude is None:
                raise PropertyValidationError("Family location is not set")

            filtered_properties: list[Property] = []

            for property_obj in properties:
                if property_obj.latitude is None or property_obj.longitude is None:
                    continue

                distance = _distance_km(
                    family.latitude,
                    family.longitude,
                    property_obj.latitude,
                    property_obj.longitude,
                )

                if distance <= radius_km:
                    filtered_properties.append(property_obj)

            return [
                _property_to_dto(property_obj) for property_obj in filtered_properties
            ]

    async def get_all_properties(
        self, session: AsyncSession
    ) -> list[PropertyResponseDTO]:
        logger.info("Fetching all properties")

        properties = await self.repo.get_all_public(session=session)

        return [_property_to_dto(property) for property in properties]
