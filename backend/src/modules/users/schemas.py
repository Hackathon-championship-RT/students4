__all__ = ["CreateUser", "ViewUser"]

import datetime

from beanie import PydanticObjectId

from src.pydantic_base import BaseSchema
from src.storages.mongo.users import LevelMetaInfo

class CreateUser(BaseSchema):
    login: str
    password: str

class AddResultReq(BaseSchema):
    level_name: str 
    time_passed: float
    help_number_used: int 
    clicks_num: int

class LevelLeaderboardResp(BaseSchema):
    user_id: PydanticObjectId
    lvlInfo: LevelMetaInfo

class ViewUser(BaseSchema):
    id: PydanticObjectId
    login: str


class UserAuthData(BaseSchema):
    user_id: PydanticObjectId
