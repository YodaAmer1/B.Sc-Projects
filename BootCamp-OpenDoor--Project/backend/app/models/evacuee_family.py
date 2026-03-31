from enum import Enum

from sqlalchemy import (
    Boolean,
    Enum as SqlEnum,
    Float,
    ForeignKey,
    Integer,
    String,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship


from app.db.session import Base


class VerificationStatus(str, Enum):
    PENDING = "Pending"
    VERIFIED = "Verified"
    REJECTED = "Rejected"


class EvacueeFamily(Base):
    __tablename__ = "evacuee_family"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
        unique=True,
        index=True,
    )

    family_size: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    origin_city: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )
    latitude: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    longitude: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    special_needs: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    needs_accessibility: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    documents_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    verification_status: Mapped[VerificationStatus] = mapped_column(
        SqlEnum(VerificationStatus, name="family_verification_status_enum"),
        nullable=False,
        default=VerificationStatus.PENDING,
        index=True,
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="evacuee_family",
    )

    booking_requests: Mapped[list["BookingRequest"]] = relationship(
        "BookingRequest",
        back_populates="family",
    )

    reviews: Mapped[list["Review"]] = relationship(
        "Review",
        back_populates="family",
    )
