from datetime import datetime
from typing import Any

from sqlalchemy import select

from ..database.connection import AsyncSessionLocal, get_mongo_db
from ..database.models import LoanApplication, PipelineCheckpoint


async def save_checkpoint(state: dict[str, Any], status: str = "running", officer_id: str | None = None) -> None:
    async with AsyncSessionLocal() as db:
        checkpoint = await db.get(PipelineCheckpoint, state["pipeline_id"])
        if checkpoint is None:
            checkpoint = PipelineCheckpoint(pipeline_id=state["pipeline_id"])
            db.add(checkpoint)
        checkpoint.state_json = state
        checkpoint.status = status
        checkpoint.officer_id = officer_id or checkpoint.officer_id
        checkpoint.updated_at = datetime.utcnow()
        await db.commit()

    mongo_db = get_mongo_db()
    if mongo_db is not None:
        await mongo_db.pipeline_reports.replace_one(
            {"pipeline_id": state["pipeline_id"]},
            {"pipeline_id": state["pipeline_id"], "state": state, "status": status, "updated_at": datetime.utcnow()},
            upsert=True,
        )


async def load_checkpoint(pipeline_id: str) -> dict[str, Any] | None:
    async with AsyncSessionLocal() as db:
        checkpoint = await db.get(PipelineCheckpoint, pipeline_id)
        return checkpoint.state_json if checkpoint else None


async def update_application_status(pipeline_id: str, status: str) -> None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(LoanApplication).where(LoanApplication.pipeline_id == pipeline_id))
        application = result.scalars().first()
        if application:
            application.status = status
            application.updated_at = datetime.utcnow()
            await db.commit()
