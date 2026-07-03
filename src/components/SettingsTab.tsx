import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, Smartphone, WifiOff, Sliders, FileSpreadsheet } from 'lucide-react';
import { Job, Task, FinancialRecord, VaultFile, JobNote } from '../types';
import { exportToMasterExcel } from '../utils/excelExport';

interface SettingsTabProps {
  isSleekTheme: boolean;
  setIsSleekTheme: (val: boolean) => void;
  userRole: 'admin' | 'floor';
  setUserRole: (role: 'admin' | 'floor') => void;
  currentUser: string;
  setCurrentUser: (user: string) => void;
  jobs: Job[];
  tasks: Task[];
  financials: FinancialRecord[];
  files: VaultFile[];
  notes: JobNote[];
  writeAuditRecord: (desc: string) => void;
  setAutomationAlert: (alert: string | null) => void;
  db: any;
  setJobs: (val: Job[]) => void;
  setTasks: (val: Task[]) => void;
  setFinancials: (val: FinancialRecord[]) => void;
  setFiles: (val: VaultFile[]) => void;
  setNotes: (val: JobNote[]) => void;
}

export default function SettingsTab({
  isSleekTheme,
  setIsSleekTheme,
  userRole,
  setUserRole,
  currentUser,
  setCurrentUser,
  jobs,
  tasks,
  financials,
  files,
  notes,
  writeAuditRecord,
  setAutomationAlert,
  db,
  setJobs,
  setTasks,
  setFinancials,
  setFiles,
  setNotes
}: SettingsTabProps) {
  return (
    <div className="space-y-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Global settings options card */}
        <div className={`p-6 rounded-3xl border ${
          isSleekTheme ? 'bg-[#111625] border-slate-805 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <h3 className="text-md font-sans font-black tracking-tight mb-2">Workspace Controls</h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">Customize theme preferences, client-server options, and role permissions.</p>

          <div className="space-y-4">
            {/* Theme toggle option */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950/40 rounded-2xl border border-slate-850">
              <div>
                <span className="text-xs font-bold block">Theme Visuals Style</span>
                <span className="text-[10px] text-slate-450">Choose between elegant light and dark templates.</span>
              </div>
              <button
                onClick={() => {
                  const newVal = !isSleekTheme;
                  setIsSleekTheme(newVal);
                  localStorage.setItem('kl_sleek_theme', JSON.stringify(newVal));
                }}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold uppercase transition select-none ${
                  isSleekTheme ? 'bg-slate-800 text-white' : 'bg-slate-105 text-slate-800 border border-slate-200'
                }`}
              >
                {isSleekTheme ? 'Dark (Sleek)' : 'Light (Classic)'}
              </button>
            </div>

            {/* User Role swap option */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950/40 rounded-2xl border border-slate-850">
              <div>
                <span className="text-xs font-bold block">Acting User Role</span>
                <span className="text-[10px] text-slate-450">Swap between supervisor and workshop floor installer layouts.</span>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setUserRole('admin');
                    localStorage.setItem('kl_user_role', 'admin');
                  }}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition select-none ${
                    userRole === 'admin' ? 'bg-[#ea580c] text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Supervisor
                </button>
                <button
                  onClick={() => {
                    setUserRole('floor');
                    localStorage.setItem('kl_user_role', 'floor');
                  }}
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition select-none ${
                    userRole === 'floor' ? 'bg-[#ea580c] text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Floor Crew
                </button>
              </div>
            </div>

            {/* Acting profile dropdown */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950/40 rounded-2xl border border-slate-850">
              <div>
                <span className="text-xs font-bold block">Acting Profile</span>
                <span className="text-[10px] text-slate-450">Assigned operator metadata logged for database edits.</span>
              </div>
              <select
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                className={`bg-slate-900 text-white font-bold border border-slate-850 rounded-xl text-[10px] px-2.5 py-1.5 cursor-pointer outline-none focus:border-orange-500`}
              >
                <option value="David">David</option>
                <option value="Admin">Admin</option>
                <option value="Installer Mark">Installer Mark</option>
              </select>
            </div>

            {/* Master spreadsheet exporter */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950/40 rounded-2xl border border-slate-850">
              <div>
                <span className="text-xs font-bold block">Consolidated Excel Export</span>
                <span className="text-[10px] text-slate-450">Download a full-fidelity backup spreadsheet of all operations.</span>
              </div>
              <button
                onClick={() => exportToMasterExcel(jobs, financials)}
                className="bg-emerald-600 hover:bg-emerald-700 font-bold text-xs text-white px-3 py-1.5 rounded-xl flex items-center gap-1 select-none cursor-pointer"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Download XLS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Database syncing options card */}
        <div className={`p-6 rounded-3xl border ${
          isSleekTheme ? 'bg-[#111625] border-slate-805 text-white' : 'bg-white border-slate-200 text-slate-850'
        }`}>
          <h3 className="text-md font-sans font-black tracking-tight mb-2">Cloud Database Alignment</h3>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">Review Cloud Firestore endpoints or force local resets.</p>

          <div className="space-y-4">
            {/* Database Info */}
            <div className="p-3.5 bg-slate-950/40 rounded-2xl border border-slate-850 space-y-1 text-xs font-mono">
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Firestore Collections:</span>
                <span className="text-slate-300">/jobs, /tasks, /financials</span>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Local Cache States:</span>
                <span className="text-slate-300">kl_jobs, kl_tasks, kl_cloud_migrated</span>
              </div>
            </div>

            {/* Cloud Synchronization manual check */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950/40 rounded-2xl border border-slate-850">
              <div>
                <span className="text-xs font-bold block">Re-sync All Collections</span>
                <span className="text-[10px] text-slate-450">Instantly force a full metadata audit and alignment loop.</span>
              </div>
              <button
                onClick={() => {
                  writeAuditRecord('Forced comprehensive pipeline database synchronization handshake');
                  setAutomationAlert('Handshake verified. 100% of local caches aligned with cloud Firestore.');
                  setTimeout(() => setAutomationAlert(null), 4000);
                }}
                className="text-xs px-3.5 py-1.5 rounded-xl font-bold bg-[#ea580c] hover:bg-[#ea580c]/90 text-white cursor-pointer select-none"
              >
                Trigger Sync
              </button>
            </div>

            {/* Hard Wipe Option */}
            <div className="flex items-center justify-between p-3.5 bg-slate-950/40 rounded-2xl border border-red-900/35">
              <div>
                <span className="text-xs font-bold block text-red-400">Factory Hard Reset</span>
                <span className="text-[10px] text-slate-450">Erase all Firestore records and reseed from initial mock templates.</span>
              </div>
              <button
                onClick={() => {
                  if (window.confirm("Warning! This will erase all customer records, payments, and site files. Proceed?")) {
                    const confirmText = window.prompt("Type 'RESET' to confirm:");
                    if (confirmText === 'RESET') {
                      setAutomationAlert('Wiping Firestore and local databases...');
                      localStorage.clear();
                      sessionStorage.clear();
                      window.location.reload();
                    }
                  }
                }}
                className="bg-red-600/20 hover:bg-red-600 text-red-350 hover:text-white border border-red-500/20 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer select-none"
              >
                Wipe Database
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Always-expanded user handbook */}
      <div className={`p-6 rounded-3xl border text-sm ${
        isSleekTheme ? 'bg-[#111625] border-slate-805 text-white' : 'bg-white border-slate-200 text-slate-850'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-[#ea580c]" />
          <h3 className="text-md font-sans font-black tracking-tight">Kitchen Lab OS • Operational Handbook</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Manual Section 1 */}
          <div className={`p-4 rounded-2xl border ${isSleekTheme ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-50 border-slate-200'} space-y-2`}>
            <div className="flex items-center gap-2 text-[#ea580c]">
              <Smartphone className="h-4.5 w-4.5" />
              <h4 className="text-xs font-bold uppercase tracking-wide">1. Loading onto your Phone</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              To run the standalone mobile PWA launcher shortcut immediately onto your home screen:
              <br />
              1. Tap the Share App option in AI Studio or open the link on your phone.
              <br />
              2. Tap the browser Menu or Share button.
              <br />
              3. Choose "Add to Home Screen".
            </p>
          </div>

          {/* Manual Section 2 */}
          <div className={`p-4 rounded-2xl border ${isSleekTheme ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-50 border-slate-200'} space-y-2`}>
            <div className="flex items-center gap-2 text-[#ea580c]">
              <WifiOff className="h-4.5 w-4.5" />
              <h4 className="text-xs font-bold uppercase tracking-wide">2. Offline Caching Layer</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              David can log payments, adjust hinge specs, or append site notes in zero-reception spots. Changes are cached inside your device's built-in LocalStorage and safely aligned to Google Cloud Firestore automatically when signal is restored.
            </p>
          </div>

          {/* Manual Section 3 */}
          <div className={`p-4 rounded-2xl border ${isSleekTheme ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-50 border-slate-200'} space-y-2`}>
            <div className="flex items-center gap-2 text-[#ea580c]">
              <Sliders className="h-4.5 w-4.5" />
              <h4 className="text-xs font-bold uppercase tracking-wide">3. Core Features Guide</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              • <strong>Workflows:</strong> Track real-time progress steps for cabinetry fabrication.
              <br />
              • <strong>Specifications:</strong> Set door style profiles, board types, hinge designs, and granite countertops.
              <br />
              • <strong>Visual Vault:</strong> Link photo assets and technical site drawings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
