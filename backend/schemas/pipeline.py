from typing import Any, Literal, NotRequired, TypedDict

from pydantic import BaseModel


class LoanPipelineState(TypedDict):
    pipeline_id: str
    applicant_email: str
    file_paths: list[str]
    loan_amount: float
    loan_tenure_months: int
    loan_purpose: str
    document_data: dict[str, Any] | None
    risk_data: dict[str, Any] | None
    compliance_data: dict[str, Any] | None
    decision_data: dict[str, Any] | None
    extraction_confidence: Literal["ok", "low"]
    hallucination_flag: bool
    manual_review: bool
    human_decision: str | None
    agent_logs: list[dict[str, Any]]
    error: str | None
    created_at: str
    updated_at: str
    is_demo: NotRequired[bool]


class AgentResult(BaseModel):
    agent: str
    status: str
    data: dict[str, Any] | None = None
    message: str | None = None


class PipelineRunRequest(BaseModel):
    pipeline_id: str
    is_demo: bool = False
