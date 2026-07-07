<img width="64" height="64" alt="image" src="https://github.com/user-attachments/assets/5c17d2d7-9b5a-4fdd-ac4d-0bd8357cf1e6" />



# KYRA — Decentralized Banking Trust Infrastructure (Backend PoC)

**Keep Your Records Always — One Identity, Infinite Trust**

KYRA is a blockchain-powered trust infrastructure for decentralized banking. This repository contains the backend proof-of-concept (PoC) — a standalone technical demo verifying the core trust layer: **Decentralized Identity (DID)** + **Verifiable Credentials** + **Privacy-Preserving Proofs (AnonCreds)** + **Cross-Chain / Off-Chain Synchronization (Mock Chainlink CCIP)**.

> This is a prototype. It runs entirely in Docker containers and Python on a single Ubuntu VM, and is not connected to the KYRA frontend. It is not production-hardened — see [Notes](#notes) below.

---

## Story Demonstrated

1. **Identity Setup** — The customer and bank register their decentralized identities (DIDs) on a local Hyperledger Indy ledger.
2. **DIDComm Connection** — The Customer (Holder) and Bank (Issuer/Verifier) establish a secure DIDComm connection.
3. **KYC Issuance** — The Bank issues a "KYC Verified" credential to the Customer's wallet once.
4. **Zero-Knowledge Proof (Selective Disclosure)** — The Customer presents a selective-disclosure proof (proving `kyc_status = verified` and `age >= 18` without disclosing `name` or `document_number`) back to the Bank.
5. **Off-Chain Synchronization (Mock CCIP)** — A mock CCIP adapter captures the verification event, generates a transaction hash, and syncs the verification status to the bank's Core Banking System (CBS) database and audit trail.

---

## System Architecture
<img width="1672" height="940" alt="arch diagram" src="https://github.com/user-attachments/assets/dc761afb-6a19-4b4b-a4cc-ac78f03f11ba" />



## Folder Structure

```
├── .github/
│   └── workflows/
│       └── ci.yml        # GitHub Actions CI pipeline (lint + docker verify)
├── cli/
│   ├── kyra.py            # CLI tool to run the step-by-step or full demo
│   └── benchmark.py       # Automated latency and performance profiling script
├── controller/
│   ├── app.py              # FastAPI coordinator & CCIP mock adapter
│   ├── database.py         # SQLite CBS database logic
│   ├── audit.py             # Audit logging logic
│   ├── Dockerfile
│   └── requirements.txt
├── docker-compose.yml     # Runs ACA-Py agents and coordinator FastAPI app
├── von-network/            # Local Indy ledger (cloned subdirectory)
├── cbs.db                    # Auto-generated SQLite CBS database (host-mounted)
├── audit.log                  # Auto-generated audit trail (host-mounted)
├── docs/
│   └── screenshots/       # Demo screenshots (see below)
├── .gitignore
└── README.md
```

---

## Prerequisites

- Ubuntu 20.04+ (or WSL2 on Windows)
- Docker & Docker Compose
- Python 3.9+
- Git

---

## Step-by-Step Execution Guide

### Step 1: Start the Local Indy Ledger

We use `von-network` (a 4-node Indy ledger pool and web server running in Docker).

1. Change into the `von-network` directory:
   ```bash
   cd von-network
   ```
2. Build the base image for the ledger (required once):
   ```bash
   sudo ./manage build
   ```
3. Start the ledger pool (4 ledger nodes + webserver on port `9000`):
   ```bash
   sudo ./manage start --wait
   ```
4. Verify the ledger is running via the ledger explorer:
   👉 **`http://localhost:9000`**

---

### Step 2: Start the Agents and Coordinator App

Open a new terminal tab and return to the project root:
```bash
cd ..
```

1. **Host-volume pre-creation** — ensures Docker mounts the database and log file correctly as files, not directories:
   ```bash
   rm -rf audit.log cbs.db && touch audit.log cbs.db
   ```

2. Build and start the Bank Agent, Customer Agent, and Controller coordinator:
   ```bash
   sudo docker compose build controller
   sudo docker compose up -d
   ```

3. Confirm all containers are healthy:
   ```bash
   sudo docker compose ps
   ```

---

### Step 3: Run the Demo Flow

#### Option A — Full End-to-End Demo (recommended)
```bash
python3 cli/kyra.py full-flow
```
This sequentially:
1. Registers DIDs on-chain
2. Establishes the connection between agents
3. Registers the schema and credential definition on-ledger
4. Issues the credential from Bank to Customer
5. Requests and verifies the selective-disclosure proof
6. Triggers the mock CCIP adapter to write the record to `cbs.db` and log the audit trail in `audit.log`

#### Option B — Step-by-Step Execution
```bash
python3 cli/kyra.py setup
python3 cli/kyra.py issue --name "Alice Smith" --age 25 --status "verified"
python3 cli/kyra.py request-proof
python3 cli/kyra.py sync-status
python3 cli/kyra.py logs
```

---

## Performance & Benchmarking

An automated performance runner profiles execution latencies and throughput:
```bash
python3 cli/benchmark.py
```
Profiles:
- System setup time (DID registrations + connection setup + credential definition)
- Credential issuance latency
- Zero-knowledge selective-disclosure verification latency
- Min/Max/Mean latencies and transactions-per-second, saved to `performance_report.md`

---

## Technical Architecture Details

### 1. Webhook-Driven Completion
ACA-Py agents process lifecycle actions asynchronously. A common race condition occurs when credential records are deleted by the agent (`auto_remove: true`) before the coordinator can poll them.

The controller uses a **webhook-driven state model** (`controller/app.py`) — webhook callbacks signal state transitions (e.g. `issuer` role reaching state `done`) directly to the controller's in-memory cache, allowing safe, immediate verification without failing due to agent record cleanup.

### 2. Zero-Knowledge Proofs (AnonCreds)
When requesting verification, the Bank specifies schema attributes and predicates:
- `kyc_status` = "verified" (attribute disclosure)
- `age` >= 18 (predicate verification)

The Customer's wallet generates a cryptographic proof using their private link secret, verified against public keys on the Indy ledger. Name and document numbers are never transmitted.

### 3. Mock Chainlink CCIP Synchronization
The controller implements a webhook receiver at `/webhooks/topic/present_proof_v2_0` that reacts to the verification event:
- Captures the verified presentation
- Generates a mock 256-bit transaction hash (simulating on-chain CCIP message routing)
- Writes the transaction record and verification properties to the SQLite database (`cbs.db`) and audit file (`audit.log`)

---

## Screenshots
1. Blockchain Backend - Registration, KYC, ZK Proof, Database for credentials
<img width="1483" height="882" alt="Screenshot 2026-07-07 233603" src="https://github.com/user-attachments/assets/f65dc804-7da5-4e16-a320-bda2038adbe8" />
2. KYRA Assistant ChatBot - (paste your API key in YOUR_API_KEY=" " to get responce)
<img width="1900" height="1078" alt="Screenshot 2026-07-07 234321" src="https://github.com/user-attachments/assets/9615680c-f7f3-40ff-9957-5e71957de0c2" />
3. Benchmarking of Ledgers
<img width="1815" height="975" alt="Screenshot 2026-07-08 000144" src="https://github.com/user-attachments/assets/34b3a342-fdb3-4341-b5a7-a414b682a92f" />
4. Web3 Based Digilocker, no requirement of physical documents, Just use your Web3 wallet and move fast ✔️
<img width="1892" height="868" alt="image" src="https://github.com/user-attachments/assets/05367a03-c88d-4e8c-8c75-7bfb23764f0a" />




---

## Notes

- This is a **prototype**, not production-ready. Live CCIP integration (testnet/mainnet), key management, and security hardening are out of scope for this demo.
- The off-chain sync is mocked — it represents where a real Core Banking System (CBS) integration would occur.
- The frontend (Lovable-built UI) lives in a this repository and whereas backend is not wired to this repository.

---

## Future Development

- Live Chainlink CCIP integration (testnet/mainnet)
- Multi-bank interoperability
- Production-grade key management and security audit
- Expanded credential types (income, address, employment proof)
- Crypto-to-fiat currency exchange within the Web3 wallet

---

This Project is Made by 
Harshal Gupta 
  Github - https://github.com/Guptaharshal1515
  Linkedin - https://www.linkedin.com/in/harshal-gupta-a27914287/
