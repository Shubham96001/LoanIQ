import asyncio
from typing import TypedDict, Optional

from agents.document_agent import run_document_agent
from agents.risk_agent import run_risk_agent
from agents.compliance_agent import run_compliance_agent
from agents.decision_agent import run_decision_agent


class LoanState(TypedDict):
    session_id: str
    file_paths: list
    is_demo: bool
    loan_amount: int
    loan_tenure_months: int
    loan_purpose: str
    document_data: Optional[dict]
    risk_data: Optional[dict]
    compliance_data: Optional[dict]
    decision_data: Optional[dict]
    error: Optional[str]


async def run_pipeline(
    session_id: str,
    file_paths: list,
    callback,
    is_demo: bool = False,
    loan_amount: int = 0,
    loan_tenure_months: int = 60,
    loan_purpose: str = "Personal Loan",
):
    """
    Run the full 4-agent LangGraph pipeline.
    - is_demo=True  → uses hardcoded Ravi demo data (no files needed)
    - is_demo=False → real extraction from uploaded file_paths
    """
    state: LoanState = {
        "session_id": session_id,
        "file_paths": file_paths,
        "is_demo": is_demo,
        "loan_amount": loan_amount,
        "loan_tenure_months": loan_tenure_months,
        "loan_purpose": loan_purpose,
        "document_data": None,
        "risk_data": None,
        "compliance_data": None,
        "decision_data": None,
        "error": None,
    }

    await callback({
        "agent": "pipeline",
        "status": "started",
        "message": "🚀 LoanIQ pipeline initiated — 4 agents queued",
        "session_id": session_id,
        "is_demo": is_demo,
    })

    try:
        # ── Node 1: Document Agent ─────────────────────────────────────────────
        await callback({"agent": "document", "status": "starting",
                        "message": "Document Intelligence Agent activated",
                        "session_id": session_id})

        state["document_data"] = await run_document_agent(
            session_id=session_id,
            file_paths=file_paths,
            callback=callback,
            loan_amount=loan_amount,
            loan_tenure_months=loan_tenure_months,
            loan_purpose=loan_purpose,
            is_demo=is_demo,
        )

        # ── Node 2: Risk Agent ─────────────────────────────────────────────────
        await callback({"agent": "risk", "status": "starting",
                        "message": "Risk Assessment Agent activated",
                        "session_id": session_id})

        state["risk_data"] = await run_risk_agent(
            session_id, state["document_data"], callback
        )

        # ── Node 3: Compliance Agent ───────────────────────────────────────────
        await callback({"agent": "compliance", "status": "starting",
                        "message": "Compliance Verification Agent activated",
                        "session_id": session_id})

        state["compliance_data"] = await run_compliance_agent(
            session_id, state["document_data"], state["risk_data"], callback
        )

        # ── Conditional routing: blocking compliance → decision still runs ─────
        # ── Node 4: Decision Agent ─────────────────────────────────────────────
        await callback({"agent": "decision", "status": "starting",
                        "message": "Decision Intelligence Agent activated",
                        "session_id": session_id})

        state["decision_data"] = await run_decision_agent(
            session_id,
            state["document_data"],
            state["risk_data"],
            state["compliance_data"],
            callback,
        )

        # ── Pipeline complete ──────────────────────────────────────────────────
        await callback({
            "agent": "pipeline",
            "status": "complete",
            "message": "✅ All agents complete — Report ready for bank officer review",
            "session_id": session_id,
            "final_state": {
                "document": state["document_data"],
                "risk": state["risk_data"],
                "compliance": state["compliance_data"],
                "decision": state["decision_data"],
            },
        })

    except Exception as e:
        import traceback
        state["error"] = str(e)
        await callback({
            "agent": "pipeline",
            "status": "error",
            "message": f"Pipeline error: {str(e)}",
            "session_id": session_id,
        })
        traceback.print_exc()

    return state