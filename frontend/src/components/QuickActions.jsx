import React from 'react';
import { Send, PiggyBank, ArrowRightLeft, Smartphone } from 'lucide-react';

export default function QuickActions({ onOpenModal }) {
  const actions = [
    { id: 'send', label: 'Send Money', icon: Send, color: 'text-[#028090]', hover: 'hover:border-[#028090]' },
    { id: 'add', label: 'Add Money', icon: PiggyBank, color: 'text-[#0077B6]', hover: 'hover:border-[#0077B6]' },
    { id: 'cashout', label: 'Cash Out', icon: ArrowRightLeft, color: 'text-amber-500', hover: 'hover:border-amber-400' },
    { id: 'recharge', label: 'Recharge', icon: Smartphone, color: 'text-[#134074]', hover: 'hover:border-[#134074]' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {actions.map(act => {
        const Icon = act.icon;
        return (
          <button
            key={act.id}
            onClick={() => onOpenModal(act.id)}
            className={`p-4 rounded-2xl border border-slate-100 ${act.hover} bg-slate-50/50 hover:bg-white text-left transition shadow-xs group cursor-pointer`}
          >
            <Icon className={`w-5 h-5 ${act.color} mb-2 group-hover:scale-110 transition`} />
            <p className="text-sm font-bold text-slate-900">{act.label}</p>
          </button>
        );
      })}
    </div>
  );
}