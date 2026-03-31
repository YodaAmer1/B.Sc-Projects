from fastapi import APIRouter, Depends
from app.api.dependencies import AdminDep, AdminServiceDep
from app.schemas.user_schema import PendingUserItem
from app.services.admin_service import AdminService
from app.db.session import get_db
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/api/v1", tags=["Admin"])


@router.get("/admin/users/pending", response_model=list[PendingUserItem])
async def get_pending_users(
    current_admin: AdminDep,
    service: AdminServiceDep,
    session: AsyncSession = Depends(get_db),
) -> list[PendingUserItem]:
    return await service.get_pending_users(session)


@router.get("/admin/users/")
async def get_all_users(current_admin: AdminDep) -> list[PendingUserItem]:
    service = AdminService()
    users = await service.all_users()
    return users


@router.patch("/admin/users/{user_id}/verify")
async def verify_user(user_id: int, current_admin: AdminDep):
    service = AdminService()
    user = await service.verify_user(user_id)
    return user


@router.patch("/admin/users/{user_id}/reject")
async def reject_user(user_id: int, current_admin: AdminDep):
    service = AdminService()
    user = await service.reject_user(user_id)
    return user


@router.get("/admin/listings")
async def get_listings(current_admin: AdminDep):
    return {"message": "not implemented"}


@router.patch("/admin/listings/{listing_id}/suspend")
async def suspend_listing(listing_id: int, current_admin: AdminDep):
    return {"message": "not implemented"}
