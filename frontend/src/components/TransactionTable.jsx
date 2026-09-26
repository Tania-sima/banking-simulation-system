import React from 'react';
import { ArrowDownLeft, ArrowUpRight, Inbox, Trash2 } from 'lucide-react';

export default function TransactionTable({ transactions, onDeleteTransaction }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-[#0B2545]">All Recorded Transactions</h2>
          <p className="text-[11px] text-slate-400">Live ledger of real transfers executed in this session</p>
        </div>
        <span className="text-[11px] font-semibold text-[#028090] bg-[#028090]/10 px-2.5 py-1 rounded-full">
          Total: {transactions.length}
        </span>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold text-[11px]">
              <th className="py-3 px-5 whitespace-nowrap">Beneficiary / Merchant</th>
              <th className="py-3 px-4 whitespace-nowrap">Category / Channel</th>
              <th className="py-3 px-4 whitespace-nowrap">Debit Source</th>
              <th className="py-3 px-4 whitespace-nowrap">Reference ID</th>
              <th className="py-3 px-4 whitespace-nowrap">Date & Time</th>
              <th className="py-3 px-4 whitespace-nowrap text-right">Amount</th>
              <th className="py-3 px-4 whitespace-nowrap text-center">Status</th>
              <th className="py-3 px-4 whitespace-nowrap text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-14 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2 text-slate-400">
                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-1">
                      <Inbox className="w-6 h-6 stroke-1" />
                    </div>
                    <p className="text-xs font-semibold text-slate-600">No Transactions Yet</p>
                    <p className="text-[11px] text-slate-400 max-w-xs">
                      Send money, top up your wallet, or pay a bill to record your first verified transaction.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              transactions.map((item) => {
                const isIncome = item.type === 'Income';
                return (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition group">
                    <td className="py-3.5 px-5 font-semibold text-slate-800 whitespace-nowrap flex items-center space-x-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shrink-0 ${isIncome ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {isIncome ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                      </div>
                      <span className="truncate max-w-[180px]">{item.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap text-[11px]">{item.category}</td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">{item.source}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-mono text-[10.5px] whitespace-nowrap">{item.ref}</td>
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap text-[11px]">{item.date}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap text-right">
                      {isIncome ? '+' : '-'} BDT {Number(item.amount).toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${isIncome ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onDeleteTransaction(item.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                        title="Delete transaction record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}