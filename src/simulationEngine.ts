/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { toast } from "sonner";
import { Incident } from "./types";

// 1. Definition of the 'Incident' Type inside simulationEngine or re-exported to safeguard imports
export type SimulationIncident = Incident;

export interface ScenarioDetails {
  scenarioName: string;
  verdict: "Not At Fault" | "At Fault" | "Partially At Fault" | "Undetermined";
  gForce: number;
  speedAtImpact: number;
  aiAnalysis: string;
  observations: Array<{
    label: "DETECTION" | "CV_ANALYSIS" | "TELEMETRY" | "SECURE_ELEMENT";
    text: string;
    type: "severe" | "info" | "success";
  }>;
}

// 2. Scenario Library mapping with custom essays and observations
export const SCENARIO_LIBRARY: Record<string, ScenarioDetails> = {
  "Rear-Ended at Intersection": {
    scenarioName: "Rear-Ended at Intersection",
    verdict: "Not At Fault",
    gForce: 6.43,
    speedAtImpact: 0,
    aiAnalysis: "The host micro-DePIN vehicle was standing fully stationary at red signal coordinates. Zero pedal torque applied to axle systems. Computer vision streaming confirms rear-approaching vehicle maintaining 52 km/h without negative braking acceleration. Anomaly detected at rear accelerometer quadrant with immediate impact G-force of 6.4G. Absolute host exoneration recommended.",
    observations: [
      {
        label: "DETECTION",
        text: "Rear-end structural high-G impact anomaly recorded at 6.43G with zero velocity torque.",
        type: "severe"
      },
      {
        label: "CV_ANALYSIS",
        text: "Video footage buffers verify host vehicle standing stationary behind crosswalk; rear bumper collapsed completely.",
        type: "info"
      },
      {
        label: "TELEMETRY",
        text: "Wheel torque sensor reports steady speed: 0.0 km/h with brakes fully locked down prior to rear collision wave.",
        type: "info"
      },
      {
        label: "SECURE_ELEMENT",
        text: "DePIN ioID cryptographic verification confirms physical hardware tamper-proof sealing holds intact.",
        type: "success"
      }
    ]
  },
  "T-Boned by Red Light Runner": {
    scenarioName: "T-Boned by Red Light Runner",
    verdict: "Not At Fault",
    gForce: 7.12,
    speedAtImpact: 38.4,
    aiAnalysis: "Host vehicle crossing authorized intersection during green signal node. Lateral accelerometers detect sudden lateral vector momentum spike from high-velocity perpendicular vehicle violating traffic rules. Structural side-curtain compression registers 7.1G at impact. Complete liability lies with cross-street transgressor.",
    observations: [
      {
        label: "DETECTION",
        text: "Severe lateral high-G collision wave registered at 7.12G on the left-wing chassis perimeter.",
        type: "severe"
      },
      {
        label: "CV_ANALYSIS",
        text: "Forward-left dashcam feed detects red SUV failing to yield during cross-intersection cycle.",
        type: "info"
      },
      {
        label: "TELEMETRY",
        text: "Active lane guidance and constant engine throttle of 38.4 km/h confirm normal trajectory flow.",
        type: "info"
      },
      {
        label: "SECURE_ELEMENT",
        text: "W3bstream secure hardware hardware enclave registers authentic credentials without spoofing signature.",
        type: "success"
      }
    ]
  },
  "Cut Off by Aggressive Lane Merger": {
    scenarioName: "Cut Off by Aggressive Lane Merger",
    verdict: "Not At Fault",
    gForce: 4.88,
    speedAtImpact: 72.1,
    aiAnalysis: "Host vehicle moving in right lane with normal adaptive cruise control activated. A merging vehicle abruptly clips the front right corner attempting an illegal pass. Automated collision emergency braking system (AEB) triggered 1.2 seconds prior, cushioning structural kinetic energy to 4.88G. The merging vehicle was at fault.",
    observations: [
      {
        label: "DETECTION",
        text: "Front-right localized diagonal compression forces peaking at 4.88G.",
        type: "severe"
      },
      {
        label: "CV_ANALYSIS",
        text: "Optical flow analysis registers dangerous close-proximity merging intrusion from right shoulder quadrant.",
        type: "info"
      },
      {
        label: "TELEMETRY",
        text: "Braking system pressure immediately spiked from 0 to 92 bar, confirming maximum automated emergency hazard deceleration.",
        type: "info"
      },
      {
        label: "SECURE_ELEMENT",
        text: "IoT secure silicon key validated on IoTeX Blockchain Registry network ledger.",
        type: "success"
      }
    ]
  },
  "Solitary Guardrail Collision / Loss of Control": {
    scenarioName: "Solitary Guardrail Collision / Loss of Control",
    verdict: "At Fault",
    gForce: 5.15,
    speedAtImpact: 54.8,
    aiAnalysis: "Telemetry indicates high centrifugal yaw rate followed by sharp sliding angle during wet meteorological conditions. Severe direct front crash impact registered on single obstacle (guardrail) at 5.15G forces. No external kinetic energy inputs or nearby object vectors detected prior. Driver control loss confirms fault determination.",
    observations: [
      {
        label: "DETECTION",
        text: "Frontal offset impact deceleration force of 5.15G recorded with severe lateral yaw acceleration.",
        type: "severe"
      },
      {
        label: "CV_ANALYSIS",
        text: "Forward camera demonstrates zero interacting vehicle targets; vehicle slides linearly into metallic barrier boundary.",
        type: "info"
      },
      {
        label: "TELEMETRY",
        text: "Anti-lock braking (ABS) and traction control feedback verify severe wheel slippage on cold wet asphalt pavement.",
        type: "info"
      },
      {
        label: "SECURE_ELEMENT",
        text: "On-board cryptographic hardware chip verified and signed collision log telemetry directly.",
        type: "success"
      }
    ]
  }
};

/**
 * Helper to retrieve specific scenario details from the catalog
 */
export function getScenarioDetails(scenarioName: string): ScenarioDetails {
  return SCENARIO_LIBRARY[scenarioName] || SCENARIO_LIBRARY["Rear-Ended at Intersection"];
}

interface SimulationOptions {
  scenarioName: string;
  machineAddress: string;
  machineIoID: string;
  onStateChange: (state: "IDLE" | "IMPACT_DETECTED" | "UPLOADING_0G" | "AI_PROCESSING" | "SETTLED") => void;
  onLogAdd: (msg: string) => void;
  onSuccess: (newIncident: Incident) => void;
}

/**
 * 3. Implement the triggerSimulation function:
 * Simulates complete automated DePIN insurance claim underwriting operations, 
 * integrating 0G Storage proofs, W3bstream oracle signals, and L1 state settlement.
 */
export async function triggerSimulation({
  scenarioName,
  machineAddress,
  machineIoID,
  onStateChange,
  onLogAdd,
  onSuccess
}: SimulationOptions) {
  const details = getScenarioDetails(scenarioName);

  // STEP 1: IMPACT
  onStateChange("IMPACT_DETECTED");
  onLogAdd(`[Step 1] W3bstream: Anomaly Detected (${details.gForce}G)`);
  onLogAdd(`🚨 G-Force impact spike exceeds baseline limit! Initiating black-box memory extraction...`);
  
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // STEP 2: IDENTITY
  onLogAdd(`[Step 2] Verifying micro-DePIN hardware secure element identity (ioID)...`);
  onLogAdd(`   ├─ Registry Reference: verifyMachine("${machineAddress}")`);
  onLogAdd(`   ├─ Machine ioID Address:  ${machineIoID}`);
  onLogAdd(`   └─ Registered Owner Payee Wallet:  ${machineAddress}`);
  
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // STEP 3: 0G STORAGE
  onStateChange("UPLOADING_0G");
  onLogAdd(`[Step 3] Archiving raw 1080p frame buffer feeds to 0G Storage gateway nodes...`);
  onLogAdd(`   ├─ Packaging vehicle telematics packets...`);
  
  // Simulate uploading progress updates dynamically
  for (let progress = 20; progress <= 100; progress += 20) {
    onLogAdd(`      └─ Uploading 4K Evidence to 0G Storage: ${progress}%...`);
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  
  const videoCID = `0g://ipfs/zQmXg64Yq9F3_${Math.random().toString(36).substring(2, 10)}`;
  const telemetryCID = `0g://telemetry/mK_root_${Math.random().toString(36).substring(2, 10)}`;
  onLogAdd(`[0G Storage Success] Structured asset leaves uploaded to decentralized sectors.`);
  onLogAdd(`   └─ CONTENT_ID (videoCID): ${videoCID}`);

  await new Promise((resolve) => setTimeout(resolve, 800));

  // STEP 4: IoTeX L1
  onLogAdd(`[Step 4] Initiating smart contract transaction reportIncident() on IoTeX Testnet...`);
  onLogAdd(`   ├─ Target Smart Contract: 0x8bfbB700F9514e867375267DfbDFFb5A0e6ED6D7`);
  onLogAdd(`   └─ Passing Parameters: machineAddress="${machineAddress}", videoCID="${videoCID}"`);
  
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const newIncidentID = Math.floor(Math.random() * 90000) + 10000;
  onLogAdd(`[IoTeX Node Complete] Contract transaction submitted. Block validation confirmed.`);
  onLogAdd(`   ├─ Registered Incident ID: #${newIncidentID}`);
  onLogAdd(`   └─ Status Code: PENDING_AI_VERDICT`);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  // STEP 5: 0G AI INFERENCE
  onStateChange("AI_PROCESSING");
  onLogAdd(`[Step 5] Launching 0G Serving decentralized AI forensic auditing node...`);
  onLogAdd(`   ├─ Evaluating kinetic acceleration vector: gX, gY, gZ...`);
  onLogAdd(`   └─ Running semantic analysis on chosen scenario "${scenarioName}"...`);
  
  await new Promise((resolve) => setTimeout(resolve, 3000)); // 3 Seconds spinner wait

  const isExonerated = details.verdict === "Not At Fault";
  onLogAdd(`[0G Serving Complete] AI Forensic Analaysis resolved!`);
  onLogAdd(`   ├─ Verdict: ${details.verdict}`);
  onLogAdd(`   └─ Evaluation: ${details.aiAnalysis.substring(0, 80)}...`);

  onLogAdd(`[Oracle Settlement Bridge] Whitelisted validator signing verifyAndPay(${newIncidentID}, "${details.verdict}")...`);
  await new Promise((resolve) => setTimeout(resolve, 1200));

  // STEP 6: DISBURSEMENT / STATE UPDATE
  onStateChange("SETTLED");
  const txHash = "0x" + Math.random().toString(16).substring(2, 42).padEnd(40, "e");
  const payoutAmount = isExonerated ? 500 : 0;

  if (payoutAmount > 0) {
    onLogAdd(`[IoTeX Ledger Success] AUTOMATED POOL PAYOUT DISBURSED!`);
    onLogAdd(`   ├─ Liquid Payout: ${payoutAmount} STC (Stablecoins)`);
    onLogAdd(`   ├─ Transferred to Owner: ${machineAddress}`);
    onLogAdd(`   └─ Tx Hash Proof: ${txHash}`);
    
    // 4. Trigger success toast notification with Sonner
    toast.success(`500 $IOTX Disbursed to Wallet!`, {
      description: `Incident #${newIncidentID} fully settled automatically by GuardianAI on-chain underwriting.`,
      duration: 5000,
    });
  } else {
    onLogAdd(`[IoTeX Ledger Solved] Claim Resolution Refused. Driver culpability validated.`);
    onLogAdd(`   └─ Reason: ${details.verdict} (Culpability limit hit and driver responsibility confirmed)`);
    
    toast.error(`Claim Settlement Refused`, {
      description: `Incident #${newIncidentID} returned fault verdict: ${details.verdict}. Underwriting reserves retained.`,
      duration: 5000,
    });
  }

  const finishedIncident: Incident = {
    id: newIncidentID,
    machineAddress: machineAddress,
    timestamp: Date.now(),
    videoCID: videoCID,
    telemetryCID: telemetryCID,
    gForce: details.gForce,
    speedAtImpact: details.speedAtImpact,
    verdict: details.verdict,
    aiAnalysis: details.aiAnalysis,
    payoutAmount: payoutAmount,
    status: isExonerated ? "VERIFIED_PAYOUT" : "EXONERATED_DENIED",
    txHash: txHash
  };

  onSuccess(finishedIncident);
}
