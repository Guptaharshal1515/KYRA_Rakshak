# KYRA Performance & Benchmarking Report

This report summarizes the end-to-end latency, throughput, and success rate of the decentralized identity operations run on the Hyperledger Indy/AnonCreds trust network.

## 1. System Setup Latency
* **Total Setup Time**: 6.48 seconds
  * *Includes: Ledger DID registration (2 DIDs), connection invitation creation/exchange, ledger schema registration, and credential definition creation.*

## 2. Core Operation Metrics

| Operation | Success Rate | Min Latency | Max Latency | Mean Latency | Throughput (TPS) |
|---|---|---|---|---|---|
| **KYC Credential Issuance** | 5/5 (100%) | 0.52s | 0.53s | 0.52s | 1.91 txn/sec |
| **ZK-Proof Verification** | 5/5 (100%) | 0.51s | 0.52s | 0.52s | 1.94 txn/sec |

## 3. Analysis & Key Observations
1. **Verifiable Credential Issuance** is fully automated using Aries v2.0 protocol. The average latency is ~0.5s, which includes cryptographic signature creation (CL signature), connection encryption, and holder storing validation.
2. **Zero-Knowledge Proof Verification** completes in ~0.5s. This operations generates and verifies AnonCreds cryptographic proofs (proving age >= 18 without revealing name or actual age), ensuring absolute data privacy.
3. **Mock CCIP Sync** runs synchronously upon proof verification, writing to SQLite Core Banking System (`cbs.db`) in less than 1ms.
