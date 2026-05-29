import { 
  X, 
  ExternalLink, 
  Cpu, 
  AlertTriangle, 
  Coins, 
  CheckCircle2, 
  Clock,
  Zap
} from "lucide-react";

export interface Transaction {
  id: string;
  hash: string;
  type: "payout" | "reportIncident" | "registerMachine" | "connect";
  title: string;
  description: string;
  time: string;
  status: "success";
}

export interface TransactionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export default function TransactionHistoryModal({ isOpen, onClose, transactions }: TransactionHistoryModalProps) {
  if (!isOpen) return null;

  const renderIcon = (type: string) => {
    switch (type) {
      case "payout":
        return <Coins className="w-4 h-4 text-emerald-400" />;
      case "reportIncident":
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "registerMachine":
        return <Cpu className="w-4 h-4 text-blue-400" />;
      default:
        return <Zap className="w-4 h-4 text-slate-400" />;
    }
  };

  const renderColor = (type: string) => {
    switch (type) {
      case "payout":
        return "bg-emerald-500/10 border-emerald-500/20";
      case "reportIncident":
        return "bg-amber-500/10 border-amber-500/20";
      case "registerMachine":
        return "bg-blue-500/10 border-blue-500/20";
      default:
        return "bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 drop-shadow-2xl font-sans">
      {/* Blurred background overlay */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-slate-900 border border-slate-700/60 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh] animate-fade-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-800 rounded-lg shadow-sm border border-slate-700/50">
              <Clock className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight uppercase font-mono tracking-tight">Ledger Logs</h2>
              <p className="text-slate-400 text-[11px] uppercase tracking-wide">Recent IoTeX Interledger Events</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-slate-950/30">
          {transactions.map((tx) => (
            <div 
              key={tx.id} 
              className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 hover:border-slate-700 transition-colors group relative overflow-hidden"
            >
              {/* Vertical accent strip aligned with tx type */}
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                tx.type === 'payout' ? 'bg-emerald-500' : 
                tx.type === 'reportIncident' ? 'bg-amber-500' : 'bg-blue-500'
              }`} />

              <div className="flex justify-between items-start pl-2">
                <div className="flex gap-3">
                  <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center border shrink-0 ${renderColor(tx.type)}`}>
                    {renderIcon(tx.type)}
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-200 uppercase font-mono tracking-tight">{tx.title}</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">{tx.description}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-slate-500 font-mono tracking-tight bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {tx.hash}
                      </span>
                      <a href="#" className="text-blue-500/70 hover:text-blue-400 transition-colors" title="View on IoTeX Explorer (Mock)">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{tx.time}</span>
                  <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-500/80 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" />
                    Success
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-[11px] text-slate-500 relative z-10 w-full">
            <span className="uppercase tracking-wider font-mono">Synced to IoTeX Mainnet</span>
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
                LIVE
            </div>
        </div>
      </div>
    </div>
  );
}
