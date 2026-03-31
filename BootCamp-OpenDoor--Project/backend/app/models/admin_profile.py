from sqlalchemy import ForeignKey, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base


class AdminProfile(Base):
    __tablename__ = "admin_profile"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"), 
        nullable=False,
        unique=True,
        index=True,
    )

    user: Mapped["User"] = relationship(
        "User",
        back_populates="admin_profile",
    )