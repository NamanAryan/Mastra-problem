# ChainSleuth 🔍  
### Explainable AML Detection & Transaction Flow Investigation System

ChainSleuth is a **RegTech-focused Anti-Money Laundering (AML) investigation platform** designed to analyze blockchain transaction data, detect suspicious fund movement patterns, and visually explain *why* a wallet is flagged.

Unlike black-box ML systems, ChainSleuth uses **deterministic, rule-based AML typologies**, making every detection **transparent, auditable, and explainable** — just like real-world compliance tools.

---

## 🚀 Key Capabilities

- 📊 **Transaction Network Visualization**
- 🧠 **Rule-based AML Pattern Detection**
- 🔍 **Case-level Investigation Dashboard**
- 📈 **Explainable Risk Scoring**
- 🧾 **Transaction Evidence & Audit Trail**
- 📤 **Exportable Investigation Summary**

Built for **analysts, auditors, and compliance teams**.

---

## 🧠 AML Patterns Detected (No ML)

ChainSleuth detects industry-standard AML typologies using graph analysis and temporal rules:

| Pattern | Description |
|------|------------|
| **Fan-Out** | One wallet distributes funds to many wallets |
| **Fan-In** | Many wallets consolidate funds into one wallet |
| **Circular Transactions** | Funds loop through wallets and return to origin |
| **Layering** | Funds routed through multiple intermediaries to obfuscate origin |
| **Structuring (Smurfing)** | Large value split into many small transfers |
| **Rapid Pass-Through** | Funds quickly received and sent onward |
| **Peel Chain** | Repeated small amounts peeled off across wallets |
| **Mixer Interaction** | Transactions involving known mixer contracts |
| **High-Volume Velocity** | Abnormally fast or high-value movements |

Each pattern is **deterministically detected**, time-bounded, and explainable.

---

## 🧮 Risk Scoring (Explainable)

Every wallet receives a **risk score (0–100)** based on detected patterns.
Example:
Circular Transaction Loop +35
Fan-Out Behavior +20
High Velocity Transfers +18

Total Risk Score 73 / 100


✔ No probabilistic scores  
✔ Fully auditable  
✔ Pattern-attributed scoring

---

## 🖥️ Application Flow

### 1️⃣ Projects (Investigation Hub)
- Create and manage investigations
- Track datasets, time ranges, and status
- View aggregated statistics

### 2️⃣ Investigation Dashboard
- Central **transaction network graph**
- Color-coded wallets by risk
- Interactive zoom, pan, and focus

### 3️⃣ Pattern Analysis
- List of detected suspicious patterns
- Click any pattern to:
  - Isolate its subgraph
  - Highlight exact laundering structure
  - View plain-English explanation

### 4️⃣ Wallet Details
- Address & metadata
- Risk score + breakdown
- Inflow / outflow stats
- Detected patterns

### 5️⃣ Evidence & Export
- Key transactions displayed for verification
- Export investigation summary (JSON)

---

## 🧩 Architecture & Tech Stack

### Frontend
- **React + TypeScript**
- **react-force-graph** (network visualization)
- Dark, analyst-grade UI
- Pattern-driven state management

### Backend
- **FastAPI**
- Rule-based graph & temporal analysis
- Deterministic AML logic
- REST APIs for analysis results

### Database & Auth
- **Supabase**
  - Authentication
  - Project metadata
  - CRUD operations

---

## 🔄 Data Flow

1. User creates a **project**
2. Transaction dataset is analyzed by backend
3. AML patterns are detected using rule-based logic
4. Backend returns:
   - Wallets
   - Transactions
   - Patterns
   - Risk scores
5. Frontend renders:
   - Network graph
   - Pattern explanations
   - Evidence & summaries

---

## 🛡️ Why Rule-Based (Not ML)?

ChainSleuth intentionally avoids ML for this phase.

**Why?**
- ✔ Explainability (critical for compliance)
- ✔ Deterministic & reproducible results
- ✔ Easier audit & regulator trust
- ✔ Clear reasoning for judges & reviewers

> “We prioritize explainable AML typologies before introducing machine learning.”

ML can be layered later — the architecture supports it.

---

## 📤 Exported Investigation Summary

Each investigation can be exported containing:
- Wallet address
- Risk score & breakdown
- Detected patterns
- Key transaction evidence
- Time windows

Designed for **audit reports and compliance reviews**.

---

## 🎯 Use Cases

- Blockchain AML monitoring
- DeFi transaction analysis
- Compliance & forensic investigations
- Academic & hackathon demos
- RegTech product prototyping

---

## 🧠 Future Enhancements

- ML-assisted anomaly detection (optional layer)
- Cross-chain analysis
- SAR (Suspicious Activity Report) generation
- Role-based analyst access
- Real-time monitoring

---

## 🏁 Status

✅ Core AML engine complete  
✅ Analyst dashboard complete  
✅ Explainability & evidence layer complete  

