import pytest
from unittest.mock import AsyncMock, Mock



@pytest.fixture
def session_mock_fixture() -> Mock:
    session_mock = Mock()
    session_mock.flush = AsyncMock()
    context_manager_mock = AsyncMock()
    transaction_mock_enter_exit = AsyncMock()
    transaction_mock_enter_exit.__aenter__.return_value = None
    transaction_mock_enter_exit.__aexit__.return_value = None
    session_mock.begin = Mock(return_value=transaction_mock_enter_exit)
    context_manager_mock.__aenter__.return_value = session_mock
    context_manager_mock.__aexit__.return_value = None
    session_maker_mock = Mock(return_value=context_manager_mock)
    return session_maker_mock