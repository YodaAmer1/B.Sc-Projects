from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.host_profile import HostProfile
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository


class HostRepository(UserRepository):
    def __init__(self) -> None:
        super().__init__(model_type=HostProfile)

    async def get_profile_id_by_user_id(
        self,
        session: AsyncSession,
        user_id: int,
    ) -> int | None:
        stmt = select(HostProfile.id).where(HostProfile.user_id == user_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self,session,documents_url: str | None, email: str, password: str, full_name: str, phone_number: str) -> HostProfile:
        new_user = User(email=email, password=password, full_name=full_name, phone_number=phone_number, user_role=UserRole.HOST)
        await super().create(session, new_user)
        await session.flush()
        new_host_profile = HostProfile(user_id=new_user.id, is_active=True, verification_status="PENDING", documents_url=documents_url, user = new_user)
        await super().create(session, new_host_profile)
        await session.flush()
        return new_host_profile.id
                
    