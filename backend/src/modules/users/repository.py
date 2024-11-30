__all__ = ["user_repository"]

import datetime

from beanie import PydanticObjectId

from src.modules.users.schemas import CreateUser, LevelLeaderboardResp
from src.storages.mongo.users import User, LevelMetaInfo
from fastapi import HTTPException

# noinspection PyMethodMayBeStatic
class UserRepository:
    async def create(self, user: CreateUser) -> User:
        from src.modules.login_and_password.repository import login_password_repository

        data = user.model_dump()
        password = data.pop("password")
        data["password_hash"] = login_password_repository.get_password_hash(password)
        created = User(**data)

        return await created.insert()

    async def read(self, user_id: PydanticObjectId) -> User | None:
        return await User.get(user_id)

    async def read_id_and_password_hash(self, login: str) -> tuple[PydanticObjectId, str] | None:
        user = await User.find_one(User.login == login)
        if user is None:
            return None
        return user.id, user.password_hash

    async def exists(self, user_id: PydanticObjectId) -> bool:
        return bool(await User.find(User.id == user_id, limit=1).count())

    async def is_banned(self, user_id: str | PydanticObjectId) -> bool:
        return False

    async def upsert_level_info(self, user_id: PydanticObjectId, level_name: str, time_passed: float, help_number_used: int, clicks_num: int) -> list[LevelMetaInfo] | None:
        user = await User.get(user_id)
        
        if user.level_passed is None:
            user.level_passed = [LevelMetaInfo(
                level_name = level_name,
                time_passed = time_passed, 
                help_number_used = help_number_used,
                clicks_num = clicks_num,
                attempts = 1,
            )]
            await User.find_one(User.id == user.id).update(
                {
                    "$set": {User.level_passed: user.level_passed}
                }
            )
            return user.level_passed
    
        found = False
        
        for lvl in user.level_passed:
            if lvl.level_name == level_name:
                lvl.attempts += 1
                if lvl.time_passed > time_passed:
                    lvl.time_passed = time_passed
                found = True
                break 
        
        if not found:
            user.level_passed.append(LevelMetaInfo(
                level_name = level_name,
                time_passed = time_passed, 
                help_number_used = help_number_used,
                clicks_num = clicks_num,
                attempts = 1,
            ))

        await User.find_one(User.id == user.id).update(
                {
                    "$set": {User.level_passed: user.level_passed}
                }
            )
        return user.level_passed

    async def get_levels_info(self, user_id: PydanticObjectId):
        user = await User.get(user_id)
        return user.level_passed 
    
    async def get_board_for_level(self, level_name: str) -> list[LevelLeaderboardResp]:
        users = await User.find_all().to_list()
        result: list[LevelLeaderboardResp] = []
        for user in users:
            if user.level_passed is None:
                continue
            for lvl in user.level_passed:
                if lvl.level_name == level_name:
                    result.append(
                        LevelLeaderboardResp(
                            user_id = user.id,
                            lvlInfo = lvl,
                        )
                    )
        return sorted(result, key=lambda x: x.lvlInfo.time_passed)

user_repository: UserRepository = UserRepository()
