"""add picture column to users

Revision ID: dae8e6a8bd8a
Revises: b10b1ecc297d
Create Date: 2026-03-27 16:47:40.481747

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dae8e6a8bd8a'
down_revision: Union[str, Sequence[str], None] = 'b10b1ecc297d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("picture", sa.LargeBinary(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("users", "picture")