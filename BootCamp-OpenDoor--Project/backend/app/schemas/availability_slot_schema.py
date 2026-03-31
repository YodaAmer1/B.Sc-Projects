import datetime
from typing import Optional
from pydantic import BaseModel, Field , model_validator
from app.schemas.property_schema import PropertyShortResponseBooking


class AvailabilitySlotBaseDTO(BaseModel):
    property_id: int = Field(gt=0)
    start_date: datetime.date
    end_date: datetime.date
    slot_status: Optional[str] = None


class AvailabilitySlotCreateDTO(AvailabilitySlotBaseDTO):
    """DTO for creating a new availability slot."""
    @model_validator(mode="after")
    def validate_dates(self):
        if self.start_date >= self.end_date:
            raise ValueError("start_date must be before end_date")
        return self



class AvailabilitySlotUpdateDTO(BaseModel):
    """DTO for updating an existing availability slot."""
    
    start_date: Optional[datetime.date] = None
    end_date: Optional[datetime.date] = None
    slot_status: Optional[str] = None


class AvailabilitySlotResponseDTO(AvailabilitySlotBaseDTO):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class AvailabilitySlotShortResponseBooking(BaseModel):
    id: int
    property: PropertyShortResponseBooking