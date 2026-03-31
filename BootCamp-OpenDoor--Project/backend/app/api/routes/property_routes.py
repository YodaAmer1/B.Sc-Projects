from datetime import date

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession


from app.api.dependencies import (
    CurrentUserDep,
    AdminDep,
    HostDep,
    PropertyServiceDep,
    HostOrFamilyDep,
    EvacueeDep,
)

from app.core.handel_exceptions_decorator import handle_exceptions
from app.db.session import get_db
from app.schemas.property_schema import (
    PropertyCreateDTO,
    PropertyResponseDTO,
    PropertyUpdateDTO,
)

router = APIRouter(prefix="/api/v1", tags=["Properties"])


@router.post("/properties", response_model=PropertyResponseDTO)
@handle_exceptions()
async def create_property(
    property_data: PropertyCreateDTO,
    current_host: HostDep,
    service: PropertyServiceDep,
    session: AsyncSession = Depends(get_db),
):
    return await service.create_property(
        session=session,
        current_host_id=current_host["id"],
        data=property_data,
    )


@router.get("/properties", response_model=list[PropertyResponseDTO])
@handle_exceptions()
async def list_my_properties(
    current_host: HostDep,
    service: PropertyServiceDep,
    session: AsyncSession = Depends(get_db),
):
    return await service.get_my_properties(
        session=session,
        current_host_id=current_host["id"],
    )


@router.get("/properties/{property_id}", response_model=PropertyResponseDTO)
@handle_exceptions()
async def get_property_by_id(
    property_id: int,
    current_user: HostOrFamilyDep,
    service: PropertyServiceDep,
    session: AsyncSession = Depends(get_db),
):
    return await service.get_property_by_id(
        session=session,
        property_id=property_id,
    )


@router.patch("/properties/{property_id}", response_model=PropertyResponseDTO)
@handle_exceptions()
async def update_property(
    property_id: int,
    property_data: PropertyUpdateDTO,
    current_user: CurrentUserDep,
    service: PropertyServiceDep,
    session: AsyncSession = Depends(get_db),
):
    return await service.update_property(
        session=session,
        property_id=property_id,
        current_user=current_user,
        data=property_data,
    )


@router.delete("/properties/{property_id}")
@handle_exceptions()
async def delete_property(
    property_id: int,
    current_host: HostDep,
    service: PropertyServiceDep,
    session: AsyncSession = Depends(get_db),
):
    return await service.delete_property(
        session=session,
        property_id=property_id,
        current_host_id=current_host["id"],
    )


@router.get("/public/properties", response_model=list[PropertyResponseDTO])
@handle_exceptions()
async def list_properties(
    service: PropertyServiceDep,
    fromDate: date | None = None,
    toDate: date | None = None,
    city: str | None = None,
    tags: list[str] | None = Query(default=None),
    session: AsyncSession = Depends(get_db),
):
    return await service.get_properties_public(
        session=session,
        from_date=fromDate,
        to_date=toDate,
        city=city,
        tags=tags,
       
    )


@router.get("/admin/properties", response_model=list[PropertyResponseDTO])
@handle_exceptions()
async def list_properties(
    current_admin: AdminDep,
    service: PropertyServiceDep,
    session: AsyncSession = Depends(get_db),
):

    return await service.get_all_properties(session=session)


@router.get("/family/properties/radius", response_model=list[PropertyResponseDTO])
@handle_exceptions()
async def list_properties_by_radius(
    current_family: EvacueeDep,
    service: PropertyServiceDep,
    radius_km: float| None = Query(default=None),
    fromDate: date | None = None,
    toDate: date | None = None,
    city: str | None = None,
    tags: list[str] | None = Query(default=None),
    session: AsyncSession = Depends(get_db),
):
    return await service.get_properties_public(
        session=session,
        current_user_id=current_family["id"],
        from_date=fromDate,
        to_date=toDate,
        city=city,
        tags=tags,
        radius_km=radius_km,
    )
