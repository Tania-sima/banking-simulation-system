import React from 'react';
import { X, Building2, Wallet } from 'lucide-react';

export default function Modals({ 
  activeModal, 
  setActiveModal, 
  profileModalOpen, 
  setProfileModalOpen, 
  userProfile, 
  setUserProfile, 
  userInitials, 
  formInput, 
  setFormInput, 
  bankBalance, 
  walletBalance, 
  selectedDate = new Date(),
  onExecuteTransaction, 
  onAddReminder,
  onSaveProfile 
}) {
  return (
    <>
      {/* USER PROFILE MODAL */}
      {profileModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-base text-[#0B2545]">User Identity & Avatar</h3>
              <X className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setProfileModalOpen(false)} />
            </div>

            <div className="flex flex-col items-center mb-5">
              <div className="w-16 h-16 rounded-full bg-linear-to-tr from-[#0B2545] to-[#028090] text-white flex items-center justify-center text-lg font-bold shadow-md overflow-hidden mb-2">
                {userProfile.avatarUrl ? (
                  <img src={userProfile.avatarUrl} alt={userProfile.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{userInitials}</span>
                )}
              </div>
              <p className="text-xs font-bold text-slate-800">{userProfile.name}</p>
              <p className="text-[11px] text-slate-400">Account #{userProfile.accountNumber}</p>
            </div>

            <form onSubmit={onSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-600">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={userProfile.name} 
                  onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })} 
                  className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2 focus:outline-[#028090]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600">Account Number</label>
                <input 
                  type="text" 
                  required
                  value={userProfile.accountNumber} 
                  onChange={(e) => setUserProfile({ ...userProfile, accountNumber: e.target.value })} 
                  className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2 focus:outline-[#028090]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-600">Custom Avatar Image URL (Optional)</label>
                <input 
                  type="url" 
                  placeholder="https://example.com/avatar.jpg"
                  value={userProfile.avatarUrl} 
                  onChange={(e) => setUserProfile({ ...userProfile, avatarUrl: e.target.value })} 
                  className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2 focus:outline-[#028090]"
                />
              </div>

              <button 
                type="submit" 
                className="w-full mt-2 bg-[#028090] text-white py-2.5 rounded-xl font-semibold hover:bg-[#0077B6] transition cursor-pointer"
              >
                Save Identity
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TRANSACTION & BILL MODALS */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 my-8">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-base text-[#0B2545]">
                {activeModal === 'send' && 'Send Money (Transfer)'}
                {activeModal === 'add' && 'Add Money'}
                {activeModal === 'cashout' && 'Cash Out'}
                {activeModal === 'recharge' && 'Mobile Recharge'}
                {activeModal === 'bill' && 'Official Utility Bill Pay'}
                {activeModal === 'reminder' && 'Create Payment Reminder'}
              </h3>
              <X className="w-5 h-5 text-slate-400 hover:text-slate-600 cursor-pointer" onClick={() => setActiveModal(null)} />
            </div>

            {/* ADD REMINDER FORM */}
           {activeModal === 'reminder' ? (
  <form onSubmit={onAddReminder} className="space-y-4">
    <div className="bg-[#028090]/10 border border-[#028090]/20 rounded-xl px-3 py-2 text-xs text-[#0B2545] flex items-center justify-between">
      <span className="font-semibold">Target Date:</span>
      <span className="font-bold text-[#028090]">
        {selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
      </span>
    </div>

    <div>
      <label className="text-xs font-bold text-slate-600">Reminder Title</label>
      <input 
        type="text" 
        required 
        placeholder="e.g. WiFi Bill, Electricity, Tuition Fee" 
        value={formInput.reminderTitle}
        onChange={(e) => setFormInput({ ...formInput, reminderTitle: e.target.value })}
        className="w-full mt-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-[#028090]" 
      />
    </div>

    <div>
      <label className="text-xs font-bold text-slate-600">Category</label>
      <select
        value={formInput.reminderCategory}
        onChange={(e) => setFormInput({ ...formInput, reminderCategory: e.target.value })}
        className="w-full mt-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-[#028090] bg-white"
      >
        <option>Utility Bill</option>
        <option>Internet Bill</option>
        <option>Rent / Maintenance</option>
        <option>Savings Contribution</option>
      </select>
    </div>

    <div>
      <label className="text-xs font-bold text-slate-600">Amount (BDT)</label>
      <input 
        type="number" 
        required 
        placeholder="e.g. 1500" 
        value={formInput.reminderAmount}
        onChange={(e) => setFormInput({ ...formInput, reminderAmount: e.target.value })}
        className="w-full mt-1 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-[#028090]" 
      />
    </div>

    <div className="flex space-x-2 pt-2">
      <button 
        type="button" 
        onClick={() => setActiveModal(null)} 
        className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
      >
        Cancel
      </button>
      <button 
        type="submit" 
        className="flex-1 bg-[#028090] text-white py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
      >
        Save Reminder
      </button>
    </div>
  </form>
) : (
              <form onSubmit={onExecuteTransaction} className="space-y-4">
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
                            className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl border text-xs font-medium transition cursor-pointer ${
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
                        className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl border font-medium transition cursor-pointer ${
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
                        className={`flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl border font-medium transition cursor-pointer ${
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

                {/* OFFICIAL BILL PAYMENT */}
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
                  <label className="text-xs font-bold text-slate-600">Amount (BDT)</label>
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
                  <button type="button" onClick={() => setActiveModal(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 bg-[#028090] hover:bg-[#0077B6] text-white py-2.5 rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer">
                    Confirm & Execute
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}