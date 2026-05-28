# 🚀 LoanIQ: AI-Powered Smart Loan Approvals
Use AI to speed up and standardize loan decisions by  auto-checking documents, risk, and compliance. 

LoanIQ is a smart, multi-agent AI system designed to speed up and standardize bank loan decisions. By automating document verification, risk calculations, and compliance audits, it compresses traditional loan processing times from 11 days down to under 10 minutes. Our main focus is helping MSMEs (Micro, Small, and Medium Enterprises) who often lose out on business contracts because traditional bank approvals take too long.

💡 Why This Project?
- Eliminates the Wait: Cuts total loan processing from weeks to minutes, and reduces an officer's file review time from 4 hours to just 15 minutes.
- Reduces Burnout & Costs: Drops manual underwriting costs by 60% and frees bank officers from manual paperwork data-entry.
- Fair Credit Distribution: Stops implicit credit discrimination by evaluating thin-file borrowers transparently using digital data patterns (GST, UPI, and cash flows).

🛠️ How It Works (The Core System)
Instead of using a basic step-by-step automation script, LoanIQ uses an Agentic Framework (built with LangGraph). Think of it as a digital team of specialized AI agents working together:
📄 Document Agent: Automatically reads digital files and images (handles both English and Hindi). It extracts income, assets, and liabilities, and checks if documents are genuine.
📊 Risk Agent: Automatically calculates critical banking risk metrics (like DSCR and FOIR) and groups applications into low, medium, or high-risk categories.
⚖️ Compliance Agent: Instantly checks the application against banking rules and guidelines. Best part? Rules are stored in easy-to-edit YAML files, meaning compliance updates take 90 seconds without changing code.
🤖 Decision Agent (Explainable AI): Creates a full recommendation report. Unlike "black box" AI, this agent gives clear, written reasons for approving or rejecting a file.
🧑‍✈️ Human-in-the-Loop: The AI does the heavy lifting, summaries, and calculations, but the final judgment and legal accountability always belong to the human Bank Manager.

🗺️ Project Roadmap
Phase 1 (V1 MVP): Set up a safe "shadow mode" using standard digital PDFs (English/Hindi data extraction).
Phase 2 (V2 Expansion): Integrate live APIs for GST/UPI data and add Google Document AI to process handwritten applications.
Phase 3 (V3 Scale): Scale to underserved rural markets by adding support for regional languages (Tamil, Telugu, Marathi).
