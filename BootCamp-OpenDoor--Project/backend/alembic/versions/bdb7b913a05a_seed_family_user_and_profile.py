"""seed_family_user_and_profile

Revision ID: bdb7b913a05a
Revises: cbf6809f8207
Create Date: 2026-03-25 12:34:10.338527

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'bdb7b913a05a'
down_revision: Union[str, Sequence[str], None] = 'cbf6809f8207'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
    INSERT INTO users (email, password, full_name, phone_number, user_role, is_deleted, created_at, updated_at)
    VALUES 
    ('family@opendoor.local', '34567890', 'User Family', '0503333333', 'EVACUEE', false, NOW(), NOW());
    """)

    op.execute("""
    INSERT INTO evacuee_family (
        user_id, 
        family_size, 
        origin_city, 
        special_needs, 
        needs_accessibility, 
        verification_status
    ) 
    SELECT 
        id, 
        4, 
        'Sderot', 
        'Requires ground floor if possible', 
        false, 
        'VERIFIED' 
    FROM users WHERE email = 'family@opendoor.local';
    """)


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
        DELETE FROM evacuee_family 
        WHERE user_id IN (SELECT id FROM users WHERE email = 'family@opendoor.local');
    """)

    op.execute("""
        DELETE FROM users 
        WHERE email = 'family@opendoor.local';
    """)
    
