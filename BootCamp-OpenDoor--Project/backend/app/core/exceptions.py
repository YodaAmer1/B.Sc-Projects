class AvailabilitySlotError(Exception):
    """Base exception for availability slot errors."""


class InvalidDateRangeError(AvailabilitySlotError):
    """Raised when start_date is not before end_date."""


class PropertyNotFoundError(AvailabilitySlotError):
    """Raised when property does not exist."""


class ForbiddenAvailabilitySlotError(AvailabilitySlotError):
    """Raised when user is not allowed to create slot for this property."""


class PropertyError(Exception):
    """Base exception for property errors."""


class ForbiddenPropertyError(PropertyError):
    """Raised when user is not allowed to access this property."""


class PropertyValidationError(PropertyError):
    """Raised when property data is invalid."""


class FamilyNotFoundError(Exception):
    """Raised when evacuee family profile does not exist."""


class BookingRequestError(Exception):
    """Base exception for booking request errors."""


class BookingRequestNotFoundError(BookingRequestError):
    """Raised when booking request does not exist."""


class ForbiddenBookingRequestError(BookingRequestError):
    """Raised when user is not allowed to access this booking request."""


class InvalidBookingRequestStateError(BookingRequestError):
    """Raised when booking request state does not allow this action."""


class UserNotFoundError(Exception):
    """Raised when user does not exist."""


class InvalidUserPictureError(Exception):
    """Raised when uploaded picture is invalid."""
