from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Enum as SqlEnum, Float, ForeignKey, Integer, String, func


from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base


class PropertyStatus(str, Enum):
    ACTIVE = "Active"
    SUSPENDED = "Suspended"
    INACTIVE = "Inactive"


class Property(Base):
    __tablename__ = "property"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    host_profile_id: Mapped[int] = mapped_column(
        ForeignKey("host_profile.id"),
        nullable=False,
        index=True,
    )

    name: Mapped[str] = mapped_column(String(255), nullable=False)

    street_address: Mapped[str] = mapped_column(String(255), nullable=False)

    city: Mapped[str] = mapped_column(String(100), nullable=False)
    latitude: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    longitude: Mapped[float | None] = mapped_column(
        Float,
        nullable=True,
    )

    capacity: Mapped[int] = mapped_column(Integer, nullable=False)

    specific_tags: Mapped[str | None] = mapped_column(String(500), nullable=True)

    status: Mapped[PropertyStatus] = mapped_column(
        SqlEnum(PropertyStatus, name="property_status_enum"),
        nullable=False,
        default=PropertyStatus.ACTIVE,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    host_profile: Mapped["HostProfile"] = relationship(
        "HostProfile",
        back_populates="properties",
    )

    availability_slots: Mapped[list["AvailabilitySlot"]] = relationship(
        "AvailabilitySlot",
        back_populates="property",
    )

    reviews: Mapped[list["Review"]] = relationship(
        "Review",
        back_populates="property",
    )
