```
backend/
├── main.py                        # Entry point - runs Uvicorn server
check endpoint
├── app/
│   ├── server.py                         # FastAPI app instance and health 
│   ├── api/
│   │   ├── dependencies.py        # RBAC functions (get_current_user, verify_host, verify_admin)
│   │   └── routes/                # API Contract Implementation
│   │       ├── auth_routes.py      
│   │       ├── property_routes.py  
│   │       ├── request_routes.py  
│   │       └── admin_routes.py     
│   ├── core/
│   │   ├── config.py              # Pydantic BaseSettings for .env 
│   │   ├── constants.py           # Role (Host/Family/Admin), RequestStatus (Pending/Approved/Rejected)
│   │   ├── exceptions.py          # Custom HTTP exceptions
│   │   ├── jwt_utils.py           # Token generation and decoding
│   │   └── password_utils.py      # Hashing logic
│   ├── db/
│   │   ├── base.py                # SQLAlchemy declarative_base() and model imports for Alembic
│   │   └── session.py             # PostgreSQL async_engine and sessionmaker setup
│   ├── models/                    # Layer 1: SQLAlchemy ORM Entities (Database Tables)
│   │   ├── user.py                # Users table
│   │   ├── property.py            # Properties table
│   │   ├── request.py             # Requests table
│   │   ├── availability_slot.py   # AvailabilitySlots table
│   │   └── notification.py        # Notifications table
│   ├── repositories/              # Layer 2: Data Access Layer (SQLAlchemy Queries)
│   │   ├── base_repository.py     # Generic CRUD operations
│   │   ├── user_repository.py     # Fetch users by role or verification status
│   │   ├── property_repository.py # join properties with availability_slots & filter by tags
│   │   ├── request_repository.py  # Fetch requests by property/family and update status
│   │   ├── availability_repository.py # Date overlap logic and slot management
│   │   └── notification_repository.py
│   ├── services/                  # Layer 3: Business Logic (Use Cases Implementation)
│   │     ├── auth_service.py        # Login logic, JWT issuing, Registration logic
│   │     ├── user_service.py        # Admin verification logic
│   │     ├── property_service.py    # Host property management, linking tags and slots
│   │     └── request_service.py     # Matchmaking logic: Family requests, Host approves/declines
│   ├── schemas/                   # Layer 4: Pydantic Models (Data Validation & DTO)
│   │   ├── user_schema.py         # UserCreate, UserResponse, UserLogin schemas
│   │   ├── property_schema.py     # PropertyCreate, PropertyResponse
│   │   ├── request_schema.py      # RequestCreate, RequestStatusUpdate
│   │   ├── availability_schema.py # AvailabilitySlotCreate, DateRangeSearch
│   │   ├── notification_schema.py     
│   │   └── token_schema.py        # Token response schema
├── tests/                         # Pytest Suite
│   ├── conftest.py                # Fixtures
│   ├── api/                       # Endpoint tests
│   ├── services/                  # Business logic unit tests
│   └── repositories/              # DB query tests
├── alembic/                       # Database migrations tracking
├── .env                           # Environment variables
├── requirements.txt               # Dependencies
├── .gitignore
└── README.md
```
