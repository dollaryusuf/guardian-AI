/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Activity, ShieldCheck, Cpu, HardDrive, Terminal, Laptop, Settings, ExternalLink, HelpCircle, AlertOctagon, Sparkles, X, History } from "lucide-react";
import { Toaster } from "sonner";
import { Machine, Incident } from "./types/types";
import LiveTelemetrySimulator from "./components/LiveTelemetrySimulator";
import ClaimsCenter from "./components/ClaimsCenter";
import MachineIDRegistry from "./components/MachineIDRegistry";
import TechnicalArchitecture from "./components/TechnicalArchitecture";
import SettlementContract from "./components/SettlementContract";
import WalletConnect from "./components/WalletConnect";
import TransactionHistoryModal, { Transaction } from "./components/TransactionHistoryModal";

const INITIAL_MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    hash: "0x9f4a8b23c...1e3b21",
    type: "payout",
    title: "Route Payout (150 STC)",
    description: "Automatic indemnification settlement",
    time: "2 mins ago",
    status: "success",
  },
  {
    id: "tx-2",
    hash: "0x3ea1b6f0a...a4fc99",
    type: "reportIncident",
    title: "Impact Incident Reported",
    description: "W3bstream parsed 4.2G collision data",
    time: "14 mins ago",
    status: "success",
  },
  {
    id: "tx-3",
    hash: "0x77b2da119...2201aa",
    type: "registerMachine",
    title: "Machine Registered",
    description: "New SecEl device ioID provisioned",
    time: "1 hr ago",
    status: "success",
  },
  {
    id: "tx-4",
    hash: "0x44c8ee88b...9dee12",
    type: "reportIncident",
    title: "Impact Incident Reported",
    description: "W3bstream parsed 6.1G collision data",
    time: "4 hrs ago",
    status: "success",
  },
  {
    id: "tx-5",
    hash: "0x12d9cc22f...2bbb44",
    type: "payout",
    title: "Route Payout (75 STC)",
    description: "Automatic indemnification settlement",
    time: "4 hrs 5 mins ago",
    status: "success",
  },
  {
    id: "tx-6",
    hash: "0xaa10bb99e...a455c2",
    type: "registerMachine",
    title: "Machine Registered",
    description: "New SecEl device ioID provisioned",
    time: "1 day ago",
    status: "success",
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"telemetry" | "claims" | "machines" | "architecture" | "contract">("telemetry");
  const [simulationState, setSimulationState] = useState<"IDLE" | "IMPACT_DETECTED" | "UPLOADING_0G" | "AI_PROCESSING" | "SETTLED">("IDLE");
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(true);
  const [isTxHistoryOpen, setIsTxHistoryOpen] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutModalDetails, setPayoutModalDetails] = useState<{
    incidentID: number;
    payoutAmount: number;
    owner: string;
    txHash: string;
    ioID: string;
    verdict: string;
  } | null>(null);

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_MOCK_TRANSACTIONS);

  const handleReset = () => {
    setSimulationState("IDLE");
    setShowPayoutModal(false);
    setActiveTab("telemetry");
  };

  // Populate initially with realistic demo nodes so the dashboard feels premium on load
  const [machines, setMachines] = useState<Machine[]>([
    {
      address: "0x3Aa9D57C8cd4e98fE4007Bf5B0cb31BEE5aa0aEE",
      ioID: "ioID:iotex:guardian-ii-dash-0941",
      owner: "0xDriver74391abcbcee8284561a3ec95e94b293",
      premiumBalance: 120,
      coverageLimit: 250,
      isActive: true,
      registeredAt: Date.now() - 3600000 * 48,
    },
    {
      address: "0x9f560E53f7feffE78D9B4A0877983c0722D088ae",
      ioID: "ioID:iotex:avalanche-sensor-cam4",
      owner: "0xDriver29419bcdcaddaa124119daaeec04ee19",
      premiumBalance: 80,
      coverageLimit: 100,
      isActive: true,
      registeredAt: Date.now() - 3600000 * 12,
    }
  ]);

  const [poolBalance, setPoolBalance] = useState<number>(3500); // STC insurance pool reserves

  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: 48910,
      machineAddress: "0x3Aa9D57C8cd4e98fE4007Bf5B0cb31BEE5aa0aEE",
      timestamp: Date.now() - 3600000 * 2, // 2 hours ago
      videoCID: "0g-video-cid-z9fke29s0fkw9sk2la8sk2",
      telemetryCID: "w3b-tel-z9fke2",
      gForce: 5.6,
      speedAtImpact: 42.5,
      verdict: "Not At Fault",
      aiAnalysis: "[Forensic AI Evaluation] Raw telemetry coordinates register baseline motion interrupted by massive decelerating rear event impulse peak of 5.6g. Deceleration profile correlates to sudden stationary velocity shift caused by secondary external force collision from 180 degrees. Full legal liability attributed outward. Driver exonerated completely from claim burden.",
      payoutAmount: 250,
      status: "VERIFIED_PAYOUT",
      txHash: "0x09f43aacdaeec11244af94eec942918bc22aee40",
    },
    {
      id: 48722,
      machineAddress: "0x9f560E53f7feffE78D9B4A0877983c0722D088ae",
      timestamp: Date.now() - 3600000 * 24, // 1 day ago
      videoCID: "0g-video-cid-a8j2jd83kdjw9sl2",
      telemetryCID: "w3b-tel-x82hd",
      gForce: 4.8,
      speedAtImpact: 55.0,
      verdict: "At Fault",
      aiAnalysis: "High centrifugal yaw detected with zero external kinetic inputs. Driver failed to maintain control on wet asphalt.",
      payoutAmount: 0,
      status: "EXONERATED_DENIED",
      txHash: "0xab820b92cd...292f9e",
    },
    {
      id: 48510,
      machineAddress: "0x3Aa9D57C8cd4e98fE4007Bf5B0cb31BEE5aa0aEE",
      timestamp: Date.now() - 3600000 * 72, // 3 days ago
      videoCID: "0g-video-cid-qm29skfjfjsu19dj2",
      telemetryCID: "w3b-tel-cmo29d",
      gForce: 7.2,
      speedAtImpact: 35.5,
      verdict: "Not At Fault",
      aiAnalysis: "Intersection lateral impact identified. Target vehicle was traveling straight with steady velocity; a 90-degree lateral force of 7.2g indicates a t-bone collision. Traffic signal correlation via 0G indicates opponent vehicle disregarded red signal.",
      payoutAmount: 400,
      status: "VERIFIED_PAYOUT",
      txHash: "0xd182cba9e7...fc82e1",
    },
    {
      id: 48301,
      machineAddress: "0x9f560E53f7feffE78D9B4A0877983c0722D088ae",
      timestamp: Date.now() - 3600000 * 96, // 4 days ago
      videoCID: "0g-video-cid-92jd83jdhx7sq1",
      telemetryCID: "w3b-tel-fka10x",
      gForce: 3.1,
      speedAtImpact: 65.2,
      verdict: "Undetermined",
      aiAnalysis: "Awaiting secondary camera angle validation from 0G Storage sector 4.",
      payoutAmount: 0,
      status: "REPORTED",
      txHash: "0x8fa10bcbda...e39abc",
    },
    {
      id: 48119,
      machineAddress: "0x3Aa9D57C8cd4e98fE4007Bf5B0cb31BEE5aa0aEE",
      timestamp: Date.now() - 3600000 * 120, // 5 days ago
      videoCID: "0g-video-cid-lz92hdus91jchw8",
      telemetryCID: "w3b-tel-al92ud",
      gForce: 1.8,
      speedAtImpact: 5.5,
      verdict: "Not At Fault",
      aiAnalysis: "Low-velocity rear minor impact detected while vehicle ego-state was parked. Forward stationary sensor corroborates nil initial movement. External liability determined.",
      payoutAmount: 50,
      status: "VERIFIED_PAYOUT",
      txHash: "0xe811dafb98...ab921c",
    }
  ]);

  const handleAddMachine = (m: Machine) => {
    setMachines((prev) => [m, ...prev]);
  };

  const handleFundPool = (amount: number) => {
    setPoolBalance((prev) => prev + amount);
  };

  const handleDeductPool = (amount: number) => {
    setPoolBalance((prev) => Math.max(0, prev - amount));
  };

  const handleNewIncident = (inc: Incident) => {
    setIncidents((prev) => [inc, ...prev]);

    // Create report incident transaction
    const reportTx: Transaction = {
      id: `tx-report-${Date.now()}`,
      hash: "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 8),
      type: "reportIncident",
      title: "Impact Incident Reported",
      description: `W3bstream parsed ${inc.gForce.toFixed(1)}G collision data`,
      time: "Just now",
      status: "success",
    };

    const newTxs = [reportTx];

    // Create payout transaction if a payout occurred
    if (inc.payoutAmount > 0) {
      const payoutTx: Transaction = {
        id: `tx-payout-${Date.now()}`,
        hash: inc.txHash || ("0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 8)),
        type: "payout",
        title: `Route Payout (${inc.payoutAmount} STC)`,
        description: "Automatic indemnification settlement",
        time: "Just now",
        status: "success",
      };
      // Payout happens after the incident is reported, so we put it first in the list
      newTxs.unshift(payoutTx);
    }

    setTransactions((prev) => [...newTxs, ...prev]);
  };

  useEffect(() => {
    if (!isWalletConnected) {
      setShowPayoutModal(false);
    }
  }, [isWalletConnected]);

  return (
    <div id="guardian-root-scaffold" className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans overflow-x-hidden">
      {/* Sonner Toaster notifications */}
      <Toaster theme="dark" position="bottom-right" closeButton richColors />
      
      {/* Visual background ambient decorations */}
      <div className="absolute top-0 left-0 w-full h-[320px] bg-gradient-to-b from-blue-950/10 to-transparent pointer-events-none z-0" />

      {/* Primary Dashboard Header aligned with Professional Polish template layout */}
      <header className="h-16 border-b border-slate-800 bg-slate-900 relative z-50 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">
            G
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-white flex items-center gap-2">
              GuardianAI 
              <span className="text-slate-500 font-normal text-xs uppercase font-mono tracking-wider pt-0.5">DePIN Engine</span>
            </h1>
          </div>
        </div>

        {/* Connected state badges */}
        <div className="flex items-center space-x-6 text-sm">
          <div className="hidden lg:flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${simulationState !== "IDLE" && simulationState !== "SETTLED" ? "bg-amber-500 animate-pulse shadow-lg shadow-amber-500/50" : "bg-emerald-500"}`}></span>
            <span className="text-slate-400 text-xs">W3bstream Core:</span>
            <span className={`font-mono ${simulationState !== "IDLE" && simulationState !== "SETTLED" ? "text-amber-400 animate-pulse font-bold" : "text-emerald-400"} uppercase text-xs font-semibold`}>
              {simulationState !== "IDLE" && simulationState !== "SETTLED" ? "TRANSMITTING" : "Operational"}
            </span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${simulationState === "UPLOADING_0G" || simulationState === "AI_PROCESSING" ? "bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50" : "bg-blue-500"}`}></span>
            <span className="text-slate-400 text-xs">0G Node:</span>
            <span className={`font-mono ${simulationState === "UPLOADING_0G" || simulationState === "AI_PROCESSING" ? "text-blue-400 animate-pulse font-bold" : "text-blue-400"} uppercase text-xs font-semibold`}>
              {simulationState === "UPLOADING_0G" ? "ARCHIVER ACTIVE" : simulationState === "AI_PROCESSING" ? "AI EVALUATING" : "Synchronized"}
            </span>
          </div>

          <button
            onClick={() => setIsTxHistoryOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-slate-700 bg-slate-900 shadow-sm hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg transition-colors cursor-pointer text-xs font-mono font-bold mx-2"
            title="View Ledger Logs & Events"
          >
            <History className="w-4 h-4 text-emerald-400" />
            Ledger Logs
          </button>

          <WalletConnect isConnected={isWalletConnected} setIsConnected={setIsWalletConnected} />
        </div>
      </header>

      {/* Interactive Tabs Menu */}
      <nav className="border-b border-slate-800 bg-slate-900/40 relative z-10 py-1">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex overflow-x-auto gap-1 text-xs font-semibold whitespace-nowrap scrollbar-hide py-1">
            {[
              { id: "telemetry", name: "Live Sensors", icon: Activity },
              { id: "claims", name: "Claims Clearance", icon: Terminal },
              { id: "machines", name: "Machine Registry", icon: Laptop },
              { id: "architecture", name: "Architecture Layout", icon: HardDrive },
              { id: "contract", name: "Settlement Contract", icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 border-b-2 text-xs font-semibold transition duration-200 rounded-lg ${
                    isActive
                      ? "border-blue-500 text-white bg-slate-900"
                      : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-blue-500" : "text-slate-500"}`} />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Core Action Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 relative z-10">
        
        {/* Render respective panels according to navigation hooks */}
        {activeTab === "telemetry" && (
          <LiveTelemetrySimulator
            activeMachine={machines[0] || null}
            onNewIncident={handleNewIncident}
            onDeductPoolBalance={handleDeductPool}
            simulationState={simulationState}
            onSimulationStateChange={setSimulationState}
            onTriggerPayoutModal={(details) => {
              setPayoutModalDetails(details);
              setShowPayoutModal(true);
            }}
            isWalletConnected={isWalletConnected}
          />
        )}

        {activeTab === "claims" && (
          <ClaimsCenter incidents={incidents} />
        )}

        {activeTab === "machines" && (
          <MachineIDRegistry
            machines={machines}
            onAddMachine={handleAddMachine}
            poolBalance={poolBalance}
            onFundPool={handleFundPool}
          />
        )}

        {activeTab === "architecture" && (
          <TechnicalArchitecture />
        )}

        {activeTab === "contract" && (
          <SettlementContract 
            totalMachines={machines.length} 
            totalPayouts={incidents.reduce((sum, inc) => sum + inc.payoutAmount, 0)} 
          />
        )}

      </main>

      {/* Portal footer stats */}
      <footer className="border-t border-slate-800/60 bg-slate-900/60 py-5 text-center text-xs text-slate-500 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono">
          <div>
            &copy; 2026 GuardianAI DePIN Technologies. Builtathon Phase 1 Core Node.
          </div>
          <div className="flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 rounded-full" />
              W3B_STATE: SYNCED
            </span>
            <span className="text-slate-800">|</span>
            <span>VER: 1.0.4-dev</span>
          </div>
        </div>
      </footer>

      {/* Payout Success Modal (Global HUD Overlay) */}
      {showPayoutModal && payoutModalDetails && (
        <div id="gp-payout-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl max-w-md w-full p-6 shadow-2xl shadow-emerald-500/15 relative overflow-hidden">
            {/* Ambient Accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />
            
            <button 
              onClick={handleReset}
              className="absolute top-4 right-4 text-slate-500 hover:text-white hover:bg-slate-800/50 p-1.5 rounded-lg transition-all duration-200"
              title="Close and Reset"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-4 pt-2">
              <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white uppercase font-mono tracking-tight">Payout Disbursed!</h3>
                <p className="text-slate-400 text-xs mt-1">Automatic DePIN Underwriting Settlement Resolved</p>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5 text-left text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500 font-semibold">INCIDENT_ID:</span>
                  <span className="text-white font-bold">#{payoutModalDetails.incidentID}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500 font-semibold">DEVICE_IOID:</span>
                  <span className="text-blue-400 truncate w-40 text-right">{payoutModalDetails.ioID}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500 font-semibold">AI EXONERATION:</span>
                  <span className="text-emerald-400 font-bold uppercase">{payoutModalDetails.verdict}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-900">
                  <span className="text-slate-500 font-semibold">RECIPIENT_PAYEE:</span>
                  <span className="text-slate-300 truncate w-40 text-right">{payoutModalDetails.owner}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-slate-400 font-bold text-xs uppercase">SETTLED Payout:</span>
                  <span className="text-emerald-400 font-black text-lg">{payoutModalDetails.payoutAmount} STC</span>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] text-left font-mono space-y-1">
                <div className="text-slate-500 font-semibold uppercase">Ledger Proof Tx Hash:</div>
                <div className="text-slate-400 text-xs break-all flex items-center justify-between gap-2.5">
                  <span className="truncate">{payoutModalDetails.txHash}</span>
                  <a 
                    href={`https://iotexscan.io/tx/${payoutModalDetails.txHash}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-0.5 shrink-0"
                  >
                    SCAN <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition duration-200 shadow-lg shadow-emerald-600/15 hover:shadow-emerald-500/25 cursor-pointer"
              >
                Okay / Return to Stream
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction History Modal Layer */}
      <TransactionHistoryModal 
        isOpen={isTxHistoryOpen} 
        onClose={() => setIsTxHistoryOpen(false)} 
        transactions={transactions}
      />
    </div>
  );
}
