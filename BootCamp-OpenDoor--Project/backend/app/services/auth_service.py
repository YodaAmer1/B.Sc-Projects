import json
import logging
import time
from typing import Optional, TypedDict
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.constants import Role
from app.core.jwt_utils import create_access_token, decode_access_token
from app.repositories.base_repository import BaseRepository
from app.repositories.base_repository import BaseRepository
from app.db.session import SessionLocal
from app.repositories.user_repository import UserRepository

logger = logging.getLogger(__name__)


class CurrentUserPayload(TypedDict):
    """Matches CurrentUser in app.api.dependencies."""

    id: int
    email: str
    role: Role
    expires_in: int  # seconds until JWT exp; 0 if no exp claim or already expired


def _parse_role_from_claim(raw: object) -> Role | None:
    if raw is None:
        return None
    s = str(raw).strip()
    for r in Role:
        if r.value == s:
            return r
    lower = s.lower()
    for r in Role:
        if r.value.lower() == lower:
            return r
    aliases: dict[str, Role] = {
        "HOST": Role.HOST,
        "host": Role.HOST,
        # Legacy JWT / client values (before Role.EVACUEE)
        "FAMILY": Role.EVACUEE,
        "Family": Role.EVACUEE,
        "family": Role.EVACUEE,
        "EVACUEE": Role.EVACUEE,
        "evacuee": Role.EVACUEE,
        "ADMIN": Role.ADMIN,
        "admin": Role.ADMIN,
    }
    return aliases.get(s) or aliases.get(s.upper())


def get_current_user_from_token(token: str) -> CurrentUserPayload | None:
    """
    Decode Bearer token and map claims to id / username / role.
    Returns None if invalid, expired, or missing required claims.
    """
    payload = decode_access_token(token)
    if not payload:
        return None

    sub = payload.get("sub")
    if sub is None:
        sub = payload.get("id")
    try:
        user_id = int(sub) if sub is not None else None
    except (TypeError, ValueError):
        user_id = None
    if user_id is None:
        return None

    email = payload.get("email") or payload.get("username") or ""
    if not isinstance(email, str):
        email = str(email)
    email = email.strip()
    
    if not email:
        return None

    role = _parse_role_from_claim(payload.get("role"))
    if role is None:
        return None

    expires_in = 0
    exp_raw = payload.get("exp")
    if exp_raw is not None:
        try:
            exp_ts = int(exp_raw)
            expires_in = max(0, exp_ts - int(time.time()))
        except (TypeError, ValueError):
            expires_in = 0

    result: CurrentUserPayload = {
        "id": user_id,
        "email": email,
        "role": role,
        "expires_in": expires_in,
    }

    logger.info(
        "get_current_user_from_token result=%s",
        json.dumps(
            {
                "id": result["id"],
                "email": result["email"],
                "role": result["role"].value,
                "expires_in": result["expires_in"],
            }
        ),
    )

    return result

class AuthService:
    def __init__(self, session_maker : Optional[AsyncSession] = None, user_repository : Optional[UserRepository] = None) -> None:
        self._session_maker = session_maker or SessionLocal
        self.user_repository = user_repository or UserRepository()
    
    async def authenticate_user(self, email: str, password_input: str) -> Optional[str]:
        async with self._session_maker() as session:
            user = await self.user_repository.get_by_email(session, email)
            if not user or user.password != password_input:
                return None
                
            return create_access_token(
                user_id=user.id, 
                full_name=user.full_name, 
                role=user.user_role,
                email=user.email
        )
