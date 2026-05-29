GuardianAI | The Decentralized Autonomous Claims Engine
<div align="center">
<img width="1200" alt="GuardianAI Banner" src="https://raw.githubusercontent.com/iotexproject/iotex-brand-assets/main/logos/iotex-logo-horizontal-white.png" />
<p><i>Autonomous DePIN safety and insurance settlement layer powered by IoTeX and 0G.</i></p>
<p>
<img src="https://img.shields.io/badge/Network-IoTeX_Testnet-00d1ff?style=for-the-badge&logo=iotex" />
<img src="https://img.shields.io/badge/Storage-0G_Network-6366f1?style=for-the-badge&logo=data-availability" />
<img src="https://img.shields.io/badge/AI-0G_Serving-a855f7?style=for-the-badge&logo=google-gemini" />
</p>
</div>
📖 Overview
GuardianAI is a modular DePIN protocol that transforms vehicles into self-sovereign auditing nodes. By utilizing IoTeX’s W3bstream for real-time edge verification and 0G’s decentralized storage and AI, we have eliminated the "Human Trust" requirement in insurance.
Accidents are detected by sensors, archived on a decentralized grid, and settled by a decentralized AI judge—all on-chain and in under 60 seconds.
🏗️ The Modular Stack
GuardianAI bridges the physical and digital worlds using a 5-layer modular architecture:
IoTeX ioID (Identity): Every dashcam is provisioned with a unique, non-spoofable hardware identity.
IoTeX W3bstream (Logic): Processes real-time telemetry (GPS + Accelerometer). If a G-force spike (> 4.0G) is detected, an incident trigger is fired.
0G Storage (Data): High-resolution 4K video evidence is archived across 0G's decentralized sectors, ensuring permanent and tamper-proof data availability.
0G Serving (Inference): A decentralized AI model analyzes the collision vector and optical flow to generate a "Fault Attribution" verdict.
IoTeX L1 (Settlement): A Solidity smart contract validates the AI verdict and dispatches instant stablecoin payouts to the driver's wallet.

Project Structure:

├── contracts/          # Solidity Insurance Pool & Settlement Logic
├── src/
│   ├── components/     # High-fidelity Forensic Dashboard
│   ├── simulation/     # W3bstream & 0G AI Simulation Engine
│   └── types/          # Global Data Definitions & ioID Schemas
├── .env.example        # Environment Configuration
└── simulator.ts        # Core DePIN Pipeline Orchestrator

Quick Start (Local Development)
Prerequisites:
Node.js (v18+)
An IoTeX Testnet wallet address

1. Clone & Install:

<> Bash
git clone https://github.com/your-username/guardian-ai.git
cd guardian-ai
npm install

2. Configure Environment:

<> Env

VITE_IOTEX_RPC_URL=https://babel-api.testnet.iotex.io
VITE_CONTRACT_ADDRESS=0x...

3. Launch Dashboard:
<> Bash 

npm run dev

4. Simulate an Event:

onnect your wallet (toggle between 0x and io formats).
Navigate to Live Sensors.
Select a scenario (e.g., "Rear-Ended at Intersection") and click Simulate High-G Impact.
Watch the Ledger Logs to see the 0G and IoTeX nodes interact in real-time.

DePIN Data Flow

<> Mermaid

sequenceDiagram
    participant D as Dashcam (ioID)
    participant W as W3bstream
    participant S as 0G Storage
    participant AI as 0G Serving
    participant L1 as IoTeX L1
    
    D->>W: Continuous Telemetry
    Note over W: Anomaly Detected (>4G)
    W->>D: Trigger Event
    D->>S: Upload 4K Video (videoCID)
    D->>L1: reportIncident(videoCID)
    AI->>S: Pull Video Data
    AI->>L1: verifyAndPay(Verdict: "Not At Fault")
    L1->>D: Instant Payout
