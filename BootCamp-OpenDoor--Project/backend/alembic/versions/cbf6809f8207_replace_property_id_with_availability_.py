"""replace property_id with availability_slot_id

Revision ID: cbf6809f8207
Revises: 568d0704b4da
Create Date: 2026-03-24 16:36:56.403831

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "cbf6809f8207"
down_revision: Union[str, Sequence[str], None] = "568d0704b4da"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_constraint(
        "booking_request_property_id_fkey",
        "booking_request",
        type_="foreignkey",
    )

    op.drop_index(op.f("ix_booking_request_property_id"), table_name="booking_request")
    op.drop_column("booking_request", "property_id")

    op.add_column(
        "booking_request",
        sa.Column("availability_slot_id", sa.Integer(), nullable=False),
    )
    op.create_foreign_key(
        "fk_booking_request_availability_slot_id",
        "booking_request",
        "availability_slot",
        ["availability_slot_id"],
        ["id"],
    )
    op.create_index(
        op.f("ix_booking_request_availability_slot_id"),
        "booking_request",
        ["availability_slot_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_booking_request_availability_slot_id"),
        table_name="booking_request",
    )
    op.drop_constraint(
        "fk_booking_request_availability_slot_id",
        "booking_request",
        type_="foreignkey",
    )
    op.drop_column("booking_request", "availability_slot_id")

    op.add_column(
        "booking_request",
        sa.Column("property_id", sa.Integer(), nullable=False),
    )
    op.create_foreign_key(
        "booking_request_property_id_fkey",
        "booking_request",
        "property",
        ["property_id"],
        ["id"],
    )
    op.create_index(
        op.f("ix_booking_request_property_id"),
        "booking_request",
        ["property_id"],
        unique=False,
    )
