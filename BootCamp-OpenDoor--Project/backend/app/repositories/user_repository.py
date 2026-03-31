from typing import Type
from sqlalchemy import select
from app.models.user import User
from app.repositories.base_repository import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, model_type: Type[User] = User) -> None:
        super().__init__(model_type)

    async def get_by_email(self, session, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        result = await session.execute(statement)
        user = result.scalars().first()
        return user

    async def email_exists(self, session, email: str) -> bool:
        statement = select(User).where(User.email == email)
        result = await session.execute(statement)
        user = result.scalars().first()
        return False if user is None else True

    async def full_name_exists(self, session, full_name: str) -> bool:
        statement = select(User).where(User.full_name == full_name)
        result = await session.execute(statement)
        user = result.scalars().first()
        return user

