import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  Settings, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  ChevronUp, 
  ChevronDown, 
  TrendingUp, 
  CheckCircle2, 
  ShieldAlert, 
  MapPin, 
  FileText,
  AlertCircle,
  Wrench,
  DollarSign,
  Activity,
  UserCheck,
  RefreshCw,
  FileSpreadsheet
} from 'lucide-react';
import { Job, Task } from '../types';

interface DashboardTabProps {
  userRole: 'admin' | 'floor';
  isSleekTheme: boolean;
  activeJobs: Job[];
  jobs: Job[];
  tasks: Task[];
  totalTasksOpen: number;
  totalContractPipeline: number;
  alertProjectsCount: number;
  drilldownType: 'jobs' | 'tasks' | null;
  setDrilldownType: (type: 'jobs' | 'tasks' | null) => void;
  handleToggleTask: (id: string) => void;
  getTasksOutstandingCount: (id: string) => number;
  setSelectedJobId: (id: string | null) => void;
  setActiveNavTab: (tab: 'dashboard' | 'jobs' | 'calendar' | 'settings') => void;
  setActiveTab: (tab: string) => void;
  filteredJobs: Job[];
  getStatusBadgeStyles: (status: string, isSleekTheme: boolean) => string;
  isFloorProjectsExpanded: boolean;
  setIsFloorProjectsExpanded: (val: boolean) => void;
  isFloorTasksExpanded: boolean;
  setIsFloorTasksExpanded: (val: boolean) => void;
}

export default function DashboardTab({
  userRole,
  isSleekTheme,
  activeJobs,
  jobs,
  tasks,
  totalTasksOpen,
  totalContractPipeline,
  alertProjectsCount,
  drilldownType,
  setDrilldownType,
  handleToggleTask,
  getTasksOutstandingCount,
  setSelectedJobId,
  setActiveNavTab,
  setActiveTab,
  filteredJobs,
  getStatusBadgeStyles,
  isFloorProjectsExpanded,
  setIsFloorProjectsExpanded,
  isFloorTasksExpanded,
  setIsFloorTasksExpanded
}: DashboardTabProps) {

  // Dynamic status/metric computations based on active database arrays
  const attentionJobs = jobs.filter(
    (j) => j.health === 'Needs Attention' || j.health === 'At Risk'
  );

  const upcomingInstallations = jobs.filter(
    (j) => j.status.includes('10') || j.status.includes('11') || (j.installationDate && j.status !== '12 Complete')
  );

  const completedJobsCount = jobs.filter((j) => j.status === '12 Complete').length;

  // Financial statistics
  const totalDeposits = jobs.reduce((sum, j) => sum + (j.depositReceived || 0), 0);
  const activeJobsCount = activeJobs.length;
  
  const totalActiveValuation = activeJobs.reduce((sum, j) => sum + j.quoteValue, 0);
  const activeDeposits = activeJobs.reduce((sum, j) => sum + j.depositReceived || 0, 0);
  const outstandingReceivable = totalActiveValuation - activeDeposits;

  // Dynamic system events reconstructed from actual job and checklist timeline changes
  const systemEvents = React.useMemo(() => {
    const list: Array<{ id: string; type: 'creation' | 'promotion' | 'health' | 'checkpoint'; time: string; text: string; sub: string }> = [];
    
    // Sort jobs by created date if available, or fallback
    const sortedByCreated = [...jobs]
      .filter(j => j.createdAt)
      .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
    
    sortedByCreated.slice(0, 2).forEach(job => {
      list.push({
        id: `evt-c-${job.id}`,
        type: 'creation',
        time: job.createdAt ? new Date(job.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recent',
        text: `Passport Initiated`,
        sub: `${job.clientName} (${job.area}) created with design workflow blueprint.`
      });
    });

    // Sort jobs by status change
    const sortedByPromo = [...jobs]
      .filter(j => j.statusSince)
      .sort((a, b) => new Date(b.statusSince || '').getTime() - new Date(a.statusSince || '').getTime());

    sortedByPromo.slice(0, 2).forEach(job => {
      list.push({
        id: `evt-p-${job.id}`,
        type: 'promotion',
        time: job.statusSince ? new Date(job.statusSince).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Recent',
        text: `Gateway Transferred`,
        sub: `${job.clientName} advanced to stage: ${job.status.split(' ').slice(1).join(' ')}`
      });
    });

    // Attention alerts
    attentionJobs.slice(0, 2).forEach(job => {
      list.push({
        id: `evt-h-${job.id}`,
        type: 'health',
        time: 'Active Alert',
        text: `SLA Warning Flag`,
        sub: `Project for ${job.clientName} has been flagged as ${job.health}.`
      });
    });

    // Return unique, sorted event pipeline
    return list.slice(0, 4);
  }, [jobs, attentionJobs]);

  return (
    <div className="space-y-8">
      {userRole === 'floor' ? (
        /* ==========================================
           FLOOR WORKSPACE - PRODUCTION PROTOCOLS
           ========================================== */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10 font-sans">
          
          {/* BENTO CARD 1: ACTIVE CLIENT PASSPORTS */}
          <div className={`p-8 rounded-[24px] border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            isSleekTheme 
              ? 'bg-[#0f1426] border-slate-850 text-white shadow-xl shadow-black/20 hover:border-slate-800' 
              : 'bg-white border-slate-200 text-slate-800 shadow-md shadow-slate-100 hover:shadow-lg hover:border-slate-300'
          }`}>
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-dashed border-slate-800/20">
                <button
                  id="toggle-floor-projects-btn"
                  onClick={() => setIsFloorProjectsExpanded(!isFloorProjectsExpanded)}
                  className={`flex items-center gap-2 text-left cursor-pointer p-2 px-3.5 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-0 border ${
                    isSleekTheme 
                      ? 'border-orange-500/20 bg-orange-500/5 text-orange-400 hover:bg-orange-500/10' 
                      : 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100'
                  }`}
                  title={isFloorProjectsExpanded ? "Collapse Active Passports" : "Expand Active Passports"}
                >
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                    Active Client Passports
                    {isFloorProjectsExpanded ? (
                      <ChevronUp className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    )}
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${
                    isSleekTheme 
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' 
                      : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  }`}>
                    {activeJobs.length} Live Channels
                  </span>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isFloorProjectsExpanded && (
                  <motion.div
                    key="floor-projects-list"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1"
                  >
                    {activeJobs.length === 0 ? (
                      <div className={`text-center py-12 rounded-2xl border border-dashed p-6 ${
                        isSleekTheme ? 'border-slate-800 bg-slate-950/20 text-slate-400' : 'border-slate-200 bg-slate-50/50 text-slate-500'
                      }`}>
                        <Briefcase className="h-8 w-8 mx-auto text-slate-500 mb-2" />
                        <p className="text-xs font-bold font-mono">No active client passports mapped</p>
                      </div>
                    ) : (
                      activeJobs.map((job) => {
                        const outstanding = getTasksOutstandingCount(job.id);
                        return (
                          <div
                            key={job.id}
                            id={`floor-project-card-${job.id}`}
                            onClick={() => {
                              setSelectedJobId(job.id);
                              setActiveNavTab('jobs');
                              setActiveTab('workflow');
                            }}
                            className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md active:scale-[0.985] flex flex-col justify-between ${
                              isSleekTheme 
                                ? 'bg-[#151a2d]/65 border-slate-800 hover:border-slate-700 text-slate-100 hover:bg-[#191f37]' 
                                : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-white hover:shadow-slate-100'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="min-w-0 space-y-1">
                                <h3 className={`text-sm font-bold truncate tracking-tight ${isSleekTheme ? 'text-white' : 'text-slate-950'}`}>
                                  {job.clientName}
                                </h3>
                                <p className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                                  <span>{job.area}</span>
                                </p>
                              </div>
                              <span className={`text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full border shrink-0 ${getStatusBadgeStyles(job.status, isSleekTheme)}`}>
                                {job.status.split(' ').slice(1).join(' ')}
                              </span>
                            </div>
                            
                            <div className={`flex items-center justify-between border-t pt-3 mt-4 text-xs ${
                              isSleekTheme ? 'border-slate-800/40' : 'border-slate-200/50'
                            }`}>
                              <span className="text-slate-450 font-medium">Compliance Steps:</span>
                              <span className={`font-mono font-bold text-[11px] px-2.5 py-0.5 rounded-lg ${
                                outstanding === 0 
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' 
                                  : isSleekTheme 
                                    ? 'bg-slate-900 text-slate-300 border border-slate-800/50' 
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}>
                                {outstanding === 0 ? 'All Milestones Satisfied ✓' : `${outstanding} Tasks Open`}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* BENTO CARD 2: OPERATIONS ACTION CHECKLIST */}
          <div className={`p-8 rounded-[24px] border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
            isSleekTheme 
              ? 'bg-[#0f1426] border-slate-850 text-white shadow-xl shadow-black/20 hover:border-slate-800' 
              : 'bg-white border-slate-200 text-slate-800 shadow-md shadow-slate-100 hover:shadow-lg hover:border-slate-300'
          }`}>
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-dashed border-slate-800/20">
                <button
                  id="toggle-floor-tasks-btn"
                  onClick={() => setIsFloorTasksExpanded(!isFloorTasksExpanded)}
                  className={`flex items-center gap-2 text-left cursor-pointer p-2 px-3.5 rounded-xl transition-all duration-200 active:scale-95 focus:outline-none focus:ring-0 border ${
                    isSleekTheme 
                      ? 'border-orange-500/20 bg-orange-500/5 text-orange-400 hover:bg-orange-500/10' 
                      : 'border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100'
                  }`}
                  title={isFloorTasksExpanded ? "Collapse Active Checklist" : "Expand Active Checklist"}
                >
                  <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 whitespace-nowrap">
                    Active Handshake Checklist
                    {isFloorTasksExpanded ? (
                      <ChevronUp className="h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0" />
                    )}
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-3 py-1 rounded-full border ${
                    isSleekTheme 
                      ? 'border-orange-500/30 bg-orange-500/10 text-orange-400' 
                      : 'border-orange-200 bg-orange-50 text-orange-700'
                  }`}>
                    {tasks.filter(t => !t.complete && activeJobs.some(j => j.id === t.jobId)).length} Action Milestones
                  </span>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {isFloorTasksExpanded && (
                  <motion.div
                    key="floor-tasks-list"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-5 max-h-[500px] overflow-y-auto pr-1"
                  >
                    {(() => {
                      const floorOpenTasks = tasks.filter(t => !t.complete && activeJobs.some(j => j.id === t.jobId));
                      if (floorOpenTasks.length === 0) {
                        return (
                          <div className={`text-center py-20 border border-dashed rounded-2xl flex flex-col items-center justify-center p-6 ${
                            isSleekTheme ? 'border-slate-800 bg-slate-950/20 text-slate-400' : 'border-slate-200 bg-slate-50/50 text-slate-500'
                          }`}>
                            <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 text-xl">
                              ✓
                            </div>
                            <p className="text-xs font-bold font-mono uppercase tracking-wider">Zero Compliance Backlog</p>
                            <p className="text-[11px] text-slate-450 mt-1 max-w-xs leading-relaxed">
                              All tracking phases for live passports have been completely verified.
                            </p>
                          </div>
                        );
                      }

                      // Group open tasks by active jobs
                      const groupedOpenTasks: { [jobId: string]: { jobName: string; tasks: typeof floorOpenTasks } } = {};
                      floorOpenTasks.forEach(t => {
                        if (!groupedOpenTasks[t.jobId]) {
                          const job = activeJobs.find(j => j.id === t.jobId);
                          groupedOpenTasks[t.jobId] = {
                            jobName: job ? job.clientName : 'General Client',
                            tasks: []
                          };
                        }
                        groupedOpenTasks[t.jobId].tasks.push(t);
                      });

                      return Object.entries(groupedOpenTasks).map(([jobId, group]) => (
                        <div key={jobId} className={`space-y-2.5 pb-4 last:border-0 last:pb-0 border-b ${
                          isSleekTheme ? 'border-slate-850' : 'border-slate-200/55'
                        }`}>
                          <div className={`text-[10px] font-bold uppercase tracking-wider ${isSleekTheme ? 'text-slate-400' : 'text-slate-600'} font-sans pl-1 flex items-center gap-2`}>
                            <span className="h-2 w-2 rounded-full bg-[#ea580c] animate-pulse shrink-0" />
                            <span>{group.jobName}</span>
                          </div>
                          <div className="space-y-2">
                            {group.tasks.map((task) => (
                              <div
                                key={task.id}
                                id={`floor-task-card-${task.id}`}
                                onClick={() => handleToggleTask(task.id)}
                                className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex items-start gap-3.5 ${
                                  isSleekTheme
                                    ? 'bg-[#151a2d]/50 border-slate-800 hover:border-slate-700 hover:bg-[#1c223c]'
                                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-xs'
                                  }`}
                              >
                                <div className="pt-0.5">
                                  <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-all ${
                                    isSleekTheme 
                                      ? 'border-slate-700 bg-slate-950 text-[#ea580c]' 
                                      : 'border-slate-300 bg-white text-[#ea580c]'
                                  }`}>
                                    <div className="h-2.5 w-2.5 bg-[#ea580c] rounded-xs opacity-0 hover:opacity-40 transition-opacity" />
                                  </div>
                                </div>
                                <div className="min-w-0 flex-1 space-y-1">
                                  <h4 className={`text-xs font-semibold leading-snug ${isSleekTheme ? 'text-slate-200' : 'text-slate-850'}`}>
                                    {task.taskName}
                                  </h4>
                                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest font-mono block">
                                    {task.stage} PHASE
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ) : (
        /* ==========================================
           ADMIN EXECUTIVE SHELL - CHROME COMMAND CENTER
           ========================================== */
        <div className="space-y-8 font-sans pb-12">
          
          {/* HEADER SUMMARY SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-dashed border-slate-800/10 pb-6">
            <div>
              <h2 className={`text-2xl font-black tracking-tight ${isSleekTheme ? 'text-white' : 'text-slate-950'}`}>
                Operational Command Centre
              </h2>
              <p className="text-sm text-slate-500 font-medium">
                Real-time strategic oversight, milestone verification and financial compliance.
              </p>
            </div>
            
            {/* Quick stats chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-bold font-mono px-3 py-1 rounded-full border shrink-0 ${
                isSleekTheme ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                Active: <strong className="text-orange-500">{activeJobsCount}</strong>
              </span>
              <span className={`text-[11px] font-bold font-mono px-3 py-1 rounded-full border shrink-0 ${
                isSleekTheme ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                Completed: <strong className="text-emerald-500">{completedJobsCount}</strong>
              </span>
              <span className={`text-[11px] font-bold font-mono px-3 py-1 rounded-full border shrink-0 ${
                isSleekTheme ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                Incidents: <strong className={alertProjectsCount > 0 ? 'text-rose-500' : 'text-emerald-500'}>{alertProjectsCount}</strong>
              </span>
            </div>
          </div>

          {/* DRILLDOWNS CONSOLE */}
          <AnimatePresence>
            {drilldownType && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`rounded-[20px] p-6 border overflow-hidden transition-all duration-300 ${
                  isSleekTheme 
                    ? 'bg-[#0a0d18] border-slate-800 shadow-inner' 
                    : 'bg-slate-50 border-slate-200/80 shadow-inner'
                }`}
              >
                <div className="flex justify-between items-center mb-4 pb-2 border-b border-dashed border-slate-800/10">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 font-mono flex items-center gap-1.5">
                    <span>🔍 DRILLDOWN INSPECTOR</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-[#ea580c]">{drilldownType === 'jobs' ? 'CLIENT CHANNELS' : 'TRACKING PROTOCOLS'}</span>
                  </h4>
                  <button
                    onClick={() => setDrilldownType(null)}
                    className="text-[11px] font-black text-rose-500 hover:text-rose-400 uppercase font-mono active:scale-95 transition-all p-1"
                  >
                    ✕ Dismiss
                  </button>
                </div>

                {drilldownType === 'jobs' ? (
                  activeJobs.length === 0 ? (
                    <p className="text-xs font-mono text-slate-500 py-4">No active client channels to map</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                      {activeJobs.map(job => (
                        <div 
                          key={job.id} 
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setActiveNavTab('jobs');
                            setActiveTab('workflow');
                          }}
                          className={`p-4 rounded-xl border cursor-pointer hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200 ${
                            isSleekTheme 
                              ? 'bg-slate-950/50 border-slate-800 hover:border-slate-500 hover:bg-slate-950' 
                              : 'bg-white border-slate-200 hover:border-slate-350 shadow-xs'
                          }`}
                        >
                          <h5 className="text-xs font-bold truncate tracking-tight">{job.clientName}</h5>
                          <span className="text-[10px] text-slate-500 font-medium block mt-1">📍 {job.area} • R{job.quoteValue.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  )
                ) : (
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {(() => {
                      const openList = tasks.filter(t => !t.complete);
                      if (openList.length === 0) {
                        return <p className="text-xs font-mono text-slate-500 py-4">No active actions in checklist queue</p>;
                      }
                      return openList.slice(0, 10).map(task => {
                        const parent = jobs.find(j => j.id === task.jobId);
                        return (
                          <div 
                            key={task.id} 
                            onClick={() => {
                              if (parent) {
                                setSelectedJobId(parent.id);
                                setActiveNavTab('jobs');
                                setActiveTab('workflow');
                              }
                            }}
                            className={`flex justify-between items-center text-xs p-3 border rounded-xl transition duration-150 cursor-pointer ${
                              isSleekTheme 
                                ? 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-950 hover:border-slate-600' 
                                : 'bg-white border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <span className="font-semibold text-slate-300 truncate max-w-[280px] sm:max-w-md">{task.taskName}</span>
                            <span className="text-[10px] text-slate-500 font-mono font-bold uppercase tracking-wider shrink-0 ml-4 bg-slate-900/40 px-2 py-0.5 rounded">
                              {parent?.clientName || 'General'}
                            </span>
                          </div>
                        );
                      });
                    })()}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* OPERATIONAL DOCK ROW: HIGH VALUE DRILLDOWNS & ACTION PROTOCOLS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Metric Card 1: Live Pipeline Drilldown */}
            <button
              id="inspect-crafting-pipeline-metric"
              onClick={() => setDrilldownType(drilldownType === 'jobs' ? null : 'jobs')}
              className={`text-left w-full cursor-pointer rounded-2xl p-6 border transition-all duration-250 hover:-translate-y-0.5 ${
                drilldownType === 'jobs'
                  ? isSleekTheme
                    ? 'ring-2 ring-orange-500 bg-[#161d36] border-transparent shadow-lg shadow-orange-950/20'
                    : 'ring-2 ring-orange-500 bg-orange-50/45 border-transparent shadow-md'
                  : isSleekTheme 
                    ? 'bg-[#0f1426] border-slate-850 hover:border-slate-700 shadow-slate-950/30 text-white' 
                    : 'bg-white border-slate-200 hover:border-slate-350 shadow-slate-100 text-slate-800'
              }`}
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between font-mono">
                <span>CRAFTING WORKFLOWS</span>
                <span className="text-[9px] text-[#ea580c] font-bold tracking-widest uppercase bg-[#ea580c]/10 px-2.5 py-0.5 rounded-full border border-orange-500/15">
                  DRILLDOWN →
                </span>
              </div>
              <div className="text-4xl font-black mt-3 flex items-baseline gap-2">
                <span>{activeJobs.length}</span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-mono">LIVE PASSPORTS</span>
              </div>
              <div className="mt-4 pt-3 border-t border-dashed border-slate-800/10 flex items-center justify-between text-[11px] text-slate-450 font-medium">
                <span>Completed Delivery Cycles:</span>
                <span className="font-mono font-bold text-[#ea580c]">{completedJobsCount} Projects</span>
              </div>
            </button>

            {/* Metric Card 2: Open Action Checklist Steps */}
            <button
              id="inspect-pending-tasks-metric"
              onClick={() => setDrilldownType(drilldownType === 'tasks' ? null : 'tasks')}
              className={`text-left w-full cursor-pointer rounded-2xl p-6 border transition-all duration-250 hover:-translate-y-0.5 ${
                drilldownType === 'tasks'
                  ? isSleekTheme
                    ? 'ring-2 ring-orange-500 bg-[#161d36] border-transparent shadow-lg shadow-orange-950/20'
                    : 'ring-2 ring-orange-500 bg-orange-50/45 border-transparent shadow-md'
                  : isSleekTheme 
                    ? 'bg-[#0f1426] border-slate-850 hover:border-slate-700 shadow-slate-950/30 text-white' 
                    : 'bg-white border-slate-200 hover:border-slate-350 shadow-slate-100 text-slate-800'
              }`}
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between font-mono">
                <span>MILESTONE CHECKLISTS</span>
                <span className="text-[9px] text-[#ea580c] font-bold tracking-widest uppercase bg-[#ea580c]/10 px-2.5 py-0.5 rounded-full border border-orange-500/15">
                  TASKS LIST →
                </span>
              </div>
              <div className="text-4xl font-black mt-3 flex items-baseline gap-2">
                <span>{totalTasksOpen}</span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider font-mono">ACTION STEPS</span>
              </div>
              <div className="mt-4 pt-3 border-t border-dashed border-slate-800/10 flex items-center justify-between text-[11px] text-slate-450 font-medium">
                <span>Pending Verification Gateways:</span>
                <span className="font-mono font-bold text-slate-400">View Active</span>
              </div>
            </button>

            {/* Metric Card 3: Secure Asset Valuation Portfolio */}
            <div
              id="total-pipeline-valuation-card"
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                isSleekTheme 
                  ? 'bg-[#0f1426] border-slate-850 shadow-slate-950/30 text-white' 
                  : 'bg-white border-slate-200 shadow-slate-100 text-slate-800'
              }`}
            >
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between font-mono">
                <span>PORTFOLIO VALUATION</span>
                <span className="text-[9px] text-emerald-400 font-bold tracking-widest uppercase bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/15">
                  LOCK SECURE
                </span>
              </div>
              <div className="text-4xl font-black mt-3 text-emerald-500 tracking-tight">
                R{totalContractPipeline.toLocaleString()}
              </div>
              <div className="mt-4 pt-3 border-t border-dashed border-slate-800/10 flex items-center justify-between text-[11px] text-slate-450 font-medium">
                <span>Outstanding Contracts:</span>
                <span className="font-mono font-bold text-slate-400">{activeJobsCount} Active Passport Channels</span>
              </div>
            </div>
          </div>

          {/* MAIN TWO-COLUMN COMMAND CENTER PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT PORTION: OPERATIONAL CARDS GRID (8 COLS) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* SECTION A: JOBS REQUIRING ATTENTION */}
              <div className={`p-6 sm:p-8 rounded-[24px] border transition-all duration-300 ${
                isSleekTheme 
                  ? 'bg-[#0f1426] border-slate-850 text-white shadow-xl shadow-black/25' 
                  : 'bg-white border-slate-200 text-slate-800 shadow-md shadow-slate-100'
              }`}>
                <div className="flex items-center justify-between pb-4 border-b border-dashed border-slate-800/15 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500">
                      <AlertCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-md font-bold tracking-tight">Jobs Requiring Immediate Attention</h3>
                      <p className="text-[11px] text-slate-550 leading-none mt-1">Milestones breached, delays flagged, or special assistance needed.</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase ${
                    attentionJobs.length > 0 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {attentionJobs.length} Alerts Detected
                  </span>
                </div>

                {attentionJobs.length === 0 ? (
                  <div className={`p-6 rounded-2xl border border-dashed text-center ${
                    isSleekTheme ? 'border-slate-800 bg-slate-950/20' : 'border-slate-200 bg-slate-50/40'
                  }`}>
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm font-bold">All Passports Clean & On Track</p>
                    <p className="text-xs text-slate-450 mt-1">Zero critical alerts, material blockages or layout design issues detected in this cycle.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {attentionJobs.map((job) => (
                      <div
                        key={job.id}
                        id={`attention-job-card-${job.id}`}
                        onClick={() => {
                          setSelectedJobId(job.id);
                          setActiveNavTab('jobs');
                          setActiveTab('workflow');
                        }}
                        className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:-translate-y-0.5 transition-all duration-200 ${
                          isSleekTheme 
                            ? 'bg-rose-500/5 border-rose-500/15 hover:border-rose-500/40 hover:bg-rose-500/10' 
                            : 'bg-rose-50/40 border-rose-200 hover:border-rose-300 hover:bg-rose-50'
                        }`}
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-100 leading-none">{job.clientName}</h4>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                              job.health === 'At Risk' 
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {job.health}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-450 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-500 shrink-0" />
                            <span>{job.area} • Gateway: {job.status.split(' ').slice(1).join(' ')}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2.5 sm:pt-0 mt-2 sm:mt-0">
                          <span className="text-xs font-semibold text-rose-450">
                            {job.nextAction || 'Requires immediate site survey confirmation'}
                          </span>
                          <ArrowRight className="h-4 w-4 text-orange-400 shrink-0" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION B: ACTIVE CLIENTS INDEX */}
              <div className={`p-6 sm:p-8 rounded-[24px] border transition-all duration-300 ${
                isSleekTheme 
                  ? 'bg-[#0f1426] border-slate-850 text-white shadow-xl shadow-black/25' 
                  : 'bg-white border-slate-200 text-slate-800 shadow-md shadow-slate-100'
              }`}>
                <div className="flex items-center justify-between pb-4 border-b border-dashed border-slate-800/15 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-md font-bold tracking-tight">Active Client Portfolios</h3>
                      <p className="text-[11px] text-slate-550 leading-none mt-1">Operational records of active kitchen builds.</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase ${
                    isSleekTheme ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-105 border-slate-200 text-slate-600'
                  }`}>
                    {activeJobs.length} Active Passports
                  </span>
                </div>

                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
                  {activeJobs.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs font-mono">No active clients found.</div>
                  ) : (
                    activeJobs.map((job) => {
                      const outstanding = getTasksOutstandingCount(job.id);
                      const isAtRisk = job.health !== 'On Track';
                      return (
                        <div
                          key={job.id}
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setActiveNavTab('jobs');
                            setActiveTab('workflow');
                          }}
                          className={`p-4.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:-translate-y-0.5 hover:shadow-sm ${
                            isSleekTheme 
                              ? 'bg-slate-950/45 border-slate-850 hover:border-slate-600 hover:bg-slate-950' 
                              : 'bg-slate-50/70 border-slate-200 hover:border-slate-350 hover:bg-white'
                          }`}
                        >
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <h4 className={`text-sm font-bold truncate ${isSleekTheme ? 'text-slate-100' : 'text-slate-900'}`}>{job.clientName}</h4>
                              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                                isSleekTheme ? 'bg-slate-900 text-slate-400' : 'bg-slate-200/50 text-slate-700'
                              }`}>
                                #{job.id}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-450 text-xs">
                              <span className="flex items-center gap-1 font-medium">
                                <MapPin className="h-3 w-3 text-slate-500" />
                                {job.area}
                              </span>
                              <span>•</span>
                              <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeStyles(job.status, isSleekTheme)}`}>
                                {job.status.split(' ').slice(1).join(' ')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0">
                            <div className="text-right">
                              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block font-mono">FINANCIAL VALUE</span>
                              <span className={`text-sm font-bold ${isSleekTheme ? 'text-white' : 'text-slate-900'}`}>
                                R{job.quoteValue.toLocaleString()}
                              </span>
                            </div>
                            <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                              outstanding === 0 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                : isAtRisk 
                                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  : isSleekTheme 
                                    ? 'bg-slate-900 text-slate-350 border border-slate-800' 
                                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}>
                              {outstanding === 0 ? 'Verified ✓' : `${outstanding} Open Steps`}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* SECTION C: ACTIVE SYSTEM CHECKLIST */}
              <div className={`p-6 sm:p-8 rounded-[24px] border transition-all duration-300 ${
                isSleekTheme 
                  ? 'bg-[#0f1426] border-slate-850 text-white shadow-xl shadow-black/25' 
                  : 'bg-white border-slate-200 text-slate-800 shadow-md shadow-slate-100'
              }`}>
                <div className="flex items-center justify-between pb-4 border-b border-dashed border-slate-800/15 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-md font-bold tracking-tight">Active Gateway Action Milestones</h3>
                      <p className="text-[11px] text-slate-550 leading-none mt-1">Outstanding items to verify and checkoff instantly to promote status phases.</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase ${
                    isSleekTheme ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-105 border-slate-200 text-slate-600'
                  }`}>
                    {tasks.filter(t => !t.complete).length} Steps Open
                  </span>
                </div>

                <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
                  {(() => {
                    const activeOpenTasks = tasks.filter(t => !t.complete && activeJobs.some(j => j.id === t.jobId));
                    if (activeOpenTasks.length === 0) {
                      return (
                        <div className="text-center py-10 text-slate-500 text-xs font-mono border border-dashed border-slate-800/10 rounded-xl">
                          All project milestone checkoffs satisfy current requirements.
                        </div>
                      );
                    }

                    // Group by Job
                    const grouped: { [jobId: string]: { job: Job; items: Task[] } } = {};
                    activeOpenTasks.forEach(t => {
                      const job = activeJobs.find(j => j.id === t.jobId);
                      if (job) {
                        if (!grouped[t.jobId]) {
                          grouped[t.jobId] = { job, items: [] };
                        }
                        grouped[t.jobId].items.push(t);
                      }
                    });

                    return Object.entries(grouped).map(([jobId, group]) => (
                      <div key={jobId} className={`space-y-2 pb-4 last:pb-0 border-b last:border-b-0 ${
                        isSleekTheme ? 'border-slate-850' : 'border-slate-150'
                      }`}>
                        <div className="flex justify-between items-center px-1">
                          <span className={`text-xs font-bold ${isSleekTheme ? 'text-slate-300' : 'text-slate-750'}`}>
                            {group.job.clientName}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 uppercase">{group.job.area}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {group.items.slice(0, 4).map(task => (
                            <div
                              key={task.id}
                              id={`admin-dashboard-task-card-${task.id}`}
                              onClick={() => handleToggleTask(task.id)}
                              className={`p-3 rounded-lg border text-xs cursor-pointer select-none transition flex items-center gap-2.5 ${
                                isSleekTheme 
                                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:bg-slate-900' 
                                  : 'bg-slate-50 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                              }`}
                            >
                              <div className={`h-3.5 w-3.5 rounded border shrink-0 transition flex items-center justify-center ${
                                isSleekTheme ? 'border-slate-700 bg-slate-950' : 'border-slate-300 bg-white'
                              }`}>
                                <div className="h-1.5 w-1.5 bg-transparent" />
                              </div>
                              <div className="min-w-0">
                                <p className={`font-bold truncate ${isSleekTheme ? 'text-slate-200' : 'text-slate-800'}`}>{task.taskName}</p>
                                <span className="text-[8.5px] text-slate-500 font-bold uppercase tracking-wider font-mono block leading-none mt-0.5">{task.stage}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>

            </div>

            {/* RIGHT PORTION: INSIGHTS & TELEMETRY PANEL (4 COLS) */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* SECTION D: UPCOMING INSTALLATIONS & DEPLOYMENTS */}
              <div className={`p-6 rounded-[24px] border transition-all duration-300 ${
                isSleekTheme 
                  ? 'bg-[#0f1426] border-slate-850 text-white shadow-xl shadow-black/25' 
                  : 'bg-white border-slate-200 text-slate-800 shadow-md'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-800/15 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4.5 w-4.5 text-orange-400 shrink-0" />
                    <h3 className="text-sm font-bold tracking-tight">Deployments & Installations</h3>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                    isSleekTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-105 border-slate-200'
                  }`}>
                    {upcomingInstallations.length} Scheduled
                  </span>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {upcomingInstallations.length === 0 ? (
                    <div className={`p-6 border border-dashed rounded-xl text-center ${
                      isSleekTheme ? 'border-slate-800 text-slate-500' : 'border-slate-205 text-slate-500'
                    }`}>
                      <Wrench className="h-6 w-6 mx-auto text-slate-500 mb-1.5" />
                      <p className="text-xs font-mono font-bold">No deployments in current cycle</p>
                    </div>
                  ) : (
                    upcomingInstallations.map(job => (
                      <div
                        key={job.id}
                        onClick={() => {
                          setSelectedJobId(job.id);
                          setActiveNavTab('jobs');
                          setActiveTab('workflow');
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition flex flex-col justify-between gap-1.5 ${
                          isSleekTheme 
                            ? 'bg-slate-950/45 border-slate-850 hover:bg-slate-950 hover:border-slate-700' 
                            : 'bg-slate-50 hover:bg-white hover:border-slate-300'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold truncate leading-none">{job.clientName}</h4>
                          <span className={`text-[8.5px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            job.status.includes('11') ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {job.status.includes('11') ? 'In Progress' : 'Prep Active'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span className="flex items-center gap-1 font-semibold">
                            <MapPin className="h-3 w-3" />
                            {job.area}
                          </span>
                          <span className="font-mono font-bold text-slate-450">
                            {job.installationDate || 'TBD Cycle'}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SECTION E: DEEP FINANCIAL COMPLIANCE SNAPSHOT */}
              <div className={`p-6 rounded-[24px] border transition-all duration-300 ${
                isSleekTheme 
                  ? 'bg-[#0f1426] border-slate-850 text-white shadow-xl shadow-black/25' 
                  : 'bg-white border-slate-200 text-slate-800 shadow-md'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-800/15 mb-5">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                    <h3 className="text-sm font-bold tracking-tight">Financial Health Compliances</h3>
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Settle Ratio
                  </span>
                </div>

                <div className="space-y-4 font-sans">
                  {/* Metric Block 1 */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-450 font-medium">Secured (Deposits Paid):</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono">
                      R{totalDeposits.toLocaleString()}
                    </span>
                  </div>

                  {/* Metric Block 2 */}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-450 font-medium">Outstanding Accounts Receivable:</span>
                    <span className="text-sm font-bold text-orange-400 font-mono">
                      R{outstandingReceivable.toLocaleString()}
                    </span>
                  </div>

                  {/* Progress Line */}
                  <div className="space-y-1.5 pt-1.5">
                    <div className="flex justify-between text-[9px] font-mono text-slate-550">
                      <span>AVERAGE CONSOLIDATION SECURED</span>
                      <span>{totalActiveValuation > 0 ? ((activeDeposits / totalActiveValuation) * 100).toFixed(0) : 0}%</span>
                    </div>
                    <div className={`w-full h-2 rounded-full overflow-hidden border ${
                      isSleekTheme ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500" 
                        style={{ width: `${totalActiveValuation > 0 ? Math.min(100, (activeDeposits / totalActiveValuation) * 100) : 0}%` }}
                      />
                    </div>
                  </div>

                  <div className={`pt-3.5 border-t border-dashed mt-4 flex items-center justify-between text-[11px] text-slate-450 ${
                    isSleekTheme ? 'border-slate-800/50' : 'border-slate-200/50'
                  }`}>
                    <span>Average Project Contract Valuation:</span>
                    <span className={`font-mono font-bold ${isSleekTheme ? 'text-slate-300' : 'text-slate-800'}`}>
                      R{(jobs.length > 0 ? Math.round(jobs.reduce((sum, j) => sum + j.quoteValue, 0) / jobs.length) : 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION F: RECENT REAL-TIME ACTIVITY TIMELINE */}
              <div className={`p-6 rounded-[24px] border transition-all duration-300 ${
                isSleekTheme 
                  ? 'bg-[#0f1426] border-slate-850 text-white shadow-xl shadow-black/25' 
                  : 'bg-white border-slate-200 text-slate-800 shadow-md'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-800/15 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Activity className="h-4.5 w-4.5 text-indigo-400 shrink-0" />
                    <h3 className="text-sm font-bold tracking-tight">Recent Activity Feed</h3>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 font-sans">
                  {systemEvents.length === 0 ? (
                    <p className="text-xs text-slate-500 font-mono text-center py-4">No recent activity detected.</p>
                  ) : (
                    systemEvents.map(evt => (
                      <div key={evt.id} className="flex gap-3 items-start text-xs">
                        <div className="pt-1">
                          <span className={`h-2 w-2 rounded-full block shrink-0 ${
                            evt.type === 'creation' ? 'bg-emerald-400' :
                            evt.type === 'promotion' ? 'bg-indigo-400' :
                            evt.type === 'health' ? 'bg-rose-400' : 'bg-slate-400'
                          }`} />
                        </div>
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex justify-between items-center">
                            <span className={`font-bold ${isSleekTheme ? 'text-slate-200' : 'text-slate-800'}`}>{evt.text}</span>
                            <span className="text-[9px] text-slate-500 font-mono shrink-0">{evt.time}</span>
                          </div>
                          <p className="text-[10.5px] text-slate-450 leading-normal">{evt.sub}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* SECTION G: QUICK ACTIONS MISSION CONTROL PORTAL */}
              <div className={`p-6 rounded-[24px] border transition-all duration-300 ${
                isSleekTheme 
                  ? 'bg-[#0f1426] border-slate-850 text-white shadow-xl shadow-black/25' 
                  : 'bg-white border-slate-200 text-slate-800 shadow-md'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-dashed border-slate-800/15 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Settings className="h-4.5 w-4.5 text-[#ea580c] shrink-0" />
                    <h3 className="text-sm font-bold tracking-tight">System Quick Actions</h3>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center font-sans">
                  {/* Action 1 */}
                  <button
                    onClick={() => {
                      setActiveNavTab('jobs');
                      setSelectedJobId(null);
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold transition duration-200 cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-1.5 ${
                      isSleekTheme 
                        ? 'bg-slate-950/45 border-slate-800 hover:bg-slate-900 hover:border-slate-600 text-slate-200' 
                        : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-350 hover:shadow-xs text-slate-700'
                    }`}
                  >
                    <Briefcase className="h-4 w-4 text-orange-400" />
                    <span>View All Passports</span>
                  </button>

                  {/* Action 2 */}
                  <button
                    onClick={() => setActiveNavTab('calendar')}
                    className={`p-3 rounded-xl border text-xs font-bold transition duration-200 cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-1.5 ${
                      isSleekTheme 
                        ? 'bg-slate-950/45 border-slate-800 hover:bg-slate-900 hover:border-slate-600 text-slate-200' 
                        : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-350 hover:shadow-xs text-slate-700'
                    }`}
                  >
                    <Calendar className="h-4 w-4 text-indigo-400" />
                    <span>Go to Deployments</span>
                  </button>

                  {/* Action 3 */}
                  <button
                    onClick={() => {
                      setActiveNavTab('settings');
                    }}
                    className={`p-3 rounded-xl border text-xs font-bold transition duration-200 cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-1.5 ${
                      isSleekTheme 
                        ? 'bg-slate-950/45 border-slate-800 hover:bg-slate-900 hover:border-slate-600 text-slate-200' 
                        : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-350 hover:shadow-xs text-slate-700'
                    }`}
                  >
                    <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                    <span>Export Audit Excel</span>
                  </button>

                  {/* Action 4 */}
                  <button
                    onClick={() => setDrilldownType(drilldownType ? null : 'tasks')}
                    className={`p-3 rounded-xl border text-xs font-bold transition duration-200 cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-1.5 ${
                      isSleekTheme 
                        ? 'bg-slate-950/45 border-slate-800 hover:bg-slate-900 hover:border-slate-600 text-slate-200' 
                        : 'bg-slate-50 border-slate-200 hover:bg-white hover:border-slate-350 hover:shadow-xs text-slate-700'
                    }`}
                  >
                    <RefreshCw className="h-4 w-4 text-amber-400" />
                    <span>System Sync Drill</span>
                  </button>
                </div>
              </div>

            </div>
            
          </div>
          
        </div>
      )}
    </div>
  );
}
