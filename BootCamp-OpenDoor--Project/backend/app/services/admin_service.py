from typing import Optional
from app.db.session import SessionLocal
from app.repositories.admin_repository import AdminRepository
from app.models.user import UserRole
from app.schemas.user_schema import PendingUserItem
from sqlalchemy.ext.asyncio import AsyncSession



class AdminService:

    def __init__(
        self,
        session_maker: Optional[AsyncSession] = None,
        admin_repository: Optional[AdminRepository] = None,
    ) -> None:
        self._session_maker = session_maker or SessionLocal
        self.admin_repository = admin_repository or AdminRepository()

    async def get_pending_users(
        self,
        session: AsyncSession,
    ) -> list[PendingUserItem]:
        users = await self.admin_repository.get_all_users_host_family(session)

        response: list[PendingUserItem] = []

        for user in users:
            if user.user_role == UserRole.HOST and user.host_profile:
                response.append(
                    PendingUserItem(
                        id=user.id,
                        email=user.email,
                        full_name=user.full_name,
                        phone_number=user.phone_number,
                        user_role=user.user_role,
                        verification_status=user.host_profile.verification_status,
                        documents_url=user.host_profile.documents_url,
                    )
                )

            elif user.user_role == UserRole.EVACUEE and user.evacuee_family:
                response.append(
                    PendingUserItem(
                        id=user.id,
                        email=user.email,
                        full_name=user.full_name,
                        phone_number=user.phone_number,
                        user_role=user.user_role,
                        verification_status=user.evacuee_family.verification_status,
                        documents_url=user.evacuee_family.documents_url,
                    )
                )

        return response

    async def all_users(self):
        async with SessionLocal() as session:
            async with session.begin():
                return await self.admin_repository.get_all_users_host_family(session)

    async def verify_user(self, user_id: int):
        async with SessionLocal() as session:
            async with session.begin():
                return await self.admin_repository.verify_user(session, user_id)

    async def reject_user(self, user_id: int):
        async with SessionLocal() as session:
            async with session.begin():
                return await self.admin_repository.reject_user(session, user_id)
