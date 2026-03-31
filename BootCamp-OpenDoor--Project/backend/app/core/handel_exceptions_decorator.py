from functools import wraps
from types import MappingProxyType
from typing import Any, Callable

from fastapi import HTTPException, status

from app.core.exceptions import (
    AvailabilitySlotError,
    BookingRequestNotFoundError,
    FamilyNotFoundError,
    PropertyNotFoundError,
    InvalidDateRangeError,
    ForbiddenAvailabilitySlotError,
    PropertyError,
    PropertyValidationError,
    ForbiddenPropertyError,
    ForbiddenBookingRequestError,
    BookingRequestError,
    InvalidBookingRequestStateError,
    UserNotFoundError,
    InvalidUserPictureError

)

STATUS_CODE_MAPPING: MappingProxyType[type, int] = MappingProxyType(
    {
        AvailabilitySlotError: status.HTTP_404_NOT_FOUND,
        PropertyNotFoundError: status.HTTP_404_NOT_FOUND,
        InvalidDateRangeError: status.HTTP_400_BAD_REQUEST,
        ForbiddenAvailabilitySlotError: status.HTTP_403_FORBIDDEN,
        PropertyError: status.HTTP_400_BAD_REQUEST,
        PropertyValidationError: status.HTTP_400_BAD_REQUEST,
        ForbiddenPropertyError: status.HTTP_403_FORBIDDEN,
        FamilyNotFoundError: status.HTTP_404_NOT_FOUND,
        BookingRequestNotFoundError: status.HTTP_404_NOT_FOUND,
        ForbiddenBookingRequestError: status.HTTP_403_FORBIDDEN,
        BookingRequestError: status.HTTP_400_BAD_REQUEST,
        InvalidBookingRequestStateError: status.HTTP_400_BAD_REQUEST,
        UserNotFoundError: status.HTTP_404_NOT_FOUND,
        InvalidUserPictureError: status.HTTP_400_BAD_REQUEST


    }
    
)

def handle_exceptions() -> Callable[..., Any]:
    def decorator(func: Callable[..., Any]) -> Callable[..., Any]:
        @wraps(func)
        async def wrapper(*args: Any, **kwargs: Any) -> Any:
            try:
                return await func(*args, **kwargs)
            except (
                AvailabilitySlotError,
                PropertyNotFoundError,
                InvalidDateRangeError,
                ForbiddenAvailabilitySlotError,
                PropertyError,
                PropertyValidationError,
                ForbiddenPropertyError,
                FamilyNotFoundError,
                BookingRequestNotFoundError,
                ForbiddenBookingRequestError,
                BookingRequestError,
                InvalidBookingRequestStateError,
                UserNotFoundError,
                InvalidUserPictureError,
                


   
            ) as exc:
                code = STATUS_CODE_MAPPING.get(type(exc), status.HTTP_500_INTERNAL_SERVER_ERROR)
                raise HTTPException(status_code=code, detail=str(exc))

        return wrapper

    return decorator