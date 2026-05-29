/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Telemetry {
  timestamp: number;
  latitude: number;
  longitude: number;
  speed: number;
  accelX: number;
  accelY: number;
  accelZ: number;
  totalG: number;
}

export interface Machine {
  address: string;
  ioID: string;
  owner: string;
  premiumBalance: number;
  coverageLimit: number;
  isActive: boolean;
  registeredAt: number;
}

export interface Incident {
  id: number;
  machineAddress: string;
  timestamp: number;
  videoCID: string;
  telemetryCID: string;
  gForce: number;
  speedAtImpact: number;
  verdict: "Not At Fault" | "At Fault" | "Partially At Fault" | "Undetermined";
  aiAnalysis: string; // The full details retrieved from the 0G Serving AI Inference Model (Gemini)
  payoutAmount: number;
  status: "REPORTED" | "VERIFIED_PAYOUT" | "EXONERATED_DENIED" | "IN_REVIEW";
  txHash: string;
}

export interface WorkflowStep {
  id: "telemetry" | "impact" | "0g_storage" | "0g_serving" | "iotex_settlement";
  title: string;
  description: string;
  status: "idle" | "running" | "success" | "failed";
  timestamp?: number;
  meta?: Record<string, any>;
}
