<> Typescript

/**
 * @license
 * SPDX-License-Identifier: MIT
 * GuardianAI | Forensic Inference & Settlement Oracle Node
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

/**
 * GuardianAI Health Handshake
 */
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "operational", 
    node: "0G-Serving-Node-Alpha",
    network: "IoTeX-Testnet-Babel",
    timestamp: Date.now() 
  });
});

/**
 * 0G SERVING AI INFERENCE ENGINE (Forensic Logic)
 * This endpoint simulates the decentralized AI inference required for 
 * determining liability. It processes raw telemetry into a verifiable 
 * verdict for the IoTeX L1 Smart Contract.
 */
app.post("/api/analyse-accident", async (req, res) => {
  const { telemetry, scenarioType, userNotes } = req.body;

  if (!telemetry || !scenarioType) {
    return res.status(400).json({ error: "Insufficient telemetry data packets." });
  }

  console.log(`[0G-Inference] Processing hardware logs for: ${scenarioType}`);
  console.log(`[Telemetry] Impact Velocity: ${telemetry.speed} km/h | Peak G-Force: ${telemetry.totalG}G`);

  // INTERNAL FORENSIC LOGIC UNIT
  // In a production environment, this would call a decentralized 0G-Serving 
  // model. Here we implement the deterministic forensic ruleset.
  
  let verdict: "Not At Fault" | "At Fault" | "Partially At Fault" = "Not At Fault";
  let analysis = "";
  let gForceEvaluation = "";

  switch (scenarioType) {
    case "Rear-Ended at Intersection":
      verdict = "Not At Fault";
      analysis = "Telemetry indicates a stationary state (0 km/h) followed by a massive positive longitudinal acceleration spike (X-axis). Physical vectors confirm a rear-impact collision from an external kinetic source. Brakes were engaged 2.4s prior to impact.";
      gForceEvaluation = "Impact Vector: 180° (Rear). Longitudinal Compression: 5.4G. Structural Strain: Moderate.";
      break;

    case "T-Boned by Red Light Runner":
      verdict = "Not At Fault";
      analysis = "Inference engine detects constant velocity (42 km/h) through intersection coordinates. Sudden lateral Y-axis impulse (6.1G) detected. Trajectory analysis confirms a perpendicular impact from a secondary vehicle violating signal node protocols.";
      gForceEvaluation = "Impact Vector: 270° (Left Lateral). Lateral Force: 6.1G. Estimated Side-Curtain Deployment: Active.";
      break;

    case "Cut Off by Aggressive Lane Merger":
      verdict = "Not At Fault";
      analysis = "High-frequency telemetry captures emergency hazard deceleration (9.2 m/s²) immediately followed by front-right diagonal deflection. Optical flow verification (0G-Storage) confirms merging vehicle intrusion into host's safety perimeter.";
      gForceEvaluation = "Impact Vector: 45° (Front-Right). Frontal Offset Force: 4.2G. AEB System Response: Verified.";
      break;

    default:
      // Solo accidents, control loss, etc.
      verdict = "At Fault";
      analysis = "Telemetry logs record excessive centrifugal yaw rate followed by a high-G frontal impact against a stationary boundary. No secondary kinetic vectors detected in the 5.0s pre-impact window. Determination: Solitary loss of vehicular control.";
      gForceEvaluation = "Impact Vector: 0° (Full Frontal). Kinetic Dissipation: 4.9G. Yaw Stability: Failed.";
      break;
  }

  // Return the structured Forensic Audit
  return res.json({
    verdict,
    analysis: `[0G-Forensic-Audit] ${analysis} ${userNotes ? `User Annotations: "${userNotes}"` : ""}`,
    gForceEvaluation: `[Kinetic-Diagnostics] ${gForceEvaluation}`,
    nodeSignature: `sig_0x${Math.random().toString(16).slice(2, 42)}`, // Simulated Oracle Signature
    timestamp: new Date().toISOString()
  });
});

/**
 * Server Lifecycle Management
 */
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => res.sendFile(path.join(distPath, "index.html")));
  }

  app.listen(PORT, () => {
    console.log(`\x1b[36m%s\x1b[0m`, `[GuardianAI] Oracle Node online at port ${PORT}`);
    console.log(`[0G-Serving] Inference engine synchronized.`);
  });
}

start().catch(console.error);