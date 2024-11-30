from src.storages.mongo.auto import AutoInfo, Auto, AutoMetaInfo

class AutoRepository:
    async def create(self, autos: AutoInfo) -> AutoInfo:
        to_create = Auto(**autos.model_dump())
        return await to_create.insert()


    async def get_all(self) -> list[Auto]:
        """Get all Auto documents."""
        return await Auto.find_all().to_list()

    async def get_by_id(self, auto_id: str) -> Auto | None:
        """Get an Auto document by its ID."""
        return await Auto.get(auto_id)
    
auto_repository = AutoRepository()