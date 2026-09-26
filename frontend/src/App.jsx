import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Eye, EyeOff, Building2, Wallet, Plus, ArrowUpRight, 
  ArrowDownLeft, Lock, Key, BellRing, Smartphone, Award, TrendingUp, Wifi
} from 'lucide-react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import QuickActions from './components/QuickActions';
import Beneficiaries from './components/Beneficiaries';
import TransactionTable from './components/TransactionTable';
import SchedulePanel from './components/SchedulePanel';
import Modals from './components/Modals';

const BENEFICIARY_ACCOUNTS = [
  { id: 'b1', name: 'Tanvir Ahmed', accountNo: '01711002233', channel: 'Wallet', provider: 'bKash' },
  { id: 'b2', name: 'Michael Liu', accountNo: '01899221100', channel: 'Wallet', provider: 'Nagad' },
  { id: 'b3', name: 'Rafiqul Islam', accountNo: '01928374651', channel: 'Wallet', provider: 'Rocket' },
  { id: 'b4', name: 'Global Ventures Ltd', accountNo: '20491823901', channel: 'Bank', provider: 'City Bank' },
  { id: 'b5', name: 'Mary Moore', accountNo: '98451203941', channel: 'Bank', provider: 'Unity Pay' },
  { id: 'b6', name: 'Apex Holdings', accountNo: '11029384756', channel: 'Bank', provider: 'Eastern Bank' },
];

export default function BankingSimulationSystem() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showBalance, setShowBalance] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  const [newDepositModal, setNewDepositModal] = useState(false);
  const [depositInstallmentModal, setDepositInstallmentModal] = useState(null);
  const [installmentSource, setInstallmentSource] = useState('Bank Account');
  const [customInstallmentAmount, setCustomInstallmentAmount] = useState('1000');
  const [selectedCardDetails, setSelectedCardDetails] = useState(null); 
  const [depositInput, setDepositInput] = useState({ 
    planType: 'FDR', 
    amount: '', 
    months: '12',
    debitSource: 'Bank Account'
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('unity_user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Tania Akter Sima',
      accountNumber: '6789',
      walletNumber: '01700-678901',
      email: 'tania.sima@unitypay.com',
      avatarUrl: ''
    };
  });

  const userInitials = userProfile.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('') || 'TS';

  const [bankBalance, setBankBalance] = useState(() => {
    const saved = localStorage.getItem('bank_sim_bankBalance');
    return saved !== null ? parseFloat(saved) : 10739810;
  });

  const [walletBalance, setWalletBalance] = useState(() => {
    const saved = localStorage.getItem('bank_sim_walletBalance');
    return saved !== null ? parseFloat(saved) : 249300;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('unity_clean_live_transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem('unity_clean_live_reminders');
    return saved ? JSON.parse(saved) : [];
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('unity_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const [activeModal, setActiveModal] = useState(null);

  const [depositPlans, setDepositPlans] = useState(() => {
    const saved = localStorage.getItem('unity_deposit_plans');
    return saved ? JSON.parse(saved) : [
      { id: 'dp-1', title: 'High-Yield Fixed Deposit', principal: 500000, rate: 8.5, tenureMonths: 12, startDate: 'Jan 15, 2026', accruedProfit: 30120 },
      { id: 'dp-2', title: 'Monthly DPS Growth Scheme', monthlyInstallment: 10000, totalDeposited: 80000, rate: 7.2, tenureMonths: 36, accruedProfit: 3450 }
    ];
  });

  const [dailyLimit, setDailyLimit] = useState(500000);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [currentPin, setCurrentPin] = useState('1234');
  const [pinChangeForm, setPinChangeForm] = useState({ oldPin: '', newPin: '', confirmPin: '' });

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
    reminderAmount: '',
    reminderCategory: 'Utility Bill'
  });

  useEffect(() => { localStorage.setItem('bank_sim_bankBalance', bankBalance.toString()); }, [bankBalance]);
  useEffect(() => { localStorage.setItem('bank_sim_walletBalance', walletBalance.toString()); }, [walletBalance]);
  useEffect(() => { localStorage.setItem('unity_clean_live_transactions', JSON.stringify(transactions)); }, [transactions]);
  useEffect(() => { localStorage.setItem('unity_clean_live_reminders', JSON.stringify(reminders)); }, [reminders]);
  useEffect(() => { localStorage.setItem('unity_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('unity_user_profile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { localStorage.setItem('unity_deposit_plans', JSON.stringify(depositPlans)); }, [depositPlans]);

  const logNotification = (title, description) => {
    const newNotice = { id: Date.now(), title, description, time: 'Just now', read: false };
    setNotifications(prev => [newNotice, ...prev]);
  };

  const handleDeleteTransaction = (id) => {
    if (window.confirm('Are you sure you want to remove this transaction record?')) {
      setTransactions(prev => prev.filter(item => item.id !== id));
      logNotification('Record Removed', 'A transaction record was deleted from your history.');
    }
  };

  const handleExecuteTransaction = (e) => {
    e.preventDefault();
    const val = parseFloat(formInput.amount);
    if (!val || val <= 0) return alert('Please enter a valid transfer amount.');

    if (formInput.pin !== currentPin) {
      return alert(`Incorrect Security PIN. Current PIN is ${currentPin}`);
    }

    if (val > dailyLimit) {
      return alert(`Transaction exceeds your daily limit of BDT ${dailyLimit.toLocaleString('en-IN')}.`);
    }

    const nowFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
      ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const refCode = `UP-${Math.floor(100000 + Math.random() * 900000)}`;

    if (activeModal === 'send') {
      const channel = formInput.sendChannel;
      const targetName = formInput.recipientName || formInput.recipient || 'Transfer Beneficiary';

      if (channel === 'bank_to_bank') {
        if (bankBalance < val) return alert('Insufficient Bank Balance.');
        setBankBalance(prev => prev - val);
        setTransactions(prev => [{ id: `tx-${Date.now()}`, name: targetName, category: 'Bank → Bank Transfer', source: 'Bank Account', date: nowFormatted, amount: val, type: 'Expend', ref: refCode }, ...prev]);
        logNotification('Funds Transferred', `BDT ${val.toLocaleString('en-IN')} deducted from Bank Card. Transferred to ${targetName}. (Ref: ${refCode})`);
      } else if (channel === 'bank_to_wallet') {
        if (bankBalance < val) return alert('Insufficient Bank Balance.');
        setBankBalance(prev => prev - val);
        setTransactions(prev => [{ id: `tx-${Date.now()}`, name: targetName, category: 'Bank → Wallet Transfer', source: 'Bank Account', date: nowFormatted, amount: val, type: 'Expend', ref: refCode }, ...prev]);
        logNotification('Wallet Transfer Completed', `BDT ${val.toLocaleString('en-IN')} transferred from Bank Card to ${targetName}'s Wallet.`);
      } else if (channel === 'wallet_to_bank') {
        if (walletBalance < val) return alert('Insufficient Virtual Wallet Balance.');
        setWalletBalance(prev => prev - val);
        setTransactions(prev => [{ id: `tx-${Date.now()}`, name: targetName, category: 'Wallet → Bank Transfer', source: 'Virtual Wallet', date: nowFormatted, amount: val, type: 'Expend', ref: refCode }, ...prev]);
        logNotification('Transfer Successful', `BDT ${val.toLocaleString('en-IN')} transferred from Wallet to Bank Account ${targetName}.`);
      } else if (channel === 'wallet_to_wallet') {
        if (walletBalance < val) return alert('Insufficient Virtual Wallet Balance.');
        setWalletBalance(prev => prev - val);
        setTransactions(prev => [{ id: `tx-${Date.now()}`, name: targetName, category: 'Wallet → Wallet Transfer', source: 'Virtual Wallet', date: nowFormatted, amount: val, type: 'Expend', ref: refCode }, ...prev]);
        logNotification('P2P Transfer Completed', `BDT ${val.toLocaleString('en-IN')} transferred to ${targetName}.`);
      }
    } else if (activeModal === 'add') {
      if (formInput.addChannel === 'bank_to_wallet') {
        if (bankBalance < val) return alert('Insufficient Bank Balance.');
        setBankBalance(prev => prev - val);
        setWalletBalance(prev => prev + val);
        setTransactions(prev => [{ id: `tx-${Date.now()}`, name: 'Wallet Fund Top-Up', category: 'Bank → Wallet Top-Up', source: 'Virtual Wallet', date: nowFormatted, amount: val, type: 'Income', ref: refCode }, ...prev]);
        logNotification('Wallet Top-Up Successful', `BDT ${val.toLocaleString('en-IN')} moved from Bank Card to Wallet.`);
      } else {
        if (walletBalance < val) return alert('Insufficient Wallet Balance.');
        setWalletBalance(prev => prev - val);
        setBankBalance(prev => prev + val);
        setTransactions(prev => [{ id: `tx-${Date.now()}`, name: 'Wallet Return Sweep', category: 'Wallet → Bank Transfer', source: 'Bank Account', date: nowFormatted, amount: val, type: 'Income', ref: refCode }, ...prev]);
        logNotification('Balance Swept to Bank', `BDT ${val.toLocaleString('en-IN')} moved from Wallet to Bank Card.`);
      }
    } else if (activeModal === 'cashout') {
      if (walletBalance < val) return alert('Insufficient Wallet Balance.');
      setWalletBalance(prev => prev - val);
      setTransactions(prev => [{ id: `tx-${Date.now()}`, name: `Agent Cash Out (${formInput.recipient})`, category: 'MFS Agent Payout', source: 'Virtual Wallet', date: nowFormatted, amount: val, type: 'Expend', ref: refCode }, ...prev]);
      logNotification('Cash Out Successful', `BDT ${val.toLocaleString('en-IN')} deducted from Wallet via Agent ${formInput.recipient}.`);
    } else if (activeModal === 'recharge') {
      if (walletBalance < val) return alert('Insufficient Wallet Balance.');
      setWalletBalance(prev => prev - val);
      setTransactions(prev => [{ id: `tx-${Date.now()}`, name: `Airtime Top-Up (${formInput.recipient})`, category: 'Mobile Recharge', source: 'Virtual Wallet', date: nowFormatted, amount: val, type: 'Expend', ref: refCode }, ...prev]);
      logNotification('Mobile Recharge Successful', `BDT ${val.toLocaleString('en-IN')} deducted from Wallet for mobile recharge.`);
    } else if (activeModal === 'bill') {
      if (formInput.billSource === 'Bank Account') {
        if (bankBalance < val) return alert('Insufficient Bank Balance.');
        setBankBalance(prev => prev - val);
      } else {
        if (walletBalance < val) return alert('Insufficient Wallet Balance.');
        setWalletBalance(prev => prev - val);
      }
      setTransactions(prev => [{ id: `tx-${Date.now()}`, name: `${formInput.utilityProvider} [${formInput.customerMeterId || 'Bill'}]`, category: `Utility Bill (${formInput.billingMonth})`, source: formInput.billSource, date: nowFormatted, amount: val, type: 'Expend', ref: refCode }, ...prev]);
      logNotification('Utility Bill Paid', `BDT ${val.toLocaleString('en-IN')} deducted for ${formInput.utilityProvider}. Ref: ${refCode}`);
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
      reminderAmount: '',
      reminderCategory: 'Utility Bill'
    });
    setActiveModal(null);
    alert('Transaction completed successfully! Your balance has been updated.');
  };

  const handleCreateDeposit = (e) => {
    e.preventDefault();
    const val = parseFloat(depositInput.amount);
    if (!val || val <= 0) return alert('Please enter a valid deposit amount.');

    const source = depositInput.debitSource;
    if (source === 'Bank Account') {
      if (bankBalance < val) return alert('Insufficient Bank Balance.');
      setBankBalance(prev => prev - val);
    } else {
      if (walletBalance < val) return alert('Insufficient Virtual Wallet Balance.');
      setWalletBalance(prev => prev - val);
    }

    const months = parseInt(depositInput.months) || 12;
    const rate = depositInput.planType === 'FDR' ? 8.5 : 7.2;
    const calculatedProfit = Math.round((val * (rate / 100) * (months / 12)));

    const nowFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
      ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const refCode = `UP-${Math.floor(100000 + Math.random() * 900000)}`;

    const newScheme = {
      id: `dp-${Date.now()}`,
      title: depositInput.planType === 'FDR' ? 'Term Fixed Deposit (FDR)' : 'Monthly DPS Scheme',
      type: depositInput.planType,
      principal: val,
      rate: rate,
      tenureMonths: months,
      startDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      accruedProfit: calculatedProfit,
      debitSource: source
    };

    setDepositPlans(prev => [newScheme, ...prev]);

    setTransactions(prev => [{
      id: `tx-${Date.now()}`,
      name: `Deposit Scheme (${newScheme.title})`,
      category: 'Deposit Placement',
      source: source,
      date: nowFormatted,
      amount: val,
      type: 'Expend',
      ref: refCode
    }, ...prev]);

    setNewDepositModal(false);
    setDepositInput({ planType: 'FDR', amount: '', months: '12', debitSource: 'Bank Account' });
    logNotification('New Deposit Created', `Invested BDT ${val.toLocaleString('en-IN')} into ${newScheme.title} from ${source}.`);
    alert(`Success! Created deposit with ${rate}% annual rate. Funded via ${source}.`);
  };

  const handlePayInstallment = (plan) => {
    const installmentVal = parseFloat(customInstallmentAmount);
    if (!installmentVal || installmentVal <= 0) return alert('Please enter a valid installment amount.');

    if (installmentSource === 'Bank Account') {
      if (bankBalance < installmentVal) return alert('Insufficient Bank Balance.');
      setBankBalance(prev => prev - installmentVal);
    } else {
      if (walletBalance < installmentVal) return alert('Insufficient Wallet Balance.');
      setWalletBalance(prev => prev - installmentVal);
    }

    const addedProfit = Math.round((installmentVal * (plan.rate / 100) * (1 / 12)));

    setDepositPlans(prev => prev.map(p => {
      if (p.id === plan.id) {
        return {
          ...p,
          principal: (p.principal || 0) + installmentVal,
          accruedProfit: (p.accruedProfit || 0) + addedProfit
        };
      }
      return p;
    }));

    const nowFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
      ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const refCode = `UP-${Math.floor(100000 + Math.random() * 900000)}`;

    setTransactions(prev => [{
      id: `tx-${Date.now()}`,
      name: `DPS Deposit (${plan.title})`,
      category: 'DPS Installment',
      source: installmentSource,
      date: nowFormatted,
      amount: installmentVal,
      type: 'Expend',
      ref: refCode
    }, ...prev]);

    setDepositInstallmentModal(null);
    logNotification('DPS Installment Deposited', `BDT ${installmentVal.toLocaleString('en-IN')} deposited from ${installmentSource}.`);
    alert(`Success! BDT ${installmentVal.toLocaleString('en-IN')} deposited into ${plan.title} from ${installmentSource}.`);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      <Navbar 
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onOpenBillModal={() => setActiveModal('bill')}
        notifications={notifications}
        unreadCount={unreadCount}
        notificationOpen={notificationOpen}
        setNotificationOpen={setNotificationOpen}
        onClearNotifications={() => setNotifications([])}
        userProfile={userProfile}
        userInitials={userInitials}
        onOpenProfileModal={() => setProfileModalOpen(true)}
        onNavigateHome={() => setActiveTab('dashboard')}
        beneficiaries={BENEFICIARY_ACCOUNTS}
        transactions={transactions}
        onSelectBeneficiary={(acc) => {
          setFormInput(prev => ({
            ...prev,
            recipient: acc.accountNo,
            recipientName: `${acc.name} (${acc.provider})`,
            sendChannel: acc.channel === 'Bank' ? 'bank_to_bank' : 'bank_to_wallet'
          }));
          setActiveModal('send');
        }}
      />

      <div className="flex-1 flex flex-col md:flex-row w-full">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          mobileMenuOpen={mobileMenuOpen} 
          setMobileMenuOpen={setMobileMenuOpen} 
        />

        <main className="flex-1 p-4 lg:p-7 flex flex-col bg-white overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 gap-2">
            <div>
              <h1 className="text-xl font-bold text-[#0B2545] capitalize">{activeTab}</h1>
              <p className="text-xs text-slate-400">Standard Checking & Virtual Wallet • Account #{userProfile.accountNumber}</p>
            </div>
            <div className="flex items-center space-x-1.5 self-end sm:self-auto bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-full text-xs text-slate-600 shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-700">256-Bit SSL Encrypted</span>
              <span className="text-slate-300">•</span>
              <span className="text-[#028090] font-medium">UnityShield™</span>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
               {/* 1st Card: Clean BRAC Bank Card */}
<div 
  onClick={() => setSelectedCardDetails('bank')}
  className="h-56 rounded-2xl p-6 text-white bg-gradient-to-tr from-[#022B42] via-[#055174] to-[#0A7398] relative overflow-hidden flex flex-col justify-between shadow-lg select-none cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all group"
>
  <div className="flex items-center justify-between z-10">
    <div className="flex items-center space-x-2">
      <div className="w-5 h-5 bg-[#FFBF00] flex items-center justify-center font-bold text-[#022B42] text-[10px] rounded-xs">
        B
      </div>
      <span className="font-extrabold tracking-wider text-sm text-white">
        BRAC BANK
      </span>
    </div>

    <div className="flex items-center space-x-1.5 bg-black/20 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/10" onClick={(e) => e.stopPropagation()}>
      <span className="text-xs font-bold text-cyan-200">
        {showBalance ? `BDT ${bankBalance.toLocaleString('en-IN')}` : "BDT ••••••"}
      </span>
      <button 
        type="button"
        onClick={() => setShowBalance(!showBalance)} 
        className="text-cyan-200/80 hover:text-white transition cursor-pointer"
      >
        {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      </button>
    </div>
  </div>

  <div className="flex items-center space-x-3 z-10 my-1">
    <div className="w-10 h-7 rounded-md bg-gradient-to-br from-[#E2B755] via-[#F8DE7E] to-[#C59B27] p-0.5 shadow-sm border border-[#A67C1E]/40 flex flex-col justify-between">
      <div className="w-full h-[1px] bg-[#936C18]/40 mt-1.5"></div>
      <div className="w-full h-[1px] bg-[#936C18]/40 mb-1.5"></div>
    </div>
    <Wifi className="w-5 h-5 text-white/80 rotate-90" />
  </div>

  <div className="z-10 space-y-1">
    <div className="font-mono text-base tracking-[0.22em] text-white font-semibold">
      0000 0000 0000 {userProfile.accountNumber}
    </div>

    <div className="flex items-center justify-between pt-1">
      <div className="space-y-0.5">
        <span className="text-[8px] font-mono text-cyan-200 block">4587</span>
        <div className="flex items-center space-x-3 text-[9px] font-mono text-cyan-100">
          <span>VALID FROM 02/25</span>
          <span>VALID THRU 02/30</span>
        </div>
        <span className="text-[11px] font-mono uppercase tracking-wider text-white block pt-0.5">
          {userProfile.name}
        </span>
      </div>

      <div className="text-right leading-none flex flex-col items-end">
        <span className="text-xl font-black italic tracking-tighter text-white block">
          VISA
        </span>
        <span className="text-[9px] text-cyan-200 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Click for Details ↗
        </span>
      </div>
    </div>
  </div>
</div>

              {/* 2nd Card: Digital Wallet */}
<div 
  onClick={() => setSelectedCardDetails('wallet')}
  className="h-56 rounded-2xl p-6 bg-white border border-slate-200 shadow-xs flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-[#028090]/50 hover:scale-[1.01] transition-all group"
>
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2">
      <Wallet className="w-4 h-4 text-[#028090]" />
      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Digital Wallet</span>
    </div>
    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-bold">Active</span>
  </div>

  <div>
    <span className="text-[11px] text-slate-400 block font-medium">Digital Wallet Balance</span>
    <div className="text-3xl font-black text-[#0B2545] mt-1">
      BDT {walletBalance.toLocaleString('en-IN')}
    </div>
    <div className="flex items-center justify-between mt-1">
      <p className="text-xs text-slate-400 font-mono">ID: {userProfile.walletNumber}</p>
      <span className="text-[10px] text-[#028090] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
        View Specs ↗
      </span>
    </div>
  </div>

  <div className="flex items-center space-x-3 pt-3 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
    <button 
      onClick={() => setActiveModal('add')} 
      className="flex-1 bg-[#028090]/10 hover:bg-[#028090]/20 text-[#028090] text-xs font-bold py-2 rounded-xl transition cursor-pointer text-center"
    >
      + Top Up
    </button>
    <button 
      onClick={() => setActiveModal('cashout')} 
      className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold py-2 rounded-xl transition cursor-pointer text-center"
    >
      Cash Out
    </button>
  </div>
</div>

              </div>

              <QuickActions onOpenModal={(modalId) => setActiveModal(modalId)} />

              <Beneficiaries 
                beneficiaries={BENEFICIARY_ACCOUNTS} 
                onSelectBeneficiary={(acc) => {
                  setFormInput(prev => ({
                    ...prev,
                    recipient: acc.accountNo,
                    recipientName: `${acc.name} (${acc.provider})`,
                    sendChannel: acc.channel === 'Bank' ? 'bank_to_bank' : 'bank_to_wallet'
                  }));
                  setActiveModal('send');
                }} 
              />
            </div>
          )}

          {activeTab === 'transaction' && (
            <div className="space-y-6">
              <QuickActions onOpenModal={(modalId) => setActiveModal(modalId)} />
              <TransactionTable 
                transactions={transactions} 
                onDeleteTransaction={handleDeleteTransaction}
              />
            </div>
          )}

          {activeTab === 'deposit' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-[#0B2545] to-[#028090] rounded-2xl p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <div className="flex items-center space-x-2 text-cyan-200 mb-1">
                    <Award className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wider">Unity Wealth & Term Deposits</span>
                  </div>
                  <h2 className="text-2xl font-black">
                    Total Unclaimed Profit: BDT {depositPlans.reduce((acc, p) => acc + (p.accruedProfit || 0), 0).toLocaleString('en-IN')}
                  </h2>
                  <p className="text-xs text-cyan-100 mt-1">
                    Percentage interest calculated on principal. Fund from Bank Account or Virtual Wallet.
                  </p>
                </div>
                <button 
                  onClick={() => setNewDepositModal(true)} 
                  className="bg-white text-[#0B2545] hover:bg-cyan-50 font-bold px-4 py-2.5 rounded-xl text-xs transition cursor-pointer self-start sm:self-auto shrink-0 shadow-xs"
                >
                  + Open New Deposit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {depositPlans.map(plan => {
                  const currentBalance = plan.principal || plan.totalDeposited || 0;
                  const isDPS = plan.type === 'DPS' || plan.title.toLowerCase().includes('dps');
                  return (
                    <div key={plan.id} className="border border-slate-200/80 rounded-2xl p-5 bg-white shadow-2xs hover:border-[#028090] transition flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-bold text-sm text-[#0B2545]">{plan.title}</h3>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              Profit Rate: <span className="font-bold text-emerald-600">{plan.rate}% p.a.</span>
                            </p>
                          </div>
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                            Active
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100 my-2 text-xs">
                          <div>
                            <span className="text-slate-400 text-[10.5px]">Deposited Balance</span>
                            <p className="font-bold text-slate-800">
                              BDT {currentBalance.toLocaleString('en-IN')}
                            </p>
                            <span className="text-[9.5px] text-slate-400">Tenure: {plan.tenureMonths} Mo</span>
                          </div>
                          <div>
                            <span className="text-slate-400 text-[10.5px]">Calculated Profit ({plan.rate}%)</span>
                            <p className="font-bold text-[#028090]">
                              + BDT {plan.accruedProfit.toLocaleString('en-IN')}
                            </p>
                            <span className="text-[9.5px] text-slate-400">Formula: (P × R% × T)/12</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        {isDPS ? (
                          <button
                            type="button"
                            onClick={() => {
                              setCustomInstallmentAmount('1000');
                              setDepositInstallmentModal(plan);
                            }}
                            className="text-xs bg-[#028090]/10 hover:bg-[#028090]/20 text-[#028090] px-3 py-1.5 rounded-lg font-bold transition cursor-pointer"
                          >
                            + Deposit Installment
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400">Term Deposit</span>
                        )}

                        <button 
                          onClick={() => {
                            if (!plan.accruedProfit || plan.accruedProfit <= 0) {
                              return alert('No profit available to claim right now.');
                            }

                            const profit = plan.accruedProfit;
                            setBankBalance(prev => prev + profit);
                            setDepositPlans(prev => prev.map(p => 
                              p.id === plan.id ? { ...p, accruedProfit: 0 } : p
                            ));

                            const nowFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
                              ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
                            const refCode = `UP-${Math.floor(100000 + Math.random() * 900000)}`;

                            setTransactions(prev => [{
                              id: `tx-${Date.now()}`,
                              name: `${plan.title} (${plan.rate}% Interest Payout)`,
                              category: 'Deposit Profit Yield',
                              source: 'Deposit Scheme → Bank Account',
                              date: nowFormatted,
                              amount: profit,
                              type: 'Income',
                              ref: refCode
                            }, ...prev]);

                            logNotification('Profit Disbursed', `BDT ${profit.toLocaleString('en-IN')} interest credited to your Bank Card.`);
                            alert(`Success! BDT ${profit.toLocaleString('en-IN')} profit has been transferred to your Bank Card.`);
                          }} 
                          className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          Claim Profit to Bank
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl mx-auto w-full space-y-5">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                <h2 className="font-bold text-sm text-[#0B2545] flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#028090]" />
                  <span>Security & Transaction Limits</span>
                </h2>

                <div className="space-y-4 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800">Daily Transfer Ceiling</p>
                      <p className="text-slate-400 text-[11px]">Maximum outward transfer allowed per 24 hours</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-slate-700">BDT {dailyLimit.toLocaleString('en-IN')}</span>
                      <button 
                        onClick={() => {
                          const val = prompt('Set new daily transfer limit (BDT):', dailyLimit);
                          if (val && !isNaN(val)) setDailyLimit(Number(val));
                        }} 
                        className="text-[#028090] font-bold hover:underline cursor-pointer ml-2"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800">Two-Factor Authentication (2FA)</p>
                      <p className="text-slate-400 text-[11px]">Require OTP verification on high-value transfers</p>
                    </div>
                    <button 
                      onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${twoFactorAuth ? 'bg-[#028090]' : 'bg-slate-300'}`}
                    >
                      <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${twoFactorAuth ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-800">Real-Time SMS & Push Alerts</p>
                      <p className="text-slate-400 text-[11px]">Receive notification immediately upon debit or credit</p>
                    </div>
                    <button 
                      onClick={() => setSmsAlerts(!smsAlerts)}
                      className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${smsAlerts ? 'bg-[#028090]' : 'bg-slate-300'}`}
                    >
                      <span className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${smsAlerts ? 'left-6' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
                <h3 className="font-bold text-sm text-[#0B2545] flex items-center space-x-2 mb-3">
                  <Key className="w-4 h-4 text-[#028090]" />
                  <span>Update Transaction Security PIN</span>
                </h3>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (pinChangeForm.oldPin !== currentPin) return alert('Current PIN does not match.');
                    if (pinChangeForm.newPin.length !== 4) return alert('New PIN must be exactly 4 digits.');
                    if (pinChangeForm.newPin !== pinChangeForm.confirmPin) return alert('New PIN and confirmation do not match.');
                    setCurrentPin(pinChangeForm.newPin);
                    setPinChangeForm({ oldPin: '', newPin: '', confirmPin: '' });
                    logNotification('Security PIN Changed', 'Your 4-digit transfer PIN has been updated.');
                    alert('Security PIN updated successfully!');
                  }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs"
                >
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Old PIN</label>
                    <input 
                      type="password" 
                      maxLength={4}
                      required
                      placeholder="••••"
                      value={pinChangeForm.oldPin}
                      onChange={(e) => setPinChangeForm({ ...pinChangeForm, oldPin: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-center font-mono focus:outline-[#028090]" 
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">New 4-Digit PIN</label>
                    <input 
                      type="password" 
                      maxLength={4}
                      required
                      placeholder="••••"
                      value={pinChangeForm.newPin}
                      onChange={(e) => setPinChangeForm({ ...pinChangeForm, newPin: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-center font-mono focus:outline-[#028090]" 
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Confirm PIN</label>
                    <input 
                      type="password" 
                      maxLength={4}
                      required
                      placeholder="••••"
                      value={pinChangeForm.confirmPin}
                      onChange={(e) => setPinChangeForm({ ...pinChangeForm, confirmPin: e.target.value })}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-center font-mono focus:outline-[#028090]" 
                    />
                  </div>
                  <div className="sm:col-span-3 pt-1">
                    <button type="submit" className="w-full py-2 bg-[#028090] hover:bg-[#0077B6] text-white font-bold rounded-xl transition cursor-pointer">
                      Save New Security PIN
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>

        <SchedulePanel 
          reminders={reminders} 
          selectedDate={selectedDate} 
          setSelectedDate={setSelectedDate} 
          onOpenReminderModal={() => setActiveModal('reminder')} 
          onPayScheduledBill={(rem) => {
            const numVal = parseFloat(rem.amount.replace(/[^0-9]/g, '')) || 0;
            if (bankBalance < numVal) return alert('Insufficient Bank Balance to settle this bill.');
            setBankBalance(prev => prev - numVal);

            const nowFormatted = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
              ' • ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const refCode = `UP-${Math.floor(100000 + Math.random() * 900000)}`;

            setTransactions(prev => [{ id: `tx-${Date.now()}`, name: rem.title, category: rem.category || 'Scheduled Payment', source: 'Bank Account', date: nowFormatted, amount: numVal, type: 'Expend', ref: refCode }, ...prev]);
            setReminders(prev => prev.filter(item => item.id !== rem.id));
            logNotification('Obligation Settled', `${rem.title} (${rem.amount}) was deducted from Bank Card.`);
            alert(`Settled! ${rem.title} has been paid and deducted from your Bank Card.`);
          }}
        />
      </div>

      {newDepositModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-base text-[#0B2545] mb-4">Open New Term Deposit</h3>
            <form onSubmit={handleCreateDeposit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Debit Source</label>
                <select 
                  value={depositInput.debitSource} 
                  onChange={(e) => setDepositInput({ ...depositInput, debitSource: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-[#028090] bg-white"
                >
                  <option value="Bank Account">Bank Account (BDT {bankBalance.toLocaleString('en-IN')})</option>
                  <option value="Virtual Wallet">Virtual Wallet (BDT {walletBalance.toLocaleString('en-IN')})</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Scheme Type</label>
                <select 
                  value={depositInput.planType} 
                  onChange={(e) => setDepositInput({ ...depositInput, planType: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-[#028090] bg-white"
                >
                  <option value="FDR">Fixed Term Deposit (FDR - 8.5% p.a.)</option>
                  <option value="DPS">Monthly DPS Scheme (7.2% p.a.)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Deposit Amount (BDT)</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 50000"
                  value={depositInput.amount}
                  onChange={(e) => setDepositInput({ ...depositInput, amount: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-[#028090]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Tenure Period</label>
                <select 
                  value={depositInput.months} 
                  onChange={(e) => setDepositInput({ ...depositInput, months: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-[#028090] bg-white"
                >
                  <option value="6">6 Months</option>
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                  <option value="36">36 Months (3 Years)</option>
                </select>
              </div>

              {depositInput.amount > 0 && (
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 space-y-1">
                  <div className="flex justify-between">
                    <span>Est. Annual Rate:</span>
                    <span className="font-bold text-emerald-600">{depositInput.planType === 'FDR' ? '8.5%' : '7.2%'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Profit Yield:</span>
                    <span className="font-bold text-[#028090]">
                      + BDT {Math.round(depositInput.amount * (depositInput.planType === 'FDR' ? 0.085 : 0.072) * (parseInt(depositInput.months) / 12)).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button type="button" onClick={() => setNewDepositModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="flex-1 bg-[#028090] text-white py-2.5 rounded-xl font-bold cursor-pointer">
                  Confirm & Invest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {depositInstallmentModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="font-bold text-base text-[#0B2545] mb-2">Deposit Monthly Installment</h3>
            <p className="text-xs text-slate-500 mb-4">{depositInstallmentModal.title}</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              handlePayInstallment(depositInstallmentModal);
            }} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-600 block mb-1">Debit Source</label>
                <select 
                  value={installmentSource} 
                  onChange={(e) => setInstallmentSource(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-semibold text-slate-700 focus:outline-[#028090] bg-white"
                >
                  <option value="Bank Account">Bank Account (BDT {bankBalance.toLocaleString('en-IN')})</option>
                  <option value="Virtual Wallet">Virtual Wallet (BDT {walletBalance.toLocaleString('en-IN')})</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-600 block mb-1">Deposit Amount (BDT)</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 1000"
                  value={customInstallmentAmount}
                  onChange={(e) => setCustomInstallmentAmount(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 font-bold focus:outline-[#028090]"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setDepositInstallmentModal(null)} 
                  className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-[#028090] text-white py-2.5 rounded-xl font-bold cursor-pointer"
                >
                  Deposit Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
{/* CARD DETAILS MODAL (BANK & WALLET) */}
      {selectedCardDetails && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            {selectedCardDetails === 'bank' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#022B42] to-[#0A7398] text-white flex items-center justify-center font-bold text-xs">
                      B
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#0B2545]">BRAC Bank Visa Platinum Card</h3>
                      <p className="text-[11px] text-slate-400">Debit / Multi-Currency EMV Chip Card</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Active & Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-sans">
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-medium block">Cardholder Name</span>
                    <span className="font-bold text-slate-800">{userProfile.name}</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-medium block">Account / Masked Number</span>
                    <span className="font-mono font-bold text-slate-800">•••• •••• •••• {userProfile.accountNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-medium block">BIN Number</span>
                    <span className="font-mono font-bold text-slate-800">4587 (Visa Debit)</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-medium block">Validity Period</span>
                    <span className="font-mono font-bold text-slate-800">02/25 — 02/30</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-medium block">Current Ledger Balance</span>
                    <span className="font-bold text-[#028090]">BDT {bankBalance.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-medium block">Daily Limit</span>
                    <span className="font-mono font-bold text-slate-800">BDT {dailyLimit.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-medium block">NPSB / BEFTN Routing</span>
                    <span className="font-mono font-bold text-slate-800">060271892</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-medium block">2FA Verification</span>
                    <span className="font-bold text-emerald-600">{twoFactorAuth ? 'Enabled (OTP/SMS)' : 'Disabled'}</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-500 bg-cyan-50/60 p-3 rounded-xl border border-cyan-100">
                  <p className="font-semibold text-[#0B2545]">Card Features & Privileges:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[10.5px]">
                    <li>Direct access to DPS and term fixed deposit schemes.</li>
                    <li>NPSB instant transfer supported for all local commercial banks.</li>
                    <li>EMV Contactless NFC enabled for fast POS tap-and-pay.</li>
                  </ul>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedCardDetails(null);
                      setActiveModal('send');
                    }}
                    className="flex-1 py-2.5 bg-[#028090] hover:bg-[#0077B6] text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Transfer Funds
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSelectedCardDetails(null)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#028090]/15 text-[#028090] flex items-center justify-center font-bold text-sm">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-[#0B2545]">Unity Digital Wallet</h3>
                      <p className="text-[11px] text-slate-400">Mobile Financial Services (MFS) Wallet</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    Tier 2 Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-sans">
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-medium block">Registered Account</span>
                    <span className="font-bold text-slate-800">{userProfile.name}</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-medium block">Wallet ID / Mobile</span>
                    <span className="font-mono font-bold text-slate-800">{userProfile.walletNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-medium block">Current Balance</span>
                    <span className="font-bold text-[#028090]">BDT {walletBalance.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-medium block">Associated Email</span>
                    <span className="font-medium text-slate-800 truncate block">{userProfile.email}</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-medium block">MFS Interoperability</span>
                    <span className="font-medium text-slate-700">bKash, Nagad, Rocket</span>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400 font-medium block">Cash Out Fee</span>
                    <span className="font-medium text-slate-700">0.0% (Simulation)</span>
                  </div>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-500 bg-amber-50/60 p-3 rounded-xl border border-amber-200/60">
                  <p className="font-semibold text-amber-900">Wallet Privileges:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-amber-800">
                    <li>Instant mobile airtime recharges across GP, Banglalink, Robi, Airtel, Teletalk.</li>
                    <li>Two-way sweep between BRAC Bank Card and Unity Wallet.</li>
                    <li>Direct utility bill settlement without debit card OTP delays.</li>
                  </ul>
                </div>

                <div className="flex space-x-2 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedCardDetails(null);
                      setActiveModal('add');
                    }}
                    className="flex-1 py-2.5 bg-[#028090] hover:bg-[#0077B6] text-white rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    + Top Up Wallet
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      setSelectedCardDetails(null);
                      setActiveModal('cashout');
                    }}
                    className="flex-1 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Cash Out
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSelectedCardDetails(null)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <Modals 
        activeModal={activeModal} 
        setActiveModal={setActiveModal} 
        profileModalOpen={profileModalOpen} 
        setProfileModalOpen={setProfileModalOpen} 
        userProfile={userProfile} 
        setUserProfile={setUserProfile} 
        userInitials={userInitials} 
        formInput={formInput} 
        setFormInput={setFormInput} 
        bankBalance={bankBalance} 
        walletBalance={walletBalance} 
        selectedDate={selectedDate}
        onExecuteTransaction={handleExecuteTransaction} 
        onAddReminder={(e) => {
          e.preventDefault();
          if (!formInput.reminderTitle || !formInput.reminderAmount) return alert('Please enter all reminder details.');
          
          const d = selectedDate.getDate();
          const m = selectedDate.toLocaleDateString('en-US', { month: 'short' });
          const y = selectedDate.getFullYear();
          const dateKey = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`;

          const newRem = {
            id: Date.now(),
            title: formInput.reminderTitle,
            category: formInput.reminderCategory || 'Scheduled Payment',
            amount: `BDT ${Number(formInput.reminderAmount).toLocaleString('en-IN')}`,
            type: 'debit',
            dueDate: `${d} ${m} ${y}`,
            dateKey: dateKey
          };

          setReminders(prev => [...prev, newRem]);
          logNotification('New Reminder Set', `Reminder created for "${newRem.title}" on ${newRem.dueDate}.`);
          setFormInput(prev => ({ ...prev, reminderTitle: '', reminderAmount: '' }));
          setActiveModal(null);
        }} 
        onSaveProfile={(e) => {
          e.preventDefault();
          setProfileModalOpen(false);
          logNotification('Profile Updated', 'User display credentials refreshed.');
        }} 
      />
    </div>
  );
}