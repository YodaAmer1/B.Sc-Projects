"""seed_demo_data

Revision ID: 3415f39061a6
Revises: dae8e6a8bd8a
Create Date: 2026-03-29 11:53:49.711134

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3415f39061a6'
down_revision: Union[str, Sequence[str], None] = 'dae8e6a8bd8a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema with mixed Jewish and Druze names for Hosts and Families."""
    
    # 1. Insert 10 Hosts (Mixed: Yoda, Daniella, Arkady, Ofir + Druze names)
    op.execute("""
    INSERT INTO users (email, password, full_name, phone_number, user_role, is_deleted, created_at, updated_at)
    VALUES 
    ('yoda.host@opendoor.local', 'pass1234', 'Yoda Host', '0501234561', 'HOST', false, NOW(), NOW()),
    ('daniella.host@opendoor.local', 'pass1234', 'Daniella Host', '0501234562', 'HOST', false, NOW(), NOW()),
    ('arkady.host@opendoor.local', 'pass1234', 'Arkady Host', '0501234563', 'HOST', false, NOW(), NOW()),
    ('ofir.host@opendoor.local', 'pass1234', 'Ofir Host', '0501234564', 'HOST', false, NOW(), NOW()),
    ('salman.host@opendoor.local', 'pass1234', 'Salman Host', '0501234565', 'HOST', false, NOW(), NOW()),
    ('amal.host@opendoor.local', 'pass1234', 'Amal Host', '0501234566', 'HOST', false, NOW(), NOW()),
    ('zidan.host@opendoor.local', 'pass1234', 'Zidan Host', '0501234567', 'HOST', false, NOW(), NOW()),
    ('rayan.host@opendoor.local', 'pass1234', 'Rayan Host', '0501234568', 'HOST', false, NOW(), NOW()),
    ('layla.host@opendoor.local', 'pass1234', 'Layla Host', '0501234569', 'HOST', false, NOW(), NOW()),
    ('fadi.host@opendoor.local', 'pass1234', 'Fadi Host', '0501234570', 'HOST', false, NOW(), NOW());
    """)

    op.execute("""
    INSERT INTO host_profile (user_id, is_active, verification_status) 
    SELECT id, true, 'VERIFIED' FROM users WHERE email LIKE '%.host@opendoor.local';
    """)

    # 2. Insert 10 Families (Mixed Jewish/Druze surnames)
    op.execute("""
    INSERT INTO users (email, password, full_name, phone_number, user_role, is_deleted, created_at, updated_at)
    VALUES 
    ('levi.family@opendoor.local', 'fam1234', 'Levi Family', '0521111111', 'EVACUEE', false, NOW(), NOW()),
    ('halabi.family@opendoor.local', 'fam1234', 'Halabi Family', '0521111112', 'EVACUEE', false, NOW(), NOW()),
    ('mizrahi.family@opendoor.local', 'fam1234', 'Mizrahi Family', '0521111113', 'EVACUEE', false, NOW(), NOW()),
    ('nasruddin.family@opendoor.local', 'fam1234', 'Nasruddin Family', '0521111114', 'EVACUEE', false, NOW(), NOW()),
    ('biton.family@opendoor.local', 'fam1234', 'Biton Family', '0521111115', 'EVACUEE', false, NOW(), NOW()),
    ('tabor.family@opendoor.local', 'fam1234', 'Tabor Family', '0521111116', 'EVACUEE', false, NOW(), NOW()),
    ('mulla.family@opendoor.local', 'fam1234', 'Mulla Family', '0521111117', 'EVACUEE', false, NOW(), NOW()),
    ('katz.family@opendoor.local', 'fam1234', 'Katz Family', '0521111118', 'EVACUEE', false, NOW(), NOW()),
    ('amar.family@opendoor.local', 'fam1234', 'Amar Family', '0521111119', 'EVACUEE', false, NOW(), NOW()),
    ('shanan.family@opendoor.local', 'fam1234', 'Shanan Family', '0521111120', 'EVACUEE', false, NOW(), NOW());
    """)

    op.execute("""
    INSERT INTO evacuee_family (user_id, family_size, origin_city, special_needs, needs_accessibility, verification_status) 
    SELECT id, floor(random() * 5 + 2), 
    CASE WHEN random() > 0.5 THEN 'Sderot' ELSE 'Kiriyat Shmona' END, 
    'None', false, 'VERIFIED' 
    FROM users WHERE email LIKE '%.family@opendoor.local';
    """)

    # 3. Insert 20 Properties for Yoda and Daniella
    op.execute("""
    INSERT INTO property (host_profile_id, name, street_address, city, capacity, specific_tags, status, created_at, updated_at)
    VALUES
    -- Properties for Yoda Host (1-10)
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'yoda.host@opendoor.local'), 'Urban Studio', 'Herzl 10', 'Tel Aviv', 2, 'WiFi, Air Conditioning', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'yoda.host@opendoor.local'), 'Garden Apartment', 'Pinsker 5', 'Petah Tikva', 4, 'Garden, Mamad, Family', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'yoda.host@opendoor.local'), 'Sea Side Flat', 'HaYarkon 50', 'Tel Aviv', 3, 'Sea View, Balcony, WiFi', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'yoda.host@opendoor.local'), 'Quiet Retreat', 'Bialik 12', 'Ramat Gan', 2, 'Parking, Air Conditioning', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'yoda.host@opendoor.local'), 'Mountain Villa', 'Main St 1', 'Daliat al-Karmel', 6, 'View, Family, Quiet', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'yoda.host@opendoor.local'), 'Modern Suite', 'Rothschild 22', 'Tel Aviv', 2, 'Balcony, WiFi, Pet Friendly', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'yoda.host@opendoor.local'), 'Simple Stay', 'Histadrut 4', 'Holon', 3, 'Parking, Air Conditioning', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'yoda.host@opendoor.local'), 'The Penthouse', 'Dizengoff 99', 'Tel Aviv', 4, 'Balcony, Sea View, WiFi', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'yoda.host@opendoor.local'), 'Cozy Spot', 'Al-Jabal 4', 'Isfiya', 3, 'Garden, Quiet', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'yoda.host@opendoor.local'), 'City Center Loft', 'Allenby 30', 'Tel Aviv', 2, 'WiFi, Air Conditioning', 'ACTIVE', NOW(), NOW()),

    -- Properties for Daniella Host (11-20)
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'daniella.host@opendoor.local'), 'Cozy Corner', 'Sokolov 8', 'Herzliya', 2, 'Parking, WiFi', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'daniella.host@opendoor.local'), 'Spacious Home', 'Ben Gurion 40', 'Ra''anana', 5, 'Family, Garden, Mamad', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'daniella.host@opendoor.local'), 'Beach Front', 'Ramat Yam 12', 'Herzliya', 3, 'Sea View, Balcony, WiFi', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'daniella.host@opendoor.local'), 'Village House', 'Olive Grove 2', 'Beit Jann', 4, 'Nature, Family, Parking', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'daniella.host@opendoor.local'), 'Downtown View', 'HaAtzmaut 1', 'Ashdod', 3, 'Sea View, Balcony, Mamad', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'daniella.host@opendoor.local'), 'Accessible Suite', 'Ahuza 100', 'Ra''anana', 2, 'Accessible, Parking, WiFi', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'daniella.host@opendoor.local'), 'High Rise Living', 'HaTzionut 15', 'Ashdod', 4, 'Sea View, Mamad, Air Conditioning', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'daniella.host@opendoor.local'), 'Worker''s Pad', 'HaMelacha 5', 'Netanya', 2, 'WiFi, Air Conditioning, Parking', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'daniella.host@opendoor.local'), 'Large Family Flat', 'Weizman 20', 'Netanya', 6, 'Family, Balcony, Mamad', 'ACTIVE', NOW(), NOW()),
    ((SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email = 'daniella.host@opendoor.local'), 'Northern View', 'Al-Shuhada 10', 'Yarka', 3, 'Garden, View, WiFi', 'ACTIVE', NOW(), NOW());
    """)

def downgrade() -> None:
    """Remove all seeded data."""
    op.execute("DELETE FROM property WHERE host_profile_id IN (SELECT hp.id FROM host_profile hp JOIN users u ON u.id = hp.user_id WHERE u.email IN ('yoda.host@opendoor.local', 'daniella.host@opendoor.local'));")
    op.execute("DELETE FROM evacuee_family WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%.family@opendoor.local');")
    op.execute("DELETE FROM host_profile WHERE user_id IN (SELECT id FROM users WHERE email LIKE '%.host@opendoor.local');")
    op.execute("DELETE FROM users WHERE email LIKE '%.host@opendoor.local' OR email LIKE '%.family@opendoor.local';")