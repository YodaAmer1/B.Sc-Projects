from fastapi import UploadFile
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.exceptions import InvalidUserPictureError, UserNotFoundError
from app.repositories.user_repository import UserRepository

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
print(pwd_context.hash("1234"))


class UserService:
    def __init__(self, user_repository: UserRepository | None = None) -> None:
        self.user_repository = user_repository or UserRepository()

    async def update_user_picture(
        self,
        session: AsyncSession,
        user_id: int,
        file: UploadFile,
    ) -> dict[str, str]:
        async with session.begin():
            user = await self.user_repository.get(session=session, item_id=user_id)
            if not user:
                raise UserNotFoundError("User not found")

            allowed_types = {"image/jpeg", "image/png", "image/webp"}
            if file.content_type not in allowed_types:
                raise InvalidUserPictureError(
                    "Only JPEG, PNG, or WEBP images are allowed"
                )

            picture_bytes = await file.read()
            if not picture_bytes:
                raise InvalidUserPictureError("Uploaded file is empty")

            user.picture = picture_bytes
            await self.user_repository.update(session=session, item=user)
        return {"message": "Profile picture updated successfully"}

    async def get_user_picture(
        self,
        session: AsyncSession,
        user_id: int,
    ) -> bytes:
        async with session.begin():
            user = await self.user_repository.get(session=session, item_id=user_id)

            if not user:
                raise UserNotFoundError("User not found")

            return user.picture
