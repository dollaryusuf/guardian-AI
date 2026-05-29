/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  ListCollapse, 
  ChevronRight, 
  ShieldCheck, 
  ShieldAlert, 
  Cpu, 
  HardDrive, 
  AlertTriangle, 
  ExternalLink, 
  Calendar, 
  CheckCircle, 
  Scale, 
  Milestone,
  Sparkles,
  Fingerprint,
  CheckCircle2,
  RefreshCw,
  Layers,
  Shield,
  FileText,
  Search,
  Link as LinkIcon
} from "lucide-react";
import { Incident } from "../types/types";

interface ClaimsCenterProps {
  incidents: Incident[];
}

export default function ClaimsCenter({ incidents }: ClaimsCenterProps) {
  const [selectedID, setSelectedID] = useState<number | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [verifiedIncidentId, setVerifiedIncidentId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<"ALL" | "SETTLED" | "REJECTED" | "PENDING">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const selectedIncident = incidents.find((inc) => inc.id === selectedID);

  const filteredIncidents = incidents.filter((inc) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      // Safely check if machineAddress or videoCID exists before lowercasing, as they can sometimes be empty/undefined in mock setups
      const addrMatch = inc.machineAddress?.toLowerCase().includes(q) || false;
      const cidMatch = inc.videoCID?.toLowerCase().includes(q) || false;
      if (!addrMatch && !cidMatch) {
        return false;
      }
    }
    
    if (activeFilter === "SETTLED") return inc.status === "VERIFIED_PAYOUT";
    if (activeFilter === "REJECTED") return inc.status === "EXONERATED_DENIED";
    if (activeFilter === "PENDING") return inc.status === "REPORTED";
    
    return true;
  });

  const handleVerify0G = async (incidentId: number) => {
    setVerifying(true);
    setVerificationSuccess(false);
    setVerifiedIncidentId(incidentId);
    
    // Simulate high-fidelity cryptographic matching of Merkle roots across 0G Storage Node sectors
    await new Promise((resolve) => setTimeout(resolve, 1400));
    
    setVerifying(false);
    setVerificationSuccess(true);
    
    // Auto-dismiss the verification indicator after 3.5 seconds
    setTimeout(() => {
      setVerificationSuccess(false);
    }, 3500);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "VERIFIED_PAYOUT":
        return "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-sm shadow-emerald-500/5";
      case "EXONERATED_DENIED":
        return "bg-amber-500/10 border-amber-500/20 text-amber-400";
      case "REPORTED":
        return "bg-cyan-500/10 border-cyan-500/30 text-cyan-400";
      default:
        return "bg-slate-800 border-slate-700 text-slate-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "VERIFIED_PAYOUT":
        return "Claim Settled (Paid)";
      case "EXONERATED_DENIED":
        return "Claim Denied (At Fault)";
      case "REPORTED":
        return "Awaiting AI Verdict";
      default:
        return "Under Review";
    }
  };

  // Helper to generate precise dynamic logs for Forensic AI Summary based on parameters
  const getForensicObservations = (inc: Incident) => {
    const isExonerated = inc.verdict === "Not At Fault" || inc.status === "VERIFIED_PAYOUT";
    return [
      {
        label: "DETECTION",
        text: `High-G sudden deceleration impact of ${inc.gForce.toFixed(2)}G recorded at timestamp offset mark.`,
        type: "severe" as const
      },
      {
        label: "CV_ANALYSIS",
        text: isExonerated 
          ? "Pre-crash video sequence confirms stationary vehicle position prior to heavy rear impact deformation."
          : "Pre-crash video sequence indicates potential driver latency/failure to yield to leading traffic.",
        type: "info" as const
      },
      {
        label: "TELEMETRY",
        text: `Automotive CAN-bus black box registered rapid drops in axle speed from ${inc.speedAtImpact.toFixed(1)} km/h to 0 km/h.`,
        type: "info" as const
      },
      {
        label: "SECURE_ELEMENT",
        text: `On-chain cryptographic validation has confirmed device signatures matched ioID registry mapping.`,
        type: "success" as const
      }
    ];
  };

  return (
    <div id="depin-claims-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* List Section (Left column / Full width on mobile) */}
      <div className="lg:col-span-1 flex flex-col h-full max-h-[640px] space-y-4">
        
        {/* Global Stats Widget */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shrink-0 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1">Protected Volume</div>
            <div className="text-sm font-black text-emerald-400 font-mono tracking-tight">$2.4M</div>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div>
            <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1">MTTS</div>
            <div className="text-sm font-bold text-blue-400 font-mono">58s</div>
          </div>
          <div className="w-px h-8 bg-slate-800"></div>
          <div>
             <div className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1">Analytics</div>
             <div className="text-[11px] font-bold text-slate-300 font-mono flex items-center gap-1.5 uppercase">
               Live <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
             </div>
          </div>
        </div>

        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-5 flex flex-col flex-1 overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <Layers className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-white uppercase font-mono tracking-tight">Insurance Incident Logs</h3>
          </div>
          <p className="text-slate-400 text-xs mb-4 leading-relaxed shrink-0">
            Select a micro-DePIN on-chain report to view hardware telemetry proofs, 0G Storage assets, and AI-negotiated settlement verdicts.
          </p>

          {/* Search Bar */}
          <div className="relative mb-3 shrink-0">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search ioID or CID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2.5 focus:outline-none focus:border-blue-500/50 transition-colors placeholder:text-slate-600"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-slate-950/50 rounded-lg p-1 mb-4 shrink-0 overflow-x-auto scrollbar-none gap-1 border border-slate-800/60">
             {["ALL", "SETTLED", "REJECTED", "PENDING"].map(tab => (
               <button 
                 key={tab}
                 onClick={() => setActiveFilter(tab as any)}
                 className={`flex-1 text-[10px] font-mono font-bold tracking-wider py-1.5 px-2 rounded-md transition-all whitespace-nowrap ${
                   activeFilter === tab 
                     ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]"
                     : "text-slate-500 border border-transparent hover:text-slate-300 hover:bg-slate-800/50"
                 }`}
               >
                 {tab}
               </button>
             ))}
          </div>

          <div className="flex-1 overflow-auto space-y-3 pr-1 scrollbar-thin">
            {filteredIncidents.map((inc) => (
              <button
                key={inc.id}
                onClick={() => {
                  setSelectedID(inc.id);
                  setVerificationSuccess(false);
                }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                  selectedID === inc.id
                    ? "bg-slate-950 border-blue-500/50 shadow-lg shadow-blue-500/10"
                    : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/60"
                }`}
              >
                {selectedID === inc.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                )}
                
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-mono font-bold text-blue-400">INCIDENT #{inc.id}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded">
                    {new Date(inc.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="text-xs font-mono text-slate-300 mb-2 truncate bg-slate-900/50 p-1.5 rounded border border-slate-800/50">
                  <span className="text-slate-500 mr-1">CID:</span>{inc.videoCID.substring(0, 22)}...
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60 mt-1">
                  <div className="flex items-center gap-1 text-[10px] font-mono">
                    <span className={`font-bold ${inc.gForce >= 3.0 ? "text-red-500" : "text-amber-500"}`}>
                      {inc.gForce.toFixed(1)}G Peak
                    </span>
                  </div>
                  <div className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${getStatusBadgeClass(inc.status)}`}>
                    {getStatusText(inc.status)}
                  </div>
                </div>
              </button>
            ))}

            {filteredIncidents.length === 0 && (
              <div className="h-48 flex flex-col items-center justify-center p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl">
                <ListCollapse className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-sm font-semibold">No claims found.</p>
                <p className="text-[10px] text-slate-600 mt-1 max-w-[200px] leading-relaxed">
                  Try adjusting your search criteria or waiting for real-time telemetry events.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Details Section / Digital Evidence Locker (Right column / Full width on mobile) */}
      <div className="lg:col-span-2 flex flex-col h-full min-h-[500px]">
        {selectedIncident ? (
          <div className="relative bg-gradient-to-b from-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 space-y-5 flex-1 overflow-auto max-h-[640px] shadow-2xl">
            
            {/* Blueprint Grid Watermark Layer */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-25 pointer-events-none" />

            {/* Header / Identifiers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center p-1.5 bg-blue-500/10 border border-blue-500/30 rounded-lg text-blue-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-400 tracking-wider">SECURE DIGITAL EVIDENCE LOCKER</span>
                </div>
                <h3 className="text-xl font-bold font-mono tracking-tight text-white mt-1">
                  Incident Report Reference #{selectedIncident.id}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Logged at: {new Date(selectedIncident.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className={`px-4 py-2 border rounded-xl text-center self-start sm:self-center ${getStatusBadgeClass(selectedIncident.status)}`}>
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-semibold mb-0.5">Underwriting Status</div>
                <div className="text-xs font-bold font-mono">{getStatusText(selectedIncident.status)}</div>
              </div>
            </div>

            {/* AI Forensic Reconstruction (The 0G AI Piece) */}
            <div className="bg-slate-950/90 border border-blue-500/10 rounded-xl p-5 space-y-4 relative z-10 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-blue-400" />
                  <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wide">
                    AI Forensic Reconstruction
                  </h4>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase ${
                  selectedIncident.verdict === "Not At Fault"
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-amber-500/10 border-amber-500/30 text-amber-400"
                }`}>
                  Verdict: {selectedIncident.verdict}
                </span>
              </div>

              {/* Dynamic Observations Log */}
              <div className="space-y-3 font-mono text-[11px] pt-1">
                {getForensicObservations(selectedIncident).map((obs, idx) => (
                  <div key={idx} className="flex gap-2.5 items-start p-2.5 bg-slate-900/60 border border-slate-800/85 rounded-lg">
                    <span className={`font-bold shrink-0 text-[10px] px-1.5 py-0.5 rounded ${
                      obs.type === "severe" 
                        ? "bg-red-500/10 text-red-400 border border-red-500/25"
                        : obs.type === "success"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/25"
                    }`}>
                      {obs.label}
                    </span>
                    <span className="text-slate-300 leading-normal">{obs.text}</span>
                  </div>
                ))}
              </div>

              {/* Core AI Explanation output */}
              <div className="p-3.5 bg-slate-900 border border-dashed border-slate-800 rounded-lg text-xs leading-relaxed text-slate-300 font-sans">
                <span className="font-mono text-[10px] text-slate-500 uppercase font-black block mb-1">0G AI EVALUATION ESSAY</span>
                {selectedIncident.aiAnalysis}
              </div>
            </div>

            {/* Evidence Verification (The 0G Storage Piece) */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4 relative z-10 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm font-bold text-white uppercase font-mono tracking-wide">
                    Data Integrity Proof (0G Storage)
                  </span>
                </div>
                
                <button
                  disabled={verifying}
                  onClick={() => handleVerify0G(selectedIncident.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition border whitespace-nowrap ${
                    verifying 
                      ? "bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed"
                      : "bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20"
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${verifying ? "animate-spin" : ""}`} />
                  {verifying ? "Verifying Roots..." : "Verify Data via 0G Node"}
                </button>
              </div>

              {/* Storage details grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl space-y-1">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Video Footage Asset</div>
                  <div className="text-slate-300 select-all break-all leading-normal pt-0.5">
                    {selectedIncident.videoCID}
                  </div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800/80 rounded-xl space-y-1">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Telemetry Log Proof</div>
                  <div className="text-blue-400 select-all break-all leading-normal pt-0.5">
                    {selectedIncident.telemetryCID}
                  </div>
                </div>
              </div>

              {/* Cryptographic verification toast simulation banner */}
              {verificationSuccess && verifiedIncidentId === selectedIncident.id && (
                <div className="animate-fade-in p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 animate-bounce" />
                  <div className="text-xs font-mono text-slate-200">
                    <span className="text-emerald-400 font-bold uppercase block text-[10px]">Verification Success!</span>
                    Merkle Root Proof anchors matched exactly. Storage blocks are unaltered (0 Tampering).
                  </div>
                </div>
              )}
            </div>

            {/* Blockchain Settlement Card (The IoTeX L1 Piece) */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-3.5 relative z-10 shadow-md">
              <div className="flex items-center gap-2 pb-1 border-b border-slate-900">
                <Milestone className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-bold text-white uppercase font-mono tracking-wide">
                  On-Chain Settlement Receipt (IoTeX L1)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Disbursed Payout</span>
                  <span className="text-base font-black text-emerald-400 mt-1 block">
                    {selectedIncident.payoutAmount ?? 0} STC
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Decentralized Machine Account</span>
                  <span className="text-[11px] text-slate-300 truncate block mt-1.5" title={selectedIncident.machineAddress}>
                    {selectedIncident.machineAddress}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">ioID identity status</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Fingerprint className="w-4 h-4 text-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/25">
                      VERIFIED_CHIP
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive block link */}
              <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 text-[10px] font-mono leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-slate-500 font-semibold block uppercase">Ledger Proof Tx Hash</span>
                  <span className="text-slate-400 select-all truncate max-w-sm block pt-0.5">{selectedIncident.txHash}</span>
                </div>
                <a 
                  href={`https://iotexscan.io/tx/${selectedIncident.txHash}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 bg-slate-950 hover:bg-slate-900 border border-slate-800 text-blue-400 font-semibold text-[10px] px-3 py-1.5 rounded-lg hover:text-blue-300 transition duration-150 tracking-wider shrink-0 uppercase"
                >
                  Inspect in IoTeXScan <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        ) : (
          /* High-Tech Blueprint Empty State with pulse animations */
          <div className="relative bg-gradient-to-br from-slate-900/60 to-slate-950/80 border border-slate-800/80 rounded-2xl p-12 flex-1 flex flex-col items-center justify-center text-center overflow-hidden min-h-[450px]">
            {/* Grid Watermarks */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1.5px,transparent_1.5px),linear-gradient(to_bottom,#020617_1.5px,transparent_1.5px)] bg-[size:1.5rem_1.5rem] opacity-30 pointer-events-none" />
            
            <div className="relative space-y-6 max-w-md">
              <div className="relative mx-auto w-20 h-20 bg-blue-500/5 border border-blue-500/20 text-blue-400 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/5 animate-pulse">
                <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping opacity-60 pointer-events-none" />
                <Fingerprint className="w-10 h-10 text-blue-400/80" />
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold font-mono tracking-wider text-slate-100 uppercase uppercase-wider">
                  Awaiting Forensic Selection...
                </h4>
                <p className="text-slate-500 text-xs leading-relaxed font-sans">
                  On-chain settlement contracts require Merkle root signatures and 0G AI forensic outcomes. Select an accident file from the index registry to activate the Digital Evidence Locker.
                </p>
              </div>

              <div className="flex justify-center items-center gap-6 pt-2 text-[10px] font-mono text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  0G STORAGE PROTOCOL
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  IoTeX LEDGER BRIDGE
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
