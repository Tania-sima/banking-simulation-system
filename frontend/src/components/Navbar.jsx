import React, { useState } from 'react';
import { Search, Receipt, Bell, Menu, X, ArrowRight } from 'lucide-react';

export const UnityPayLogo = ({ showTagline = true, iconSize = 34, textSize = "text-xl" }) => (
  <div className="flex items-center space-x-2.5 select-none">
    <svg width={iconSize} height={iconSize} viewBox="0 0 100 100" fill="none" className="shrink-0 drop-shadow-xs">
      <defs>
        <linearGradient id="upNavyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B2545" />
          <stop offset="100%" stopColor="#134074" />
        </linearGradient>
        <linearGradient id="upBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1D63B8" />
          <stop offset="100%" stopColor="#0077B6" />
        </linearGradient>
        <linearGradient id="upTealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00A896" />
          <stop offset="100%" stopColor="#028090" />
        </linearGradient>
        <linearGradient id="upCyanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#05B292" />
          <stop offset="100%" stopColor="#00C49F" />
        </linearGradient>
      </defs>
      <path d="M 50 8 C 73 8 92 27 92 50 C 92 65 84 78 72 85 C 80 77 82 63 80 52 C 78 35 63 20 45 20 C 37 20 28 23 22 28 C 30 16 39 8 50 8 Z" fill="url(#upNavyGrad)" />
      <path d="M 22 28 C 13 36 8 47 8 60 C 8 78 22 92 40 92 C 55 92 68 83 74 70 C 65 77 53 79 42 77 C 28 74 19 62 20 48 C 20 41 21 34 22 28 Z" fill="url(#upBlueGrad)" />
      <path d="M 45 20 C 62 20 74 34 72 50 C 70 63 59 73 45 74 C 34 75 25 68 25 57 C 25 48 32 41 40 40 C 50 39 58 45 57 53 C 56 59 50 63 45 63 C 51 63 54 57 54 52 C 54 47 48 44 42 45 C 36 46 32 51 32 57 C 32 64 39 69 47 68 C 57 67 65 59 66 49 C 68 36 57 26 44 26 C 36 26 30 29 25 33 C 31 25 37 20 45 20 Z" fill="url(#upTealGrad)" />
      <path d="M 74 70 C 68 83 55 92 40 92 C 48 92 58 87 64 80 C 70 73 72 65 72 56 C 72 62 73 66 74 70 Z" fill="url(#upCyanGrad)" />
    </svg>
    <div className="flex flex-col leading-none">
      <div className={`font-black tracking-tight ${textSize} flex items-center`}>
        <span className="text-[#0B2545]">Unity</span>
        <span className="text-[#028090] ml-1">Pay</span>
      </div>
      {showTagline && (
        <span className="text-[7.5px] font-bold text-slate-400 tracking-[0.22em] uppercase mt-0.5">
          SECURE • SEAMLESS • TRUSTED
        </span>
      )}
    </div>
  </div>
);

export default function Navbar({ 
  onToggleMobileMenu, 
  onOpenBillModal, 
  notifications, 
  unreadCount, 
  notificationOpen, 
  setNotificationOpen, 
  onClearNotifications, 
  userProfile, 
  userInitials, 
  onOpenProfileModal,
  onNavigateHome,
  beneficiaries = [],
  transactions = [],
  onSelectBeneficiary
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // Live filter for search
  const filteredBeneficiaries = searchQuery.trim() === '' ? [] : beneficiaries.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.accountNo.includes(searchQuery) ||
    b.provider.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTransactions = searchQuery.trim() === '' ? [] : transactions.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.ref && t.ref.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const hasResults = filteredBeneficiaries.length > 0 || filteredTransactions.length > 0;

  return (
    <header className="w-full bg-white border-b border-slate-200/80 px-4 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      <div className="flex items-center space-x-3">
        <button onClick={onToggleMobileMenu} className="md:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer">
          <Menu className="w-5 h-5" />
        </button>
        <div className="cursor-pointer" onClick={onNavigateHome}>
          <UnityPayLogo showTagline={true} />
        </div>
      </div>

      {/* Real Functional Live Search Bar */}
      <div className="relative hidden sm:flex flex-1 max-w-md mx-6">
        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 flex items-center space-x-2 text-xs text-slate-400 focus-within:border-[#028090] focus-within:bg-white transition">
          <Search className="w-3.5 h-3.5 text-[#028090]" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            placeholder="Search beneficiary, transaction ID, or biller..." 
            className="bg-transparent border-none outline-none text-slate-700 w-full placeholder:text-slate-400 text-xs" 
          />
          {searchQuery && (
            <X className="w-3 h-3 text-slate-400 cursor-pointer hover:text-slate-600" onClick={() => setSearchQuery('')} />
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {searchFocused && searchQuery.trim() !== '' && (
          <div 
            className="absolute left-0 top-11 w-full bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-3 max-h-80 overflow-y-auto"
            onMouseDown={(e) => e.preventDefault()}
          >
            {!hasResults ? (
              <p className="text-xs text-slate-400 p-2 text-center">No matching records found.</p>
            ) : (
              <div className="space-y-3">
                {filteredBeneficiaries.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Beneficiaries</span>
                    {filteredBeneficiaries.map(b => (
                      <div 
                        key={b.id} 
                        onClick={() => {
                          onSelectBeneficiary(b);
                          setSearchQuery('');
                          setSearchFocused(false);
                        }}
                        className="p-2 hover:bg-slate-50 rounded-lg flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <p className="text-xs font-bold text-slate-800">{b.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{b.accountNo} • {b.provider}</p>
                        </div>
                        <ArrowRight className="w-3 h-3 text-[#028090]" />
                      </div>
                    ))}
                  </div>
                )}

                {filteredTransactions.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Transactions</span>
                    {filteredTransactions.map(t => (
                      <div key={t.id} className="p-2 hover:bg-slate-50 rounded-lg flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{t.name}</p>
                          <p className="text-[10px] text-slate-400">{t.ref} • {t.date}</p>
                        </div>
                        <span className="text-xs font-bold text-slate-800">Rp {t.amount.toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-3">
        <button 
          onClick={onOpenBillModal} 
          className="flex items-center space-x-1.5 bg-[#028090]/10 hover:bg-[#028090]/20 text-[#028090] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer"
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Pay Bill</span>
        </button>

        <div className="relative">
          <button 
            onClick={() => setNotificationOpen(!notificationOpen)} 
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center text-xs cursor-pointer transition relative"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 p-4">
              <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
                <span className="text-xs font-bold text-[#0B2545]">Account Activity Alerts</span>
                <button onClick={onClearNotifications} className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer">
                  Clear all
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50 mt-2">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">No activity logged yet</div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className="py-2.5 flex items-start space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#028090] mt-1.5 shrink-0"></span>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-slate-800 leading-tight">{n.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{n.description}</p>
                        <span className="text-[9px] text-slate-400">{n.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div 
          onClick={onOpenProfileModal} 
          title="Click to view & edit profile" 
          className="w-8 h-8 rounded-full bg-linear-to-tr from-[#0B2545] to-[#028090] text-white flex items-center justify-center text-xs font-bold shadow-xs cursor-pointer hover:ring-2 hover:ring-[#028090] transition overflow-hidden"
        >
          {userProfile.avatarUrl ? (
            <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
          ) : (
            <span>{userInitials}</span>
          )}
        </div>
      </div>
    </header>
  );
}