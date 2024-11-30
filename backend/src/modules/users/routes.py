from fastapi import APIRouter, Request

from src.api.dependencies import USER_AUTH
from src.api.exceptions import IncorrectCredentialsException
from src.modules.users.repository import user_repository
from src.modules.users.schemas import ViewUser, AddResultReq, LevelLeaderboardResp
from src.storages.mongo.users import LevelMetaInfo

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    responses={
        **IncorrectCredentialsException.responses,
    },
)


@router.get("/me", responses={200: {"description": "Current user info"}})
async def get_me(auth: USER_AUTH) -> ViewUser:
    """
    Get current user info if authenticated
    """

    user = await user_repository.read(auth.user_id)
    return user


@router.post(
    "/register",
    responses={200: {"description": "Successfully registered"}},
)
async def register_by_credentials(login: str, password: str, request: Request) -> None:
    """
    Register using credentials
    """
    from src.modules.users.schemas import CreateUser

    user = CreateUser(login=login, password=password)
    created = await user_repository.create(user)
    request.session["uid"] = str(created.id)


@router.post(
    "/login",
    responses={200: {"description": "Successfully logged in (session updated)"}},
)
async def login_by_credentials(login: str, password: str, request: Request) -> None:
    """
    Login using credentials
    """
    from src.modules.login_and_password.repository import login_password_repository

    verification_result = await login_password_repository.verify_credentials(login, password)
    if verification_result is None:
        request.session.clear()
        raise IncorrectCredentialsException()

    request.session["uid"] = str(verification_result.user_id)


@router.post(
    "/logout",
    responses={200: {"description": "Successfully logged out (session cleared)"}},
)
async def logout(request: Request) -> None:
    """
    Logout (clear session)
    """
    request.session.clear()
    return None

@router.post(
    "/result",
    responses={200: {"description": "Result was added successfully"}}
)
async def add_result(request: AddResultReq, user: USER_AUTH) -> list[LevelMetaInfo] | None:
    """
    
    Add result to user; if not exist will create it 
    """
    return await user_repository.upsert_level_info(user.user_id, request.level_name, request.time_passed, request.help_number_used, request.clicks_num)

@router.get(
    "/result"
)
async def get_results(user: USER_AUTH) -> list[LevelMetaInfo] | None:
    return await user_repository.get_levels_info(user.user_id)

@router.get(
    "/result/{level_name}"
)
async def get_results_by_level_name(level_name: str) -> list[LevelLeaderboardResp]:
    return await user_repository.get_board_for_level(level_name)