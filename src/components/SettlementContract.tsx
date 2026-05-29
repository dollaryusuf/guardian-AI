import { useState } from "react";
import { Code, BookOpen, Shield, HelpCircle, Copy, Check, Zap, Cpu, Activity, Link as LinkIcon, Database } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export interface SettlementContractProps {
  totalMachines: number;
  totalPayouts: number;
}

export default function SettlementContract({ totalMachines, totalPayouts }: SettlementContractProps) {
  const [copied, setCopied] = useState(false);

  const contractSol = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GuardianInsurance {
    enum IncidentStatus { REPORTED, VERIFIED_PAYOUT, EXONERATED_DENIED, IN_REVIEW }

    struct Machine {
        string ioID;            // IoTeX Machine identity
        address owner;          // Wallet address of driver/owner
        uint256 premiumPaid;   // Insured pool balances
        uint256 coverageLimit; // Maximum stablecoin payout on accident
        bool isActive;          // Device status
    }

    struct Incident {
        uint256 id;
        address machineAddress;
        string videoCID;       // 0G Storage content ID containing 4K footage
        string telemetryCID;   // W3bstream monitored raw telemetry logs
        string faultVerdict;   // 0G AI Serving accident attribution summary
        IncidentStatus status;
        uint256 timestamp;
        uint256 payoutDistributed;
    }

    address public oracleNode;  // Authorized 0G Inference & W3bstream oracle proxy
    address public contractOwner;
    uint256 public totalIncidents;
    uint256 public totalPayoutsClaimed;

    mapping(address => Machine) public machines;
    mapping(uint256 => Incident) public incidents;
    mapping(string => bool) public reportedCIDs;

    constructor(address _oracleNode) payable {
        contractOwner = msg.sender;
        oracleNode = _oracleNode;
    }

    // Registers a micro-DePIN dashcam to IoTeX
    function registerMachine(
        address _machineAddress,
        string calldata _ioID,
        uint256 _coverageLimit
    ) external onlyContractOwner {
        machines[_machineAddress] = Machine({
            ioID: _ioID,
            owner: _machineAddress,
            premiumPaid: 0,
            coverageLimit: _coverageLimit,
            isActive: true
        });
    }

    // Reports crash detected under speed/accelerometer threshold 
    function reportIncident(
        address _machineAddress,
        string calldata _videoCID,
        string calldata _telemetryCID
    ) external returns (uint256) {
        require(!reportedCIDs[_videoCID], "Duplicate incident CID");
        reportedCIDs[_videoCID] = true;
        
        totalIncidents++;
        incidents[totalIncidents] = Incident({
            id: totalIncidents,
            machineAddress: _machineAddress,
            videoCID: _videoCID,
            telemetryCID: _telemetryCID,
            faultVerdict: "PENDING_ORACLE",
            status: IncidentStatus.REPORTED,
            timestamp: block.timestamp,
            payoutDistributed: 0
        });
        
        return totalIncidents;
    }

    // Evaluates 0G Serving AI consensus to dispatch instant stablecoin settlements
    function verifyAndPay(
        uint256 _incidentID,
        string calldata _faultVerdict,
        uint256 _payoutAmount
    ) external onlyOracle {
        Incident storage inc = incidents[_incidentID];
        require(inc.status == IncidentStatus.REPORTED, "Already settled");
        
        inc.faultVerdict = _faultVerdict;
        inc.payoutDistributed = _payoutAmount;
        totalPayoutsClaimed += _payoutAmount;
        
        if (_payoutAmount > 0) {
            inc.status = IncidentStatus.VERIFIED_PAYOUT;
            // Native ERC20 transfer logic omitted for brevity
        } else {
            inc.status = IncidentStatus.EXONERATED_DENIED;
        }
    }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(contractSol);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="contract-viewing-panel" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Code panel (Left 2 cols) */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#0b101a] border border-emerald-900/30 rounded-2xl p-6 flex flex-col h-[600px] shadow-[0_0_40px_rgba(16,185,129,0.03)] group">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-sans tracking-tight">GuardianInsurance.sol</h3>
                <p className="text-emerald-500/60 font-mono text-[10px] tracking-widest uppercase mt-0.5">IoTeX L1 Smart Contract</p>
              </div>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 p-2 bg-slate-900 hover:bg-slate-800 hover:text-white rounded-lg text-slate-400 border border-slate-800 hover:border-slate-700 transition duration-200 text-[10px] font-mono tracking-wider"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "COPIED" : "COPY CODE"}
            </button>
          </div>

          <div className="flex-1 overflow-auto rounded-xl border border-slate-800/50 bg-[#0d1424]">
             <SyntaxHighlighter 
               language="solidity" 
               style={vscDarkPlus}
               customStyle={{
                 background: 'transparent',
                 padding: '1.25rem',
                 fontSize: '11px',
                 lineHeight: '1.6',
                 margin: 0
               }}
               showLineNumbers
               lineNumberStyle={{ minWidth: '3.5em', paddingRight: '1em', color: '#475569', textAlign: 'right' }}
             >
               {contractSol}
             </SyntaxHighlighter>
          </div>
        </div>
      </div>

      {/* Right Column: Stats & Identity */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Live Stats */}
        <div className="bg-[#0b101a] border border-slate-800/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded">
              <Activity className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white uppercase tracking-widest font-mono">Ledger State</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">Contract Address (IoTeX)</div>
              <div className="flex items-center gap-2">
                <LinkIcon className="w-3.5 h-3.5 text-slate-600" />
                <span className="text-xs text-blue-400 font-mono font-bold bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  0x7B9A284Aa36B7382f1E5De5F
                </span>
              </div>
            </div>
            
            <div className="h-px bg-slate-800/50 w-full" />

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">Total Active Machines</div>
                 <div className="text-lg font-black text-white font-mono flex items-center gap-2">
                   {totalMachines}
                   <span className="text-[9px] text-slate-500 font-normal">NODES</span>
                 </div>
               </div>
               <div>
                 <div className="text-[10px] text-emerald-500/70 font-mono uppercase tracking-wider mb-1">Total Payouts</div>
                 <div className="text-lg font-black text-emerald-400 font-mono tracking-tight flex items-center gap-1.5">
                   ${totalPayouts}
                   <span className="text-[9px] text-emerald-500/50 font-normal">STC</span>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Oracle Identity Card */}
        <div className="bg-purple-950/10 border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden group hover:bg-purple-950/20 transition-colors shadow-[0_0_30px_rgba(168,85,247,0.05)]">
           <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-3xl rounded-full" />
           
           <div className="relative z-10">
             <div className="flex justify-between items-start mb-4">
               <div className="flex gap-3">
                 <div className="p-2.5 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/30">
                   <Cpu className="w-5 h-5" />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-white font-sans">Authorized 0G AI Oracle</h3>
                   <div className="text-[10px] text-purple-400 font-mono mt-0.5 tracking-wider">VERIFICATION NODE</div>
                 </div>
               </div>
               <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-bold font-mono rounded tracking-wider flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                 VERIFIED
               </div>
             </div>

             <div className="mt-5 space-y-2">
               <div className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Oracle Identity PubKey</div>
               <div className="text-[11px] text-slate-300 font-mono select-all bg-[#0a0a0a] p-2.5 rounded-lg border border-slate-800 break-all leading-relaxed">
                 0xEf3Bd91A084CbA23C87a0229D7D62571Aa189681
               </div>
             </div>
             
             <p className="text-[10px] text-slate-400 leading-relaxed mt-4 font-sans">
               This off-chain AI consensus node calculates crash impact vectors and invokes <span className="font-mono text-purple-400/80 bg-purple-900/30 px-1 py-0.5 rounded">verifyAndPay()</span> to execute the final contract verdict via zero-knowledge proofs.
             </p>
           </div>
        </div>

      </div>
    </div>
  );
}
