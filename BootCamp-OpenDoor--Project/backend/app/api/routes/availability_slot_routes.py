from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import AvailabilityServiceDep, HostDep, HostOrFamilyDep
from app.core.handel_exceptions_decorator import handle_exceptions
from app.db.session import get_db
from app.schemas.availability_slot_schema import (
    AvailabilitySlotCreateDTO,
    AvailabilitySlotResponseDTO,
    AvailabilitySlotUpdateDTO,
)

router = APIRouter(prefix="/api/v1", tags=["Availability Slots"])


@router.post("/availability_slots", response_model=AvailabilitySlotResponseDTO)
@handle_exceptions()
async def create_availability_slot(
    slot_data: AvailabilitySlotCreateDTO,
    current_host: HostDep,
    service: AvailabilityServiceDep,
    session: AsyncSession = Depends(get_db),
):
    return await service.create_availability_slot(
        session=session,
        current_host_id=current_host["id"],
        data=slot_data,
    )


@router.get(
    "/properties/{property_id}/available_slots",
    response_model=list[AvailabilitySlotResponseDTO],
)
@handle_exceptions()
async def get_available_slots(
    property_id: int,
    current_user: HostOrFamilyDep,
    service: AvailabilityServiceDep,
    session: AsyncSession = Depends(get_db),
):
    return await service.get_available_slots(
        session=session,
        property_id=property_id,
    )


@router.patch(
    "/availability_slots/{slot_id}",
    response_model=AvailabilitySlotResponseDTO,
)
@handle_exceptions()
async def update_availability_slot(
    slot_id: int,
    slot_data: AvailabilitySlotUpdateDTO,
    current_host: HostDep,
    service: AvailabilityServiceDep,
    session: AsyncSession = Depends(get_db),
):
    return await service.update_availability_slot(
        session=session,
        slot_id=slot_id,
        current_host_id=current_host["id"],
        data=slot_data,
    )


@router.delete("/availability_slots/{slot_id}")
@handle_exceptions()
async def delete_availability_slot(
    slot_id: int,
    current_host: HostDep,
    service: AvailabilityServiceDep,
    session: AsyncSession = Depends(get_db),
):
    await service.delete_availability_slot(
        session=session,
        slot_id=slot_id,
        current_host_id=current_host["id"],
    )

    return {"message": "Availability slot deleted successfully"}
