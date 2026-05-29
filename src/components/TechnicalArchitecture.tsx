/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Server, Shield, Database, Cpu, HardDrive, ArrowRight, Code, Key, Radio, Hexagon, ArrowDown } from "lucide-react";
import { motion } from "motion/react";

export default function TechnicalArchitecture() {
  const [copied, setCopied] = useState(false);

  const mermaidCode = `sequenceDiagram
    autonumber
    actor Driver as DePIN Driver
    participant Dashcam as Guardian Dashcam (ioID Element)
    participant W3bstream as IoTeX W3bstream Node
    participant Storage0G as ZeroGravity (0G) Storage
    participant Inference0G as 0G Serving (AI Node)
    participant IoTeXL1 as IoTeX L1 Smart Contract

    %% Step 1: Secure Registry
    IoTeXL1->>Dashcam: registerMachine(Address, ioID, PayoutLimit)
    
    %% Step 2: Streaming Telemetry
    loop Continuous Stream
        Dashcam->>W3bstream: Send telemetry packets (Speed, GPS, Accelerometer)
    end
    
    %% Step 3: Threshold Violation
    Note over W3bstream: Detect anomaly (G-Force > 4G)
    W3bstream-->>Dashcam: Pull Event Trigger Notification
    
    %% Step 4: Storage Archival
    Dashcam->>Storage0G: Stream 30s incident buffer (client.upload)
    Storage0G-->>Dashcam: Return Storage Content ID (videoCID)
    
    %% Step 5: Incident Logging
    Dashcam->>W3bstream: Dispatch Video CID & telemetry metadata
    W3bstream->>IoTeXL1: reportIncident(Address, videoCID, telemetryCID)
    
    %% Step 6: Inference Audit
    Inference0G->>Storage0G: Retrieve video data sectors (videoCID)
    Note over Inference0G: Execute Forensic Inference Model (Gemini-Engine)
    Inference0G->>IoTeXL1: verifyAndPay(incidentID, verdict: "Not At Fault")
    
    %% Step 7: Ledger Payout Disbursment
    Note over IoTeXL1: Auto-verify Verdict & Liquidity Pool Reserves
    IoTeXL1->>Driver: Execute instant insurance disburse payout (Stablecoins)`;

  const handleCopy = () => {
    navigator.clipboard.writeText(mermaidCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="tech-architecture-panel" className="space-y-12">
      <div className="flex items-center justify-between mb-2">
         <div>
            <h2 className="text-2xl font-bold text-white font-sans tracking-tight">DePIN Dynamic Data Flow</h2>
            <p className="text-slate-400 text-sm mt-1">Modular Schematic of IoTeX edge verification and 0G storage grids.</p>
         </div>
      </div>

      <div className="relative w-full max-w-5xl mx-auto space-y-4 md:space-y-6">
        
        {/* Layer 1: The Device Edge */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-[10px] font-bold tracking-widest text-cyan-500 uppercase font-mono px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-md">Layer 1</div>
            <div className="text-xs uppercase font-bold tracking-widest text-slate-300 font-mono">The Device Edge</div>
            <div className="flex-1 border-t border-slate-800/80 border-dashed"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 relative">
            <ArchitectureCard 
               stepNumber="01"
               title="Machine Registration"
               tech="IoTeX ioID Registry"
               desc="Dashcam devices verify their hardware authenticity. The owner binds the device on-chain via IoTeX registerMachine to guarantee unique non-spoofable DePIN identities."
               badge="VERIFIED"
               nodeId="IOTX-W3B-v2.1"
               icon={Key}
               theme="cyan"
            />

            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-[2rem] z-10 mx-auto right-auto">
               <HorizontalConnector theme="cyan" />
            </div>

            <div className="md:hidden flex justify-center py-2 h-8">
               <VerticalConnector theme="cyan" />
            </div>

            <ArchitectureCard 
               stepNumber="02"
               title="Real-time Telemetry"
               tech="IoTeX W3bstream Node"
               desc="Device sensors stream telemetry (GPS coordinates, speed, 3-axis accelerometer readings). If forces exceed 4G, incident logic is instantly fired."
               badge="SECURE"
               nodeId="IOTX-W3B-v2.2"
               icon={Radio}
               theme="cyan"
            />
          </div>
        </div>

        {/* Global Vertical Connector Layer 1 -> Layer 2 */}
        <div className="flex justify-center -my-2 h-16 md:h-12 relative z-0">
           <VerticalConnector theme="purple" length="h-full" />
        </div>

        {/* Layer 2: Data & Intelligence Grid */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-[10px] font-bold tracking-widest text-fuchsia-500 uppercase font-mono px-2 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded-md">Layer 2</div>
            <div className="text-xs uppercase font-bold tracking-widest text-slate-300 font-mono">Data & Intelligence Grid</div>
            <div className="flex-1 border-t border-slate-800/80 border-dashed"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 relative">
            <ArchitectureCard 
               stepNumber="03"
               title="High-Perf Storage"
               tech="0G Storage Network"
               desc="Whenever a collision is detected, the dashcam uploads the preceding 30s of archived 4K video clips to 0G storage, securing tamper-proof evidence."
               badge="DECENTRALIZED"
               nodeId="0G-STORAGE-v1.4"
               icon={HardDrive}
               theme="purple"
            />

            <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center w-[2rem] z-10 mx-auto right-auto">
               <HorizontalConnector theme="purple" />
             </div>

            <div className="md:hidden flex justify-center py-2 h-8">
               <VerticalConnector theme="purple" />
            </div>

            <ArchitectureCard 
               stepNumber="04"
               title="Decentralized AI Inference"
               tech="0G Serving (AI Node)"
               desc="AI Serving nodes retrieve video sectors. Our Gemini-powered AI engine reviews physical impact vectors to produce an automated Fault Verdict with advanced ZKP Verification."
               badge="ZKP PROVED"
               nodeId="0G-SERVING-v0.9"
               icon={Cpu}
               theme="purple"
            />
          </div>
        </div>

        {/* Global Vertical Connector Layer 2 -> Layer 3 */}
        <div className="flex justify-center -my-2 h-16 md:h-12 relative z-0">
           <VerticalConnector theme="emerald" length="h-full" />
        </div>

        {/* Layer 3: The Settlement Layer */}
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase font-mono px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">Layer 3</div>
            <div className="text-xs uppercase font-bold tracking-widest text-slate-300 font-mono">The Settlement Layer</div>
            <div className="flex-1 border-t border-slate-800/80 border-dashed"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 relative">
            <div className="md:col-start-1 md:col-span-2 max-w-2xl mx-auto w-full">
              <ArchitectureCard 
                 stepNumber="05"
                 title="On-Chain Settlement Payouts"
                 tech="IoTeX L1 Ledger Contracts"
                 desc="The GuardianInsurance Solidity contract validates the AI verdict statement. If evaluated as 'Not At Fault', an instant reimbursement dispatches from the pool to the driver utilizing Cross-Chain Interop capabilities."
                 badge="SETTLED"
                 nodeId="IOTX-L1-SC-v3"
                 icon={Shield}
                 theme="emerald"
                 featured
              />
            </div>
          </div>
        </div>

      </div>

      {/* Mermaid Sequence Code Block */}
      <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 mt-16 md:mt-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl font-bold text-white font-sans tracking-tight">Mermaid.js Sequence Structure</h3>
            <p className="text-slate-400 text-sm">
              Standardized DePIN sequencing diagram detailing smart oracle validation pipelines and proofs.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-white font-mono tracking-tight text-xs transition duration-200 self-start"
          >
            <Code className="w-4 h-4" />
            {copied ? "Copied Schematic!" : "Copy diagram block"}
          </button>
        </div>

        <div className="relative">
          <pre className="overflow-x-auto max-h-[420px] bg-[#0d1424] border border-[#1e293b] rounded-xl p-5 font-mono text-xs text-blue-300 leading-relaxed block shadow-inner">
            {mermaidCode}
          </pre>
          <div className="absolute bottom-3 right-3 text-[10px] font-mono text-slate-500 bg-[#0d1424] px-2 py-1 rounded">
            Click copy to render inside standard markdown views
          </div>
        </div>
      </div>
    </div>
  );
}

function ArchitectureCard({ stepNumber, title, tech, desc, badge, nodeId, icon: Icon, theme, featured = false }: any) {
   let colorClasses = "";
   let badgeColor = "";
   let iconColor = "";
   let glowColor = "";

   if (theme === "cyan") {
     colorClasses = "border-cyan-500/30 bg-cyan-950/10 shadow-[0_0_30px_rgba(6,182,212,0.03)] hover:border-cyan-400/50 hover:bg-cyan-950/20 hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]";
     badgeColor = "text-cyan-400 bg-cyan-500/10 border-cyan-500/20";
     iconColor = "text-cyan-400 bg-cyan-500/10";
     glowColor = "from-cyan-500/20 to-transparent";
   } else if (theme === "purple") {
     colorClasses = "border-fuchsia-500/30 bg-fuchsia-950/10 shadow-[0_0_30px_rgba(217,70,239,0.03)] hover:border-fuchsia-400/50 hover:bg-fuchsia-950/20 hover:shadow-[0_0_30px_rgba(217,70,239,0.08)]";
     badgeColor = "text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20";
     iconColor = "text-fuchsia-400 bg-fuchsia-500/10";
     glowColor = "from-fuchsia-500/20 to-transparent";
   } else {
     colorClasses = "border-emerald-500/30 bg-emerald-950/10 shadow-[0_0_30px_rgba(16,185,129,0.03)] hover:border-emerald-400/50 hover:bg-emerald-950/20 hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]";
     badgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
     iconColor = "text-emerald-400 bg-emerald-500/10";
     glowColor = "from-emerald-500/20 to-transparent";
   }

   return (
     <div className={`relative p-5 md:p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 overflow-hidden group ${colorClasses} ${featured ? "ring-1 ring-emerald-500/20" : ""}`}>
       
       <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl ${glowColor} opacity-50 blur-2xl pointer-events-none rounded-full transform translate-x-1/2 -translate-y-1/2 group-hover:opacity-70 transition-opacity`} />
       <div className="absolute right-[-10%] bottom-[-20%] opacity-[0.03] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
         <Hexagon className="w-56 h-56 text-white" strokeWidth={0.5} />
       </div>

       <div className="relative z-10 flex flex-col h-full">
         <div className="flex justify-between items-start mb-4">
           <div className="flex gap-3 items-center">
             <div className={`p-2.5 rounded-lg border ${iconColor} border-inherit/10`}>
               <Icon className="w-5 h-5" />
             </div>
             <div>
               <div className="text-[10px] text-slate-500 font-mono tracking-widest">{tech}</div>
               <h4 className="text-base font-bold text-white font-sans tracking-tight mt-0.5">{title}</h4>
             </div>
           </div>
           
           <div className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider border ${badgeColor} shrink-0 ml-2`}>
             {badge}
           </div>
         </div>

         <p className="text-xs text-slate-400 leading-relaxed font-sans mb-5 flex-1 pr-2 relative z-10">
           {desc}
         </p>

         <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between mt-auto">
           <div className="flex items-center gap-2">
             <span className="text-[10px] text-slate-500 font-mono tracking-wider">ID:</span>
             <span className="text-[10px] font-bold text-slate-300 font-mono bg-slate-900/60 px-2 py-1 rounded border border-slate-800">{nodeId}</span>
           </div>
           <div className="text-[10px] text-slate-600 font-mono opacity-50">STEP {stepNumber}</div>
         </div>
       </div>
     </div>
   );
}

function HorizontalConnector({ theme }: { theme: "cyan" | "purple" }) {
  const colorStr = theme === "cyan" ? "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" : "bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.8)]";

  return (
    <div className="relative w-8 h-px bg-slate-800/50 flex items-center overflow-hidden">
       <motion.div 
         className={`w-4 h-px ${colorStr}`}
         animate={{ x: ["-40px", "40px"] }}
         transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
       />
    </div>
  );
}

function VerticalConnector({ theme, length = "h-full" }: { theme: "cyan" | "purple" | "emerald", length?: string }) {
  let colorStr = "";
  if (theme === "cyan") colorStr = "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]";
  else if (theme === "purple") colorStr = "bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.8)]";
  else colorStr = "bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]";

  return (
    <div className={`relative w-px bg-slate-800/50 overflow-hidden ${length}`}>
      <motion.div 
         className={`w-px h-8 ${colorStr}`}
         animate={{ y: ["-30px", "60px"] }}
         transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}
