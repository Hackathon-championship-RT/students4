__all__ = ["User", "UserRole"]

import datetime

from enum import StrEnum

from beanie import PydanticObjectId
from pymongo import IndexModel

from src.pydantic_base import BaseSchema, BaseModel
from src.storages.mongo.__base__ import CustomDocument


class UserRole(StrEnum):
    DEFAULT = "default"
    ADMIN = "admin"


class LevelMetaInfo(BaseModel):
    level_name: str 
    time_passed: float
    help_number_used: int 
    clicks_num: int
    attempts: int


class UserSchema(BaseSchema):
    login: str
    password_hash: str
    level_passed: list[LevelMetaInfo] | None = None 
    role: UserRole = UserRole.DEFAULT


class User(UserSchema, CustomDocument):
    class Settings:
        indexes = [
            IndexModel("login", unique=True),
        ]
