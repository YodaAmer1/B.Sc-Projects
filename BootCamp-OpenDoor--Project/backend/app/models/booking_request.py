from datetime import datetime, date
from enum import Enum

from sqlalchemy import (
    Date,
    DateTime,
    Enum as SqlEnum,
    ForeignKey,
    Integer,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship


from app.db.session import Base


class RequestStatus(str, Enum):
    PENDING = "Pending"
    APPROVED = "Approved"
    REJECTED = "Rejected"
    CANCELLED = "Cancelled"


class BookingRequest(Base):
    __tablename__ = "booking_request"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    availability_slot_id: Mapped[int] = mapped_column(
        ForeignKey("availability_slot.id"),
        nullable=False,
        index=True,
    )

    family_id: Mapped[int] = mapped_column(
        ForeignKey("evacuee_family.id"),
        nullable=False,
        index=True,
    )

    requested_start_date: Mapped[date] = mapped_column(Date, nullable=False)

    requested_end_date: Mapped[date] = mapped_column(Date, nullable=False)

    requested_capacity: Mapped[int] = mapped_column(Integer, nullable=False)

    family_message: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    request_status: Mapped[RequestStatus] = mapped_column(
        SqlEnum(RequestStatus, name="request_status_enum"),
        nullable=False,
        default=RequestStatus.PENDING,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    responded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    host_response: Mapped[str | None] = mapped_column(String(1000))

    family: Mapped["EvacueeFamily"] = relationship(
        "EvacueeFamily",
        back_populates="booking_requests",
    )

    review: Mapped["Review | None"] = relationship(
        "Review",
        back_populates="booking_request",
        uselist=False,
    )

    notifications: Mapped[list["Notification"]] = relationship(
        "Notification",
        back_populates="booking_request",
    )
    availability_slot: Mapped["AvailabilitySlot"] = relationship(
        "AvailabilitySlot",
        back_populates="booking_requests",
    )
