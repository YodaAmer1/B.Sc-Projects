from fastapi import HTTPException, status
from typing import Optional
from app.models.host_profile import HostProfile
from app.models.user import User, UserRole
from app.repositories.host_repository import HostRepository
from app.db.session import SessionLocal
from sqlalchemy.ext.asyncio import AsyncSession


class HostService:
    def __init__(self, session_maker : Optional[AsyncSession] = None, host_repository : Optional[HostRepository] = None) -> None:
        self._session_maker = session_maker or SessionLocal
        self.host_repository = host_repository or HostRepository()

    async def create_host_profile(self, documents_url: str | None, email: str, password: str, full_name: str, phone_number: str) -> HostProfile:
         async with self._session_maker() as session:
            async with session.begin():
                email_exists = await self.host_repository.email_exists(session, email)
                full_name_exists = await self.host_repository.full_name_exists(session, full_name)
                
                if email_exists is not None and full_name_exists is not None:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Email and full name already exists.",
                    )
                else:
                    return await self.host_repository.create(session, documents_url, email, password, full_name, phone_number)