import React, { useState } from 'react';
import { Task, Job, JobStatus } from '../types';
import { CheckSquare, Square, ChevronRight, Plus, HelpCircle, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

interface WorkflowSectionProps {
  job: Job;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (taskName: string, stage: string) => void;
  onUpdateStatus: (newStatus: JobStatus) => void;
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

export default function WorkflowSection({ job, tasks, onToggleTask, onAddTask, onUpdateStatus }: WorkflowSectionProps) {
  const [newTaskName, setNewTaskName] = useState<string>('');
  const [showAddTaskInput, setShowAddTaskInput] = useState<boolean>(false);

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

  // Let's create smart automation checks
  // 1: Suggested promo for Production to Installation Scheduled
  const allProductionTasksDone =
    job.status === '9 Production' &&
    activeStageTasks.length > 0 &&
    activeStageTasks.every((t) => t.complete);

  // 2: Suggest promo for Qualifying/Site scheduled to Next stage
  const allLeadTasksDone = 
    (job.status === '1 First Contact' || job.status === '2 Qualifying Lead' || job.status === '3 Site Visit Scheduled' || job.status === '4 Site Visit Done') && 
    activeStageTasks.length > 0 && 
    activeStageTasks.every((t) => t.complete);

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;

    onAddTask(newTaskName.trim(), activeStage);
    setNewTaskName('');
    setShowAddTaskInput(false);
  };

  return (
    <div id={`workflow-section-${job.id}`} className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
      
      {/* Step Progress Visualiser (12 Steps Slider / Flow) */}
      <div className="mb-6 select-none">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-sans font-extrabold uppercase tracking-widest text-gray-400">
            Project Phase Track (12 Gateways)
          </h3>
          <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-3 py-1 rounded-full">
            Active: {job.status}
          </span>
        </div>

        {/* Horizontal scroll of 12 stages with progress colors */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 pt-1 px-1 scrollbar-thin">
          {STATUS_STAGES.map((step, idx) => {
            const isCurrent = step.status === job.status;
            // Completed if index is lower than current index
            const currentIndex = STATUS_STAGES.findIndex((s) => s.status === job.status);
            const isCompleted = idx < currentIndex;

            return (
              <button
                key={step.status}
                id={`status-step-btn-${idx}`}
                onClick={() => onUpdateStatus(step.status)}
                className={`flex-shrink-0 text-[11px] font-sans font-bold px-3 py-2 rounded-xl transition-all border flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-indigo-600 border-indigo-600 text-white ring-4 ring-indigo-500/15'
                    : isCompleted
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                <span className="text-[10px] opacity-75">{idx + 1}</span>
                <span className="truncate max-w-[120px]">
                  {step.status.substring(2)}
                </span>
                {isCompleted && <span className="text-emerald-500">✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Section of Workflow */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-6 mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200/50 pb-4 mb-4">
          <div>
            <span className="text-[10px] font-bold uppercase text-slate-400">Current Phase workflow</span>
            <h4 className="text-lg font-sans font-extrabold text-slate-800">
              {activeStage} Milestones
            </h4>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-indigo-700 block sm:inline mr-2">
              Progress: {completedCount} of {totalCount} Complete
            </span>
            <span className="text-xs text-gray-400 font-medium">({percentComplete.toFixed(0)}%)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 rounded-full h-2 mb-6">
          <div
            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentComplete}%` }}
          />
        </div>

        {/* Dynamic List of Active Stage Tasks */}
        <div className="space-y-2.5">
          {activeStageTasks.length === 0 ? (
            <div className="text-center py-4 text-slate-400 text-xs">
              No tasks declared yet for the "{activeStage}" stage. Click 'Add Action Milestone' to start tracking.
            </div>
          ) : (
            activeStageTasks.map((task) => (
              <div
                key={task.id}
                id={`task-row-${task.id}`}
                onClick={() => onToggleTask(task.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                  task.complete
                    ? 'bg-emerald-50/40 border-emerald-100/55 text-slate-500 line-through decoration-slate-350'
                    : 'bg-white hover:bg-slate-100/50 border-slate-200 text-slate-800 font-semibold'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {task.complete ? (
                    <CheckSquare className="h-4.5 w-4.5 text-emerald-600" />
                  ) : (
                    <Square className="h-4.5 w-4.5 text-indigo-400 hover:text-indigo-600 transition-colors" />
                  )}
                </div>
                <div className="text-xs font-sans text-left leading-relaxed">
                  {task.taskName}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Live Action suggestion notifications (Automations Phase 1.5) */}
        {allProductionTasksDone && (
          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-amber-500 shrink-0 animate-pulse mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <span className="font-extrabold flex items-center gap-1.5">
                💡 Suggested Automation Trigger
              </span>
              All Production stage tasks for <span className="font-bold">{job.clientName}</span> are completed. Would you like to advance status to scheduled installation?
              <button
                id="auto-advance-to-install-btn"
                onClick={() => onUpdateStatus('10 Installation Scheduled')}
                className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-1.2 rounded-lg flex items-center gap-1 cursor-pointer transition-all active:scale-95 text-[11px]"
              >
                Advance to 10 Installation Scheduled
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {/* Add custom action input */}
        <div className="mt-4 pt-3 border-t border-slate-200/50">
          {showAddTaskInput ? (
            <form onSubmit={handleAddTaskSubmit} className="flex gap-2">
              <input
                id={`task-new-input-${job.id}`}
                type="text"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
                placeholder="Declare custom task for active stage..."
                required
                className="flex-1 text-xs border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-950 focus:border-indigo-600 outline-none"
              />
              <button
                id={`task-submit-add-btn-${job.id}`}
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Insert
              </button>
              <button
                id={`task-cancel-add-btn-${job.id}`}
                type="button"
                onClick={() => setShowAddTaskInput(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-xs px-3 py-1.5 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
            </form>
          ) : (
            <button
              id={`task-trigger-form-btn-${job.id}`}
              onClick={() => setShowAddTaskInput(true)}
              className="flex items-center gap-1 text-[11px] font-sans font-bold text-indigo-700 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Action Milestone Row
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
