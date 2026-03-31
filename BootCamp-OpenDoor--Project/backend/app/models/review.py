from datetime import datetime
from sqlalchemy import DateTime, ForeignKey, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Review(Base):
    __tablename__ = "review"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    property_id: Mapped[int] = mapped_column(
        ForeignKey("property.id"),
        nullable=False,
        index=True,
    )

    family_id: Mapped[int] = mapped_column(
        ForeignKey("evacuee_family.id"),
        nullable=False,
        index=True,
    )

    request_id: Mapped[int] = mapped_column(
        ForeignKey("booking_request.id"),
        nullable=False,
        index=True,
        unique=True,
    )

    rating: Mapped[int] = mapped_column(Integer, nullable=False)

    comment: Mapped[str | None] = mapped_column(String(1000))

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    property: Mapped["Property"] = relationship(
        "Property",
        back_populates="reviews",
    )

    family: Mapped["EvacueeFamily"] = relationship(
        "EvacueeFamily",
        back_populates="reviews",
    )

    booking_request: Mapped["BookingRequest"] = relationship(
        "BookingRequest",
        back_populates="review",
    )