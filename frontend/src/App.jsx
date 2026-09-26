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
  Plus,
  Send,
  Smartphone,
  CreditCard,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';

const CURRENT_ACCOUNT_NUMBER = '6789';
const DEFAULT_PIN = '1234';

export default function BankingSimulationSystem() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBalance, setShowBalance] = useState(true);

  // Balances stored directly in React State (with localStorage persistence)
  const [bankBalance, setBankBalance] = useState(() => {
    const saved = localStorage.getItem('bank_sim_bankBalance');
    return saved !== null ? parseFloat(saved) : 10750000;
  });

  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('bank_sim_walletBalance');
    return saved !== null ? parseFloat(saved) : 250000;
  });

  // Transaction History State
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
      { id: 1, name: 'Global Ventures Ltd', date: '3/2/2022, 10:10 pm', amount: 6000000, type: 'Income', source: 'Bank Account' },
      { id: 2, name: 'Michael Liu', date: '1/2/2022, 09:14 pm', amount: 300000, type: 'Expend', source: 'Virtual Wallet' },
      { id: 3, name: 'Mary Moore', date: '31/1/2022, 03:07 am', amount: 450000, type: 'Expend', source: 'Virtual Wallet' }
    ];
  });

  // Save to localStorage whenever state updates
  useEffect(() => {
    localStorage.setItem('bank_sim_bankBalance', bankBalance.toString());
  }, [bankBalance]);

  useEffect(() => {
    localStorage.setItem('bank_sim_walletBalance', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('bank_sim_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Upcoming Reminders State
  const [reminders, setReminders] = useState([
    { id: 1, title: 'Salary', category: 'Money', amount: 'Rp 6.000.000', type: 'credit' },
    { id: 2, title: 'Deposit Inter...', category: 'Money', amount: 'Rp 35.000', type: 'credit' },
    { id: 3, title: 'Electricity', category: 'Money', amount: 'Rp 220.000', type: 'debit' },
    { id: 4, title: 'Wi-Fi', category: 'Money', amount: 'Rp 330.000', type: 'debit' }
  ]);

  // Modal Action System
  const [activeModal, setActiveModal] = useState(null);
  const [formInput, setFormInput] = useState({
    recipient: '',
    amount: '',
    pin: '',
    utilityType: 'DESCO Electricity',
    reminderTitle: '',
    reminderAmount: ''
  });

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [loanRate, setLoanRate] = useState(9.5);
  const [loanYears, setLoanYears] = useState(2);

  const calculateEMI = () => {
    const r = (loanRate / 12) / 100;
    const n = loanYears * 12;
    const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return isNaN(emi) ? 0 : Math.round(emi).toLocaleString('id-ID');
  };

  // Pure Client-side Transaction Execution
  const handleExecuteTransaction = (e) => {
    e.preventDefault();
    const val = parseFloat(formInput.amount);
    if (!val || val <= 0) return alert('Please enter a valid amount.');

    if (formInput.pin !== DEFAULT_PIN) {
      return alert(`Incorrect Security PIN. Default PIN is ${DEFAULT_PIN}`);
    }

    const nowFormatted = new Date().toLocaleString();

    if (activeModal === 'send') {
      if (bankBalance < val) return alert('Insufficient Bank Balance.');
      setBankBalance(prev => prev - val);
      setTransactions(prev => [
        { id: Date.now(), name: formInput.recipient || 'Transfer Recipient', date: nowFormatted, amount: val, type: 'Expend', source: 'Bank Account' },
        ...prev
      ]);
    } else if (activeModal === 'add') {
      if (bankBalance < val) return alert('Insufficient Bank Balance.');
      setBankBalance(prev => prev - val);
      setWalletBalance(prev => prev + val);
      setTransactions(prev => [
        { id: Date.now(), name: 'Bank to Wallet Top-Up', date: nowFormatted, amount: val, type: 'Income', source: 'Virtual Wallet' },
        ...prev
      ]);
    } else if (activeModal === 'cashout') {
      if (walletBalance < val) return alert('Insufficient Wallet Balance.');
      setWalletBalance(prev => prev - val);
      setTransactions(prev => [
        { id: Date.now(), name: `Agent Cash Out (${formInput.recipient})`, date: nowFormatted, amount: val, type: 'Expend', source: 'Virtual Wallet' },
        ...prev
      ]);
    } else if (activeModal === 'recharge') {
      if (walletBalance < val) return alert('Insufficient Wallet Balance.');
      setWalletBalance(prev => prev - val);
      setTransactions(prev => [
        { id: Date.now(), name: `Mobile Recharge (${formInput.recipient})`, date: nowFormatted, amount: val, type: 'Expend', source: 'Virtual Wallet' },
        ...prev
      ]);
    } else if (activeModal === 'bill') {
      if (bankBalance < val) return alert('Insufficient Bank Balance.');
      setBankBalance(prev => prev - val);
      setTransactions(prev => [
        { id: Date.now(), name: formInput.utilityType, date: nowFormatted, amount: val, type: 'Expend', source: 'Bank Account' },
        ...prev
      ]);
    }

    setFormInput({ recipient: '', amount: '', pin: '', utilityType: 'DESCO Electricity', reminderTitle: '', reminderAmount: '' });
    setActiveModal(null);
    alert('Transaction successful!');
  };

  // Add Reminder Handler
  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!formInput.reminderTitle || !formInput.reminderAmount) return alert('Please enter all reminder fields.');
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
    <div className="min-h-screen bg-[#f1f3f6] p-4 lg:p-8 flex items-center justify-center font-sans antialiased text-slate-800">
      
      {/* Browser Window Outer Frame */}
      <div className="w-full max-w-[1240px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/80">
        
        {/* Top Browser Header Bar */}
        <div className="bg-[#fcfdfd] px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block"></span>
            <div className="flex items-center space-x-2 pl-4 text-slate-400">
              <ChevronLeft className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600" />
              <ChevronRight className="w-3.5 h-3.5 cursor-pointer hover:text-slate-600" />
            </div>
          </div>

          <div className="flex-1 max-w-xs mx-4">
            <div className="bg-slate-100/70 rounded-md px-3 py-1 flex items-center space-x-2 text-xs text-slate-400">
              <Search className="w-3 h-3" />
              <span className="text-[11px] text-slate-400 font-normal">Search accounts, payees, or bills</span>
            </div>
          </div>

          <div className="text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setActiveModal('send')}>
            <Plus className="w-4 h-4" />
          </div>
        </div>

        {/* Main Dashboard Layout */}
        <div className="flex flex-col md:flex-row min-h-[750px]">
          
          {/* Left Mini Sidebar */}
          <aside className="w-16 border-r border-slate-100 flex flex-col items-center py-5 justify-between bg-white shrink-0">
            <div className="flex flex-col items-center space-y-7 w-full">
              <span className="text-[#059669] font-black text-xl tracking-tighter cursor-pointer" onClick={() => setActiveTab('dashboard')}>M</span>

              <nav className="flex flex-col space-y-5 w-full items-center">
                <button 
                  onClick={() => setActiveTab('dashboard')} 
                  className="flex flex-col items-center group w-full"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${activeTab === 'dashboard' ? 'bg-emerald-50 text-[#059669]' : 'text-slate-400 hover:bg-slate-50'}`}>
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-medium mt-0.5 scale-90 ${activeTab === 'dashboard' ? 'text-[#059669]' : 'text-slate-400'}`}>Dashboard</span>
                </button>

                <button 
                  onClick={() => setActiveTab('transaction')} 
                  className="flex flex-col items-center group w-full"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${activeTab === 'transaction' ? 'bg-emerald-50 text-[#059669]' : 'text-slate-400 hover:bg-slate-50'}`}>
                    <ArrowRightLeft className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-medium mt-0.5 scale-90 ${activeTab === 'transaction' ? 'text-[#059669]' : 'text-slate-400'}`}>Transaction</span>
                </button>

                <button 
                  onClick={() => setActiveTab('deposit')} 
                  className="flex flex-col items-center group w-full"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${activeTab === 'deposit' ? 'bg-emerald-50 text-[#059669]' : 'text-slate-400 hover:bg-slate-50'}`}>
                    <PiggyBank className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-medium mt-0.5 scale-90 ${activeTab === 'deposit' ? 'text-[#059669]' : 'text-slate-400'}`}>Deposit</span>
                </button>

                <button 
                  onClick={() => setActiveTab('settings')} 
                  className="flex flex-col items-center group w-full"
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${activeTab === 'settings' ? 'bg-emerald-50 text-[#059669]' : 'text-slate-400 hover:bg-slate-50'}`}>
                    <Settings className="w-4 h-4" />
                  </div>
                  <span className={`text-[9px] font-medium mt-0.5 scale-90 ${activeTab === 'settings' ? 'text-[#059669]' : 'text-slate-400'}`}>Setting</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Center Main Workspace */}
          <main className="flex-1 p-6 lg:p-7 flex flex-col bg-white overflow-hidden">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-6">
              <div>
                <h1 className="text-lg font-bold text-slate-900 capitalize">{activeTab}</h1>
                <p className="text-[10px] text-slate-400">Authenticated Session • Demo User (ID: {CURRENT_ACCOUNT_NUMBER})</p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-xs cursor-pointer">🔔</span>
                <span className="w-6 h-6 rounded-full bg-amber-50 flex items-center justify-center text-xs cursor-pointer">⭐</span>
                <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                  U
                </div>
              </div>
            </div>

            {/* TAB VIEW 1: Main Dashboard */}
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div className="h-40 rounded-2xl p-5 text-white bg-[#039868] relative overflow-hidden flex flex-col justify-between shadow-sm">
                    <div className="absolute right-4 top-4 text-white/90 text-xl font-black">
                      M
                    </div>
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                      <div className="absolute -bottom-8 -left-8 w-40 h-40 border-8 border-white rounded-full"></div>
                      <div className="absolute -bottom-4 -left-4 w-40 h-40 border-8 border-white rounded-full"></div>
                    </div>

                    <div>
                      <span className="text-[10px] text-emerald-100 font-medium block">Current Balance</span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xl font-bold tracking-tight">
                          {showBalance ? `Rp ${bankBalance.toLocaleString('id-ID')}` : "Rp ••••••••••"}
                        </span>
                        <button onClick={() => setShowBalance(!showBalance)} className="text-emerald-200 hover:text-white transition">
                          {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center z-10">
                      <span className="font-mono text-xs tracking-wider text-emerald-100">•••• •••• •••• {CURRENT_ACCOUNT_NUMBER}</span>
                      <button onClick={() => setActiveModal('send')} className="bg-white/20 hover:bg-white/30 text-white text-[10px] px-2 py-1 rounded transition">
                        Transfer
                      </button>
                    </div>
                  </div>

                  <div className="h-40 rounded-2xl p-5 bg-white border border-slate-100 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">Virtual Wallet Balance</span>
                      <div className="text-lg font-bold text-slate-900 mt-1">
                        Rp {walletBalance.toLocaleString('id-ID')}
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button onClick={() => setActiveModal('add')} className="bg-emerald-50 hover:bg-emerald-100 text-[#059669] text-[10px] font-bold px-2.5 py-1 rounded transition">
                          + Top Up
                        </button>
                        <button onClick={() => setActiveModal('cashout')} className="bg-amber-50 hover:bg-amber-100 text-amber-700 text-[10px] font-bold px-2.5 py-1 rounded transition">
                          Cash Out
                        </button>
                      </div>
                    </div>

                    <div className="relative w-20 h-20 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-emerald-50/50 absolute"></div>
                      <div className="text-2xl relative z-10">🌱</div>
                      <div className="text-xs absolute bottom-1 right-2">🪙</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm mb-5">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-8">
                      <div>
                        <span className="text-[10px] text-slate-400">Income</span>
                        <div className="text-xs font-bold text-slate-800">Rp 12.000.000</div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400">Expense</span>
                        <div className="text-xs font-bold text-slate-800">Rp 6.500.000</div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3 text-[10px]">
                        <span className="flex items-center text-slate-500">
                          <span className="w-2 h-2 rounded-full bg-[#059669] mr-1"></span>Income
                        </span>
                        <span className="flex items-center text-slate-500">
                          <span className="w-2 h-2 rounded-full bg-[#f59e0b] mr-1"></span>Expense
                        </span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200 px-2 py-1 rounded text-[10px] text-slate-600 flex items-center space-x-1 cursor-pointer">
                        <span>February 2022</span>
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div className="h-28 flex items-end justify-between px-6 pt-4 border-b border-slate-50 pb-2">
                    {[
                      { week: 'Week 1', inc: 70, exp: 35 },
                      { week: 'Week 2', inc: 90, exp: 75 },
                      { week: 'Week 3', inc: 0, exp: 0 },
                      { week: 'Week 4', inc: 0, exp: 0 },
                    ].map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center space-y-2 h-full justify-end">
                        <div className="flex items-end space-x-1 h-20">
                          {item.inc > 0 && <div style={{ height: `${item.inc}%` }} className="w-2.5 bg-[#059669] rounded-t-sm"></div>}
                          {item.exp > 0 && <div style={{ height: `${item.exp}%` }} className="w-2.5 bg-[#f59e0b] rounded-t-sm"></div>}
                        </div>
                        <span className="text-[9px] text-slate-400">{item.week}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="font-bold text-xs text-slate-900">History Transaction</h2>
                    <span onClick={() => setActiveTab('transaction')} className="text-[10px] font-semibold text-[#059669] cursor-pointer hover:underline">
                      See more
                    </span>
                  </div>

                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-normal pb-2">
                        <th className="pb-2 font-normal">Transaction</th>
                        <th className="pb-2 font-normal">Date</th>
                        <th className="pb-2 font-normal">Amount</th>
                        <th className="pb-2 text-right font-normal">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {transactions.slice(0, 3).map((item) => (
                        <tr key={item.id}>
                          <td className="py-2.5 flex items-center space-x-2 text-slate-700">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${item.type === 'Income' ? 'bg-emerald-50 text-[#059669]' : 'bg-rose-50 text-[#e11d48]'}`}>
                              💼
                            </div>
                            <span>{item.name}</span>
                          </td>
                          <td className="py-2.5 text-slate-400 text-[10px]">{item.date}</td>
                          <td className="py-2.5 font-medium text-slate-800">Rp {item.amount.toLocaleString('id-ID')}</td>
                          <td className="py-2.5 text-right">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full ${item.type === 'Income' ? 'bg-emerald-50 text-[#059669]' : 'bg-rose-50 text-[#e11d48]'}`}>
                              {item.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* TAB VIEW 2: Complete Transaction Table & Quick Actions */}
            {activeTab === 'transaction' && (
              <div className="space-y-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button onClick={() => setActiveModal('send')} className="p-4 rounded-xl border border-slate-100 hover:border-emerald-300 text-left bg-slate-50/50 transition">
                    <Send className="w-4 h-4 text-[#059669] mb-1" />
                    <p className="text-xs font-bold text-slate-800">Send Money</p>
                    <p className="text-[10px] text-slate-400">User → User</p>
                  </button>

                  <button onClick={() => setActiveModal('add')} className="p-4 rounded-xl border border-slate-100 hover:border-emerald-300 text-left bg-slate-50/50 transition">
                    <PiggyBank className="w-4 h-4 text-emerald-600 mb-1" />
                    <p className="text-xs font-bold text-slate-800">Add Money</p>
                    <p className="text-[10px] text-slate-400">Bank → Wallet</p>
                  </button>

                  <button onClick={() => setActiveModal('cashout')} className="p-4 rounded-xl border border-slate-100 hover:border-emerald-300 text-left bg-slate-50/50 transition">
                    <ArrowRightLeft className="w-4 h-4 text-amber-500 mb-1" />
                    <p className="text-xs font-bold text-slate-800">Cash Out</p>
                    <p className="text-[10px] text-slate-400">Wallet Agent</p>
                  </button>

                  <button onClick={() => setActiveModal('recharge')} className="p-4 rounded-xl border border-slate-100 hover:border-emerald-300 text-left bg-slate-50/50 transition">
                    <Smartphone className="w-4 h-4 text-blue-500 mb-1" />
                    <p className="text-xs font-bold text-slate-800">Recharge</p>
                    <p className="text-[10px] text-slate-400">Mobile Top-up</p>
                  </button>
                </div>

                <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
                  <h2 className="font-bold text-xs text-slate-900 mb-3">All Recorded Transactions</h2>
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 font-normal pb-2">
                        <th className="pb-2 font-normal">Transaction</th>
                        <th className="pb-2 font-normal">Source</th>
                        <th className="pb-2 font-normal">Date</th>
                        <th className="pb-2 font-normal">Amount</th>
                        <th className="pb-2 text-right font-normal">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {transactions.map((item) => (
                        <tr key={item.id}>
                          <td className="py-2.5 font-medium text-slate-800">{item.name}</td>
                          <td className="py-2.5 text-slate-400 text-[10px]">{item.source}</td>
                          <td className="py-2.5 text-slate-400 text-[10px]">{item.date}</td>
                          <td className="py-2.5 font-semibold text-slate-800">Rp {item.amount.toLocaleString('id-ID')}</td>
                          <td className="py-2.5 text-right">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full ${item.type === 'Income' ? 'bg-emerald-50 text-[#059669]' : 'bg-rose-50 text-[#e11d48]'}`}>
                              {item.type}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB VIEW 3: Deposit Interest & Savings Plans */}
            {activeTab === 'deposit' && (
              <div className="space-y-5">
                <div className="border border-slate-100 rounded-2xl p-6 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 font-medium">Accumulated Deposit Interest</span>
                    <h2 className="text-2xl font-black text-slate-900 mt-1">Rp 250.000</h2>
                    <p className="text-[11px] text-emerald-600 mt-1">Auto-compounding active on Savings account</p>
                  </div>
                  <button onClick={() => setActiveModal('add')} className="bg-[#059669] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-sm">
                    Deposit New Funds
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm">
                    <h3 className="font-bold text-xs text-slate-800">Term Deposit Scheme</h3>
                    <p className="text-[10px] text-slate-400 mt-1">Annual Yield: 6.5% • Minimum term: 6 Months</p>
                  </div>
                  <div className="border border-slate-100 rounded-xl p-4 bg-white shadow-sm">
                    <h3 className="font-bold text-xs text-slate-800">Flexible Savings Goal (DPS)</h3>
                    <p className="text-[10px] text-slate-400 mt-1">Monthly automatic transfer: Rp 500.000</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 4: EMI Calculator */}
            {activeTab === 'settings' && (
              <div className="max-w-xl mx-auto w-full bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="font-bold text-sm text-slate-900">EMI & Loan Installment Calculator</h2>
                  <p className="text-[10px] text-slate-400">Simulate monthly repayment schedule according to banking interest standards</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Loan Principal (Rp)</label>
                    <input 
                      type="number" 
                      value={loanAmount} 
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Annual Interest Rate (%)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={loanRate} 
                      onChange={(e) => setLoanRate(Number(e.target.value))}
                      className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Tenure (Years)</label>
                    <input 
                      type="number" 
                      value={loanYears} 
                      onChange={(e) => setLoanYears(Number(e.target.value))}
                      className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500" 
                    />
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold text-emerald-800">Calculated Monthly EMI</p>
                    <p className="text-xl font-bold text-[#059669]">Rp {calculateEMI()}</p>
                  </div>
                  <span className="text-[10px] text-emerald-700 bg-white px-2.5 py-1 rounded-md font-medium">Standard Formula</span>
                </div>
              </div>
            )}

          </main>

          {/* Right Sidebar: Upcoming Transaction & Calendar */}
          <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-slate-100 p-6 flex flex-col justify-between bg-white shrink-0">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-sm text-slate-900">Upcoming Transaction</h2>
                <button onClick={() => setActiveModal('bill')} className="text-[10px] font-bold text-[#059669] hover:underline">
                  Pay Bill
                </button>
              </div>

              <div className="border border-slate-100 rounded-xl p-3 mb-5">
                <div className="flex justify-between items-center mb-3 text-[11px] font-semibold text-slate-700">
                  <span className="flex items-center cursor-pointer">
                    February 2022 <ChevronDown className="w-3 h-3 ml-1 text-slate-400" />
                  </span>
                  <div className="flex space-x-1 text-slate-400">
                    <ChevronLeft className="w-3 h-3 cursor-pointer hover:text-slate-600" />
                    <ChevronRight className="w-3 h-3 cursor-pointer hover:text-slate-600" />
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[9px] text-slate-400 mb-1">
                  <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-slate-700">
                  <span className="text-slate-200"></span><span className="text-slate-200"></span><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                  <span>6</span>
                  <span className="w-5 h-5 rounded-full border border-slate-200 flex items-center justify-center mx-auto text-[9px]">8</span>
                  <span>9</span>
                  <span className="w-5 h-5 rounded-full bg-[#059669] text-white flex items-center justify-center mx-auto text-[9px] font-bold">10</span>
                  <span>11</span><span>12</span><span>13</span>
                  <span>14</span><span>15</span><span>16</span><span>17</span><span>18</span><span>19</span><span>20</span>
                  <span>21</span><span>22</span><span>23</span><span>24</span><span>25</span><span>26</span><span>27</span>
                  <span>28</span><span>29</span><span>30</span>
                </div>
              </div>

              <div className="text-[10px] font-bold text-slate-800 mb-3">10 February 2022</div>
              <div className="space-y-3">
                {reminders.map((rem) => (
                  <div key={rem.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${rem.type === 'credit' ? 'bg-emerald-50 text-[#059669]' : 'bg-rose-50 text-[#e11d48]'}`}>
                        💼
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold text-slate-800 leading-tight">{rem.title}</p>
                        <p className="text-[9px] text-slate-400">{rem.category}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-700">{rem.amount}</span>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setActiveModal('reminder')}
              className="w-full mt-6 bg-[#059669] hover:bg-[#047857] text-white py-2.5 rounded-xl text-xs font-semibold shadow-sm transition"
            >
              Add Remainder
            </button>
          </aside>

        </div>
      </div>

      {/* MODAL SYSTEM */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-100">
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-sm text-slate-900">
                {activeModal === 'send' && 'Send Money (User to User)'}
                {activeModal === 'add' && 'Add Money (Bank → Wallet)'}
                {activeModal === 'cashout' && 'Cash Out (Wallet Agent)'}
                {activeModal === 'recharge' && 'Mobile Airtime Recharge'}
                {activeModal === 'bill' && 'Pay Utility Bill'}
                {activeModal === 'reminder' && 'Create Payment Reminder'}
              </h3>
              <X className="w-4 h-4 text-slate-400 cursor-pointer" onClick={() => setActiveModal(null)} />
            </div>

            {activeModal === 'reminder' ? (
              <form onSubmit={handleAddReminder} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-600">Reminder Title</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Gas Bill / Cloud Server" 
                    value={formInput.reminderTitle}
                    onChange={(e) => setFormInput({ ...formInput, reminderTitle: e.target.value })}
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600">Amount (Rp)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="e.g. 150000" 
                    value={formInput.reminderAmount}
                    onChange={(e) => setFormInput({ ...formInput, reminderAmount: e.target.value })}
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500" 
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-xs font-semibold">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 bg-[#059669] text-white py-2 rounded-lg text-xs font-semibold">
                    Save Reminder
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleExecuteTransaction} className="space-y-3">
                {activeModal === 'bill' ? (
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">Utility Provider</label>
                    <select 
                      value={formInput.utilityType} 
                      onChange={(e) => setFormInput({ ...formInput, utilityType: e.target.value })}
                      className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500"
                    >
                      <option>DESCO Electricity</option>
                      <option>WASA Water Utility</option>
                      <option>Carnival Internet</option>
                      <option>Titas Gas</option>
                    </select>
                  </div>
                ) : activeModal !== 'add' && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-600">
                      {activeModal === 'recharge' ? 'Phone Number' : activeModal === 'cashout' ? 'Agent Number' : 'Recipient Account Number'}
                    </label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. 01700000000" 
                      value={formInput.recipient}
                      onChange={(e) => setFormInput({ ...formInput, recipient: e.target.value })}
                      className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500" 
                    />
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-slate-600">Amount (Rp)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="Enter amount" 
                    value={formInput.amount}
                    onChange={(e) => setFormInput({ ...formInput, amount: e.target.value })}
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500" 
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600">Transaction PIN (Simulated)</label>
                  <input 
                    type="password" 
                    maxLength={4} 
                    required 
                    placeholder="••••" 
                    value={formInput.pin}
                    onChange={(e) => setFormInput({ ...formInput, pin: e.target.value })}
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:outline-emerald-500 font-mono tracking-widest text-center" 
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button type="button" onClick={() => setActiveModal(null)} className="flex-1 bg-slate-100 text-slate-600 py-2 rounded-lg text-xs font-semibold">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 bg-[#059669] text-white py-2 rounded-lg text-xs font-semibold">
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