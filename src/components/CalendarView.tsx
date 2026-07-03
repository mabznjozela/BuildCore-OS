import React, { useState } from 'react';
import { Job } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, MapPin, Phone, ArrowRight, Clock } from 'lucide-react';

interface CalendarViewProps {
  jobs: Job[];
  isSleekTheme: boolean;
  onSelectJob: (jobId: string) => void;
}

export default function CalendarView({ jobs, isSleekTheme, onSelectJob }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed (January is 0)

  // Get first day of the month
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Get total days in the month
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Month names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Helper to change months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Safe date parsing helper
  const parseJobDate = (dateStr?: string): Date | null => {
    if (!dateStr) return null;
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return null;
    return parsed;
  };

  // Filter jobs that have installation dates in this month or are scheduled
  const getJobsForDay = (dayNum: number): Job[] => {
    return jobs.filter(job => {
      const jobDate = parseJobDate(job.installationDate);
      if (jobDate) {
        return (
          jobDate.getDate() === dayNum &&
          jobDate.getMonth() === month &&
          jobDate.getFullYear() === year
        );
      }
      
      // Fallback: If job is on Installation Scheduled (10) or In Progress (11) and has no explicit date,
      // place it tentatively on the 15th of the current month so it displays beautifully on the calendar.
      if (dayNum === 15 && (job.status === '10 Installation Scheduled' || job.status === '11 Installation In Progress')) {
        const statusSinceDate = parseJobDate(job.statusSince);
        if (statusSinceDate) {
          return statusSinceDate.getMonth() === month && statusSinceDate.getFullYear() === year;
        }
        // General fallback if no status date
        return true;
      }
      
      return false;
    });
  };

  // Generate calendar grid slots
  const renderCalendarDays = () => {
    const days = [];
    
    // Empty slots for preceding month overlap
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className={`h-16 md:h-24 p-1 border-b border-r select-none ${
            isSleekTheme ? 'bg-slate-950/20 border-slate-900/60' : 'bg-slate-50/50 border-gray-100'
          }`}
        />
      );
    }

    // Actual calendar days
    for (let day = 1; day <= totalDays; day++) {
      const dayJobs = getJobsForDay(day);
      const isToday = 
        day === new Date().getDate() && 
        month === new Date().getMonth() && 
        year === new Date().getFullYear();

      days.push(
        <div 
          key={`day-${day}`}
          className={`h-16 md:h-24 p-1 md:p-2 border-b border-r flex flex-col justify-between transition-colors relative group overflow-hidden ${
            isSleekTheme 
              ? 'border-slate-900/60 hover:bg-slate-900/30' 
              : 'border-gray-150 hover:bg-slate-50'
          } ${isToday ? (isSleekTheme ? 'bg-[#ea580c]/10' : 'bg-orange-50') : ''}`}
        >
          {/* Day number & Today badge */}
          <div className="flex justify-between items-center z-10">
            <span className={`text-[11px] md:text-xs font-mono font-bold ${
              isToday 
                ? 'text-[#ea580c] bg-[#ea580c]/20 px-1.5 py-0.2 rounded-md' 
                : isSleekTheme ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-800'
            }`}>
              {day}
            </span>
            {dayJobs.length > 0 && (
              <span className="h-1.5 w-1.5 rounded-full bg-[#ea580c]" />
            )}
          </div>

          {/* Jobs container inside slot */}
          <div className="mt-1 space-y-1 overflow-y-auto max-h-[40px] md:max-h-[60px] scrollbar-none z-10">
            {dayJobs.map(job => (
              <div
                key={job.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectJob(job.id);
                }}
                className={`text-[9px] font-bold px-1 py-0.5 rounded truncate transition-all cursor-pointer select-none ${
                  job.status === '11 Installation In Progress'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-[#ea580c]/20 text-orange-300 border border-orange-500/30'
                }`}
                title={`${job.clientName} - ${job.status}`}
              >
                🔧 {job.clientName}
              </div>
            ))}
          </div>

          {/* Decorative subtle background overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      );
    }

    // Remaining empty slots to complete the calendar grid row (if not divisible by 7)
    const totalSlots = days.length;
    const remainingSlots = (7 - (totalSlots % 7)) % 7;
    for (let i = 0; i < remainingSlots; i++) {
      days.push(
        <div 
          key={`empty-end-${i}`} 
          className={`h-16 md:h-24 p-1 border-b border-r select-none ${
            isSleekTheme ? 'bg-slate-950/20 border-slate-900/60' : 'bg-slate-50/50 border-gray-100'
          }`}
        />
      );
    }

    return days;
  };

  // Get upcoming installation jobs list sorted by date
  const upcomingJobs = jobs
    .filter(job => {
      const date = parseJobDate(job.installationDate);
      if (date) return date >= new Date(year, month, 1);
      return job.status === '10 Installation Scheduled' || job.status === '11 Installation In Progress';
    })
    .sort((a, b) => {
      const dateA = parseJobDate(a.installationDate) || new Date(year, month, 15);
      const dateB = parseJobDate(b.installationDate) || new Date(year, month, 15);
      return dateA.getTime() - dateB.getTime();
    });

  return (
    <div id="calendar-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans">
      
      {/* Calendar Grid (Col Span 8) */}
      <div className={`lg:col-span-8 rounded-3xl p-5 border flex flex-col justify-between ${
        isSleekTheme 
          ? 'bg-[#111625] border-slate-800/80 text-white shadow-xl' 
          : 'bg-white border-slate-200 text-slate-850 shadow-sm'
      }`}>
        
        {/* Calendar Header with toggles */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/40">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#ea580c]/10 flex items-center justify-center">
              <CalendarIcon className="h-4.5 w-4.5 text-[#ea580c]" />
            </div>
            <div>
              <h2 className={`text-md font-sans font-black tracking-tight ${isSleekTheme ? 'text-[#f1f5f9]' : 'text-slate-900'}`}>
                {monthNames[month]} {year}
              </h2>
              <p className="text-[10px] text-slate-400 font-medium">Installation & Deployments Calendar</p>
            </div>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={handlePrevMonth}
              className={`p-1.5 rounded-lg border transition cursor-pointer select-none ${
                isSleekTheme 
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-bold uppercase tracking-wider transition cursor-pointer select-none ${
                isSleekTheme 
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className={`p-1.5 rounded-lg border transition cursor-pointer select-none ${
                isSleekTheme 
                  ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' 
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Days of week titles */}
        <div className="grid grid-cols-7 text-center font-bold text-[10px] uppercase tracking-wider text-slate-450 mb-1 font-mono">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>

        {/* Main month grid days */}
        <div className={`grid grid-cols-7 border-t border-l rounded-2xl overflow-hidden ${
          isSleekTheme ? 'border-slate-900/60' : 'border-gray-150'
        }`}>
          {renderCalendarDays()}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/20 text-[10px] flex items-center gap-3 text-slate-450 justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#ea580c]" /> Scheduled
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" /> In Progress
            </span>
          </div>
          <span className="font-mono">ERP Dispatch Synchronizer Active</span>
        </div>
      </div>

      {/* Deployments sidebar (Col Span 4) */}
      <div className={`lg:col-span-4 rounded-3xl p-5 border flex flex-col justify-between ${
        isSleekTheme 
          ? 'bg-[#111625] border-slate-800/80 text-white shadow-xl' 
          : 'bg-white border-slate-200 text-slate-850 shadow-sm'
      }`}>
        <div className="space-y-4">
          <div>
            <span className="text-[10px] bg-[#ea580c]/10 text-[#ea580c] border border-orange-500/20 font-bold px-2 py-0.5 rounded-md uppercase tracking-wider font-mono">
              Deployments Pipeline
            </span>
            <h3 className={`text-md font-sans font-black mt-1 ${isSleekTheme ? 'text-white' : 'text-slate-900'}`}>
              Upcoming Worksite Schedule
            </h3>
            <p className="text-xs text-slate-400 leading-snug">Tap a deployment card to open the complete kitchen project passport.</p>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
            {upcomingJobs.length > 0 ? (
              upcomingJobs.map(job => {
                const jobDate = parseJobDate(job.installationDate);
                const dateDisplay = jobDate 
                  ? jobDate.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })
                  : 'Tentative (Mid-month)';

                return (
                  <div
                    key={job.id}
                    onClick={() => onSelectJob(job.id)}
                    className={`p-3.5 rounded-2xl border transition-all hover:scale-[1.015] active:scale-[0.985] cursor-pointer group flex flex-col justify-between ${
                      isSleekTheme 
                        ? 'bg-slate-950/40 border-slate-900 hover:border-[#ea580c]/60' 
                        : 'bg-slate-50 border-slate-200 hover:border-[#ea580c]/60'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded">
                          {job.id}
                        </span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          job.status === '11 Installation In Progress'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {job.status.replace(/^\d+\s+/, '')}
                        </span>
                      </div>
                      <h4 className={`text-xs font-extrabold group-hover:text-[#ea580c] transition-colors ${
                        isSleekTheme ? 'text-white' : 'text-slate-900'
                      }`}>
                        {job.clientName}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-500 shrink-0" /> {job.area}
                      </p>
                    </div>

                    <div className="border-t border-slate-800/40 pt-2.5 mt-3 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="h-3.5 w-3.5 text-slate-500" />
                        {dateDisplay}
                      </span>
                      <span className="text-[#ea580c] font-bold flex items-center gap-0.5">
                        Open <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 duration-150" />
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-slate-400 border border-dashed border-slate-800/50 rounded-2xl">
                <p className="text-xs font-bold font-mono">No active scheduled deployments</p>
                <p className="text-[10px] text-slate-500 mt-1">Assign an installation date to projects inside their specs or edit forms.</p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800/40 mt-4 text-[10px] text-slate-500 flex items-center justify-between">
          <span>Active schedule</span>
          <span className="font-mono">{upcomingJobs.length} scheduled</span>
        </div>
      </div>

    </div>
  );
}
