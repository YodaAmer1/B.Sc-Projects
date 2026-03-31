from app.models.host_profile import HostProfile
from app.services.host_service import HostService
import pytest
from unittest.mock import AsyncMock, MagicMock, Mock
from app.models.availability_slot import AvailabilitySlot
from app.models.user import User, UserRole
from app.models.host_profile import HostProfile
from app.models.admin_profile import AdminProfile
from app.models.evacuee_family import EvacueeFamily
from app.models.notification import Notification
from app.models.booking_request import BookingRequest
from app.models.review import Review
from app.models.property import Property

@pytest.mark.asyncio
async def test_create_host_profile_success(session_mock_fixture):

    mock_host_repository = AsyncMock()
    fake_user_for_host = User(email="test@opendoor.local", full_name="Test User", phone_number="0501234567", password="password123", user_role=UserRole.HOST)
    fake_returned_profile = HostProfile(user_id=fake_user_for_host.id, documents_url="http://test.com")
    mock_host_repository.create.return_value = fake_returned_profile

    service = HostService(
        session_maker=session_mock_fixture, 
        host_repository=mock_host_repository
    )

    result = await service.create_host_profile(
        documents_url="http://test.com",
        email="test@opendoor.local",
        password="password123",
        full_name="Test User",
        phone_number="0501234567"
    )

    assert result == fake_returned_profile
    mock_host_repository.create.assert_awaited_once()