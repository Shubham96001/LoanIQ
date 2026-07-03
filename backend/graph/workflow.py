import asyncio
import re
import tempfile
from datetime import datetime
from pathlib import Path
from typing import Any, Awaitable, Callable

from ..services.compliance_agent import run_compliance_agent
from ..services.decision_agent import run_decision_agent
from ..services.doc_agent import run_document_agent
from ..services.risk_agent import run_risk_agent
from ..services.persistence import save_checkpoint
from ..services.storage import decrypt_file
from .state import LoanPipelineState

PipelineCallback = Callable[[dict[str, Any]], Awaitable[None]]

try:
    from langgraph.graph import END, START, StateGraph
except Exception:  # pragma: no cover - keeps dev/demo usable without langgraph installed.
    END = START = None
    StateGraph = None


def now_iso() -> str:
    return datetime.utcnow().isoformat()


async def _emit(state: LoanPipelineState, callback: PipelineCallback | None, event: dict[str, Any]) -> None:
    state["agent_logs"].append(event)
    state["updated_at"] = now_iso()
    if callback:
        await callback(event)


def _flatten_keys(value: Any, prefix: str = "") -> set[str]:
    if isinstance(value, dict):
        keys: set[str] = set()
        for key, child in value.items():
            name = f"{prefix}.{key}" if prefix else str(key)
            keys.add(name)
            keys.update(_flatten_keys(child, name))
        return keys
    return set()


def validate_citations(report_text: str, state: LoanPipelineState) -> bool:
    known_fields = _flatten_keys(dict(state))
    known_fields.update(state.keys())
    for match in re.findall(r"\[SOURCE:\s*([\w.]+)\]", report_text):
        if match not in known_fields:
            return False
    return True


def build_initial_state(
    pipeline_id: str,
    applicant_email: str,
    file_paths: list[str],
    loan_amount: float,
    loan_tenure_months: int,
    loan_purpose: str,
    is_demo: bool = False,
) -> LoanPipelineState:
    timestamp = now_iso()
    return {
        "pipeline_id": pipeline_id,
        "applicant_email": applicant_email,
        "file_paths": file_paths,
        "loan_amount": loan_amount,
        "loan_tenure_months": loan_tenure_months,
        "loan_purpose": loan_purpose,
        "document_data": None,
        "risk_data": None,
        "compliance_data": None,
        "decision_data": None,
        "extraction_confidence": "ok",
        "hallucination_flag": False,
        "manual_review": False,
        "human_decision": None,
        "agent_logs": [],
        "error": None,
        "created_at": timestamp,
        "updated_at": timestamp,
        "is_demo": is_demo,
    }


async def _with_plaintext_files(state: LoanPipelineState) -> list[str]:
    plain_paths: list[str] = []
    for encrypted in state["file_paths"]:
        encrypted_path = Path(encrypted)
        if encrypted_path.suffix != ".enc":
            plain_paths.append(str(encrypted_path))
            continue
        suffix = encrypted_path.name.replace(".enc", "")
        target = Path(tempfile.gettempdir()) / f"{state['pipeline_id']}_{suffix}"
        target.write_bytes(decrypt_file(encrypted_path))
        plain_paths.append(str(target))
    return plain_paths


async def document_node(state: LoanPipelineState, callback: PipelineCallback | None = None) -> LoanPipelineState:
    await _emit(state, callback, {"agent": "document", "status": "starting", "pipeline_id": state["pipeline_id"]})
    plain_paths = await _with_plaintext_files(state)
    state["document_data"] = await run_document_agent(
        session_id=state["pipeline_id"],
        file_paths=plain_paths,
        callback=lambda event: _emit(state, callback, event),
        loan_amount=int(state["loan_amount"]),
        loan_tenure_months=state["loan_tenure_months"],
        loan_purpose=state["loan_purpose"],
        is_demo=state.get("is_demo", False),
    )
    confidence = float((state["document_data"] or {}).get("document_confidence", 0))
    state["extraction_confidence"] = "low" if confidence < 0.65 else "ok"
    state["manual_review"] = state["extraction_confidence"] == "low"
    await save_checkpoint(dict(state), "manual_review" if state["manual_review"] else "running")
    return state


async def risk_node(state: LoanPipelineState, callback: PipelineCallback | None = None) -> LoanPipelineState:
    state["risk_data"] = await run_risk_agent(state["pipeline_id"], state["document_data"] or {}, lambda e: _emit(state, callback, e))
    await save_checkpoint(dict(state), "running")
    return state


async def compliance_node(state: LoanPipelineState, callback: PipelineCallback | None = None) -> LoanPipelineState:
    state["compliance_data"] = await run_compliance_agent(
        state["pipeline_id"],
        state["document_data"] or {},
        state["risk_data"] or {},
        lambda e: _emit(state, callback, e),
    )
    await save_checkpoint(dict(state), "running")
    return state


async def decision_node(state: LoanPipelineState, callback: PipelineCallback | None = None) -> LoanPipelineState:
    state["decision_data"] = await run_decision_agent(
        state["pipeline_id"],
        state["document_data"] or {},
        state["risk_data"] or {},
        state["compliance_data"] or {},
        lambda e: _emit(state, callback, e),
    )
    report_text = (state["decision_data"] or {}).get("report_text", "")
    state["hallucination_flag"] = not validate_citations(report_text, state)
    state["manual_review"] = state["manual_review"] or state["hallucination_flag"]
    await save_checkpoint(dict(state), "manual_review" if state["manual_review"] else "paused")
    return state


async def manual_review_node(state: LoanPipelineState, callback: PipelineCallback | None = None) -> LoanPipelineState:
    state["manual_review"] = True
    await _emit(state, callback, {"agent": "pipeline", "status": "manual_review", "pipeline_id": state["pipeline_id"]})
    await save_checkpoint(dict(state), "manual_review")
    return state


async def human_checkpoint_node(state: LoanPipelineState, callback: PipelineCallback | None = None) -> LoanPipelineState:
    await _emit(state, callback, {"agent": "pipeline", "status": "paused", "message": "Awaiting officer decision", "pipeline_id": state["pipeline_id"]})
    await save_checkpoint(dict(state), "paused")
    return state


async def run_pipeline(state: LoanPipelineState, callback: PipelineCallback | None = None) -> LoanPipelineState:
    try:
        await _emit(state, callback, {"agent": "pipeline", "status": "started", "pipeline_id": state["pipeline_id"]})
        state = await document_node(state, callback)
        if state["manual_review"]:
            return await manual_review_node(state, callback)
        state = await risk_node(state, callback)
        state = await compliance_node(state, callback)
        state = await decision_node(state, callback)
        if state["manual_review"]:
            return await manual_review_node(state, callback)
        return await human_checkpoint_node(state, callback)
    except Exception as exc:
        state["error"] = str(exc)
        await _emit(state, callback, {"agent": "pipeline", "status": "error", "message": str(exc), "pipeline_id": state["pipeline_id"]})
        await save_checkpoint(dict(state), "error")
        return state


def build_langgraph():
    if StateGraph is None:
        return None
    graph = StateGraph(LoanPipelineState)
    graph.add_node("document_node", document_node)
    graph.add_node("risk_node", risk_node)
    graph.add_node("compliance_node", compliance_node)
    graph.add_node("decision_node", decision_node)
    graph.add_node("manual_review_node", manual_review_node)
    graph.add_node("human_checkpoint_node", human_checkpoint_node)
    graph.add_edge(START, "document_node")
    graph.add_conditional_edges("document_node", lambda s: "manual_review_node" if s["manual_review"] else "risk_node")
    graph.add_edge("risk_node", "compliance_node")
    graph.add_edge("compliance_node", "decision_node")
    graph.add_conditional_edges("decision_node", lambda s: "manual_review_node" if s["manual_review"] else "human_checkpoint_node")
    graph.add_edge("manual_review_node", END)
    graph.add_edge("human_checkpoint_node", END)
    return graph.compile()


def run_pipeline_background(state: LoanPipelineState, callback: PipelineCallback | None = None) -> None:
    asyncio.create_task(run_pipeline(state, callback))
