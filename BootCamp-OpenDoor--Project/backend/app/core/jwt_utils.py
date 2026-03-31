from datetime import datetime, timedelta, timezone
from enum import Enum

import jwt

from app.core.config import JWT_ALGORITHM, JWT_EXPIRE_MINUTES, JWT_SECRET

def decode_access_token(token: str) -> dict | None:
    """
    Verify signature and standard claims (e.g. exp). Return payload dict or None.
    """
    if not JWT_SECRET:
        return None
    try:
        return jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )
    except jwt.PyJWTError:
        return None
    

def create_access_token(user_id: int, full_name: str, email: str, role: str | Enum) -> str:
    """
    Generates a signed JWT access token containing the user ID, role, and expiration.
    Role claim matches DB/API values (e.g. Host, Evacuee, Admin), not forced UPPERCASE.
    """
    if not JWT_SECRET:
        raise ValueError("JWT_SECRET environment variable is not set")

    if isinstance(role, Enum):
        role_claim = role.value
    else:
        role_claim = str(role)

    expire_datetime = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    expire_timestamp = int(expire_datetime.timestamp())
    payload = {
        "id": str(user_id),
        "username": full_name,
        "email": email,
        "role": role_claim,
        "expire_timestamp": expire_timestamp,

    }
    
    # Sign and return the token
    encoded_jwt = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    
    return encoded_jwt