import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Job, 
  Task, 
  FinancialRecord, 
  VaultFile, 
  JobNote, 
  ProjectHealth, 
  JobStatus 
} from '../types';
import { 
  ArrowLeft, 
  CheckCircle, 
  AlertOctagon, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  Coins,
  MessageSquare,
  Upload,
  User,
  Wrench,
  ChevronRight,
  TrendingUp,
  Activity,
  Plus,
  Sliders,
  Check,
  AlertCircle,
  FileText,
  UserCheck,
  FileImage,
  CreditCard,
  Target,
  ShieldCheck,
  ChevronDown,
  Save
} from 'lucide-react';

interface CommandCentreProps {
  job: Job;
  outstandingTasksCount: number;
  onGoBack: () => void;
  onUpdateJob: (updatedFields: Partial<Job>) => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
  tasks: Task[];
  onToggleTask: (id: string) => void;
  financials: FinancialRecord[];
  onAddTransaction: (newTx: Omit<FinancialRecord, 'id' | 'date'>) => void;
  onAddFile: (newFile: Omit<VaultFile, 'id' | 'uploadedAt'>) => void;
  onAddNote: (content: string, author: string) => void;
  isSleekTheme?: boolean;
}

export default function CommandCentre({
  job,
  outstandingTasksCount,
  onGoBack,
  onUpdateJob,
  activeSection,
  onSelectSection,
  tasks,
  onToggleTask,
  financials,
  onAddTransaction,
  onAddFile,
  onAddNote,
  isSleekTheme = true
}: CommandCentreProps) {
  
  // Local states for editing nextAction
  const [nextAction, setNextAction] = useState<string>(job.nextAction || '');
  
  // Modal states for Quick Actions
  const [activeModal, setActiveModal] = useState<'client' | 'note' | 'image' | 'payment' | null>(null);
  
  // Client Passport edit form states
  const [isEditingClient, setIsEditingClient] = useState<boolean>(false);
  const [editClientFields, setEditClientFields] = useState({
    clientName: '',
    phone: '',
    email: '',
    address: '',
    area: '',
    comments: '',
    installationDate: ''
  });

  // Notes Form State
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteAuthor, setNewNoteAuthor] = useState('Admin');

  // Transactions Form State
  const [txType, setTxType] = useState<'expense' | 'payment'>('payment');
  const [txAmount, setTxAmount] = useState('');
  const [txDescription, setTxDescription] = useState('');
  const [txCategory, setTxCategory] = useState('');

  // Image/File Vault upload states
  const [imgName, setImgName] = useState('');
  const [imgType, setImgType] = useState<'photo' | 'render' | 'document'>('photo');
  const [imgUrl, setImgUrl] = useState('');
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number | null>(null);

  const PRESET_MOCK_IMAGES = [
    { name: 'Tall Cabinet Detail.jpg', url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop', type: 'photo' as const },
    { name: 'Island Quartz Waterfall Cantilever.jpg', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop', type: 'render' as const },
    { name: 'Integrated Under-lighting Spec.jpg', url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&auto=format&fit=crop', type: 'photo' as const },
    { name: 'Bespoke Oak Cutlery Drawer.jpg', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop', type: 'photo' as const },
  ];

  // Keep nextAction in sync with external changes
  useEffect(() => {
    setNextAction(job.nextAction || '');
  }, [job.nextAction]);

  const handleNextActionSave = () => {
    onUpdateJob({ nextAction });
  };

  const startEditingClient = () => {
    setEditClientFields({
      clientName: job.clientName || '',
      phone: job.phone || '',
      email: job.email || '',
      address: job.address || '',
      area: job.area || '',
      comments: job.comments || '',
      installationDate: job.installationDate || ''
    });
    setIsEditingClient(true);
  };

  const handleSaveClientDetails = () => {
    onUpdateJob(editClientFields);
    setIsEditingClient(false);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    onAddNote(newNoteContent.trim(), newNoteAuthor);
    setNewNoteContent('');
    setActiveModal(null);
  };

  const handleTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmt = parseFloat(txAmount);
    if (isNaN(parsedAmt) || parsedAmt <= 0 || !txDescription.trim()) return;

    onAddTransaction({
      jobId: job.id,
      type: txType,
      amount: parsedAmt,
      description: txDescription.trim(),
      category: txCategory.trim() || (txType === 'expense' ? 'Material Cost' : 'Client Payment')
    });

    setTxAmount('');
    setTxDescription('');
    setTxCategory('');
    setActiveModal(null);
  };

  const handlePresetSelect = (idx: number) => {
    setSelectedPresetIndex(idx);
    setImgName(PRESET_MOCK_IMAGES[idx].name);
    setImgType(PRESET_MOCK_IMAGES[idx].type);
    setImgUrl(PRESET_MOCK_IMAGES[idx].url);
  };

  const handleImageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgName.trim()) return;

    onAddFile({
      jobId: job.id,
      name: imgName.trim(),
      type: imgType,
      url: imgUrl.trim() || (imgType === 'document' ? '#' : 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop')
    });

    setImgName('');
    setImgUrl('');
    setSelectedPresetIndex(null);
    setActiveModal(null);
  };

  // Financial Mathematics
  const quoteValue = job.quoteValue || 0;
  const jobTxs = financials ? financials.filter((f) => f.jobId === job.id) : [];
  const paymentTotal = jobTxs
    .filter((f) => f.type === 'payment')
    .reduce((sum, f) => sum + f.amount, 0) + (job.depositReceived || 0);
  const outstandingBalance = Math.max(0, quoteValue - paymentTotal);

  // Active checklist / Immediate tasks for the current stage
  const openTasks = tasks ? tasks.filter(t => t.jobId === job.id && !t.complete) : [];

  // Stages definition for Project Timeline
  const STAGES = [
    { status: '1 First Contact', title: 'First Contact', desc: 'Initial brief registered.' },
    { status: '2 Qualifying Lead', title: 'Qualifying Lead', desc: 'Pre-qualification completed.' },
    { status: '3 Site Visit Scheduled', title: 'Site Visit Scheduled', desc: 'Consultation appointment confirmed.' },
    { status: '4 Site Visit Done', title: 'Site Visit Done', desc: 'Space consultation completed.' },
    { status: '5 Design Phase', title: 'Design Phase', desc: '3D modeling & floor planning.' },
    { status: '6 Quote Sent', title: 'Quote Sent', desc: 'Pricing quote transmitted to client.' },
    { status: '7 Awaiting Deposit', title: 'Awaiting Deposit', desc: 'Client reviewing quote and terms.' },
    { status: '8 Deposit Paid', title: 'Deposit Paid', desc: 'Commitment deposit received.' },
    { status: '9 Production', title: 'Production Queue', desc: 'Procurement and cabinet building.' },
    { status: '10 Installation Scheduled', title: 'Installation Scheduled', desc: 'Fitment schedule coordinated.' },
    { status: '11 Installation In Progress', title: 'Installation In Progress', desc: 'On-site kitchen fitment in progress.' },
    { status: '12 Complete', title: 'Complete & Settled', desc: 'Final sign-off, snag-free handover.' },
  ];

  const currentStageIndex = STAGES.findIndex(s => s.status === job.status);
  const progressPercent = Math.round(((currentStageIndex + 1) / 12) * 100);

  // Status Style Badges helpers
  const getStageColorClass = (status: string) => {
    const norm = status ? status.toLowerCase() : '';
    if (norm.includes('12 ') || norm.includes('complete')) {
      return 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10';
    } else if (norm.includes('9 ') || norm.includes('production')) {
      return 'text-violet-500 border-violet-500/20 bg-violet-500/10';
    } else if (norm.includes('10 ') || norm.includes('11 ') || norm.includes('installation')) {
      return 'text-cyan-500 border-cyan-500/20 bg-cyan-500/10';
    } else if (norm.includes('7 ') || norm.includes('8 ') || norm.includes('deposit')) {
      return 'text-amber-500 border-amber-500/20 bg-amber-500/10';
    } else {
      return 'text-blue-500 border-blue-500/20 bg-blue-500/10';
    }
  };

  return (
    <div id={`command-centre-${job.id}`} className="space-y-6 font-sans">
      
      {/* ========================================================
         1. TOP BAR: BACK TO MASTER & ID ACTION TAG
         ======================================================== */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-dashed border-slate-800/10 pb-4">
        <button
          id="cmd-back-home-btn"
          onClick={onGoBack}
          className={`flex items-center gap-1.5 text-xs font-bold transition-all p-2 px-4 rounded-xl border cursor-pointer select-none ${
            isSleekTheme 
              ? 'bg-slate-900 border-slate-800 hover:border-slate-750 text-slate-300 hover:text-white' 
              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-650 hover:text-slate-900 shadow-xs'
          }`}
        >
          <ArrowLeft className="h-4 w-4 text-[#ea580c]" /> Back to Passports
        </button>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono font-bold px-3 py-1.5 rounded-full border ${
            isSleekTheme ? 'bg-slate-950 border-slate-850 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
          }`}>
            PASSPORT: {job.id}
          </span>
        </div>
      </div>

      {/* ========================================================
         2. PROJECT SUMMARY (WHERE AM I IN THIS PROJECT?)
         ======================================================== */}
      <div className={`p-6 sm:p-8 rounded-2xl border shadow-sm relative overflow-hidden ${
        isSleekTheme ? 'bg-[#111625] border-slate-850' : 'bg-white border-slate-200'
      }`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Main info panel */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block mb-1">
                Active Client Name
              </span>
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight leading-none ${isSleekTheme ? 'text-white' : 'text-slate-900'}`}>
                {job.clientName}
              </h2>
              {job.comments && (
                <div className="mt-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block mb-1">
                    Project Description
                  </span>
                  <p className={`text-xs leading-relaxed max-w-2xl ${isSleekTheme ? 'text-slate-350' : 'text-slate-650'}`}>
                    {job.comments}
                  </p>
                </div>
              )}
            </div>

            {/* Stage and Schedule side-by-side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-dashed border-slate-800/10">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
                  Current Workflow Stage
                </span>
                <span className={`text-sm font-extrabold block leading-tight ${isSleekTheme ? 'text-[#f1f5f9]' : 'text-slate-900'}`}>
                  {job.status.split(' ').slice(1).join(' ')}
                </span>
                <span className="text-[10.5px] text-slate-450 block">
                  Active since: {job.statusSince ? new Date(job.statusSince).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Today'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
                  Schedule Status
                </span>
                <span className={`text-sm font-extrabold block leading-tight ${isSleekTheme ? 'text-[#f1f5f9]' : 'text-slate-900'}`}>
                  {job.installationDate 
                    ? new Date(job.installationDate).toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' }) 
                    : 'Awaiting Schedule'}
                </span>
                <span className="text-[10.5px] text-slate-450 block">
                  Kitchen On-site fitment handover
                </span>
              </div>
            </div>

            {/* Health with controller */}
            <div className="pt-4 border-t border-dashed border-slate-800/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Project Health
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                  job.health === 'On Track' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  job.health === 'Needs Attention' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 
                  'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}>
                  ● {job.health}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-2 max-w-sm">
                {(['On Track', 'Needs Attention', 'At Risk'] as ProjectHealth[]).map((h) => (
                  <button
                    key={h}
                    onClick={() => onUpdateJob({ health: h })}
                    className={`text-[10px] font-bold py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                      job.health === h
                        ? h === 'On Track' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-450' :
                          h === 'Needs Attention' ? 'bg-amber-500/20 border-amber-500/40 text-amber-450' :
                          'bg-rose-500/20 border-rose-500/40 text-rose-450'
                        : isSleekTheme 
                          ? 'bg-slate-900/60 border-slate-850 text-slate-400 hover:text-slate-200 hover:border-slate-750' 
                          : 'bg-slate-50 border-slate-200 text-slate-650 hover:bg-slate-100 hover:border-slate-350'
                    }`}
                    title={`Set status health to ${h}`}
                  >
                    {h === 'On Track' ? 'On Track' : h === 'Needs Attention' ? 'Attention' : 'At Risk'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Gauge panel */}
          <div className={`lg:col-span-4 flex flex-col items-center justify-center p-5 rounded-xl border text-center h-full min-h-[180px] ${
            isSleekTheme ? 'bg-slate-950/40 border-slate-850/60' : 'bg-slate-50 border-slate-100'
          }`}>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-4 block">
              Project Completion Percentage
            </span>
            
            {/* Circular SVG Gauge */}
            <div className="relative h-28 w-28 shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  className={isSleekTheme ? "stroke-slate-800/80" : "stroke-slate-200"}
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  className="stroke-[#ea580c]"
                  strokeWidth="7"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 48}
                  strokeDashoffset={2 * Math.PI * 48 * (1 - (currentStageIndex + 1) / 12)}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-black tracking-tighter ${isSleekTheme ? 'text-white' : 'text-slate-950'}`}>
                  {progressPercent}%
                </span>
                <span className="text-[8px] text-slate-400 uppercase tracking-widest font-mono font-bold mt-0.5">
                  DONE
                </span>
              </div>
            </div>

            <div className="mt-4 text-[11px] text-slate-450 font-medium">
              Stage <span className="font-extrabold text-[#ea580c]">{currentStageIndex + 1}</span> of 12 gateways passed
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
         3. NEXT ACTION PORTAL (OP REGULATOR - MOST IMPORTANT SECTION)
         ======================================================== */}
      <div className={`p-5 sm:p-6 rounded-2xl border relative overflow-hidden ${
        isSleekTheme ? 'bg-[#0f1426] border-slate-850' : 'bg-white border-slate-200/90 shadow-sm'
      }`}>
        <div className="absolute top-0 right-0 h-40 w-40 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-2 pb-3.5 border-b border-dashed border-slate-800/10 mb-4">
          <div className="p-2 rounded-xl bg-orange-500/10 text-[#ea580c]">
            <Target className="h-5 w-5" />
          </div>
          <div>
            <h3 className={`text-sm sm:text-md font-extrabold ${isSleekTheme ? 'text-white' : 'text-slate-900'}`}>Next Action operational Directive</h3>
            <p className="text-[10px] text-slate-450 font-mono uppercase tracking-wider">The central nervous system of day-to-day operations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* IMMEDIATE DIRECTIVE OVERRIDE INPUT */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-455 uppercase tracking-widest block font-mono pl-0.5">
                Immediate Action Priority Target
              </label>
              <div className="relative">
                <input
                  id="command-next-action-input"
                  type="text"
                  value={nextAction}
                  onChange={(e) => setNextAction(e.target.value)}
                  className={`w-full text-xs font-sans border rounded-xl pl-3.5 pr-16 py-3.5 outline-none font-bold transition-all ${
                    isSleekTheme
                      ? 'bg-slate-950 border-slate-800 text-white focus:border-[#ea580c]'
                      : 'bg-slate-50 border-slate-250 text-slate-900 focus:bg-white focus:border-[#ea580c] shadow-inner'
                  }`}
                  placeholder="e.g. Measure island spacing on site..."
                />
                <button
                  id="save-next-action-btn"
                  onClick={handleNextActionSave}
                  className="absolute right-2 top-2 bg-[#ea580c] hover:bg-[#ea580c]/90 text-white text-[10px] font-black uppercase px-3.5 py-2 rounded-lg transition-colors cursor-pointer select-none"
                >
                  Set
                </button>
              </div>
            </div>

            {/* Blockers / Priorities Notice alert */}
            <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
              job.health === 'On Track' 
                ? isSleekTheme ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                : isSleekTheme ? 'bg-amber-950/10 border-amber-500/20 text-amber-400 animate-pulse' : 'bg-amber-50 border-amber-100 text-amber-800 animate-pulse'
            }`}>
              <span className="font-extrabold flex items-center gap-1 mb-1 font-mono text-[10px] tracking-wider uppercase">
                {job.health === 'On Track' ? '✓ GATEWAY COMPLIANT' : '⚠️ LIVE PROGRESS BLOCKER'}
              </span>
              {job.health === 'On Track' 
                ? 'Project health is stable. Proceed with scheduled tasks below to hit target fitment deadline.' 
                : 'Project flagged with progress blockers. Set an Immediate Action Priority directive above and notify the on-site installer team.'}
            </div>
          </div>

          {/* ACTIVE CHECKLIST STEPS & OUTSTANDING CHECKS */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-450 uppercase tracking-widest font-mono pl-0.5">
                Outstanding Phase Checkpoints ({openTasks.length})
              </span>
              <span className="text-[9px] text-[#ea580c] font-black uppercase tracking-wider font-mono bg-[#ea580c]/10 px-2 py-0.5 rounded-md">
                TODAY'S PRIORITIES
              </span>
            </div>

            {openTasks.length === 0 ? (
              <div className={`p-6 rounded-xl border border-dashed text-center flex flex-col items-center justify-center ${
                isSleekTheme ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-slate-50/50'
              }`}>
                <CheckCircle className="h-7 w-7 text-emerald-500 mb-1.5" />
                <h4 className="text-xs font-bold uppercase tracking-wide">All Gate Checkpoints Synced</h4>
                <p className="text-[11px] text-slate-450 mt-1 max-w-sm">No active blocking checklists remaining in this phase. The project is compliant and ready for status promotion.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[175px] overflow-y-auto pr-1">
                {openTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    id={`active-task-chk-${task.id}`}
                    onClick={() => onToggleTask(task.id)}
                    className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 select-none transition-all ${
                      isSleekTheme
                        ? 'bg-slate-950/60 border-slate-850 hover:border-slate-750 hover:bg-slate-950'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center transition-all ${
                        isSleekTheme ? 'border-slate-750 bg-slate-950/40 text-[#ea580c]' : 'border-slate-300 bg-white text-[#ea580c]'
                      }`}>
                        <div className="h-2 w-2 bg-[#ea580c] rounded-xs opacity-0 group-hover:opacity-40 transition-all" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold leading-tight truncate ${isSleekTheme ? 'text-slate-100' : 'text-slate-800'}`}>
                        {task.taskName}
                      </p>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest font-mono">
                        {task.stage} Phase
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* ========================================================
         4. QUICK ACTIONS GRID (TOUCH-FRIENDLY & COHESIVE MODULES)
         ======================================================== */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold text-slate-440 uppercase tracking-widest block font-mono pl-1">
          Strategic Action Centre
        </span>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <button
            onClick={() => setActiveModal('note')}
            className={`flex flex-col items-center justify-center text-center p-4 rounded-xl border text-xs font-bold gap-2 cursor-pointer transition-all active:scale-97 select-none h-24 ${
              isSleekTheme
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white hover:border-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-xs shadow-black/5'
            }`}
          >
            <MessageSquare className="h-5 w-5 text-[#ea580c]" />
            <span>Add Work Log Note</span>
          </button>

          <button
            onClick={() => {
              setImgType('photo');
              setActiveModal('image');
            }}
            className={`flex flex-col items-center justify-center text-center p-4 rounded-xl border text-xs font-bold gap-2 cursor-pointer transition-all active:scale-97 select-none h-24 ${
              isSleekTheme
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white hover:border-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-xs shadow-black/5'
            }`}
          >
            <FileImage className="h-5 w-5 text-[#ea580c]" />
            <span>Upload Image</span>
          </button>

          <button
            onClick={() => {
              setImgType('document');
              setActiveModal('image');
            }}
            className={`flex flex-col items-center justify-center text-center p-4 rounded-xl border text-xs font-bold gap-2 cursor-pointer transition-all active:scale-97 select-none h-24 ${
              isSleekTheme
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white hover:border-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-xs shadow-black/5'
            }`}
          >
            <FileText className="h-5 w-5 text-[#ea580c]" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={() => setActiveModal('payment')}
            className={`flex flex-col items-center justify-center text-center p-4 rounded-xl border text-xs font-bold gap-2 cursor-pointer transition-all active:scale-97 select-none h-24 ${
              isSleekTheme
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-[#ea580c]/10 hover:text-white hover:border-[#ea580c]/30'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-xs shadow-black/5'
            }`}
          >
            <CreditCard className="h-5 w-5 text-[#ea580c]" />
            <span>Record Payment</span>
          </button>

          <button
            onClick={() => {
              onSelectSection('specs');
              setTimeout(() => {
                const element = document.getElementById('operational-card-specs');
                if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 150);
            }}
            className={`flex flex-col items-center justify-center text-center p-4 rounded-xl border text-xs font-bold gap-2 cursor-pointer transition-all active:scale-97 select-none h-24 ${
              isSleekTheme
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850 hover:text-white hover:border-slate-700'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:shadow-xs shadow-black/5'
            }`}
          >
            <Wrench className="h-5 w-5 text-[#ea580c]" />
            <span>View Specifications</span>
          </button>

          <button
            onClick={() => {
              setActiveModal('client');
              setIsEditingClient(false);
            }}
            className="flex flex-col items-center justify-center text-center p-4 rounded-xl text-xs font-black gap-2 cursor-pointer transition-all active:scale-97 select-none h-24 bg-[#ea580c] hover:bg-[#ea580c]/90 text-white shadow-md shadow-orange-950/15"
          >
            <UserCheck className="h-5 w-5" />
            <span>View Client Passport</span>
          </button>

        </div>
      </div>

      {/* ========================================================
         5. NAVIGATION TABS CONTROLLER (EXPANDS/SCROLLS TO MODULES)
         ======================================================== */}
      <div className="hidden md:block space-y-3">
        <div className="border-b border-dashed border-slate-800/10 pt-2" />
        
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest font-mono pl-1">
            Operational Workspace Module Jump
          </span>
          <span className="text-[10px] text-[#ea580c] font-black uppercase tracking-wider font-mono bg-[#ea580c]/10 px-2 py-0.5 rounded-md">
            {activeSection ? activeSection.toUpperCase() : 'COLLAPSED'}
          </span>
        </div>
        
        {/* Navigation capsule tabs row - jumps / expands cards below */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { key: 'workflow', label: '📊 Workflow' },
            { key: 'specs', label: '📐 Specs' },
            { key: 'financials', label: '💸 Expenses' },
            { key: 'notes', label: '📝 Logs' },
            { key: 'vault', label: '🎨 Document Vault' },
            { key: 'timeline', label: '⏳ Timeline' },
          ].map((tab) => (
            <button
              key={tab.key}
              id={`cmd-nav-tab-${tab.key}`}
              onClick={() => {
                onSelectSection(activeSection === tab.key ? '' : tab.key);
                setTimeout(() => {
                  const element = document.getElementById(`operational-card-${tab.key}`);
                  if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 150);
              }}
              className={`text-xs px-4 py-2.5 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer select-none border ${
                activeSection === tab.key
                  ? isSleekTheme
                    ? 'bg-white text-slate-950 border-white shadow-lg shadow-black/10'
                    : 'bg-[#ea580c] text-white border-[#ea580c] shadow-md shadow-orange-950/10'
                  : isSleekTheme
                    ? 'bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white border-slate-850'
                    : 'bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-850 border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========================================================
         6. MODAL OVERLAY PORTALS
         ======================================================== */}
      <AnimatePresence>
        {activeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className={`w-full max-w-xl rounded-2xl p-6 sm:p-8 border shadow-2xl relative overflow-hidden flex flex-col justify-between max-h-[90vh] overflow-y-auto ${
                isSleekTheme ? 'bg-[#0f1426] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-850'
              }`}
            >
              
              {/* MODAL CASE 1: DEDICATED VIEW CLIENT PASSPORT */}
              {activeModal === 'client' && (
                <div className="space-y-6">
                  
                  {/* Modal Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-800/15">
                    <h3 className="text-xs font-bold tracking-wider uppercase font-mono text-slate-400 flex items-center gap-1.5">
                      <User className="h-4 w-4 text-[#ea580c]" /> Client Passport Portal
                    </h3>
                    <button
                      onClick={() => {
                        setIsEditingClient(false);
                        setActiveModal(null);
                      }}
                      className="text-xs font-bold text-rose-500 hover:text-rose-400 uppercase font-mono active:scale-95 p-1 cursor-pointer"
                    >
                      ✕ Close
                    </button>
                  </div>

                  {isEditingClient ? (
                    /* Edit Form Inner */
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Client Name</label>
                          <input
                            type="text"
                            value={editClientFields.clientName}
                            onChange={(e) => setEditClientFields({ ...editClientFields, clientName: e.target.value })}
                            className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold ${
                              isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                            }`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Contact Phone Number</label>
                          <input
                            type="text"
                            value={editClientFields.phone}
                            onChange={(e) => setEditClientFields({ ...editClientFields, phone: e.target.value })}
                            className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold ${
                              isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                            }`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Client Email</label>
                          <input
                            type="email"
                            value={editClientFields.email}
                            onChange={(e) => setEditClientFields({ ...editClientFields, email: e.target.value })}
                            className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold ${
                              isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                            }`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Geographic Area</label>
                          <input
                            type="text"
                            value={editClientFields.area}
                            onChange={(e) => setEditClientFields({ ...editClientFields, area: e.target.value })}
                            className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold ${
                              isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                            }`}
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Physical Address</label>
                          <input
                            type="text"
                            value={editClientFields.address}
                            onChange={(e) => setEditClientFields({ ...editClientFields, address: e.target.value })}
                            className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold ${
                              isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                            }`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Installation / Fitment Date</label>
                          <input
                            type="date"
                            value={editClientFields.installationDate}
                            onChange={(e) => setEditClientFields({ ...editClientFields, installationDate: e.target.value })}
                            className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold cursor-pointer ${
                              isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                            }`}
                          />
                        </div>
                        <div className="sm:col-span-2 space-y-1">
                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Project Backstory & Summary Notes</label>
                          <textarea
                            value={editClientFields.comments}
                            onChange={(e) => setEditClientFields({ ...editClientFields, comments: e.target.value })}
                            rows={3}
                            className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold resize-none ${
                              isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                            }`}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end pt-4 border-t border-slate-850">
                        <button
                          type="button"
                          onClick={() => setIsEditingClient(false)}
                          className={`text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer transition-all ${
                            isSleekTheme ? 'bg-slate-900 hover:bg-slate-850 text-slate-300' : 'bg-slate-100 hover:bg-slate-150 text-slate-650'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveClientDetails}
                          className="bg-[#ea580c] hover:bg-[#ea580c]/90 text-white text-xs font-black uppercase px-5 py-2.5 rounded-xl transition-all shadow-md shadow-orange-950/20 flex items-center gap-1 cursor-pointer"
                        >
                          <Save className="h-4 w-4" /> Save Details
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Client Read-Only Detail View */
                    <div className="space-y-5">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h2 className={`text-lg sm:text-xl font-black ${isSleekTheme ? 'text-white' : 'text-slate-900'}`}>{job.clientName}</h2>
                          <p className="text-[10px] text-slate-450 font-medium font-mono uppercase tracking-wider mt-0.5">Physical Account Passport Registry</p>
                        </div>
                        <button
                          onClick={startEditingClient}
                          className={`text-[10px] font-bold uppercase px-3 py-1.5 rounded-xl border flex items-center gap-1 cursor-pointer transition-all ${
                            isSleekTheme 
                              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-750' 
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white shadow-xs'
                          }`}
                        >
                          ✏️ Edit Record
                        </button>
                      </div>

                      <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4.5 rounded-xl border ${
                        isSleekTheme ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Contact Number</span>
                          <a href={`tel:${job.phone}`} className={`text-xs font-bold flex items-center gap-1.5 ${isSleekTheme ? 'text-slate-200 hover:text-[#ea580c]' : 'text-slate-850 hover:text-[#ea580c]'}`}>
                            <Phone className="h-4 w-4 text-[#ea580c] shrink-0" /> {job.phone || 'Not Registered'}
                          </a>
                        </div>
                        
                        <div className="space-y-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Client Email</span>
                          <a href={`mailto:${job.email}`} className={`text-xs font-bold flex items-center gap-1.5 truncate ${isSleekTheme ? 'text-slate-200 hover:text-[#ea580c]' : 'text-slate-850 hover:text-[#ea580c]'}`}>
                            <Mail className="h-4 w-4 text-[#ea580c] shrink-0" /> {job.email || 'Not Registered'}
                          </a>
                        </div>
                        
                        <div className="sm:col-span-2 space-y-1 border-t border-slate-800/10 pt-3">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Physical Fitment Address</span>
                          <div className={`text-xs font-semibold flex items-start gap-1.5 leading-relaxed ${isSleekTheme ? 'text-slate-300' : 'text-slate-850'}`}>
                            <MapPin className="h-4.5 w-4.5 text-[#ea580c] shrink-0 mt-0.5" />
                            <span>{job.address || 'No Address Registered'}</span>
                          </div>
                        </div>
                      </div>

                      {job.installationDate && (
                        <div className="bg-[#ea580c]/10 border border-orange-500/20 p-4 rounded-xl flex items-center gap-2.5">
                          <ShieldCheck className="h-5 w-5 text-[#ea580c] shrink-0" />
                          <div className="text-xs font-semibold text-[#ea580c]">
                            <span>Fitment Handover is scheduled for {new Date(job.installationDate).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* MODAL CASE 2: ADD NOTE FORM */}
              {activeModal === 'note' && (
                <form onSubmit={handleNoteSubmit} className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-800/15">
                    <h3 className="text-xs font-bold tracking-wider uppercase font-mono text-slate-400 flex items-center gap-1.5">
                      <MessageSquare className="h-4 w-4 text-[#ea580c]" /> Add Workspace Site Log
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="text-xs font-bold text-rose-500 hover:text-rose-400 uppercase font-mono active:scale-95 p-1"
                    >
                      ✕ Cancel
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Log Writer (Author)</label>
                        <select
                          value={newNoteAuthor}
                          onChange={(e) => setNewNoteAuthor(e.target.value)}
                          className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold ${
                            isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                          }`}
                        >
                          <option value="Admin">Admin</option>
                          <option value="David">David</option>
                          <option value="Installer Mark">Installer Mark</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Work Log / Discussion Details</label>
                      <textarea
                        value={newNoteContent}
                        onChange={(e) => setNewNoteContent(e.target.value)}
                        placeholder="Type note details here..."
                        rows={4}
                        required
                        className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold resize-none ${
                          isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t border-slate-850">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
                        isSleekTheme ? 'bg-slate-900 hover:bg-slate-850 text-slate-300' : 'bg-slate-100 hover:bg-slate-150 text-slate-650'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#ea580c] hover:bg-[#ea580c]/90 text-white text-xs font-black uppercase px-5 py-2.5 rounded-xl shadow-md shadow-orange-950/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageSquare className="h-4 w-4" /> Save Site Log Note
                    </button>
                  </div>
                </form>
              )}

              {/* MODAL CASE 3: UPLOAD FILE IMAGE / TECHNICAL DOCUMENT */}
              {activeModal === 'image' && (
                <form onSubmit={handleImageSubmit} className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-800/15">
                    <h3 className="text-xs font-bold tracking-wider uppercase font-mono text-slate-400 flex items-center gap-1.5">
                      <Upload className="h-4 w-4 text-[#ea580c]" /> Attach File Blueprint
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="text-xs font-bold text-rose-500 hover:text-rose-400 uppercase font-mono active:scale-95 p-1"
                    >
                      ✕ Cancel
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Presets Grid */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">
                        Select Demo Template Preset
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {PRESET_MOCK_IMAGES.map((preset, idx) => (
                          <div
                            key={idx}
                            onClick={() => handlePresetSelect(idx)}
                            className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all select-none ${
                              selectedPresetIndex === idx
                                ? 'bg-orange-500/10 border-[#ea580c] text-orange-405'
                                : isSleekTheme 
                                  ? 'bg-slate-950/40 border-slate-805 hover:border-slate-750 text-slate-350' 
                                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-650'
                            }`}
                          >
                            <span className="text-[10px] font-bold block truncate leading-none mb-1">{preset.name}</span>
                            <span className="text-[9px] font-mono opacity-60 block uppercase">{preset.type}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Attachment Name</label>
                        <input
                          type="text"
                          value={imgName}
                          onChange={(e) => setImgName(e.target.value)}
                          placeholder="e.g. Approved Floor Plan.pdf"
                          required
                          className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold ${
                            isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                          }`}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Attachment Category Type</label>
                        <select
                          value={imgType}
                          onChange={(e) => setImgType(e.target.value as any)}
                          className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold ${
                            isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                          }`}
                        >
                          <option value="photo">Real Site Photo</option>
                          <option value="render">3D Design Render</option>
                          <option value="document">PDF / Technical Doc</option>
                        </select>
                      </div>
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Secure Image / File URL</label>
                        <input
                          type="text"
                          value={imgUrl}
                          onChange={(e) => setImgUrl(e.target.value)}
                          placeholder="https://images.unsplash.com/..."
                          className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold ${
                            isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t border-slate-850">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
                        isSleekTheme ? 'bg-slate-900 hover:bg-slate-850 text-slate-300' : 'bg-slate-100 hover:bg-slate-150 text-slate-650'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#ea580c] hover:bg-[#ea580c]/90 text-white text-xs font-black uppercase px-5 py-2.5 rounded-xl shadow-md shadow-orange-950/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="h-4 w-4" /> Pin File in Vault
                    </button>
                  </div>
                </form>
              )}

              {/* MODAL CASE 4: RECORD PAYMENT */}
              {activeModal === 'payment' && (
                <form onSubmit={handleTxSubmit} className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-800/15">
                    <h3 className="text-xs font-bold tracking-wider uppercase font-mono text-slate-400 flex items-center gap-1.5">
                      <Coins className="h-4 w-4 text-[#ea580c]" /> Record Ledger Cashflow Transaction
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="text-xs font-bold text-rose-500 hover:text-rose-400 uppercase font-mono active:scale-95 p-1"
                    >
                      ✕ Cancel
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Ledger Direction</label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setTxType('payment')}
                            className={`py-2 text-xs font-bold rounded-lg border cursor-pointer text-center transition-all ${
                              txType === 'payment'
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 font-extrabold'
                                : isSleekTheme ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            📥 Payment (In)
                          </button>
                          <button
                            type="button"
                            onClick={() => setTxType('expense')}
                            className={`py-2 text-xs font-bold rounded-lg border cursor-pointer text-center transition-all ${
                              txType === 'expense'
                                ? 'bg-rose-500/10 border-rose-500 text-rose-400 font-extrabold'
                                : isSleekTheme ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                            }`}
                          >
                            📤 Expense (Out)
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Transaction Value (Rands)</label>
                        <input
                          type="number"
                          value={txAmount}
                          onChange={(e) => setTxAmount(e.target.value)}
                          placeholder="e.g. 15000"
                          required
                          min="1"
                          className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold ${
                            isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Particulars Description</label>
                        <input
                          type="text"
                          value={txDescription}
                          onChange={(e) => setTxDescription(e.target.value)}
                          placeholder="e.g. Kitchen fitment progress deposit"
                          required
                          className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold ${
                            isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                          }`}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest pl-1 font-mono">Asset Category</label>
                        <input
                          type="text"
                          value={txCategory}
                          onChange={(e) => setTxCategory(e.target.value)}
                          placeholder="e.g. Deposit, Snags"
                          className={`w-full text-xs font-sans border rounded-xl px-3.5 py-2.5 outline-none font-semibold ${
                            isSleekTheme ? 'bg-slate-950 border-slate-800 text-white focus:border-orange-500' : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-orange-500'
                          }`}
                        />
                      </div>

                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-4 border-t border-slate-850">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all ${
                        isSleekTheme ? 'bg-slate-900 hover:bg-slate-850 text-slate-300' : 'bg-slate-100 hover:bg-slate-150 text-slate-650'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-[#ea580c] hover:bg-[#ea580c]/90 text-white text-xs font-black uppercase px-5 py-2.5 rounded-xl shadow-md shadow-orange-950/20 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Save Ledger Entry
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
