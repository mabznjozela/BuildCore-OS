import { useState } from 'react';
import { Database, ArrowRight, CheckCircle, Lock, Layers, Sparkles } from 'lucide-react';

export default function PowerBiSync() {
  const [upgradeStatus, setUpgradeStatus] = useState<'idle' | 'requesting' | 'completed'>('idle');

  const handleRequestUpgrade = () => {
    setUpgradeStatus('requesting');
    setTimeout(() => {
      setUpgradeStatus('completed');
    }, 1500);
  };

  return (
    <div id="erp-addon-container" className="bg-[#111625] border border-indigo-950/40 rounded-3xl p-6 text-slate-350 shadow-xl relative overflow-hidden">
      {/* Premium Accent badge background blur */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-505"></span>
            </span>
            <span className="text-[10px] bg-slate-900 border border-slate-800 text-indigo-450 font-bold px-2 py-0.5 rounded tracking-widest font-sans uppercase">
              Premium Add-On Available
            </span>
          </div>
          <h3 className="font-sans font-extrabold text-md md:text-lg text-slate-100 tracking-wide">
            Upgrade to ERP & Report Layer
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl mt-1.5 leading-relaxed font-sans">
            Kitchen Lab OS operates as the master craftsmanship execution engine. Upgrade to the **ERP & Reporting Layer** to automatically populate Google Sheets, execute detailed material and hardware cost audits, and generate multi-user Power BI client dashboards.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start lg:self-center">
          {upgradeStatus === 'completed' ? (
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-xl inline-block">
                ✓ Setup Request Submitted!
              </span>
              <p className="text-[10px] text-slate-405 mt-1 font-mono">David will be notified</p>
            </div>
          ) : (
            <button
              id="addon-upgrade-request-btn"
              onClick={handleRequestUpgrade}
              disabled={upgradeStatus === 'requesting'}
              className={`flex items-center gap-2 text-xs px-4 py-2.5 rounded-xl font-bold cursor-pointer font-sans transition-all active:scale-95 border ${
                upgradeStatus === 'requesting'
                  ? 'bg-indigo-950/50 text-indigo-400 border-indigo-900/40 cursor-default'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white border-transparent shadow-md shadow-indigo-600/20'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {upgradeStatus === 'requesting' ? 'Requesting Setup...' : 'Upgrade to ERP/Report Layer'}
            </button>
          )}
        </div>
      </div>

      {/* Visual Pipeline with Lock indicators */}
      <div className="mt-6 pt-4 border-t border-slate-800/60 flex flex-wrap items-center justify-start gap-y-3 gap-x-3 text-xs text-slate-400">
        
        {/* Step 1: Active AppSheet */}
        <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850">
          <Layers className="h-3.5 w-3.5 text-indigo-400" />
          <span className="font-bold text-slate-200">AppSheet Site App</span>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-extrabold px-1 py-0.5 rounded ml-1 uppercase">Active</span>
        </div>
        
        <ArrowRight className="h-3.5 w-3.5 text-slate-700 shrink-0" />
        
        {/* Step 2: Active Sheets */}
        <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-850">
          <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
          <span className="font-bold text-slate-200">Google Sheets DB</span>
          <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-extrabold px-1 py-0.5 rounded ml-1 uppercase">Active</span>
        </div>
        
        <ArrowRight className="h-3.5 w-3.5 text-slate-700 shrink-0" />
        
        {/* Step 3: Locked Power BI */}
        <div className="flex items-center gap-1.5 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-850/60 text-slate-500 relative group">
          <Database className="h-3.5 w-3.5 text-slate-600" />
          <span className="font-bold text-slate-400 select-none">Power BI Executive Dashboards</span>
          <div className="flex items-center gap-1 text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/10 font-bold px-1.5 py-0.5 rounded ml-1 uppercase">
            <Lock className="h-2.5 w-2.5" />
            <span>Add-On Upgrade</span>
          </div>
        </div>

      </div>
    </div>
  );
}
