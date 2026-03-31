from app.repositories.request_repository import BookingRepository
from app.services.request_service import BookingService
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated, List, TypedDict

from app.core.constants import Role
from app.services.auth_service import get_current_user_from_token
from app.repositories.property_repository import PropertyRepository
from app.services.property_service import PropertyService
from app.repositories.availability_repository import AvailabilityRepository
from app.services.availability_slot_service import AvailabilityService
from app.repositories.admin_repository import AdminRepository
from app.services.admin_service import AdminService
from app.repositories.user_repository import UserRepository
from app.services.user_service import UserService


class CurrentUser(TypedDict):
    """
    Minimal representation of the authenticated user as decoded from the JWT.
    Adjust this when you implement the real auth_service and user model.
    """

    id: int
    username: str
    role: Role
    expires_in: int  # seconds until JWT exp; 0 if no exp claim or already expired


# from where to get the token from the request (Authorization header with Bearer scheme)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> CurrentUser:
    """
    validate the JWT token and return the current user info. Raises 401 if token is invalid or expired.
    """
    user = get_current_user_from_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials or token expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def require_role(required_roles: List[Role]):
    """
    Dependency factory to create a dependency that checks if the current user has one of the required roles. Raises 403 if user does not have permission.
    """

    def role_checker(
        current_user: CurrentUser = Depends(get_current_user),
    ) -> CurrentUser:
        if current_user["role"] not in required_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action",
            )
        return current_user

    return role_checker


def get_property_service() -> PropertyService:
    property_repository = PropertyRepository()
    return PropertyService(property_repository)


def get_availability_service() -> AvailabilityService:
    availability_repository = AvailabilityRepository()
    return AvailabilityService(availability_repository)


def get_booking_service() -> BookingService:
    booking_requests_repository = BookingRepository()
    return BookingService(booking_repository=booking_requests_repository)


def get_admin_service() -> AdminService:
    admin_repository = AdminRepository()
    return AdminService(admin_repository)
def get_user_service() -> UserService:
    user_repository = UserRepository()
    return UserService(user_repository=user_repository)



# Convenience type aliases for use in routers to clearly express access rules.
CurrentUserDep = Annotated[CurrentUser, Depends(get_current_user)]
HostDep = Annotated[CurrentUser, Depends(require_role([Role.HOST]))]
EvacueeDep = Annotated[CurrentUser, Depends(require_role([Role.EVACUEE]))]
AdminDep = Annotated[CurrentUser, Depends(require_role([Role.ADMIN]))]
PropertyServiceDep = Annotated[PropertyService, Depends(get_property_service)]
AvailabilityServiceDep = Annotated[
    AvailabilityService, Depends(get_availability_service)
]
BookingServiceDep = Annotated[BookingService, Depends(get_booking_service)]
HostOrFamilyDep = Annotated[
    CurrentUser, Depends(require_role([Role.HOST, Role.EVACUEE]))
]
AdminServiceDep = Annotated[AdminService, Depends(get_admin_service)]
UserServiceDep = Annotated[UserService, Depends(get_user_service)]
