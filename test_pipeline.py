import asyncio
import json
from pathlib import Path
import sys

# Ensure current directory is in path so imports work smoothly
sys.path.append(str(Path(__file__).parent))

from graph import run_pipeline


# 1. Define a mock async callback to stream agent events
async def mock_agent_callback(event: dict):
    """Captures and formats streaming logs from running pipeline agents."""
    agent = event.get("agent", "unknown").upper()
    status = event.get("status", "running")
    message = event.get("message", "")
    
    # Color-coded console logs for readability
    if status == "started" or status == "starting":
        print(f"▶️ [\033[94m{agent}\033[0m] {message}")
    elif status == "complete":
        print(f"✅ [\033[92m{agent}\033[0m] {message}")
        # Print summary if available
        if "summary" in event:
            print(f"   Summary: {json.dumps(event['summary'], indent=2)}")
    elif status == "error":
        print(f"❌ [\033[91m{agent}\033[0m] {message}")
    else:
        print(f"   └── {message}")


# 2. Setup mock files for real extraction path testing
def create_mock_documents():
    """Generates clean dummy files to prevent file-not-found crashes during real tests."""
    docs_dir = Path("test_docs")
    docs_dir.mkdir(exist_ok=True)
    
    pdf_path = docs_dir / "sample_salary_slip.pdf"
    img_path = docs_dir / "pan_card.png"
    
    # Write empty content just to establish standard file structures
    if not pdf_path.exists():
        pdf_path.write_text("%PDF-1.5 dummy content for structural checking")
    if not img_path.exists():
        img_path.write_bytes(b"dummy image bytes")
        
    return [str(pdf_path), str(img_path)]


# 3. Test Cases Execution Environment
async def main():
    print("=" * 70)
    print("🚀 STARTING LOANIQ MULTI-AGENT PIPELINE AUTOMATED TEST SUITE")
    print("=" * 70 + "\n")

    # ─────────────────────────────────────────────────────────────────────────
    # CASE 1: Test Demo Pipeline (Ravi Shankar Mehta)
    # ─────────────────────────────────────────────────────────────────────────
    print("\n🔹 CASE 1: Testing Pipeline in Demo Mode (Hardcoded Data Paths)")
    print("-" * 70)
    
    demo_state = await run_pipeline(
        session_id="demo-session-2026",
        file_paths=[],
        callback=mock_agent_callback,
        is_demo=True,
        loan_amount=1500000,
        loan_tenure_months=84,
        loan_purpose="Working Capital expansion"
    )
    
    print("\n🏁 Case 1 Pipeline Final Recommendation:")
    if demo_state["decision_data"]:
        print(f"\033[93m{demo_state['decision_data']['recommendation']}\033[0m")
        print("\n📝 Snippet of generated XAI Report:")
        # Print first 15 lines of the markdown report
        lines = demo_state['decision_data']['report_text'].split('\n')
        print("\n".join(lines[:14]))
    else:
        print("❌ Report generation failed.")

    # ─────────────────────────────────────────────────────────────────────────
    # CASE 2: Test Real Upload Pipeline with Unreadable/Empty Files
    # ─────────────────────────────────────────────────────────────────────────
    print("\n\n🔹 CASE 2: Testing Real Upload Mode (Edge Case: Empty/Unreadable Files)")
    print("-" * 70)
    
    mock_files = create_mock_documents()
    
    real_state = await run_pipeline(
        session_id="real-session-2026",
        file_paths=mock_files,
        callback=mock_agent_callback,
        is_demo=False,
        loan_amount=500000,
        loan_tenure_months=36,
        loan_purpose="Personal Emergency Loan"
    )
    
    print("\n🏁 Case 2 Pipeline Final Recommendation:")
    if real_state["decision_data"]:
        print(f"\033[91m{real_state['decision_data']['recommendation']}\033[0m")
        print(f"Compliance Score: {real_state['compliance_data']['compliance_score']}%")
        print(f"Blocking Issues Found: {real_state['compliance_data']['failed_blocking']}")
    else:
         print(f"❌ Pipeline failed with internal runtime exception: {real_state.get('error')}")

    print("\n" + "=" * 70)
    print("✅ LOANIQ PIPELINE INTEGRATION TEST RUN COMPLETE")
    print("=" * 70)


if __name__ == "__main__":
    asyncio.run(main())