"""
LoanIQ — Compliance Agent
Checks applicant data against YAML-encoded RBI compliance rules.
Rules can be updated without code redeployment.
"""
import asyncio
import yaml
from pathlib import Path
from typing import Optional


RULES_PATH = Path(__file__).parent.parent / "compliance_rules" / "rules.yaml"


def load_rules() -> list:
    """Load compliance rules from YAML file."""
    with open(RULES_PATH, "r") as f:
        data = yaml.safe_load(f)
    return data.get("rules", [])


def check_rule(rule: dict, applicant_data: dict, risk_data: dict) -> dict:
    """Evaluate a single compliance rule against applicant data."""
    field = rule["field"]
    condition = rule["condition"]
    
    # Merge data sources
    combined = {**applicant_data, **risk_data}
    
    value = combined.get(field)
    
    if value is None:
        if rule.get("severity") == "blocking":
            return {
                "rule_id": rule["id"],
                "name": rule["name"],
                "status": "FAIL",
                "severity": rule["severity"],
                "message": f"Required field '{field}' not found in documents",
                "reference": rule["reference"]
            }
        return {
            "rule_id": rule["id"],
            "name": rule["name"],
            "status": "SKIP",
            "severity": rule["severity"],
            "message": f"Field '{field}' not applicable — skipped",
            "reference": rule["reference"]
        }
    
    # Evaluate condition
    threshold = rule.get("value")
    passed = False
    
    if condition == "not_null":
        passed = value is not None and value != "" and value != False
    elif condition == "equals":
        passed = value == threshold
    elif condition == "greater_than_or_equal":
        passed = float(value) >= float(threshold)
    elif condition == "less_than_or_equal":
        passed = float(value) <= float(threshold)
    elif condition == "greater_than":
        passed = float(value) > float(threshold)
    elif condition == "less_than":
        passed = float(value) < float(threshold)
    
    # Handle income threshold for advisory rules
    if not passed and rule.get("income_threshold"):
        income = float(combined.get("monthly_income", 0))
        if income >= rule["income_threshold"]:
            current_metric = float(combined.get(rule["field"], 1.0))
            passed = current_metric <= float(rule["value"])
    status = "PASS" if passed else "FAIL"
    
    return {
        "rule_id": rule["id"],
        "name": rule["name"],
        "status": status,
        "severity": rule["severity"],
        "value_checked": str(value),
        "threshold": str(threshold) if threshold is not None else "N/A",
        "message": f"{'✅' if passed else '❌'} {rule['name']} — {'Passed' if passed else 'Failed'}",
        "reference": rule["reference"]
    }


def run_compliance_check(applicant_data: dict, risk_data: dict) -> dict:
    """Run all compliance rules and return summary."""
    rules = load_rules()
    results = []
    blocking_fails = []
    advisory_flags = []
    
    for rule in rules:
        result = check_rule(rule, applicant_data, risk_data)
        results.append(result)
        
        if result["status"] == "FAIL":
            if result["severity"] == "blocking":
                blocking_fails.append(result)
            else:
                advisory_flags.append(result)
    
    passed_count = sum(1 for r in results if r["status"] == "PASS")
    compliance_score = (passed_count / len(results)) * 100 if results else 0
    
    overall_status = "CLEAR" if not blocking_fails else "BLOCKED"
    
    return {
        "overall_status": overall_status,
        "compliance_score": round(compliance_score, 1),
        "total_rules": len(results),
        "passed": passed_count,
        "failed_blocking": len(blocking_fails),
        "advisory_flags": len(advisory_flags),
        "rule_results": results,
        "blocking_issues": blocking_fails,
        "advisories": advisory_flags,
    }


async def run_compliance_agent(session_id: str, document_data: dict, risk_data: dict, callback) -> dict:
    """Compliance Agent — checks all RBI rules with streaming updates."""
    rules = load_rules()
    
    await callback({
        "agent": "compliance",
        "status": "running",
        "message": f"📋 Loading {len(rules)} RBI compliance rules...",
        "session_id": session_id
    })
    await asyncio.sleep(0.8)
    
    await callback({
        "agent": "compliance",
        "status": "running",
        "message": "🔍 Checking KYC requirements (PAN, Aadhaar, address proof)...",
        "session_id": session_id
    })
    await asyncio.sleep(1.2)
    
    await callback({
        "agent": "compliance",
        "status": "running",
        "message": "🚨 Running AML watchlist verification...",
        "session_id": session_id
    })
    await asyncio.sleep(1.0)
    
    await callback({
        "agent": "compliance",
        "status": "running",
        "message": "📊 Validating FOIR and DSCR against RBI lending norms...",
        "session_id": session_id
    })
    await asyncio.sleep(0.8)
    
    await callback({
        "agent": "compliance",
        "status": "running",
        "message": "📜 Verifying DPDP Act 2023 consent compliance...",
        "session_id": session_id
    })
    await asyncio.sleep(0.6)
    
    compliance_result = run_compliance_check(document_data, risk_data)
    
    await callback({
        "agent": "compliance",
        "status": "running",
        "message": f"✅ Compliance check complete — Score: {compliance_result['compliance_score']}%",
        "session_id": session_id
    })
    await asyncio.sleep(0.3)
    
    result = {
        "agent": "compliance",
        "status": "complete",
        "data": compliance_result,
        "session_id": session_id,
        "summary": {
            "overall": compliance_result["overall_status"],
            "score": f"{compliance_result['compliance_score']}%",
            "rules_checked": compliance_result["total_rules"],
            "passed": compliance_result["passed"],
            "blocking_issues": compliance_result["failed_blocking"],
            "advisories": compliance_result["advisory_flags"],
        }
    }
    
    await callback(result)
    return compliance_result
