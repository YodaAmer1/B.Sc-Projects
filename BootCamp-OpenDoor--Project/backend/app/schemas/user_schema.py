from typing import Literal, Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr = Field(..., max_length=255)
    username: str = Field(..., max_length=255)
    phone_number: str = Field(max_length=255, default=None)
    password: str = Field(..., max_length=255)


class HostCreateRequest(UserBase):
    role: Literal["Host"]
    documents_url: Optional[str] = Field(default=None)


class FamilyCreateRequest(UserBase):
    role: Literal["Evacuee"]
    family_size: int = Field(min=1, max=20, default=0)
    origin_city: str = Field(min_length=1, max_length=255, default="Not Specified")
    special_needs: Optional[str] = Field(max_length=255, default=None)
    needs_accessibility: bool = Field(default=False)
    documents_url: Optional[str] = Field(default=None)
    latitude: Optional[float] = Field(default=None)
    longitude: Optional[float] = Field(default=None)


class UserResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class PendingUserItem(BaseModel):
    """One row in the admin registration verification queue (GET /admin/users/pending)."""

    id: int
    email: str
    full_name: str
    phone_number: str
    user_role: UserRole
    verification_status: str = Field(default="Pending")
    documents_url: str | None = None


class HostProfileResponse(BaseModel):

    model_config = ConfigDict(from_attributes=True)


class FamilyProfileResponse(BaseModel):
    id: int
    user_id: int
    family_size: int
    origin_city: str
    special_needs: Optional[str] = None
    needs_accessibility: bool
    documents_url: Optional[str] = None
    verification_status: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)


class FamilyShortBooking(BaseModel):
    id: int
    family_size: int | None = None
    origin_city: str | None = None

    model_config = ConfigDict(from_attributes=True)


class FamilyLocationUpdate(BaseModel):
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    model_config = ConfigDict(from_attributes=True)
