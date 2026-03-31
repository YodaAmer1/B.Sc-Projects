from enum import Enum

class Role(str, Enum):
    HOST = "Host"
    EVACUEE = "Evacuee"
    ADMIN = "Admin"