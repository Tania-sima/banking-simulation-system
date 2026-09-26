import React from 'react';
import { LayoutDashboard, ArrowRightLeft, PiggyBank, Settings } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, mobileMenuOpen, setMobileMenuOpen }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transaction', label: 'Transaction', icon: ArrowRightLeft },
    { id: 'deposit', label: 'Deposit', icon: PiggyBank },
    { id: 'settings', label: 'Setting', icon: Settings },
  ];

  return (
    <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:flex w-full md:w-20 lg:w-56 border-r border-slate-200/80 flex-col py-6 bg-white shrink-0`}>
      <nav className="flex flex-col space-y-1.5 px-3 w-full">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false); }}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                isActive ? 'bg-[#028090]/10 text-[#028090] font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="md:hidden lg:inline-block">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}