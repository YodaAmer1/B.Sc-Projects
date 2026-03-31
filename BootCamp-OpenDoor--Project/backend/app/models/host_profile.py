from enum import Enum

from app.models.property import Property
from sqlalchemy import Boolean, Enum as SqlEnum, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship



from app.db.session import Base


class VerificationStatus(str, Enum):
    PENDING = "Pending"
    VERIFIED = "Verified"
    REJECTED = "Rejected"


class HostProfile(Base):
    __tablename__ = "host_profile"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), 
        nullable=False,
        unique=True,  
        index=True,
    )

    documents_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
    )

    verification_status: Mapped[VerificationStatus] = mapped_column(
        SqlEnum(VerificationStatus, name="verification_status_enum"),
        nullable=False,
        default=VerificationStatus.PENDING,
        index=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True,
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="host_profile",
    )

    properties: Mapped[list["Property"]] = relationship(
        "Property",
        back_populates="host_profile",
    )