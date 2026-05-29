/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Plus, Disc, ShieldAlert, Coins, Library, User, Laptop } from "lucide-react";
import { Machine } from "../types";

interface MachineIDRegistryProps {
  machines: Machine[];
  onAddMachine: (machine: Machine) => void;
  poolBalance: number;
  onFundPool: (amount: number) => void;
}

export default function MachineIDRegistry({
  machines,
  onAddMachine,
  poolBalance,
  onFundPool,
}: MachineIDRegistryProps) {
  const [newIoID, setNewIoID] = useState("");
  const [newLimit, setNewLimit] = useState(100);
  const [fundAmount, setFundAmount] = useState(10);
  const [errorLoc, setErrorLoc] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIoID.trim()) {
      setErrorLoc("Please provide a valid ioID identifier");
      return;
    }
    setErrorLoc("");
    
    // Generate mock random address
    const randomHex = Math.random().toString(16).substring(2, 42).padEnd(40, "0");
    const machineAddress = "0x" + randomHex;
    const driverAddress = "0xDriver" + Math.random().toString(16).substring(2, 8).padEnd(32, "a");

    const machineObj: Machine = {
      address: machineAddress,
      ioID: `ioID:iotex:${newIoID.toLowerCase().trim()}`,
      owner: driverAddress,
      premiumBalance: 0,
      coverageLimit: newLimit,
      isActive: true,
      registeredAt: Date.now(),
    };

    onAddMachine(machineObj);
    setNewIoID("");
  };

  const handleFunding = (e: React.FormEvent) => {
    e.preventDefault();
    if (fundAmount <= 0) return;
    onFundPool(fundAmount);
    setFundAmount(10);
  };

  return (
    <div id="dev-machine-registry" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Onboard form & Pool action */}
      <div className="space-y-6">
        {/* Machine Registry */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-800">
            <div className="p-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Register Dashcam</h3>
              <p className="text-slate-400 text-xs text-wrap">Onboard DePIN machine onto IoTeX L1 ioID registry</p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase font-mono tracking-wider">
                Machine Name (for ioID)
              </label>
              <input
                type="text"
                placeholder="e.g. guardian-cam-x5"
                value={newIoID}
                onChange={(e) => setNewIoID(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3.5 py-2 text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-600 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold mb-1.5 uppercase font-mono tracking-wider">
                Max Insurance Coverage Limit (Stablecoins)
              </label>
              <select
                value={newLimit}
                onChange={(e) => setNewLimit(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value={100}>100 STC (Basic Coverage)</option>
                <option value={250}>250 STC (Premium Tier)</option>
                <option value={500}>500 STC (Supreme Hardware Tier)</option>
              </select>
            </div>

            {errorLoc && <p className="text-red-400 text-xs">{errorLoc}</p>}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Onboard & Generate ioID
            </button>
          </form>
        </div>

        {/* Insurance Payout Reserve Pool */}
        <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Coins className="text-cyan-400 w-5 h-5" />
              <h3 className="text-lg font-bold text-white">Settlement Pool</h3>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 font-mono tracking-wide uppercase">Reserves</div>
              <div className="text-xl font-black text-cyan-400 font-mono">{poolBalance.toFixed(0)} STC</div>
            </div>
          </div>

          <p className="text-slate-400 text-xs mb-4 leading-relaxed">
            The smart contract requires underlying token liquidity pools to facilitate instant claims reimbursement and settlement disbursements after a verified incident verdict.
          </p>

          <form onSubmit={handleFunding} className="flex gap-2">
            <input
              type="number"
              min={1}
              value={fundAmount}
              onChange={(e) => setFundAmount(Number(e.target.value))}
              className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-cyan-500 font-mono text-center"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 hover:text-cyan-300 font-semibold text-xs rounded-lg transition"
            >
              Fund Pool
            </button>
          </form>
        </div>
      </div>

      {/* Grid of registered machines */}
      <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 p-6 flex flex-col h-full">
        <h3 className="text-lg font-bold text-white mb-2">Active ioID Secure Element Registries</h3>
        <p className="text-slate-400 text-xs mb-4">
          Verified dashcam hardware registered on IoTeX L1 node directories with secure elements.
        </p>

        <div className="flex-1 overflow-auto space-y-3 max-h-[460px] pr-2">
          {machines.map((mac, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition duration-150"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Disc className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="text-sm font-semibold text-white font-mono">{mac.ioID}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1 pt-1 text-[11px] text-slate-500 font-mono">
                  <div>
                    <span className="text-slate-600 font-semibold">ELEMENT_SMC:</span> {mac.address}
                  </div>
                  <div>
                    <span className="text-slate-600 font-semibold">DRIVER_OWN:</span> {mac.owner}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6">
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Max Coverage</span>
                  <span className="text-sm font-bold text-blue-400 font-mono">{mac.coverageLimit} STC</span>
                </div>
                
                <div className="text-left md:text-right">
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Status</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}

          {machines.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-slate-800 rounded-xl p-8 text-center bg-slate-950/20">
              <ShieldAlert className="w-8 h-8 text-slate-600 mb-2" />
              <p className="text-slate-500 text-sm font-medium">No micro-DePIN devices whitelisted yet.</p>
              <p className="text-slate-600 text-xs max-w-sm mt-1">
                Onboard your first Guardian dashcam camera hardware configuration using the form.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
