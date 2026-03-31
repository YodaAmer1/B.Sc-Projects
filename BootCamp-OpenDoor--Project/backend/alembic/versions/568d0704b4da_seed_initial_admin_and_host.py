"""seed_initial_admin_and_host

Revision ID: 568d0704b4da
Revises: eff41b5f100c
Create Date: 2026-03-19 17:48:38.564922

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '568d0704b4da'
down_revision: Union[str, Sequence[str], None] = 'eff41b5f100c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.execute("""
    INSERT INTO users (email, password, full_name, phone_number, user_role, is_deleted, created_at, updated_at)
    VALUES 
    ('admin@opendoor.local', '12345678', 'Admin User', '0501111111', 'ADMIN', false, NOW(), NOW()),
    ('host@opendoor.local', '23456789', 'Host User', '0502222222', 'HOST', false, NOW(), NOW());
""")
    op.execute("""
    INSERT INTO admin_profile (user_id) 
    SELECT id FROM users WHERE email = 'admin@opendoor.local';
""")
    op.execute("""
    INSERT INTO host_profile (user_id, is_active, verification_status) 
    SELECT id, true, 'VERIFIED' FROM users WHERE email = 'host@opendoor.local';
""")



def downgrade() -> None:
    """Downgrade schema."""
    op.execute("""
        DELETE FROM admin_profiles 
        WHERE user_id IN (SELECT id FROM users WHERE email = 'admin@opendoor.local');
    """)
    
    op.execute("""
        DELETE FROM host_profiles 
        WHERE user_id IN (SELECT id FROM users WHERE email = 'host@opendoor.local');
    """)
    
    op.execute("""
        DELETE FROM users 
        WHERE email IN ('admin@opendoor.local', 'host@opendoor.local');
    """)
