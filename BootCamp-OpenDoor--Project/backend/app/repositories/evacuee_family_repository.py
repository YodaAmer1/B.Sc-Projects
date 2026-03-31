from sqlalchemy import select
from typing import Optional

from app.models.evacuee_family import EvacueeFamily
from app.models.user import User, UserRole

from app.repositories.user_repository import UserRepository


class EvacueeFamilyRepository(UserRepository):
    def __init__(self) -> None:
        super().__init__(model_type=EvacueeFamily)

    async def create(
        self,
        session,
        family_size: int,
        origin_city: str,
        special_needs: Optional[str],
        needs_accessibility: bool,
        documents_url: Optional[str],
        email: str,
        password: str,
        full_name: str,
        phone_number: str,
    ):
        new_user = User(
            email=email,
            password=password,
            full_name=full_name,
            phone_number=phone_number,
            user_role=UserRole.EVACUEE,
        )
        await super().create(session, new_user)
        await session.flush()
        new_family_profile = EvacueeFamily(
            family_size=family_size,
            verification_status="PENDING",
            origin_city=origin_city,
            special_needs=special_needs,
            needs_accessibility=needs_accessibility,
            documents_url=documents_url,
            user=new_user,
        )
        await super().create(session, new_family_profile)
        await session.flush()
        return new_family_profile.id

    async def get_family_by_user_id(self, session, user_id: int):
        stmt = select(EvacueeFamily).where(EvacueeFamily.user_id == user_id)
        result = await session.execute(stmt)
        return result.scalar_one_or_none()
