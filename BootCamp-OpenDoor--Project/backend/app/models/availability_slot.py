from datetime import datetime, date
from enum import Enum
from app.db.session import Base
from sqlalchemy import Date, DateTime, Enum as SqlEnum, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship


class SlotStatus(str, Enum):
    AVAILABLE = "Available"
    BLOCKED = "Blocked"
    BOOKED = "Booked"


class AvailabilitySlot(Base):
    __tablename__ = "availability_slot"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    property_id: Mapped[int] = mapped_column(
        ForeignKey("property.id"),
        nullable=False,
        index=True,
    )

    start_date: Mapped[date] = mapped_column(Date, nullable=False)

    end_date: Mapped[date] = mapped_column(Date, nullable=False)

    slot_status: Mapped[SlotStatus] = mapped_column(
        SqlEnum(SlotStatus, name="slot_status_enum"),
        nullable=False,
        default=SlotStatus.AVAILABLE,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    property: Mapped["Property"] = relationship(
        "Property",
        back_populates="availability_slots",
    )
    booking_requests: Mapped[list["BookingRequest"]] = relationship(
    "BookingRequest",
     back_populates="availability_slot",
)