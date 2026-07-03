from typing import Any

from ..services.persistence import load_checkpoint, save_checkpoint


class AsyncCheckpointStore:
    async def save(self, state: dict[str, Any], status: str = "running") -> None:
        await save_checkpoint(state, status=status)

    async def load(self, pipeline_id: str) -> dict[str, Any] | None:
        return await load_checkpoint(pipeline_id)
