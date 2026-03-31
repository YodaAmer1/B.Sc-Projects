from typing import Generic, Type, TypeVar

from app.models.user import User, UserRole
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


T = TypeVar("T")


class BaseRepository(Generic[T]):
    def __init__(self, model_type: Type[T]) -> None:
        self._model_type = model_type

    async def create(
        self,
        session: AsyncSession,
        item: T,
    ) -> T:
        session.add(item)
        await session.flush()
        await session.refresh(item)
        return item

    async def get(
        self,
        session: AsyncSession,
        item_id: int,
    ) -> T | None:
        stmt = select(self._model_type).where(self._model_type.id == item_id)
        result = await session.execute(stmt)
        item = result.scalar_one_or_none()
        if item is None:
            raise ValueError("Item not found")
        return item

    async def get_all(
        self,
        session: AsyncSession,
    ) -> list[T]:
        stmt = select(self._model_type)
        result = await session.execute(stmt)
        return list(result.scalars().all())

    async def update(
        self,
        session: AsyncSession,
        item: T,
    ) -> T:
        existing_item = await self.get(session, item.id)
        for key, value in vars(item).items():
            if key.startswith("_"):
                continue
            setattr(existing_item, key, value)

        session.add(existing_item)
        await session.flush()
        await session.refresh(existing_item)
        return existing_item

    async def delete(
        self,
        session: AsyncSession,
        item_id: int,
    ) -> None:
        item = await self.get(session, item_id)
        await session.delete(item)
        await session.flush()
    


    
