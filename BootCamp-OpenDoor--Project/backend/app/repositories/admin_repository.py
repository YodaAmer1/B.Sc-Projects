from unittest import result

from sqlalchemy import select
from sqlalchemy.orm import joinedload

from app.models.admin_profile import AdminProfile
from app.models.user import User, UserRole
from app.repositories.base_repository import BaseRepository


class AdminRepository(BaseRepository[AdminProfile]):
    def __init__(self) -> None:
        super().__init__(AdminProfile)

    async def get_all_users_host_family(self,session):
        statement = (
            select(User)
            .where(User.user_role.in_([UserRole.HOST, UserRole.EVACUEE]))
            .options(
                joinedload(User.host_profile), # <--- LEFT OUTER JOIN
                joinedload(User.evacuee_family) # <--- LEFT OUTER JOIN
            )
        )
        result = await session.execute(statement)
        return result.unique().scalars().all()
    
    async def verify_user(self, session, user_id: int):
        statement = (
            select(User)
            .where(User.id == user_id)
            .options(
                joinedload(User.host_profile),
                joinedload(User.evacuee_family)
            )
        )
        result = await session.execute(statement)
        user = result.unique().scalars().first()

        if not user:
            raise ValueError(f"User with id {user_id} not found")
        
        if user.user_role == "Host" and user.host_profile:
            user.host_profile.verification_status = "Verified"
        elif user.user_role == "Evacuee" and user.evacuee_family:
            user.evacuee_family.verification_status = "Verified"
        else:
            raise ValueError(f"Profile for user {user_id} not found")
        
        await session.flush()
        await session.refresh(user)
        return user


    async def reject_user(self, session, user_id: int):
        statement = (
            select(User)
            .where(User.id == user_id)
            .options(
                joinedload(User.host_profile),
                joinedload(User.evacuee_family)
            )
        )
        result = await session.execute(statement)
        user = result.unique().scalars().first()

        if not user:
            raise ValueError(f"User with id {user_id} not found")
        
        if user.user_role == "Host" and user.host_profile:
            user.host_profile.verification_status = "Rejected"
        elif user.user_role == "Evacuee" and user.evacuee_family:
            user.evacuee_family.verification_status = "Rejected"
        else:
            raise ValueError(f"Profile for user {user_id} not found")
        
        await session.flush()
        await session.refresh(user)
        return user
