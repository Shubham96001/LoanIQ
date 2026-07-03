import asyncio
from datetime import datetime
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from ..services.notification import push_decision
from ..services.persistence import load_checkpoint, save_checkpoint, update_application_status

router = APIRouter(prefix="/api", tags=["officer"])


class DecisionRequest(BaseModel):
    action: Literal["Approve", "Reject"]
    officer_id: str


@router.get("/officer/{pipeline_id}/report")
async def stream_report(pipeline_id: str):
    state = await load_checkpoint(pipeline_id)
    if state is None:
        raise HTTPException(status_code=404, detail="pipeline not found")
    report = ((state.get("decision_data") or {}).get("report_text") or "Report is not ready.").split()

    async def events():
        for word in report:
            yield {"event": "word", "data": word}
            await asyncio.sleep(0.02)
        yield {"event": "done", "data": pipeline_id}

    return EventSourceResponse(events())


@router.post("/decision/{pipeline_id}")
async def decide(pipeline_id: str, payload: DecisionRequest):
    state = await load_checkpoint(pipeline_id)
    if state is None:
        raise HTTPException(status_code=404, detail="pipeline not found")

    state["human_decision"] = payload.action
    status = "complete" if payload.action == "Approve" else "rejected"
    await save_checkpoint(state, status=status, officer_id=payload.officer_id)
    await update_application_status(pipeline_id, "Approved" if payload.action == "Approve" else "Rejected")

    decision_payload = {
        "pipeline_id": pipeline_id,
        "applicant_email": state.get("applicant_email"),
        "decision": payload.action,
        "officer_id": payload.officer_id,
        "decided_at": datetime.utcnow().isoformat(),
        "decision_letter_markdown": (state.get("decision_data") or {}).get("report_text", ""),
    }
    webhook = await push_decision(decision_payload)
    return {**decision_payload, "webhook": webhook}
