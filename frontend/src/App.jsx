import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  PiggyBank, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Search, 
  Send, 
  Smartphone, 
  Receipt, 
  UserCheck, 
  Building2, 
  Wallet, 
  Menu, 
  X,
  CreditCard
} from 'lucide-react';

const CURRENT_ACCOUNT_NUMBER = '6789';
const DEFAULT_PIN = '1234';

// Custom Unity Pay Scalable Vector Logo Component
const UnityPayLogo = ({ showTagline = true, iconSize = 38, textSize = "text-xl" }) => (
  <div className="flex items-center space-x-3 select-none">
    {/* Swirling Ribbon Vector Icon */}
    <svg 
      width={iconSize} 
      height={iconSize} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 drop-shadow-xs"
    >
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

      {/* Outer Deep Navy Crest */}
      <path 
        d="M 50 8 C 73 8 92 27 92 50 C 92 65 84 78 72 85 C 80 77 82 63 80 52 C 78 35 63 20 45 20 C 37 20 28 23 22 28 C 30 16 39 8 50 8 Z" 
        fill="url(#upNavyGrad)" 
      />
      {/* Mid Ocean Blue Ribbon */}
      <path 
        d="M 22 28 C 13 36 8 47 8 60 C 8 78 22 92 40 92 C 55 92 68 83 74 70 C 65 77 53 79 42 77 C 28 74 19 62 20 48 C 20 41 21 34 22 28 Z" 
        fill="url(#upBlueGrad)" 
      />
      {/* Dynamic S-Curve Center Cyan Ribbon */}
      <path 
        d="M 45 20 C 62 20 74 34 72 50 C 70 63 59 73 45 74 C 34 75 25 68 25 57 C 25 48 32 41 40 40 C 50 39 58 45 57 53 C 56 59 50 63 45 63 C 51 63 54 57 54 52 C 54 47 48 44 42 45 C 36 46 32 51 32 57 C 32 64 39 69 47 68 C 57 67 65 59 66 49 C 68 36 57 26 44 26 C 36 26 30 29 25 33 C 31 25 37 20 45 20 Z" 
        fill="url(#upTealGrad)" 
      />
      {/* Lower Wing Accent Ribbon */}
      <path 
        d="M 74 70 C 68 83 55 92 40 92 C 48 92 58 87 64 80 C 70 73 72 65 72 56 C 72 62 73 66 74 70 Z" 
        fill="url(#upCyanGrad)" 
      />
    </svg>

    {/* Brand Text Header */}
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

// Beneficiary Accounts
const BENEFICIARY_ACCOUNTS = [
  { id: 'b1', name: 'Global Ventures Ltd', accountNo: '20491823901', channel: 'Bank', bankName: 'City Bank Ltd' },
  { id: 'b2', name: 'Tanvir Ahmed', accountNo: '01711002233', channel: 'Wallet', bankName: 'bKash Personal' },
  { id: 'b3', name: 'Michael Liu', accountNo: '01899221100', channel: 'Wallet', bankName: 'Nagad Wallet' },
  { id: 'b4', name: 'Mary Moore', accountNo: '98451203941', channel: 'Bank', bankName: 'Brac Bank PLC' }
];

export default function BankingSimulationSystem() {
  const [activeTab, setActiveTab] = useState('transaction');
  const [showBalance, setShowBalance] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Balances stored directly in React State
  const [bankBalance, setBankBalance] = useState(() => {
    const saved = localStorage.getItem('bank_sim_bankBalance');
    return saved !== null ? parseFloat(saved) : 10750000;
  });

  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('bank_sim_walletBalance');
    return saved !== null ? parseFloat(saved) : 250000;
  });

  // Recorded Transactions
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('bank_sim_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return [
      { id: 1, name: '01939848778', category: 'Wallet Transfer', source: 'Bank Account', date: '9/26/2026, 6:25:15 AM', amount: 100, type: 'Expend' },
      { id: 2, name: 'Global Ventures Ltd', category: 'Corporate Deposit', source: 'Bank Account', date: '3/2/2022, 10:10 pm', amount: 6000000, type: 'Income' },
      { id: 3, name: 'Michael Liu', category: 'P2P Transfer', source: 'Virtual Wallet', date: '1/2/2022, 09:14 pm', amount: 300000, type: 'Expend' },
      { id: 4, name: 'Mary Moore', category: 'Freelance Payout', source: 'Virtual Wallet', date: '31/1/2022, 03:07 am', amount: 450000, type: 'Expend' }
    ];
  });

  // Reminders
  const [reminders, setReminders] = useState([
    { id: 1, title: 'Salary', category: 'Money', amount: 'Rp 6.000.000', type: 'credit' },
    { id: 2, title: 'Deposit Inter...', category: 'Money', amount: 'Rp 35.000', type: 'credit' },
    { id: 3, title: 'Electricity', category: 'Money', amount: 'Rp 220.000', type: 'debit' },
    { id: 4, title: 'Wi-Fi', category: 'Money', amount: 'Rp 330.000', type: 'debit' }
  ]);

  // Sync balances and transactions
  useEffect(() => {
    localStorage.setItem('bank_sim_bankBalance', bankBalance.toString());
  }, [bankBalance]);

  useEffect(() => {
    localStorage.setItem('bank_sim_walletBalance', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('bank_sim_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Modal State
  const [activeModal, setActiveModal] = useState(null);
  const [formInput, setFormInput] = useState({
    sendChannel: 'bank_to_bank',
    addChannel: 'bank_to_wallet',
    recipient: '',
    recipientName: '',
    amount: '',
    pin: '',
    billSource: 'Bank Account',
    utilityProvider: 'DESCO Electricity',
    customerMeterId: '',
    billingMonth: 'October 2026',
    reminderTitle: '',
    reminderAmount: ''
  });

  // EMI Calculator
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [loanRate, setLoanRate] = useState(9.5);
  const [loanYears, setLoanYears] = useState(2);

  const calculateEMI = () => {
    const r = (loanRate / 12) / 100;
    const n = loanYears * 12;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return isNaN(emi) ? 0 : Math.round(emi).toLocaleString('id-ID');
  };

  // Transaction Handler
  const handleExecuteTransaction = (e) => {
    e.preventDefault();
    const val = parseFloat(formInput.amount);
    if (!val || val <= 0) return alert('Please enter a valid amount.');

    if (formInput.pin !== DEFAULT_PIN) {
      return alert(`Incorrect Security PIN. Default PIN is ${DEFAULT_PIN}`);
    }

    const nowFormatted = new Date().toLocaleString();

    // 1. SEND MONEY (4 Channels)
    if (activeModal === 'send') {
      const channel = formInput.sendChannel;
      const targetName = formInput.recipientName || formInput.recipient;

      if (channel === 'bank_to_bank') {
        if (bankBalance < val) return alert('Insufficient Bank Balance.');
        setBankBalance(prev => prev - val);
        setTransactions(prev => [
          { id: Date.now(), name: targetName, category: 'Bank → Bank Transfer', source: 'Bank Account', date: nowFormatted, amount: val, type: 'Expend' },
          ...prev
        ]);
      } else if (channel === 'bank_to_wallet') {
        if (bankBalance < val) return alert('Insufficient Bank Balance.');
        setBankBalance(prev => prev - val);
        setTransactions(prev => [
          { id: Date.now(), name: targetName, category: 'Bank → Wallet Transfer', source: 'Bank Account', date: nowFormatted, amount: val, type: 'Expend' },
          ...prev
        ]);
      } else if (channel === 'wallet_to_bank') {
        if (walletBalance < val) return alert('Insufficient Virtual Wallet Balance.');
        setWalletBalance(prev => prev - val);
        setTransactions(prev => [
          { id: Date.now(), name: targetName, category: 'Wallet → Bank Transfer', source: 'Virtual Wallet', date: nowFormatted, amount: val, type: 'Expend' },
          ...prev
        ]);
      } else if (channel === 'wallet_to_wallet') {
        if (walletBalance < val) return alert('Insufficient Virtual Wallet Balance.');
        setWalletBalance(prev => prev - val);
        setTransactions(prev => [
          { id: Date.now(), name: targetName, category: 'Wallet → Wallet Transfer', source: 'Virtual Wallet', date: nowFormatted, amount: val, type: 'Expend' },
          ...prev
        ]);
      }
    } 
    // 2. ADD MONEY (2 Channels)
    else if (activeModal === 'add') {
      const channel = formInput.addChannel;

      if (channel === 'bank_to_wallet') {
        if (bankBalance < val) return alert('Insufficient Bank Balance.');
        setBankBalance(prev => prev - val);
        setWalletBalance(prev => prev + val);
        setTransactions(prev => [
          { id: Date.now(), name: 'Internal Top-Up', category: 'Bank → Wallet Top-Up', source: 'Virtual Wallet', date: nowFormatted, amount: val, type: 'Income' },
          ...prev
        ]);
      } else if (channel === 'wallet_to_bank') {
        if (walletBalance < val) return alert('Insufficient Wallet Balance.');
        setWalletBalance(prev => prev - val);
        setBankBalance(prev => prev + val);
        setTransactions(prev => [
          { id: Date.now(), name: 'Wallet Sweep', category: 'Wallet → Bank Fund Sweep', source: 'Bank Account', date: nowFormatted, amount: val, type: 'Income' },
          ...prev
        ]);
      }
    }
    // 3. CASH OUT
    else if (activeModal === 'cashout') {
      if (walletBalance < val) return alert('Insufficient Wallet Balance.');
      setWalletBalance(prev => prev - val);
      setTransactions(prev => [
        { id: Date.now(), name: `Agent (${formInput.recipient})`, category: 'Cash Out Payout', source: 'Virtual Wallet', date: nowFormatted, amount: val, type: 'Expend' },
        ...prev
      ]);
    }
    // 4. MOBILE RECHARGE
    else if (activeModal === 'recharge') {
      if (walletBalance < val) return alert('Insufficient Wallet Balance.');
      setWalletBalance(prev => prev - val);
      setTransactions(prev => [
        { id: Date.now(), name: `Recharge (${formInput.recipient})`, category: 'Mobile Top-up', source: 'Virtual Wallet', date: nowFormatted, amount: val, type: 'Expend' },
        ...prev
      ]);
    }
    // 5. BILL PAY
    else if (activeModal === 'bill') {
      if (formInput.billSource === 'Bank Account') {
        if (bankBalance < val) return alert('Insufficient Bank Balance to pay bill.');
        setBankBalance(prev => prev - val);
      } else {
        if (walletBalance < val) return alert('Insufficient Wallet Balance to pay bill.');
        setWalletBalance(prev => prev - val);
      }
      setTransactions(prev => [
        { 
          id: Date.now(), 
          name: `${formInput.utilityProvider} [${formInput.customerMeterId || 'Bill No.'}]`, 
          category: `Utility Bill (${formInput.billingMonth})`, 
          source: formInput.billSource, 
          date: nowFormatted, 
          amount: val, 
          type: 'Expend' 
        },
        ...prev
      ]);
    }

    setFormInput({
      sendChannel: 'bank_to_bank',
      addChannel: 'bank_to_wallet',
      recipient: '',
      recipientName: '',
      amount: '',
      pin: '',
      billSource: 'Bank Account',
      utilityProvider: 'DESCO Electricity',
      customerMeterId: '',
      billingMonth: 'October 2026',
      reminderTitle: '',
      reminderAmount: ''
    });
    setActiveModal(null);
    alert('Transaction executed successfully!');
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!formInput.reminderTitle || !formInput.reminderAmount) return alert('Please enter all reminder details.');
    setReminders(prev => [
      ...prev,
      {
        id: Date.now(),
        title: formInput.reminderTitle,
        category: 'Money',
        amount: `Rp ${Number(formInput.reminderAmount).toLocaleString('id-ID')}`,
        type: 'debit'
      }
    ]);
    setFormInput({ ...formInput, reminderTitle: '', reminderAmount: '' });
    setActiveModal(null);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      
      {/* Edge-to-Edge Navigation Header */}
      <header className="w-full bg-white border-b border-slate-200/80 px-4 lg:px-8 py-3 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="cursor-pointer" onClick={() => setActiveTab('transaction')}>
            <UnityPayLogo showTagline={true} iconSize={36} textSize="text-xl" />
          </div>
        </div>

        <div className="hidden sm:flex flex-1 max-w-md mx-6">
          <div className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 flex items-center space-x-2 text-xs text-slate-400 focus-within:border-[#028090] focus-within:bg-white transition">
            <Search className="w-3.5 h-3.5 text-[#028090]" />
            <input 
              type="text" 
              placeholder="Search beneficiary, transaction ID, or biller..." 
              className="bg-transparent border-none outline-none text-slate-700 w-full placeholder:text-slate-400 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setActiveModal('bill')} 
            className="hidden sm:flex items-center space-x-1.5 bg-[#028090]/10 hover:bg-[#028090]/20 text-[#028090] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition"
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>Pay Bill</span>
          </button>
          <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center text-xs cursor-pointer">
            🔔
          </span>
          <div className="w-8 h-8 rounded-full bg-linear-to-tr from-[#0B2545] to-[#028090] text-white flex items-center justify-center text-xs font-bold shadow-xs">
            TA
          </div>
        </div>
      </header>

      {/* Main Full-Size Body */}
      <div className="flex-1 flex flex-col md:flex-row w-full">
        
        {/* Left Vertical Menu */}
        <aside className={`${mobileMenuOpen ? 'block' : 'hidden'} md:flex w-full md:w-20 lg:w-56 border-r border-slate-200/80 flex-col py-6 bg-white shrink-0`}>
          <nav className="flex flex-col space-y-1.5 px-3 w-full">
            <button 
              onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }} 
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${activeTab === 'dashboard' ? 'bg-[#028090]/10 text-[#028090] font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span className="md:hidden lg:inline-block">Dashboard</span>
            </button>

            <button 
              onClick={() => { setActiveTab('transaction'); setMobileMenuOpen(false); }} 
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${activeTab === 'transaction' ? 'bg-[#028090]/10 text-[#028090] font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <ArrowRightLeft className="w-4 h-4 shrink-0" />
              <span className="md:hidden lg:inline-block">Transaction</span>
            </button>

            <button 
              onClick={() => { setActiveTab('deposit'); setMobileMenuOpen(false); }} 
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${activeTab === 'deposit' ? 'bg-[#028090]/10 text-[#028090] font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <PiggyBank className="w-4 h-4 shrink-0" />
              <span className="md:hidden lg:inline-block">Deposit</span>
            </button>

            <button 
              onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false); }} 
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${activeTab === 'settings' ? 'bg-[#028090]/10 text-[#028090] font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span className="md:hidden lg:inline-block">Setting</span>
            </button>
          </nav>
        </aside>

        {/* Center Main Workspace */}
        <main className="flex-1 p-4 lg:p-8 flex flex-col bg-white overflow-x-hidden">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2">
            <div>
              <h1 className="text-xl font-bold text-[#0B2545] capitalize">{activeTab}</h1>
              <p className="text-xs text-slate-400">Unity Pay Verified • Account #{CURRENT_ACCOUNT_NUMBER}</p>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-auto bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] text-slate-600 font-medium">Secured by UnityShield</span>
            </div>
          </div>

          {/* VIEW: Transaction */}
          {activeTab === 'transaction' && (
            <div className="space-y-6">
              
              {/* Quick Action Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                <button 
                  onClick={() => setActiveModal('send')} 
                  className="p-4 rounded-2xl border border-slate-100 hover:border-[#028090] bg-slate-50/50 hover:bg-white text-left transition shadow-xs group"
                >
                  <Send className="w-5 h-5 text-[#028090] mb-2 group-hover:scale-110 transition" />
                  <p className="text-xs font-bold text-slate-900">Send Money</p>
                  <p className="text-[11px] text-slate-400">4 Transfer Options</p>
                </button>

                <button 
                  onClick={() => setActiveModal('add')} 
                  className="p-4 rounded-2xl border border-slate-100 hover:border-[#0077B6] bg-slate-50/50 hover:bg-white text-left transition shadow-xs group"
                >
                  <PiggyBank className="w-5 h-5 text-[#0077B6] mb-2 group-hover:scale-110 transition" />
                  <p className="text-xs font-bold text-slate-900">Add Money</p>
                  <p className="text-[11px] text-slate-400">2-Way Top-Up / Sweep</p>
                </button>

                <button 
                  onClick={() => setActiveModal('cashout')} 
                  className="p-4 rounded-2xl border border-slate-100 hover:border-amber-400 bg-slate-50/50 hover:bg-white text-left transition shadow-xs group"
                >
                  <ArrowRightLeft className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition" />
                  <p className="text-xs font-bold text-slate-900">Cash Out</p>
                  <p className="text-[11px] text-slate-400">Wallet Agent</p>
                </button>

                <button 
                  onClick={() => setActiveModal('recharge')} 
                  className="p-4 rounded-2xl border border-slate-100 hover:border-[#134074] bg-slate-50/50 hover:bg-white text-left transition shadow-xs group"
                >
                  <Smartphone className="w-5 h-5 text-[#134074] mb-2 group-hover:scale-110 transition" />
                  <p className="text-xs font-bold text-slate-900">Recharge</p>
                  <p className="text-[11px] text-slate-400">Mobile Top-up</p>
                </button>
              </div>

              {/* Verified Beneficiary Tracker */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-xs text-[#0B2545]">Saved Transfer Beneficiaries</h3>
                    <p className="text-[11px] text-slate-400">Instant routing with verified bank and wallet credentials</p>
                  </div>
                  <UserCheck className="w-4 h-4 text-[#028090]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {BENEFICIARY_ACCOUNTS.map((acc) => (
                    <div 
                      key={acc.id} 
                      onClick={() => {
                        setFormInput(prev => ({
                          ...prev,
                          recipient: acc.accountNo,
                          recipientName: acc.name,
                          sendChannel: acc.channel === 'Bank' ? 'bank_to_bank' : 'bank_to_wallet'
                        }));
                        setActiveModal('send');
                      }}
                      className="p-3.5 rounded-xl border border-slate-100 hover:border-[#028090] bg-slate-50/40 hover:bg-[#028090]/5 cursor-pointer transition flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-semibold ${acc.channel === 'Bank' ? 'bg-[#0B2545]/10 text-[#0B2545]' : 'bg-[#028090]/15 text-[#028090]'}`}>
                          {acc.channel}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{acc.bankName}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{acc.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">{acc.accountNo}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Recorded Transactions Table */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-xs text-[#0B2545]">All Recorded Transactions</h2>
                  <span className="text-[10px] text-slate-400 font-medium">Total: {transactions.length} Records</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[550px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-normal">
                        <th className="pb-3 font-medium">Transaction</th>
                        <th className="pb-3 font-medium">Channel / Category</th>
                        <th className="pb-3 font-medium">Source</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 text-right font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {transactions.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition">
                          <td className="py-3 font-medium text-slate-800">{item.name}</td>
                          <td className="py-3 text-slate-500 text-[11px]">{item.category || 'Transfer'}</td>
                          <td className="py-3 text-slate-400 text-[11px]">{item.source}</td>
                          <td className="py-3 text-slate-400 text-[11px]">{item.date}</td>
                          <td className="py-3 font-bold text-slate-900">Rp {item.amount.toLocaleString('id-ID')}</td>
                          <td className="py-3 text-right">
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-medium ${item.type === 'Income' ? 'bg-[#028090]/15 text-[#028090]' : 'bg-rose-50 text-rose-600'}`}>
                              {item.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* VIEW: Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Brand Navy-Cyan Gradient Card */}
                <div className="h-44 rounded-2xl p-6 text-white bg-linear-to-br from-[#0B2545] via-[#134074] to-[#028090] relative overflow-hidden flex flex-col justify-between shadow-md">
                  <div className="absolute right-5 top-5 opacity-30">
                    <UnityPayLogo showTagline={false} iconSize={42} textSize="text-white" />
                  </div>
                  <div className="absolute -bottom-10 -right-10 w-44 h-44 rounded-full border-12 border-white/5 pointer-events-none"></div>

                  <div>
                    <span className="text-xs text-cyan-200 font-medium block">Current Balance</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-2xl font-bold tracking-tight">
                        {showBalance ? `Rp ${bankBalance.toLocaleString('id-ID')}` : "Rp ••••••••••"}
                      </span>
                      <button onClick={() => setShowBalance(!showBalance)} className="text-cyan-200 hover:text-white transition">
                        {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center z-10">
                    <span className="font-mono text-xs tracking-wider text-cyan-100">•••• •••• •••• {CURRENT_ACCOUNT_NUMBER}</span>
                    <button onClick={() => setActiveModal('send')} className="bg-white/20 hover:bg-white/30 text-white text-xs px-3.5 py-1.5 rounded-lg transition font-medium">
                      Transfer
                    </button>
                  </div>
                </div>

                <div className="h-44 rounded-2xl p-6 bg-white border border-slate-100 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium block">Virtual Wallet Balance</span>
                    <div className="text-2xl font-bold text-[#0B2545] mt-1">
                      Rp {walletBalance.toLocaleString('id-ID')}
                    </div>
                    <div className="flex space-x-2.5 mt-4">
                      <button onClick={() => setActiveModal('add')} className="bg-[#028090]/10 hover:bg-[#028090]/20 text-[#028090] text-xs font-bold px-3.5 py-1.5 rounded-lg transition">
                        + Top Up
                      </button>
                      <button onClick={() => setActiveModal('cashout')} className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold px-3.5 py-1.5 rounded-lg transition">
                        Cash Out
                      </button>
                    </div>
                  </div>
                  <div className="w-20 h-20 rounded-2xl bg-[#028090]/10 flex items-center justify-center text-3xl">
                    💳
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: Deposit */}
          {activeTab === 'deposit' && (
            <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 font-medium">Accumulated Deposit Interest</span>
                <h2 className="text-3xl font-black text-[#0B2545] mt-1">Rp 250.000</h2>
                <p className="text-xs text-[#028090] mt-1 font-medium">Auto-compounding active on Unity Savings Account</p>
              </div>
              <button onClick={() => setActiveModal('add')} className="bg-[#028090] hover:bg-[#0077B6] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs self-start sm:self-auto transition">
                Deposit Funds
              </button>
            </div>
          )}

          {/* VIEW: Settings / EMI */}
          {activeTab === 'settings' && (
            <div className="max-w-xl mx-auto w-full bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="font-bold text-sm text-[#0B2545]">Unity Pay EMI & Loan Calculator</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase">Loan Principal (Rp)</label>
                  <input 
                    type="number" 
                    value={loanAmount} 
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-[#028090]" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase">Interest Rate (%)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={loanRate} 
                    onChange={(e) => setLoanRate(Number(e.target.value))}
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-[#028090]" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase">Tenure (Years)</label>
                  <input 
                    type="number" 
                    value={loanYears} 
                    onChange={(e) => setLoanYears(Number(e.target.value))}
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-[#028090]" 
                  />
                </div>
              </div>
              <div className="bg-[#028090]/10 p-4 rounded-xl border border-[#028090]/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#0B2545]">Estimated Monthly Installment</p>
                  <p className="text-xl font-bold text-[#028090]">Rp {calculateEMI()}</p>
                </div>
                <span className="text-xs text-[#028090] bg-white px-2.5 py-1 rounded-md font-semibold">Standard Formula</span>
              </div>
            </div>
          )}

        </main>

        {/* Right Sidebar: Upcoming Transactions & Calendar */}
        <aside className="w-full md:w-72 lg:w-80 border-t md:border-t-0 md:border-l border-slate-200/80 p-6 flex flex-col justify-between bg-white shrink-0">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-sm text-[#0B2545]">Upcoming Transaction</h2>
              <button onClick={() => setActiveModal('bill')} className="text-xs font-bold text-[#028090] hover:underline flex items-center space-x-1">
                <Receipt className="w-3.5 h-3.5" />
                <span>Pay Bill</span>
              </button>
            </div>

            <div className="border border-slate-100 rounded-2xl p-4 mb-5 shadow-xs">
              <div className="flex justify-between items-center mb-3 text-xs font-semibold text-slate-700">
                <span className="flex items-center cursor-pointer text-[#0B2545]">
                  October 2026 <ChevronDown className="w-3.5 h-3.5 ml-1 text-slate-400" />
                </span>
                <div className="flex space-x-1 text-slate-400">
                  <ChevronLeft className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600" />
                  <ChevronRight className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600" />
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-400 mb-1">
                <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-700">
                <span className="text-slate-200"></span><span className="text-slate-200"></span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                <span>6</span>
                <span className="w-6 h-6 rounded-full border border-slate-200 flex items-center justify-center mx-auto text-[10px]">8</span>
                <span>9</span>
                <span className="w-6 h-6 rounded-full bg-[#028090] text-white flex items-center justify-center mx-auto text-[10px] font-bold">10</span>
                <span>11</span><span>12</span><span>13</span>
                <span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span>
                <span>21</span><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span><span>27</span>
                <span>28</span><span>29</span><span>30</span><span>31</span>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-800 mb-3">10 October 2026</div>
            <div className="space-y-3">
              {reminders.map((rem) => (
                <div key={rem.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs ${rem.type === 'credit' ? 'bg-[#028090]/15 text-[#028090]' : 'bg-rose-50 text-rose-600'}`}>
                      💼
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-800 leading-tight">{rem.title}</p>
                      <p className="text-[10px] text-slate-400">{rem.category}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700">{rem.amount}</span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => setActiveModal('reminder')}
            className="w-full mt-6 bg-[#0B2545] hover:bg-[#134074] text-white py-2.5 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            Add Reminder
          </button>
        </aside>

      </div>

      {/* MODAL SYSTEM */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 my-8">
            
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-base text-[#0B2545]">
                {activeModal === 'send' && 'Send Money (Transfer)'}
                {activeModal === 'add' && 'Add Money (Top-Up / Sweep)'}
                {activeModal === 'cashout' && 'Cash Out (Wallet Agent)'}
                {activeModal === 'recharge' && 'Mobile Airtime Recharge'}
                {activeModal === 'bill' && 'Official Utility Bill Pay'}
                {activeModal === 'reminder' && 'Create Payment Reminder'}
              </h3>
              <X className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setActiveModal(null)} />
            </div>

            {/* MODAL: ADD REMINDER */}
            {activeModal === 'reminder' ? (
              <form onSubmit={handleAddReminder} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600">Reminder Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Broadband Fiber / Rent" 
                    value={formInput.reminderTitle}
                    onChange={(e) => setFormInput({ ...formInput, reminderTitle: e.target.value })}
                    className="w-full mt-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-[#028090]" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">Amount (Rp)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g. 150000" 
                    value={formInput.reminderAmount}
                    onChange={(e) => setFormInput({ ...formInput, reminderAmount: e.target.value })}
                    className="w-full mt-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-[#028090]" 
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl text-xs font-semibold">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 bg-[#028090] text-white py-2.5 rounded-xl text-xs font-semibold">
                    Save Reminder
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleExecuteTransaction} className="space-y-4">
                
                {/* 1. SEND MONEY: 4 Channels */}
                {activeModal === 'send' && (
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-2 block">Choose Transfer Channel</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'bank_to_bank', label: 'Bank → Bank', icon: Building2 },
                        { id: 'bank_to_wallet', label: 'Bank → Wallet', icon: Wallet },
                        { id: 'wallet_to_bank', label: 'Wallet → Bank', icon: Building2 },
                        { id: 'wallet_to_wallet', label: 'Wallet → Wallet', icon: Wallet },
                      ].map(item => {
                        const Icon = item.icon;
                        const isSelected = formInput.sendChannel === item.id;
                        return (
                          <button
                            type="button"
                            key={item.id}
                            onClick={() => setFormInput({ ...formInput, sendChannel: item.id })}
                            className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl border text-xs font-medium transition ${
                              isSelected 
                                ? 'bg-[#028090]/10 border-[#028090] text-[#028090] font-bold shadow-xs' 
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. ADD MONEY: 2 Channels */}
                {activeModal === 'add' && (
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-2 block">Transfer Direction</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <button
                        type="button"
                        onClick={() => setFormInput({ ...formInput, addChannel: 'bank_to_wallet' })}
                        className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl border font-medium transition ${
                          formInput.addChannel === 'bank_to_wallet'
                            ? 'bg-[#028090]/10 border-[#028090] text-[#028090] font-bold shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Wallet className="w-3.5 h-3.5" />
                        <span>Bank → Wallet</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormInput({ ...formInput, addChannel: 'wallet_to_bank' })}
                        className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl border font-medium transition ${
                          formInput.addChannel === 'wallet_to_bank'
                            ? 'bg-[#028090]/10 border-[#028090] text-[#028090] font-bold shadow-xs'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>Wallet → Bank</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* BILL PAYMENT */}
                {activeModal === 'bill' ? (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-600">Utility Provider</label>
                        <select 
                          value={formInput.utilityProvider} 
                          onChange={(e) => setFormInput({ ...formInput, utilityProvider: e.target.value })}
                          className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-[#028090] bg-white"
                        >
                          <option>DESCO Electricity</option>
                          <option>Dhaka WASA Water</option>
                          <option>Carnival Broadband</option>
                          <option>Titas Gas Transmission</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-600">Debit Source</label>
                        <select 
                          value={formInput.billSource} 
                          onChange={(e) => setFormInput({ ...formInput, billSource: e.target.value })}
                          className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-[#028090] bg-white"
                        >
                          <option value="Bank Account">Bank Account (Rp {bankBalance.toLocaleString('id-ID')})</option>
                          <option value="Virtual Wallet">Virtual Wallet (Rp {walletBalance.toLocaleString('id-ID')})</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-600">Customer Meter / Account ID</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="e.g. 10098471203" 
                        value={formInput.customerMeterId}
                        onChange={(e) => setFormInput({ ...formInput, customerMeterId: e.target.value })}
                        className="w-full mt-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-[#028090]" 
                      />
                    </div>
                  </>
                ) : (
                  activeModal !== 'add' && (
                    <div>
                      <label className="text-xs font-bold text-slate-600">
                        {activeModal === 'send' 
                          ? (formInput.sendChannel.endsWith('bank') ? 'Recipient Bank Account Number' : 'Recipient Wallet Number')
                          : (activeModal === 'recharge' ? 'Phone Number' : 'Agent Number')}
                      </label>
                      <input 
                        type="text" 
                        required 
                        placeholder={activeModal === 'send' && formInput.sendChannel.endsWith('bank') ? 'e.g. 20491823901' : 'e.g. 01711002233'}
                        value={formInput.recipient}
                        onChange={(e) => setFormInput({ ...formInput, recipient: e.target.value, recipientName: '' })}
                        className="w-full mt-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-[#028090]" 
                      />
                    </div>
                  )
                )}

                <div>
                  <label className="text-xs font-bold text-slate-600">Amount (Rp)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="Enter amount" 
                    value={formInput.amount}
                    onChange={(e) => setFormInput({ ...formInput, amount: e.target.value })}
                    className="w-full mt-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-[#028090] font-bold" 
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600">Security PIN</label>
                  <input 
                    type="password" 
                    maxLength={4} 
                    required 
                    placeholder="••••" 
                    value={formInput.pin}
                    onChange={(e) => setFormInput({ ...formInput, pin: e.target.value })}
                    className="w-full mt-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-[#028090] font-mono tracking-widest text-center text-base" 
                  />
                </div>

                <div className="flex space-x-2.5 pt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-semibold transition">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 bg-[#028090] hover:bg-[#0077B6] text-white py-2.5 rounded-xl text-xs font-semibold shadow-xs transition">
                    Confirm & Execute
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}