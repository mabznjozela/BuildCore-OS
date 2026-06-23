import React, { useState } from 'react';
import { FinancialRecord, Job } from '../types';
import { Coins, Plus, TrendingDown, ArrowUpRight, ArrowDownRight, Info, AlertCircle } from 'lucide-react';

interface FinancialsSectionProps {
  job: Job;
  financials: FinancialRecord[];
  onAddTransaction: (newTx: Omit<FinancialRecord, 'id' | 'date'>) => void;
}

export default function FinancialsSection({ job, financials, onAddTransaction }: FinancialsSectionProps) {
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [txType, setTxType] = useState<'expense' | 'payment'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');

  const jobTxs = financials.filter((f) => f.jobId === job.id);

  // Math totals
  const quoteValue = job.quoteValue;
  // Calculate payments dynamically from matching types (depositReceived is in job, but we also let him log payments!)
  const paymentTotal = jobTxs
    .filter((f) => f.type === 'payment')
    .reduce((sum, f) => sum + f.amount, 0) + (job.depositReceived || 0);

  const expenseTotal = jobTxs
    .filter((f) => f.type === 'expense')
    .reduce((sum, f) => sum + f.amount, 0);

  const outstandingBalance = Math.max(0, quoteValue - paymentTotal);

  const depositPercent = quoteValue > 0 ? (paymentTotal / quoteValue) * 100 : 0;
  const sixtyPercentThreshold = quoteValue * 0.6;
  const metSixtyPercent = paymentTotal >= sixtyPercentThreshold;

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0 || !description.trim()) return;

    onAddTransaction({
      jobId: job.id,
      type: txType,
      amount: numAmount,
      description: description.trim(),
      category: category.trim() || (txType === 'expense' ? 'Material Cost' : 'Client Payment'),
    });

    // Reset Form
    setAmount('');
    setDescription('');
    setCategory('');
    setShowAddForm(false);
  };

  return (
    <div id={`financial-section-${job.id}`} className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 mb-6 gap-3">
        <div>
          <h2 className="text-xl font-sans font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Coins className="h-5 w-5 text-emerald-600" />
            Financial Health
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Operational cash ledger. Not double-entry bookkeeping, just clear, straightforward cashflow tracking.
          </p>
        </div>
        <button
          id={`fin-add-tx-btn-${job.id}`}
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          {showAddForm ? 'Cancel Form' : 'Log Expense or Payment'}
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Quote Value */}
        <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Contract Quote</div>
          <div className="text-lg md:text-xl font-sans font-extrabold text-slate-900 mt-1">
            R{quoteValue.toLocaleString()}
          </div>
          <span className="text-[10px] text-gray-400">Locked Client SLA Amount</span>
        </div>

        {/* Deposit Received */}
        <div className="bg-emerald-50/20 border border-emerald-100/50 p-4 rounded-xl relative overflow-hidden">
          <div className="text-[10px] font-bold text-emerald-800/80 uppercase tracking-wider flex items-center gap-1 font-sans">
            Deposit Received
            {metSixtyPercent && <span className="text-[9px] bg-emerald-500 text-white font-extrabold px-1 rounded">60%+</span>}
          </div>
          <div className="text-lg md:text-xl font-sans font-extrabold text-emerald-950 mt-1">
            R{paymentTotal.toLocaleString()}
          </div>
          <div className="flex items-center justify-between mt-1 text-[10px] font-sans">
            <span className="text-emerald-700 font-semibold">{depositPercent.toFixed(0)}% secured</span>
            <span className="text-gray-400">Req: R{sixtyPercentThreshold.toLocaleString()}</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-rose-50/20 border border-rose-100/50 p-4 rounded-xl">
          <div className="text-[10px] font-bold text-rose-800/80 uppercase tracking-wider">Accumulated Expenses</div>
          <div className="text-lg md:text-xl font-sans font-extrabold text-rose-950 mt-1">
            R{expenseTotal.toLocaleString()}
          </div>
          <span className="text-[10px] text-rose-600/70 font-semibold font-sans">
            Margin: {quoteValue > 0 ? (((quoteValue - expenseTotal) / quoteValue) * 100).toFixed(0) : 0}% Target
          </span>
        </div>

        {/* Outstanding Balance */}
        <div className="bg-red-50/10 border border-red-100/40 p-4 rounded-xl">
          <div className="text-[10px] font-bold text-red-800/80 uppercase tracking-wider">Outstanding Balance</div>
          <div className="text-lg md:text-xl font-sans font-extrabold text-red-950 mt-1">
            R{outstandingBalance.toLocaleString()}
          </div>
          <span className={`text-[10px] font-semibold font-sans ${outstandingBalance === 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
            {outstandingBalance === 0 ? 'Fully Settle Cleared 🎉' : 'Payable on installation finish'}
          </span>
        </div>
      </div>

      {/* Automatic Trigger Messages */}
      <div className="mb-6 space-y-2">
        {metSixtyPercent ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-emerald-900 text-xs flex items-start gap-3">
            <Info className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="font-sans">
              <span className="font-bold">60% Booking Deposit Automatons Active</span>: This client has reached/surpassed the required 60% booking deposit. Production stage is authorized to run.
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 text-xs flex items-start gap-3">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="font-sans font-medium">
              <span className="font-bold">Awaiting 60% Booking Deposit (R{sixtyPercentThreshold.toLocaleString()})</span>: Outstanding deposit gap is <span className="font-bold text-rose-700 font-sans">R{(sixtyPercentThreshold - paymentTotal).toLocaleString()}</span>. Avoid dispatching to factory until resolved.
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Log form */}
      {showAddForm && (
        <form onSubmit={handleTxSubmit} className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 mb-6 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Log New Transaction Entry
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Transaction Type</label>
              <select
                id={`fin-select-type-${job.id}`}
                value={txType}
                onChange={(e) => setTxType(e.target.value as any)}
                className="w-full text-xs border border-gray-300 bg-white rounded-lg px-2.5 py-1.5 outline-none focus:border-slate-500 text-gray-950 font-sans"
              >
                <option value="expense">🔴 Expense (Money Out)</option>
                <option value="payment">🟢 Payment Received (Money In)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Amount (R ZAR)</label>
              <input
                id={`fin-input-amount-${job.id}`}
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                placeholder="e.g. 15000"
                className="w-full text-xs border border-gray-300 bg-white rounded-lg px-2.5 py-1.5 outline-none focus:border-slate-500 text-gray-950 font-sans font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <input
                id={`fin-input-description-${job.id}`}
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="e.g. Oak Veneer board sheets, Hettich hinges"
                className="w-full text-xs border border-gray-300 bg-white rounded-lg px-2.5 py-1.5 outline-none focus:border-slate-500 text-gray-950 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category / Tag</label>
              <input
                id={`fin-input-category-${job.id}`}
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Timber, Quartzite, Commission"
                className="w-full text-xs border border-gray-300 bg-white rounded-lg px-2.5 py-1.5 outline-none focus:border-slate-500 text-gray-950 font-sans"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              id={`fin-cancel-btn-${job.id}`}
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs bg-gray-200 hover:bg-gray-300 px-3 py-1.5 rounded-lg font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              id={`fin-submit-btn-${job.id}`}
              type="submit"
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg cursor-pointer"
            >
              Add Ledger Row
            </button>
          </div>
        </form>
      )}

      {/* Transaction List Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Payments Received Table */}
        <div className="bg-slate-50/50 p-4 border border-gray-100 rounded-xl">
          <h3 className="text-xs font-sans font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4" /> Payments Received (Inflow)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-semibold bg-gray-100/60 p-2 text-[10px] uppercase">
                  <th className="py-2 px-2">Date</th>
                  <th className="py-2 px-2">Details</th>
                  <th className="py-2 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-gray-700">
                {/* Seed Initial Base Deposit if set */}
                {job.depositReceived > 0 && (
                  <tr className="hover:bg-gray-100/30">
                    <td className="py-2 px-2 text-gray-400 font-mono">Original</td>
                    <td className="py-2 px-2">
                      <div className="font-semibold text-gray-900">Initial Project Booking Deposit</div>
                      <div className="text-[10px] text-gray-400 bg-emerald-100 text-emerald-800 px-2 inline-block rounded-full transform scale-90 -translate-x-1.5">Preset 60%</div>
                    </td>
                    <td className="py-2 px-2 text-right font-bold text-emerald-600">
                      R{job.depositReceived.toLocaleString()}
                    </td>
                  </tr>
                )}
                {jobTxs.filter(f => f.type === 'payment').length === 0 && job.depositReceived === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-400">No payment logs yet</td>
                  </tr>
                ) : (
                  jobTxs
                    .filter((f) => f.type === 'payment')
                    .map((tx) => (
                      <tr key={tx.id} id={`ledger-row-${tx.id}`} className="hover:bg-gray-100/30">
                        <td className="py-2 px-2 text-gray-400 font-mono">{tx.date}</td>
                        <td className="py-2 px-2">
                          <div className="font-semibold text-gray-900">{tx.description}</div>
                          <div className="text-[9px] text-gray-400">{tx.category}</div>
                        </td>
                        <td className="py-2 px-2 text-right font-bold text-emerald-600">
                          +R{tx.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses List Table */}
        <div className="bg-slate-50/50 p-4 border border-gray-100 rounded-xl">
          <h3 className="text-xs font-sans font-bold text-rose-800 uppercase tracking-wider mb-3 flex items-center gap-1">
            <ArrowDownRight className="h-4 w-4" /> Material Expenses (Outflow)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-semibold bg-gray-100/60 p-2 text-[10px] uppercase">
                  <th className="py-2 px-2">Date</th>
                  <th className="py-2 px-2">Details</th>
                  <th className="py-2 px-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-gray-700 font-sans">
                {jobTxs.filter(f => f.type === 'expense').length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-400">No expense logs yet</td>
                  </tr>
                ) : (
                  jobTxs
                    .filter((f) => f.type === 'expense')
                    .map((tx) => (
                      <tr key={tx.id} id={`ledger-row-${tx.id}`} className="hover:bg-gray-100/30 font-medium">
                        <td className="py-2 px-2 text-gray-400 font-mono">{tx.date}</td>
                        <td className="py-2 px-2">
                          <div className="font-semibold text-gray-900">{tx.description}</div>
                          <div className="text-[9px] text-slate-400">{tx.category}</div>
                        </td>
                        <td className="py-2 px-2 text-right font-semibold text-rose-600">
                          -R{tx.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
