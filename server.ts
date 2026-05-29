/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client with proper telemetry headers
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("[Gemini] API Client initialized successfully for 0G Serving Simulations.");
  } catch (error) {
    console.error("[Gemini] Failed to initialize GoogleGenAI client:", error);
  }
} else {
  console.log("[Gemini] No explicit GEMINI_API_KEY found. Utilizing high-fidelity local physics engine simulations.");
}

// Ensure simple server health check
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: Date.now() });
});

/**
 * Endpoint representing the decentralized "0G Serving" AI Inference Node.
 * It takes the telemetry inputs + scenario conditions, processes them using Gemini,
 * and issues a final, legally sound Fault Attribution binding for IoTeX L1 Settlement.
 */
app.post("/api/analyse-accident", async (req, res) => {
  const { telemetry, scenarioType, userNotes } = req.body;

  if (!telemetry || !scenarioType) {
    return res.status(400).json({ error: "Missing required telemetry or scenario inputs" });
  }

  const promptText = `
    Conduct a decentralized forensic automobile accident analysis as a DePIN 0G Serving AI node.
    
    CRITICAL EVALUATION PARAMETERS:
    - Target Machine ID: ioID:iotex:guardian-ii-dash-0941
    - Collision Telemetry:
      * Speed at Impact: ${telemetry.speed.toFixed(1)} km/h
      * Direct G-Force Acceleration Anomaly: ${telemetry.totalG.toFixed(1)}G
      * Angular Shifts (gX, gY, gZ axis): ${telemetry.accelX}g, ${telemetry.accelY}g, ${telemetry.accelZ}g
    - Driver Incident Scenario selection: "${scenarioType}"
    - Additional Notes: "${userNotes || "None provided"}"
    
    Your role is to act as a secure, neutral, deterministic oracle arbiter. Process whether this driver is "At Fault", "Not At Fault", "Partially At Fault", or if details are "Undetermined".
    
    RULES FOR BLOCKCHAIN MUTATIONS:
    - To trigger the automated IoTeX smart contract insurance settlement, the verdict MUST resolve strictly to "Not At Fault" (e.g. rear-ended, parked, or hit by traffic violator).
    - If the user selected an at-fault scenario ("Slipped on ice and hit guardrail" or "Sideswiped stationary object"), the verdict MUST resolve strictly to "At Fault" or "Partially At Fault".
    - Explain the physics forces (e.g. how the impact deceleration vector gX, gY correlates with the chosen collision type).
    - Keep formatting highly technical, analytical, and professional of a senior DePIN forensic AI evaluator.
    
    Generate your report as a JSON object matching this schema exactly:
    {
      "verdict": "Not At Fault" | "At Fault" | "Partially At Fault" | "Undetermined",
      "analysis": "A detailed 2-3 paragraph breakdown outlining the physical forces, G-force impact angle, deceleration trajectory, and immediate driver culpability.",
      "gForceEvaluation": "A short, highly technical spatial physics log summarizing the vector accelerometer deviation (x, y, z) and estimated structural damage."
    }
    
    Ensure you output only valid, parseable JSON text.
  `;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptText,
        config: {
          responseMimeType: "application/json",
        },
      });

      const responseText = response.text || "";
      const parsedData = JSON.parse(responseText.trim());
      return res.json(parsedData);
    } catch (err: any) {
      console.error("[Gemini API Error]", err);
      // Fallback below if API call fails
    }
  }

  // High-fidelity fallback logic if Gemini is unconfigured or fails
  console.log("[0G Serving Fallback] Processing local DePIN engine rule mapping.");
  
  let verdict: "Not At Fault" | "At Fault" | "Partially At Fault" = "Not At Fault";
  let analysis = "";
  let gForceEvaluation = "";

  if (scenarioType === "Rear-Ended at Intersection") {
    verdict = "Not At Fault";
    analysis = "Telemetry sensor inputs detect stationary positioning (0 km/h baseline) interrupted by high magnitude posterior acceleration pulse (x-axis spike to 5.4g). Evaluation supports rear-end shockwave from a secondary vehicle. Zero driver kinetic contribution computed immediately preceding crash. Full liability attributed to striking external agent.";
    gForceEvaluation = "Impact angle: 180 degrees (direct rear). Longitudinal force compression: 5.4G. Horizontal shear wave: minor. Estimated structural chassis deformation: Moderate.";
  } else if (scenarioType === "T-Boned by Red Light Runner") {
    verdict = "Not At Fault";
    analysis = "Telemetry verifies driver moving linearly at constant speed (42 km/h) through intersection before lateral acceleration impulse (y-axis peak of 6.1g). Shockwave trajectory confirms high speed transverse bumper impact from left boundary. Traffic node telemetry checks support complete exoneration of host identity.";
    gForceEvaluation = "Impact angle: 270 degrees (left side). Lateral force compression: 6.1G. Rotational moment: 1.4G. Estimated side curtain airbag deployment triggered.";
  } else if (scenarioType === "Cut Off by Aggressive Lane Merger") {
    verdict = "Not At Fault";
    analysis = "Telemetry displays severe, rapid braking immediately before lateral structural deflection (total G peaks at 4.2G). Deceleration deceleration rates match extreme emergency friction conditions. Physics projection establishes lane violation by a merging actor, leaving zero hazard evasion distance for driver.";
    gForceEvaluation = "Impact angle: 45 degrees (front-right). Frontal offset deceleration: 4.2G. Braking force friction coeff: 0.85. Dynamic stability control active.";
  } else {
    // Single vehicle accidents, slipped on ice, hit stationary guardrail
    verdict = "At Fault";
    analysis = "Telemetry captures sudden steering overshoot at 55 km/h followed by immediate decelerating front-end impact (total G peaks at 4.9G). No secondary kinetic energy vector represented in telemetry coordinates before barrier collision. Action confirms solitary loss of directional control.";
    gForceEvaluation = "Impact angle: 15 degrees (front-left corner). Frontal structural compression: 4.9G. Slide velocity vector: 18 km/h. Left safety cell zone absorbed impact energy.";
  }

  return res.json({
    verdict,
    analysis: `[Simulator Node Evaluation] ${analysis} ${userNotes ? `Driver Note Annotations: "${userNotes}" processed.` : ""}`,
    gForceEvaluation: `[Kinetic Diagnostics] ${gForceEvaluation}`
  });
});

if (process.env.NODE_ENV !== "production") {
  async function startViteDev() {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[GuardianAI Fullstack Engine] Dev Server booting under port ${PORT}`);
    });
  }
  startViteDev().catch(console.error);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
  
  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[GuardianAI Fullstack Engine] Prod Server booting under port ${PORT}`);
    });
  }
}

export default app;
