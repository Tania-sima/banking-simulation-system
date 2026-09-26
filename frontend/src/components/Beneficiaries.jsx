import React from 'react';
import { UserCheck } from 'lucide-react';

export default function Beneficiaries({ beneficiaries, onSelectBeneficiary }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-xs text-[#0B2545]">Saved Transfer Beneficiaries</h3>
          <p className="text-[11px] text-slate-400">Select any contact for quick transfer</p>
        </div>
        <UserCheck className="w-4 h-4 text-[#028090]" />
      </div>

      {/* Strictly 2 cards in 1 row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {beneficiaries.map((acc) => (
          <div 
            key={acc.id} 
            onClick={() => onSelectBeneficiary(acc)}
            className="p-4 rounded-xl border border-slate-200/70 hover:border-[#028090] bg-slate-50/40 hover:bg-[#028090]/5 cursor-pointer transition flex items-center justify-between group shadow-2xs"
          >
            <div>
              <p className="text-xs font-bold text-slate-800 leading-snug group-hover:text-[#028090] transition">
                {acc.name}
              </p>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                {acc.accountNo}
              </p>
            </div>

            {/* Clean Badge Only - No redundant MFS Wallet / Commercial Bank text */}
            <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold tracking-wide uppercase shrink-0 ${
              acc.provider === 'bKash' ? 'bg-pink-100 text-pink-700' :
              acc.provider === 'Nagad' ? 'bg-orange-100 text-orange-700' :
              acc.provider === 'Rocket' ? 'bg-purple-100 text-purple-700' :
              acc.provider === 'BRAC Bank' ? 'bg-blue-100 text-blue-800' :
              acc.provider === 'City Bank' ? 'bg-slate-200 text-slate-800' :
              'bg-[#0B2545]/10 text-[#0B2545]'
            }`}>
              {acc.provider}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}