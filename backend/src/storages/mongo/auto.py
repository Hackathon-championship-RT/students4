__all__ = ["User", "UserRole"]

import datetime

from pymongo import IndexModel

from src.pydantic_base import BaseSchema, BaseModel
from src.storages.mongo.__base__ import CustomDocument

class AutoMetaInfo(BaseSchema):
    url: str
    description: str
    types: list[str]
    history: str

class AutoInfo(BaseSchema):
    auto_name: str 
    auto_meta_info: AutoMetaInfo

class Auto(AutoInfo, CustomDocument):
    class Settings:
        indexes = [
            IndexModel("auto_name", unique=True),
        ]
