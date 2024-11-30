from fastapi import APIRouter, Request, HTTPException

from src.api.dependencies import USER_AUTH
from src.api.exceptions import IncorrectCredentialsException
from src.modules.auto.repository import auto_repository
from src.storages.mongo.auto import AutoInfo
from beanie import PydanticObjectId

router = APIRouter(
    prefix="/autos",
    tags=["Autos"],
    responses={
        **IncorrectCredentialsException.responses,
    },
)

@router.post("/", response_model=AutoInfo)
async def batch_create_autos(autos: AutoInfo):
    return await auto_repository.create(autos)

@router.get("/", response_model=list[AutoInfo])
async def get_all_autos():
    return await auto_repository.get_all()

@router.get("/{auto_id}", response_model=AutoInfo)
async def get_auto_by_id(auto_id: str):
    auto = await auto_repository.get_by_id(auto_id)
    if auto is None:
        raise HTTPException(status_code=404, detail="Auto not found")
    return auto