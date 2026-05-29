/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from "react";
import { 
  ChevronDown, 
  Copy, 
  LogOut, 
  Globe, 
  Check, 
  Wallet, 
  RefreshCw, 
  ArrowLeftRight 
} from "lucide-react";
import { bech32 } from "bech32";
import { toast } from "sonner";

// High-fidelity standard EVM <=> IoTeX address converters using 'bech32'
export function iotexToEvm(iotexAddress: string): string {
  try {
    if (!iotexAddress || !iotexAddress.startsWith("io")) {
      return iotexAddress;
    }
    const decoded = bech32.decode(iotexAddress);
    const bytes = bech32.fromWords(decoded.words);
    const hex = Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return "0x" + hex;
  } catch (e) {
    console.error("Failed to convert IoTeX address to EVM:", e);
    return iotexAddress;
  }
}

export function evmToIotex(evmAddress: string): string {
  try {
    const cleanAddress = evmAddress.startsWith("0x") ? evmAddress.slice(2) : evmAddress;
    if (cleanAddress.length !== 40) {
      return evmAddress;
    }
    const bytes = new Uint8Array(20);
    for (let i = 0; i < 20; i++) {
      bytes[i] = parseInt(cleanAddress.substring(i * 2, i * 2 + 2), 16);
    }
    const words = bech32.toWords(bytes);
    return bech32.encode("io", words);
  } catch (e) {
    console.error("Failed to convert EVM address to IoTeX:", e);
    return evmAddress;
  }
}

const DEFAULT_EVM_ADDRESS = "0x74391abcbcee8284561a3ec95e94b293aba5bee2";

interface WalletConnectProps {
  isConnected: boolean;
  setIsConnected: (connected: boolean) => void;
}

export default function WalletConnect({ isConnected, setIsConnected }: WalletConnectProps) {
  const [isEvm, setIsEvm] = useState(true); // default display 0x format
  const [evmAddress, setEvmAddress] = useState<string | null>(DEFAULT_EVM_ADDRESS);
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = async () => {
    if (!evmAddress) return;
    const currentAddress = isEvm ? evmAddress : evmToIotex(evmAddress);
    try {
      await navigator.clipboard.writeText(currentAddress);
      setIsCopied(true);
      toast.success("Address Copied!", {
        description: `Copied ${isEvm ? "EVM (0x)" : "IoTeX (io)"} formatted address to clipboard.`,
        duration: 2000,
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy address");
    }
  };

  const handleConnectSimulate = async () => {
    setIsConnecting(true);
    toast.loading("Synchronizing with IoTeX Secure Element...", { id: "connect-toast" });
    
    // Simulate web3 secure element handshake delay (exactly 1.0 seconds)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setEvmAddress(DEFAULT_EVM_ADDRESS);
    setIsEvm(true);
    setIsConnected(true);
    setIsConnecting(false);
    toast.success("Wallet connected!", {
      id: "connect-toast",
      description: "Secure element session started successfully.",
      duration: 3000,
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setEvmAddress(null);
    setIsOpen(false);
    toast.info("Secure hardware session terminated.", {
      duration: 3000,
    });
  };

  const getTruncatedAddress = (addr: string | null) => {
    if (!addr) return "";
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  const activeAddressLabel = evmAddress ? (isEvm ? evmAddress : evmToIotex(evmAddress)) : "";

  return (
    <div id="guardian-wallet-hud" className="relative" ref={dropdownRef}>
      {isConnected && evmAddress ? (
        <div>
          {/* Main Button with Connected pulse & Indicator */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-750 border border-slate-700 hover:border-slate-600 px-3 py-1.5 rounded-lg text-xs font-mono font-bold text-slate-300 transition duration-200 cursor-pointer shadow-md"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>{getTruncatedAddress(activeAddressLabel)}</span>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 font-bold transition transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {/* High-fidelity Custom Dropdown */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl border border-slate-800 bg-slate-900 shadow-2xl shadow-black/80 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 animate-fade-in p-1">
              {/* Profile/Identity Card */}
              <div className="px-3.5 py-3 border-b border-slate-800">
                <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Active Payee Node</span>
                <div className="mt-1 font-mono text-[10px] text-white select-all break-all leading-relaxed bg-slate-950 p-2 rounded-lg border border-slate-900">
                  {activeAddressLabel}
                </div>
              </div>

              {/* Operations Items */}
              <div className="py-1">
                {/* Copy Address */}
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-between w-full px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition duration-150 cursor-pointer"
                >
                  <span className="flex items-center gap-2 font-mono">
                    <Copy className="w-4 h-4 text-blue-400" />
                    Copy Address
                  </span>
                  {isCopied ? (
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <span className="text-[10px] text-slate-500 font-mono">EVM 0x</span>
                  )}
                </button>

                {/* Address Format Toggle */}
                <button
                  onClick={() => setIsEvm(!isEvm)}
                  className="flex items-center justify-between w-full px-3.5 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg transition duration-150 cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2 font-mono">
                    <ArrowLeftRight className="w-4 h-4 text-teal-400" />
                    Format: {isEvm ? "EVM format (0x)" : "IoTeX format (io)"}
                  </span>
                  <div className="w-8 h-4 bg-slate-850 rounded-full p-0.5 transition duration-200 relative">
                    <div className={`w-3.5 h-3 bg-teal-500 rounded-full transition transform duration-200 ${isEvm ? "translate-x-0" : "translate-x-4"}`} />
                  </div>
                </button>
              </div>

              {/* Terminate Session / Disconnect */}
              <div className="border-t border-slate-800/80 p-1 mt-1">
                <button
                  onClick={handleDisconnect}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition duration-150 cursor-pointer font-mono"
                >
                  <LogOut className="w-4 h-4 text-red-500" />
                  Disconnect Wallet
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleConnectSimulate}
          disabled={isConnecting}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98] border border-cyan-400/30 text-white px-4 py-1.5 rounded-lg text-xs font-semibold select-none shadow-md shadow-cyan-500/10 cursor-pointer transition duration-200"
        >
          {isConnecting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
              <span>Connecting Handshake...</span>
            </>
          ) : (
            <>
              <Wallet className="w-3.5 h-3.5 text-cyan-200" />
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
