"""seed_initial_properties

Revision ID: b10b1ecc297d
Revises: bdb7b913a05a
Create Date: 2026-03-25 13:30:23.392500

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b10b1ecc297d'
down_revision: Union[str, Sequence[str], None] = 'bdb7b913a05a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
    INSERT INTO property (
        host_profile_id,
        name,
        street_address,
        city,
        capacity,
        specific_tags,
        status,
        created_at,
        updated_at
    )
    VALUES
    (
        (SELECT hp.id FROM host_profile hp
         INNER JOIN users u ON u.id = hp.user_id
         WHERE u.email = 'host@opendoor.local'),
        'Shared Family Apartment',
        '10 Rothschild St',
        'Petah Tikva',
        3,
        'Ground floor, Shared building, Spacious',
        'ACTIVE',
        NOW(),
        NOW()
    ),
    (
        (SELECT hp.id FROM host_profile hp
         INNER JOIN users u ON u.id = hp.user_id
         WHERE u.email = 'host@opendoor.local'),
        'Cozy Downtown Studio',
        '5 Herzl St',
        'Tel Aviv',
        2,
        'Close to transit, Pet friendly',
        'ACTIVE',
        NOW(),
        NOW()
    );
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
    DELETE FROM property
    WHERE host_profile_id = (
        SELECT hp.id FROM host_profile hp
        INNER JOIN users u ON u.id = hp.user_id
        WHERE u.email = 'host@opendoor.local'
    )
    AND street_address IN ('10 Rothschild St', '5 Herzl St');
    """)


