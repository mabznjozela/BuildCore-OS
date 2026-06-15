import React, { useState, useEffect } from 'react';
import { Job, JobStatus, ProjectHealth } from '../types';
import { ArrowLeft, CheckCircle, AlertOctagon, Heart, Save, Calendar, Phone, Mail, MapPin } from 'lucide-react';

interface CommandCentreProps {
  job: Job;
  outstandingTasksCount: number;
  onGoBack: () => void;
  onUpdateJob: (updatedFields: Partial<Job>) => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
}

export default function CommandCentre({
  job,
  outstandingTasksCount,
  onGoBack,
  onUpdateJob,
  activeSection,
  onSelectSection
}: CommandCentreProps) {
  const [nextAction, setNextAction] = useState<string>(job.nextAction || '');

  useEffect(() => {
    setNextAction(job.nextAction || '');
  }, [job]);

  const handleHealthChange = (health: ProjectHealth) => {
    onUpdateJob({ health });
  };

  const handleNextActionSave = () => {
    onUpdateJob({ nextAction });
  };

  return (
    <div id={`command-centre-${job.id}`} className="space-y-6">
      
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between">
        <button
          id="cmd-back-home-btn"
          onClick={onGoBack}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-bold transition-colors cursor-pointer select-none"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Workspace
        </button>
        <span className="text-[11px] font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-md">
          PROJECT ID: {job.id}
        </span>
      </div>

      {/* Main Command Header Panel */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        {/* Decorative Grid Light overlay */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative">
          
          {/* Main info (Left) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className={`text-[9px] font-sans font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  job.health === 'On Track' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                  job.health === 'Needs Attention' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  ❤️ Health: {job.health}
                </span>
                <span className="text-xs text-slate-400 font-medium font-sans">
                  • {job.area}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-sans font-extrabold text-slate-100 tracking-tight">
                {job.clientName}
              </h1>
              <p className="text-xs text-slate-400 max-w-xl mt-1.5 leading-relaxed font-sans">
                {job.comments}
              </p>
            </div>

            {/* Quick Contacts detail in Command block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="truncate">{job.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500 shrink-0" />
                <span>{job.phone}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                <span className="truncate">{job.email}</span>
              </div>
            </div>
          </div>

          {/* Controls & Quick Knobs (Right) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4 lg:border-l lg:border-slate-800/80 lg:pl-6">
            
            {/* Health selectors */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Adjust Project Health
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['On Track', 'Needs Attention', 'At Risk'] as ProjectHealth[]).map((h) => (
                  <button
                    key={h}
                    id={`health-btn-${h}`}
                    onClick={() => handleHealthChange(h)}
                    className={`text-[10px] font-sans font-extrabold py-1.5 rounded-lg border transition-all cursor-pointer ${
                      job.health === h
                        ? h === 'On Track' ? 'bg-emerald-600 border-emerald-500 text-white' :
                          h === 'Needs Attention' ? 'bg-amber-600 border-amber-500 text-white' :
                          'bg-rose-600 border-rose-500 text-white'
                        : 'bg-slate-850 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Next Actions quick text input */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Next Active Action Point
              </label>
              <div className="flex gap-2">
                <input
                  id="command-next-action-input"
                  type="text"
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  className="flex-1 text-xs bg-slate-850 border border-slate-700/60 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-indigo-400"
                  placeholder="Set next chore point..."
                />
                <button
                  id="save-next-action-btn"
                  onClick={handleNextActionSave}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors shrink-0"
                >
                  Set
                </button>
              </div>
            </div>

            {/* Outstanding Tasks metric display */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">OUTSTANDING TASKS</span>
                <span className="text-xl font-sans font-extrabold text-slate-100">
                  {outstandingTasksCount} Action{outstandingTasksCount === 1 ? '' : 's'} Remaining
                </span>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400">
                {outstandingTasksCount}
              </div>
            </div>

          </div>
        </div>

        {/* Rapid Jump Tabs Menu inside detail */}
        <div className="mt-6 pt-4 border-t border-slate-800/70 flex items-center overflow-x-auto gap-2 scrollbar-none">
          {[
            { key: 'workflow', label: '📋 Workflow Progress' },
            { key: 'specs', label: '📐 Specifications' },
            { key: 'vault', label: '🎨 Visual Vault' },
            { key: 'financials', label: '💰 Expenses & Payments' },
            { key: 'notes', label: '📝 Site Logs' }
          ].map((tab) => (
            <button
              key={tab.key}
              id={`cmd-nav-tab-${tab.key}`}
              onClick={() => onSelectSection(tab.key)}
              className={`text-xs px-3.5 py-2.2 rounded-xl font-sans font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                activeSection === tab.key
                  ? 'bg-white text-slate-950 shadow-md ring-2 ring-indigo-500/10'
                  : 'bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
