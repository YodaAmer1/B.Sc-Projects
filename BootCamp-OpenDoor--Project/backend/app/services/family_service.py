from http.client import HTTPException
from typing import Optional
from app.models.evacuee_family import EvacueeFamily
from app.models.user import User, UserRole
from app.repositories.evacuee_family_repository import EvacueeFamilyRepository
from app.db.session import SessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.core.exceptions import FamilyNotFoundError

class FamilyService:
    def __init__(self, session_maker : Optional[AsyncSession] = None, family_repository : Optional[EvacueeFamilyRepository] = None) -> None:
        self._session_maker = session_maker or SessionLocal
        self.family_repository = family_repository or EvacueeFamilyRepository()


    async def create_family_profile(self, family_size: int, origin_city: str, special_needs: Optional[str], needs_accessibility: bool, documents_url: Optional[str], email: str, password: str, full_name: str, phone_number: str) -> EvacueeFamily:
        async with self._session_maker() as session:
            async with session.begin():
                email_exists = await self.family_repository.email_exists(session, email)
                full_name_exists = await self.family_repository.full_name_exists(session, full_name)
                if email_exists or full_name_exists:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Email and full name already exists.",
                    )
                else:
                    return await self.family_repository.create(session, family_size=family_size, 
                                                                            origin_city=origin_city, 
                                                                            special_needs=special_needs, 
                                                                            needs_accessibility=needs_accessibility, 
                                                                            documents_url=documents_url, 
                                                                            email=email, 
                                                                            password=password, 
                                                                            full_name=full_name, 
                                                                            phone_number=phone_number)
    async def update_family_location(
    self,
    session: AsyncSession,
    user_id: int,
    latitude: float | None,
    longitude: float | None,
):
     async with session.begin():
        family = await self.family_repository.get_family_by_user_id(
            session=session,
            user_id=user_id,
        )

        if not family:
            raise FamilyNotFoundError("Family profile not found")

        
        if latitude is not None:
            if not (-90 <= latitude <= 90):
                raise ValueError("Latitude must be between -90 and 90")
            family.latitude = latitude

        if longitude is not None:
            if not (-180 <= longitude <= 180):
                raise ValueError("Longitude must be between -180 and 180")
            family.longitude = longitude

        await self.family_repository.update(session=session, item=family)

     return {"message": "Family location updated successfully"}            