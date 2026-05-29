/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Radio, Zap, Server, Shield, Database, Cpu, HardDrive, CheckCircle2, Loader2, AlertTriangle, ShieldCheck, Share2, Sparkles, ExternalLink, X } from "lucide-react";
import { Telemetry, WorkflowStep, Machine, Incident } from "../types";
import { ethers } from "ethers";
import { triggerSimulation, getScenarioDetails } from "../simulationEngine";

interface LiveTelemetrySimulatorProps {
  activeMachine: Machine | null;
  onNewIncident: (incident: Incident) => void;
  onDeductPoolBalance: (payout: number) => void;
  simulationState: "IDLE" | "IMPACT_DETECTED" | "UPLOADING_0G" | "AI_PROCESSING" | "SETTLED";
  onSimulationStateChange: (state: "IDLE" | "IMPACT_DETECTED" | "UPLOADING_0G" | "AI_PROCESSING" | "SETTLED") => void;
  onTriggerPayoutModal: (details: {
    incidentID: number;
    payoutAmount: number;
    owner: string;
    txHash: string;
    ioID: string;
    verdict: string;
  }) => void;
  isWalletConnected: boolean;
}

export default function LiveTelemetrySimulator({
  activeMachine,
  onNewIncident,
  onDeductPoolBalance,
  simulationState,
  onSimulationStateChange,
  onTriggerPayoutModal,
  isWalletConnected,
}: LiveTelemetrySimulatorProps) {
  const [telemetry, setTelemetry] = useState<Telemetry>({
    timestamp: Date.now(),
    latitude: 37.77492,
    longitude: -122.41941,
    speed: 45,
    accelX: 0.05,
    accelY: -0.02,
    accelZ: 1.01,
    totalG: 1.01,
  });

  const [isPlaying, setIsPlaying] = useState(true);
  const [scenarioType, setScenarioType] = useState("Rear-Ended at Intersection");
  const [driverNotes, setDriverNotes] = useState("");
  
  // Visual states
  const [shakeScreen, setShakeScreen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Clear visual workflow status and terminal logs when simulationState is IDLE
  useEffect(() => {
    if (simulationState === "IDLE") {
      setWorkflowLogs([]);
      setActiveStep("idle");
    }
  }, [simulationState]);

  // Workflow state machine during collision simulation
  const [isSimulatingCrash, setIsSimulatingCrash] = useState(false);
  const [activeStep, setActiveStep] = useState<"idle" | "telemetry" | "impact" | "0g_storage" | "0g_serving" | "iotex_settlement">("idle");
  const [workflowLogs, setWorkflowLogs] = useState<string[]>([]);
  const [aiReport, setAiReport] = useState<any>(null);

  const telemetryInterval = useRef<any>(null);

  // Continuously generate realistic telemetry drift when playing
  useEffect(() => {
    if (isPlaying && !isSimulatingCrash) {
      telemetryInterval.current = setInterval(() => {
        setTelemetry((prev) => {
          const latDrift = (Math.random() - 0.5) * 0.0001;
          const lngDrift = (Math.random() - 0.5) * 0.0001;
          
          // Moderate speed adjustments
          const speedAdjustment = (Math.random() - 0.5) * 5;
          const speed = Math.max(15, Math.min(85, prev.speed + speedAdjustment));

          // Base gravity offsets
          const gX = Number(((Math.random() - 0.5) * 0.15).toFixed(3));
          const gY = Number(((Math.random() - 0.5) * 0.15).toFixed(3));
          const gZ = Number((1.0 + (Math.random() - 0.5) * 0.1).toFixed(3));
          const totalG = Number(Math.sqrt(gX * gX + gY * gY + gZ * gZ).toFixed(3));

          return {
            timestamp: Date.now(),
            latitude: prev.latitude + latDrift,
            longitude: prev.longitude + lngDrift,
            speed,
            accelX: gX,
            accelY: gY,
            accelZ: gZ,
            totalG,
          };
        });
      }, 1000);
    } else {
      if (telemetryInterval.current) clearInterval(telemetryInterval.current);
    }

    return () => {
      if (telemetryInterval.current) clearInterval(telemetryInterval.current);
    };
  }, [isPlaying, isSimulatingCrash]);

  const addLog = (msg: string) => {
    setWorkflowLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  // Triggers the chain of DePIN events (including requested 6-Step Simulation Sequence)
  const handleTriggerImpact = async () => {
    if (!activeMachine) {
      alert("Please ensure you have an active registered Machine whitelisted first in the 'Machine Registry' tab.");
      return;
    }

    setIsSimulatingCrash(true);
    setWorkflowLogs([]);
    setAiReport(null);
    setIsPlaying(false);
    setUploadProgress(0);

    try {
      await triggerSimulation({
        scenarioName: scenarioType,
        machineAddress: activeMachine.address,
        machineIoID: activeMachine.ioID,
        onStateChange: (state) => {
          onSimulationStateChange(state);
          if (state === "IMPACT_DETECTED") {
            setShakeScreen(true);
            setActiveStep("telemetry");
            setTimeout(() => setShakeScreen(false), 1500);
          } else if (state === "UPLOADING_0G") {
            setActiveStep("0g_storage");
          } else if (state === "AI_PROCESSING") {
            setActiveStep("0g_serving");
          } else if (state === "SETTLED") {
            setActiveStep("iotex_settlement");
          }
        },
        onLogAdd: (msg) => {
          if (msg.includes("Uploading 4K Evidence to 0G Storage:")) {
            const match = msg.match(/(\d+)%/);
            if (match) {
              setUploadProgress(parseInt(match[1], 10));
            }
          }
          addLog(msg);
        },
        onSuccess: (newInc) => {
          onNewIncident(newInc);
          if (newInc.payoutAmount > 0) {
            onDeductPoolBalance(newInc.payoutAmount);
          }

          onTriggerPayoutModal({
            incidentID: newInc.id,
            payoutAmount: newInc.payoutAmount,
            owner: activeMachine.owner,
            txHash: newInc.txHash,
            ioID: activeMachine.ioID,
            verdict: newInc.verdict,
          });

          setTelemetry((prev) => ({
            ...prev,
            totalG: newInc.gForce,
            speed: newInc.speedAtImpact,
            accelX: Number((newInc.gForce * 0.81).toFixed(2)),
            accelY: Number((-newInc.gForce * 0.48).toFixed(2)),
            accelZ: Number((newInc.gForce * 0.31).toFixed(2)),
          }));
        }
      });
    } catch (err) {
      console.error("Simulation engine crash:", err);
      addLog(`[Error] Simulation execution failed: ${err}`);
    } finally {
      setIsSimulatingCrash(false);
      setActiveStep("idle");
    }
  };

  return (
    <div 
      id="live-telemetry-panel" 
      className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-300 ${shakeScreen ? "animate-shake bg-red-950/10 p-2 rounded-3xl border border-red-500/20" : ""}`}
    >
      
      {/* Dynamic Sensor Visual Gauges */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-6 lg:col-span-1">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Radio className="text-red-500 w-5 h-5 animate-pulse" />
            <h3 className="text-lg font-bold text-white uppercase font-mono tracking-tight">Active Sensor Stream</h3>
          </div>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={isSimulatingCrash}
            className={`p-2 rounded-lg border flex items-center gap-1.5 transition ${
              isPlaying
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            } disabled:opacity-40`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="text-xs font-semibold">{isPlaying ? "Pause Sensors" : "Start Sensors"}</span>
          </button>
        </div>

        {/* Dynamic Velocity Speed Dial (SVG-driven) */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-950 border border-slate-800 rounded-2xl relative overflow-hidden">
          <svg className="w-40 h-40 transform -rotate-90">
            {/* Speedometer Track */}
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke="#1e293b"
              strokeWidth="10"
              fill="transparent"
            />
            {/* Speedometer Filled Gauge */}
            <circle
              cx="80"
              cy="80"
              r="68"
              stroke={telemetry.speed > 70 ? "#ef4444" : "#06b6d4"}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={427}
              strokeDashoffset={427 - (427 * (Math.min(120, telemetry.speed) / 120))}
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-black text-white font-mono tracking-tight">
              {telemetry.speed.toFixed(0)}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 mt-0.5">Speed (km/h)</span>
          </div>
        </div>

        {/* 3-Axis Accel display */}
        <div className="space-y-3 bg-slate-950 border border-slate-800 rounded-2xl p-4">
          <div className="flex justify-between text-xs pb-1 border-b border-slate-900">
            <span className="text-slate-500 font-semibold font-mono">SENSOR CORES</span>
            <span className={`font-mono font-bold ${telemetry.totalG > 4 ? "text-red-500 animate-pulse" : "text-cyan-400"}`}>
              {telemetry.totalG.toFixed(3)}G Net Accel
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-1">
            <div className="bg-slate-900 p-2 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">AXIAL_X</span>
              <span className={`font-bold mt-1 block ${Math.abs(telemetry.accelX) > 3.5 ? "text-red-400" : "text-slate-100"}`}>
                {telemetry.accelX > 0 ? `+${telemetry.accelX}` : telemetry.accelX}g
              </span>
            </div>
            <div className="bg-slate-900 p-2 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">AXIAL_Y</span>
              <span className={`font-bold mt-1 block ${Math.abs(telemetry.accelY) > 3.5 ? "text-red-400" : "text-slate-100"}`}>
                {telemetry.accelY > 0 ? `+${telemetry.accelY}` : telemetry.accelY}g
              </span>
            </div>
            <div className="bg-slate-900 p-2 border border-slate-800 rounded-lg">
              <span className="text-[10px] text-slate-500 block">AXIAL_Z</span>
              <span className="text-slate-100 font-bold mt-1 block">
                {telemetry.accelZ > 0 ? `+${telemetry.accelZ}` : telemetry.accelZ}g
              </span>
            </div>
          </div>
          
          <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between pt-1">
            <span>COORDINATES:</span>
            <span className="text-slate-400 font-semibold">{telemetry.latitude.toFixed(5)}°, {telemetry.longitude.toFixed(5)}°</span>
          </div>
        </div>
      </div>

      {/* Control Simulation Parameter Grid */}
      <div className="space-y-6 lg:col-span-2 flex flex-col">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-5">
          <h3 className="text-lg font-bold text-white">Interactive Crash Scenario Matrix</h3>
          <p className="text-slate-400 text-xs">
            Configure vehicular impact profiles. The resulting force metrics will trigger W3bstream network consensus, video streaming uploads, and automated AI payouts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase font-mono tracking-wider">
                Vehicular Collision Profile
              </label>
              <select
                value={scenarioType}
                onChange={(e) => setScenarioType(e.target.value)}
                disabled={isSimulatingCrash}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3.5 py-2.5 text-sm font-semibold focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="Rear-Ended at Intersection">Rear-Ended at Intersection (Not At Fault)</option>
                <option value="T-Boned by Red Light Runner">T-Boned by Red Light Runner (Not At Fault)</option>
                <option value="Cut Off by Aggressive Lane Merger">Cut Off by Aggressive Lane Merger (Not At Fault)</option>
                <option value="Slipped on Ice and struck Guardrail">Slipped on Ice and struck Guardrail (At Fault)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase font-mono tracking-wider">
                Driver Explanatory Annotations (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Stationary at green light lane..."
                value={driverNotes}
                onChange={(e) => setDriverNotes(e.target.value)}
                disabled={isSimulatingCrash}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-600 font-mono"
              />
            </div>
          </div>

          <button
            onClick={handleTriggerImpact}
            disabled={isSimulatingCrash || !isWalletConnected}
            className={`w-full relative flex items-center justify-center gap-3 py-3.5 rounded-xl text-white font-black text-sm uppercase tracking-wider transition duration-200 ${
              !isWalletConnected 
                ? "bg-slate-805 border border-slate-800 text-slate-500 cursor-not-allowed opacity-60" 
                : "bg-red-600 hover:bg-red-500 shadow-lg hover:shadow-red-600/20 shadow-red-600/10 cursor-pointer"
            } disabled:opacity-40`}
          >
            {isWalletConnected ? (
              <>
                <Zap className="w-5 h-5 fill-white animate-bounce" />
                Simulate High-G Impact Anomaly (&gt; 4.0G)
              </>
            ) : (
              <span>Connect Wallet to Activate Sensors</span>
            )}
          </button>
        </div>

        {/* Real-time Detailed Status Overlay */}
        {simulationState !== "IDLE" && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-3.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 uppercase font-mono tracking-wider font-semibold">Active State Pipeline</span>
              <span className="text-blue-400 font-mono font-bold uppercase text-xs">{simulationState}</span>
            </div>

            {simulationState === "IMPACT_DETECTED" && (
              <div className="flex items-center gap-2.5 text-red-500 text-sm font-semibold py-1 animate-pulse">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <span>🚨 W3bstream: Anomaly Detected (6.4G) - Monitoring incident trigger...</span>
              </div>
            )}

            {simulationState === "UPLOADING_0G" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 flex items-center gap-1.5 font-semibold">
                    <HardDrive className="w-4 h-4 text-blue-400 animate-pulse" />
                    Uploading 4K Evidence and Telemetry Proof to 0G Storage...
                  </span>
                  <span className="font-mono text-blue-400 font-bold text-xs">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {simulationState === "AI_PROCESSING" && (
              <div className="flex items-center gap-2.5 text-cyan-400 text-sm font-semibold py-1">
                <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                <span>🧠 Waiting for 0G AI Verdict regarding accident fault...</span>
              </div>
            )}
          </div>
        )}

        {/* Real-time State Machine Processing Logs */}
        {isSimulatingCrash || workflowLogs.length > 0 ? (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 flex-1">
            <div className="flex items-center justify-between pb-3 border-b border-slate-900">
              <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-widest">
                GuardianAI processing trace
              </span>
              {isSimulatingCrash && (
                <div className="flex items-center gap-2 text-xs text-blue-400 font-mono">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  Orchestrating DePIN Nodes...
                </div>
              )}
            </div>

            {/* Micro Steps Visual representation */}
            <div className="grid grid-cols-5 gap-2 relative">
              {[
                { step: "telemetry", icon: Radio, name: "W3bstream" },
                { step: "impact", icon: AlertTriangle, name: "Impact Trigger" },
                { step: "0g_storage", icon: HardDrive, name: "0G Storage" },
                { step: "0g_serving", icon: Cpu, name: "0G AI Serving" },
                { step: "iotex_settlement", icon: Shield, name: "IoTeX Settlement" },
              ].map((obj, i) => {
                const IconComp = obj.icon;
                const isCurrent = activeStep === obj.step;
                const indexActive = ["telemetry", "impact", "0g_storage", "0g_serving", "iotex_settlement"].indexOf(activeStep);
                const isPassed = ["telemetry", "impact", "0g_storage", "0g_serving", "iotex_settlement"].indexOf(obj.step) < indexActive;

                return (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className={`p-2.5 rounded-lg border text-center relative ${
                        isCurrent
                          ? "bg-blue-600 border-blue-500 text-white animate-pulse"
                          : isPassed
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                          : "bg-slate-900 border-slate-800 text-slate-600"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 mt-1 uppercase font-mono tracking-tight font-black">{obj.name}</span>
                  </div>
                );
              })}
            </div>

            {/* Text Logs terminal-like stream */}
            <div className="bg-slate-950/40 font-mono text-[10px] text-slate-400 p-4 border border-slate-900 rounded-xl space-y-1.5 h-44 overflow-y-auto">
              {workflowLogs.map((log, idx) => (
                <div key={idx} className="leading-relaxed whitespace-pre-wrap">
                  {log}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-950/10 flex-1 flex flex-col items-center justify-center">
            <Server className="w-8 h-8 text-slate-700 mb-2" />
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">System Pipeline Idle</h4>
            <p className="text-slate-500 text-xs max-w-sm mt-1">
              Start sensor feeds or hit the collision anomaly trigger to watch raw physics telemetry disburse claims instantly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
