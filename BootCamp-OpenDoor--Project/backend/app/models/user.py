from datetime import datetime
from enum import Enum

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum as SqlEnum,
    Integer,
    LargeBinary,
    String,
    func,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class UserRole(str, Enum):
    HOST = "Host"
    EVACUEE = "Evacuee"
    ADMIN = "Admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    email: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        unique=True,
        index=True,
    )

    password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    phone_number: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    user_role: Mapped[UserRole] = mapped_column(
        SqlEnum(UserRole, name="user_role_enum"),
        nullable=False,
        index=True,
    )

    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
    picture: Mapped[bytes | None] = mapped_column(
        LargeBinary,
        nullable=True,
    )

    host_profile: Mapped["HostProfile | None"] = relationship(
        "HostProfile",
        back_populates="user",
        uselist=False,
    )

    evacuee_family: Mapped["EvacueeFamily | None"] = relationship(
        "EvacueeFamily",
        back_populates="user",
        uselist=False,
    )

    admin_profile: Mapped["AdminProfile | None"] = relationship(
        "AdminProfile",
        back_populates="user",
        uselist=False,
    )

    notifications: Mapped[list["Notification"]] = relationship(
        "Notification",
        back_populates="user",
    )
