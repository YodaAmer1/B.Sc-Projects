import json
import logging
import sys
from urllib.parse import parse_qs
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.params import Depends

from app.schemas.user_schema import (
    FamilyCreateRequest,
    FamilyLocationUpdate,
    FamilyProfileResponse,
    HostCreateRequest,
    HostProfileResponse,
)
from app.schemas.user_schema import HostCreateRequest
from app.services.auth_service import AuthService
from app.db.session import get_db
from app.services.host_service import HostService
from fastapi import (
    APIRouter,
    File,
    HTTPException,
    Request,
    Response,
    UploadFile,
    status,
)

from app.api.dependencies import CurrentUserDep, UserServiceDep
from app.core.handel_exceptions_decorator import handle_exceptions
from app.services.family_service import FamilyService

SERVICE_HOST = HostService()
SERVICE_FAMILY = FamilyService()


logger = logging.getLogger(__name__)
# Uvicorn often leaves app.* loggers at WARNING — no INFO on console. Attach stderr so login lines always show.
if not logger.handlers:
    _stderr = logging.StreamHandler(sys.stderr)
    _stderr.setFormatter(logging.Formatter("%(levelname)s [auth/login] %(message)s"))
    _stderr.setLevel(logging.INFO)
    logger.addHandler(_stderr)
    logger.setLevel(logging.INFO)
    logger.propagate = False

router = APIRouter(prefix="/api/v1", tags=["Auth"])

# Handler uses Request (manual parse). OpenAPI would omit request body unless we document it here.
_LOGIN_OPENAPI_REQUEST_BODY = {
    "requestBody": {
        "required": True,
        "content": {
            "application/json": {
                "schema": {
                    "type": "object",
                    "required": ["email", "password"],
                    "properties": {
                        "email": {"type": "string", "example": "alice@example.com"},
                        "password": {
                            "type": "string",
                            "format": "password",
                            "example": "your-password",
                        },
                    },
                },
            },
            "application/x-www-form-urlencoded": {
                "schema": {
                    "type": "object",
                    "properties": {
                        "grant_type": {
                            "type": "string",
                            "example": "password",
                            "description": "OAuth2 password grant (Swagger Authorize)",
                        },
                        "email": {"type": "string"},
                        "password": {"type": "string", "format": "password"},
                        "scope": {"type": "string"},
                        "client_id": {"type": "string"},
                        "client_secret": {"type": "string", "format": "password"},
                    },
                },
            },
        },
    },
}


def _form_body_to_flat_dict(text: str) -> dict[str, str]:
    parsed = parse_qs(text, keep_blank_values=True)
    return {k: (v[0] if v else "") for k, v in parsed.items()}


@router.post("/auth/register")
async def register(profile: HostCreateRequest | FamilyCreateRequest):
    if isinstance(profile, HostCreateRequest):
        await SERVICE_HOST.create_host_profile(
            documents_url=profile.documents_url,
            email=profile.email,
            password=profile.password,
            full_name=profile.username,
            phone_number="00000000",
        )
    elif isinstance(profile, FamilyCreateRequest):
        await SERVICE_FAMILY.create_family_profile(
            family_size=0,
            origin_city="Not Specified",
            special_needs=profile.special_needs,
            needs_accessibility=False,
            documents_url=profile.documents_url,
            email=profile.email,
            password=profile.password,
            full_name=profile.username,
            phone_number="00000000",
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid profile type"
        )
    auth_service = AuthService()
    token = await auth_service.authenticate_user(profile.email, profile.password)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User created but failed to generate access token",
        )
    return {"access_token": token, "token_type": "bearer"}


@router.post(
    "/auth/login",
    openapi_extra=_LOGIN_OPENAPI_REQUEST_BODY,
    summary="Login (JSON or form-urlencoded)",
)
async def login(request: Request) -> dict[str, str]:
    """
    Accepts either:
    - application/json: {"email", "password"}
    - application/x-www-form-urlencoded: grant_type=password&email=...&password=... (Swagger / curl -d)
    """
    query_params = dict(request.query_params)
    # Raw query string from ASGI (Swagger OAuth2 token POST usually has no query string — body carries data).
    raw_query = request.scope.get("query_string", b"").decode(
        "latin-1", errors="replace"
    )
    raw_ct = (request.headers.get("content-type") or "").split(";")[0].strip().lower()
    body_bytes = await request.body()

    email: str | None = None
    password: str | None = None
    log_body: dict

    if raw_ct == "application/json":
        if not body_bytes.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Empty body",
            )
        try:
            data = json.loads(body_bytes.decode("utf-8"))
        except json.JSONDecodeError as exc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Invalid JSON body",
            ) from exc
        if not isinstance(data, dict):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="JSON body must be an object",
            )
        email = data.get("email")
        password = data.get("password")
        log_body = data
    elif raw_ct == "application/x-www-form-urlencoded" or raw_ct == "":
        text = body_bytes.decode("utf-8") if body_bytes else ""
        flat = _form_body_to_flat_dict(text)
        grant_type = flat.get("grant_type")
        if grant_type and grant_type != "password":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported grant_type",
            )
        email = flat.get("email") or flat.get("username") or None
        password = flat.get("password") or None
        log_body = flat
    else:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail=(
                "Use Content-Type: application/json or "
                "application/x-www-form-urlencoded"
            ),
        )

    if (
        email is None
        or password is None
        or str(email).strip() == ""
        or str(password) == ""
    ):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="email and password are required",
        )

    logger.info(
        "full_url=%s | raw_query_string=%r | query_params=%s | body=%s",
        str(request.url),
        raw_query,
        json.dumps(query_params),
        json.dumps(log_body),
    )

    auth_service = AuthService()
    token = await auth_service.authenticate_user(email, password)
    if not token:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"access_token": token, "token_type": "bearer"}


@router.get("/auth/me")
async def get_me(current_user: CurrentUserDep):
    return {"message": f"Hello {current_user['email']}"}


@handle_exceptions()
@router.put("/user/image/picture")
async def update_user_picture(
    current_user: CurrentUserDep,
    user_service: UserServiceDep,
    session: AsyncSession = Depends(get_db),
    file: UploadFile = File(...),
):
    user_id = int(current_user.get("id"))
    return await user_service.update_user_picture(
        session=session,
        user_id=user_id,
        file=file,
    )


@handle_exceptions()
@router.get("/{user_id}/image/picture")
async def get_user_picture(
    user_id: int,
    user_service: UserServiceDep,
    session: AsyncSession = Depends(get_db),
):
    picture_bytes = await user_service.get_user_picture(
        session=session,
        user_id=user_id,
    )

    if picture_bytes is None:
        return {
            "message": "User has no picture",
            "picture": None,
        }

    return Response(
        content=picture_bytes,
        media_type="image/jpeg",
    )


@router.patch("/family/profile")
@handle_exceptions()
async def update_family_location(
    data: FamilyLocationUpdate,
    current_user: CurrentUserDep,
    session: AsyncSession = Depends(get_db),
):
    return await SERVICE_FAMILY.update_family_location(
        session=session,
        user_id=current_user["id"],
        latitude=data.latitude,
        longitude=data.longitude,
    )
