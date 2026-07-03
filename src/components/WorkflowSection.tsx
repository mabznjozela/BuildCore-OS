import React, { useState, useRef, useEffect } from 'react';
import { Task, Job, JobStatus } from '../types';
import { CheckSquare, Square, ChevronRight, Plus, HelpCircle, Sparkles, CheckCircle, ArrowRight, Mic, MicOff } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WorkflowSectionProps {
  job: Job;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (taskName: string, stage: string) => void;
  onUpdateStatus: (newStatus: JobStatus) => void;
  isSleekTheme?: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  vX: number;
  vY: number;
}

const STATUS_STAGES: { status: JobStatus; stage: string }[] = [
  { status: '1 First Contact', stage: 'Lead Care' },
  { status: '2 Qualifying Lead', stage: 'Lead Care' },
  { status: '3 Site Visit Scheduled', stage: 'Lead Care' },
  { status: '4 Site Visit Done', stage: 'Lead Care' },
  { status: '5 Design Phase', stage: 'Design' },
  { status: '6 Quote Sent', stage: 'Design' },
  { status: '7 Awaiting Deposit', stage: 'Financials' },
  { status: '8 Deposit Paid', stage: 'Financials' },
  { status: '9 Production', stage: 'Production' },
  { status: '10 Installation Scheduled', stage: 'Installation' },
  { status: '11 Installation In Progress', stage: 'Installation' },
  { status: '12 Complete', stage: 'Handover' }
];

export default function WorkflowSection({ job, tasks, onToggleTask, onAddTask, onUpdateStatus, isSleekTheme = true }: WorkflowSectionProps) {
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [showAddTaskInput, setShowAddTaskInput] = useState<boolean>(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isListeningTask, setIsListeningTask] = useState<boolean>(false);
  
  const taskRecognitionRef = useRef<any>(null);

  // Filter tasks belonging exactly to this Job
  const jobTasks = tasks.filter((t) => t.jobId === job.id);

  // Derive current operational stage from STATUS_STAGES for grouping highlight
  const currentStageMapping = STATUS_STAGES.find((s) => s.status === job.status);
  const activeStage = currentStageMapping ? currentStageMapping.stage : 'Production';

  // Filter tasks relating to the current active Stage
  const activeStageTasks = jobTasks.filter(
    (t) => t.stage.toLowerCase() === activeStage.toLowerCase()
  );

  const completedCount = activeStageTasks.filter((t) => t.complete).length;
  const totalCount = activeStageTasks.length;
  const percentComplete = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Suggested promotions
  const allProductionTasksDone =
    job.status === '9 Production' &&
    activeStageTasks.length > 0 &&
    activeStageTasks.every((t) => t.complete);

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    onAddTask(newTaskName.trim(), activeStage);
    setNewTaskName('');
    setShowAddTaskInput(false);
  };

  const toggleListeningTask = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice dictation is not fully supported by your current browser environment. Try using Google Chrome.");
      return;
    }

    if (isListeningTask) {
      if (taskRecognitionRef.current) {
        taskRecognitionRef.current.stop();
      }
      setIsListeningTask(false);
    } else {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';

        rec.onstart = () => {
          setIsListeningTask(true);
        };

        let initialText = newTaskName;

        rec.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          const combined = (initialText + ' ' + finalTranscript + interimTranscript).trim().replace(/\s+/g, ' ');
          setNewTaskName(combined);
        };

        rec.onerror = (err: any) => {
          console.error("Task voice-to-text error:", err);
          setIsListeningTask(false);
        };

        rec.onend = () => {
          setIsListeningTask(false);
        };

        taskRecognitionRef.current = rec;
        rec.start();
      } catch (err) {
        console.error("Failed to start voice dictation", err);
        setIsListeningTask(false);
      }
    }
  };

  const handleTaskClick = (e: React.MouseEvent, task: Task) => {
    // Standard trigger
    onToggleTask(task.id);

    // If task was incomplete, we triggered complete = true, so celebrate!
    if (!task.complete) {
      const rect = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const colors = ['#10B981', '#6366F1', '#F59E0B', '#3B82F6', '#EC4899', '#14B8A6', '#A855F7'];
      const newParticles: Particle[] = Array.from({ length: 16 }).map((_, idx) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 3.8;
        return {
          id: Date.now() + idx,
          x: clickX,
          y: clickY,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.random() * 5,
          vX: Math.cos(angle) * speed,
          vY: Math.sin(angle) * speed - 1.2
        };
      });

      setParticles((prev) => [...prev, ...newParticles]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)));
      }, 900);
    }
  };

  useEffect(() => {
    return () => {
      if (taskRecognitionRef.current) {
        taskRecognitionRef.current.stop();
      }
    };
  }, []);

  return (
    <div id={`workflow-section-${job.id}`} className={`border rounded-2xl p-6 shadow-sm overflow-hidden relative ${
      isSleekTheme ? 'bg-[#0f1426] border-slate-850 text-white' : 'bg-white border-gray-150 text-slate-850'
    }`}>
      
      {/* Absolute particle renderer */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute pointer-events-none rounded-full z-50"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            x: p.vX * 35,
            y: p.vY * 35,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.85, ease: "easeOut" }}
        />
      ))}

      {/* Step Progress Visualiser (12 Steps Slider / Flow) */}
      <div className="mb-6 select-none">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-sans font-extrabold uppercase tracking-widest text-gray-400">
            Project Phase Track (12 Gateways)
          </h3>
          <span className="text-xs bg-red-50 text-red-700 font-bold px-3 py-1 rounded-full animate-pulse">
            Active: {job.status}
          </span>
        </div>

        {/* Responsive grid of 12 stages with progress colors - NO HORIZONTAL SCROLL */}
        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 pb-4 pt-1 px-1">
          {STATUS_STAGES.map((step, idx) => {
            const isCurrent = step.status === job.status;
            const currentIndex = STATUS_STAGES.findIndex((s) => s.status === job.status);
            const isCompleted = idx < currentIndex;

            return (
              <button
                key={step.status}
                id={`status-step-btn-${idx}`}
                onClick={() => onUpdateStatus(step.status)}
                className={`text-[11px] font-sans font-bold px-3 py-2 rounded-xl transition-all border flex items-center gap-1.5 cursor-pointer leading-tight ${
                  isCurrent
                    ? isSleekTheme
                      ? 'bg-orange-500/25 border-[#ea580c] text-orange-400 ring-2 ring-[#ea580c]/15'
                      : 'bg-slate-800 border-red-600 text-white ring-4 ring-slate-500/15'
                    : isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : isSleekTheme
                    ? 'bg-slate-950/40 border-slate-850 text-slate-450 hover:border-slate-750 hover:text-white'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <span className="text-[10px] opacity-75">{idx + 1}</span>
                <span className="truncate">
                  {step.status.substring(2)}
                </span>
                {isCompleted && <span className="text-emerald-500 ml-auto shrink-0">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Section of Workflow */}
      <div className={`rounded-2xl p-4 md:p-6 mb-5 border ${
        isSleekTheme ? 'bg-slate-950/40 border-slate-850' : 'bg-slate-50 border-slate-100'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800/10 pb-4 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Current Phase workflow</span>
            <h4 className={`text-lg font-sans font-extrabold ${isSleekTheme ? 'text-white' : 'text-slate-800'}`}>
              {activeStage} Milestones
            </h4>
          </div>

          <div className="text-right">
            <span className={`text-xs font-bold block sm:inline mr-2 ${isSleekTheme ? 'text-orange-400' : 'text-red-750'}`}>
              Progress: {completedCount} of {totalCount} Complete
            </span>
            <span className="text-xs text-slate-450 font-medium">({percentComplete.toFixed(0)}%)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={`w-full rounded-full h-2 mb-6 relative overflow-hidden ${
          isSleekTheme ? 'bg-slate-900' : 'bg-slate-250'
        }`}>
          <motion.div
            className={`h-2 rounded-full ${isSleekTheme ? 'bg-gradient-to-r from-orange-600 to-amber-500' : 'bg-slate-800'}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentComplete}%` }}
            transition={{ type: 'spring', damping: 15, stiffness: 100 }}
          />
        </div>

        {/* Dynamic List of Active Stage Tasks */}
        <div className="space-y-2.5 relative">
          {activeStageTasks.length === 0 ? (
            <div className="text-center py-4 text-slate-400 text-xs">
              No tasks declared yet for the "{activeStage}" stage. Click 'Add Action Milestone' to start tracking.
            </div>
          ) : (
            activeStageTasks.map((task) => (
              <motion.div
                key={task.id}
                id={`task-row-${task.id}`}
                onClick={(e) => handleTaskClick(e, task)}
                whileHover={{ scale: 1.008 }}
                whileTap={{ scale: 0.992 }}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none relative overflow-hidden ${
                  task.complete
                    ? isSleekTheme
                      ? 'bg-emerald-950/20 border-emerald-900/20 text-slate-450 line-through decoration-slate-650'
                      : 'bg-emerald-50/40 border-emerald-100/55 text-slate-500 line-through decoration-slate-350'
                    : isSleekTheme
                    ? 'bg-slate-900 hover:bg-slate-850/80 border-slate-800 text-slate-200 font-semibold'
                    : 'bg-white hover:bg-slate-100/50 border-slate-200 text-slate-800 font-semibold'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {task.complete ? (
                    <motion.div initial={{ scale: 0.5, rotate: -45 }} animate={{ scale: 1, rotate: 0 }}>
                      <CheckSquare className="h-4.5 w-4.5 text-emerald-500" />
                    </motion.div>
                  ) : (
                    <Square className={`h-4.5 w-4.5 ${isSleekTheme ? 'text-slate-600' : 'text-slate-400'} hover:text-emerald-500 transition-colors`} />
                  )}
                </div>
                <div className="text-xs font-sans text-left leading-relaxed">
                  {task.taskName}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Celebrate completion of all stage milestones */}
        <AnimatePresence>
          {percentComplete === 100 && totalCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 15, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -15, height: 0 }}
              className="mt-5 p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-red-500/10 border border-emerald-500/25 text-center flex flex-col items-center justify-center overflow-hidden"
            >
              <Sparkles className="h-6 w-6 text-emerald-500 animate-bounce mb-1" />
              <span className="text-xs font-sans font-extrabold text-emerald-800 uppercase tracking-wider">
                🎉 Stage Gateway Completed!
              </span>
              <p className="text-[11px] text-emerald-700/80 mt-1 max-w-sm">
                All milestones for <span className="font-extrabold">{activeStage}</span> have been checked and resolved. Ready for hand-off!
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Action suggestion notifications (Automations Phase 1.5) */}
        {allProductionTasksDone && (
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-amber-500 shrink-0 animate-pulse mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed text-left">
              <span className="font-extrabold flex items-center gap-1.5">
                💡 Suggested Automation Trigger
              </span>
              All Production stage tasks for <span className="font-bold">{job.clientName}</span> are completed. Would you like to advance status to scheduled installation?
              <button
                id="auto-advance-to-install-btn"
                onClick={() => onUpdateStatus('10 Installation Scheduled')}
                className="mt-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-1.2 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-[11px]"
              >
                Advance to 10 Installation Scheduled
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Add custom action input */}
        <div className="mt-4 pt-3 border-t border-slate-200/50">
          <AnimatePresence initial={false}>
            {showAddTaskInput ? (
              <motion.form
                key="add-task-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onSubmit={handleAddTaskSubmit} 
                className="flex gap-2 items-center"
              >
                <div className="relative flex-1 flex">
                  <input
                    id={`task-new-input-${job.id}`}
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    placeholder="Type or speak custom task description..."
                    required
                    className="flex-1 text-xs border border-gray-350 rounded-lg pl-2.5 pr-10 py-2 bg-white text-gray-950 focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={toggleListeningTask}
                    className={`absolute right-2 top-2 p-1 rounded-md transition-all flex items-center justify-center cursor-pointer ${
                      isListeningTask
                        ? 'bg-rose-500 text-white animate-pulse'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                    }`}
                    title={isListeningTask ? "Stop dictating" : "Voice dictation (speech to text)"}
                  >
                    {isListeningTask ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <button
                  id={`task-submit-add-btn-${job.id}`}
                  type="submit"
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-3 py-2 rounded-lg cursor-pointer transition-colors active:scale-95"
                >
                  Insert
                </button>
                <button
                  id={`task-cancel-add-btn-${job.id}`}
                  type="button"
                  onClick={() => {
                    setShowAddTaskInput(false);
                    if (isListeningTask && taskRecognitionRef.current) {
                      taskRecognitionRef.current.stop();
                    }
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs px-3 py-2 rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </motion.form>
            ) : (
              <motion.button
                key="add-task-trigger"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                id={`task-trigger-form-btn-${job.id}`}
                onClick={() => setShowAddTaskInput(true)}
                className="flex items-center gap-1 text-[11px] font-sans font-bold text-red-700 hover:text-red-800 transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Action Milestone Row
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
