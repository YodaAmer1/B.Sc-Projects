import os

from dotenv import load_dotenv

load_dotenv()

JWT_SECRET: str | None = os.getenv("JWT_SECRET")
JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
# Access-token lifetime in minutes when issuing JWTs (login/register); default 60.
JWT_EXPIRE_MINUTES: int = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))
