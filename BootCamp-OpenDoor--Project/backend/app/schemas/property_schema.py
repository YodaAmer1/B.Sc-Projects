from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from app.models.property import PropertyStatus


class PropertyBaseDTO(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    street_address: str = Field(min_length=1, max_length=255)
    city: str = Field(min_length=1, max_length=100)
    capacity: int = Field(gt=0)
    specific_tags: Optional[str] = Field(default=None, max_length=500)
    status: Optional[PropertyStatus] = PropertyStatus.ACTIVE
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class PropertyCreateDTO(PropertyBaseDTO):
    """DTO for creating a new property."""


class PropertyUpdateDTO(BaseModel):
    """DTO for updating an existing property."""

    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    street_address: Optional[str] = Field(default=None, min_length=1, max_length=255)
    city: Optional[str] = Field(default=None, min_length=1, max_length=100)
    capacity: Optional[int] = Field(default=None, gt=0)
    specific_tags: Optional[str] = Field(default=None, max_length=500)
    status: Optional[PropertyStatus] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class PropertyResponseDTO(PropertyBaseDTO):
    id: int
    host_profile_id: int
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True


class PropertyShortResponseBooking(BaseModel):
    id: int
    title: str

    model_config = ConfigDict(from_attributes=True)
