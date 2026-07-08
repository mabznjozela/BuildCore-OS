export function getStatusBadgeStyles(status: string, isSleekTheme: boolean): string {
  const norm = status ? status.toLowerCase() : '';
  if (norm.includes('1 ') || norm.includes('2 ') || norm.includes('3 ') || norm.includes('4 ') || norm.includes('contact') || norm.includes('lead')) {
    return isSleekTheme
      ? 'bg-blue-950/60 text-blue-300 border border-blue-900/40'
      : 'bg-blue-50 text-blue-800 border border-blue-200';
  } else if (norm.includes('5 ') || norm.includes('6 ') || norm.includes('design') || norm.includes('quote')) {
    return isSleekTheme
      ? 'bg-rose-950/60 text-rose-300 border border-rose-900/40 font-semibold'
      : 'bg-rose-50 text-rose-800 border border-rose-200 font-semibold';
  } else if (norm.includes('7 ') || norm.includes('awaiting deposit')) {
    return isSleekTheme
      ? 'bg-amber-950/60 text-amber-300 border border-amber-900/40'
      : 'bg-amber-50 text-amber-800 border border-amber-200';
  } else if (norm.includes('8 ') || norm.includes('deposit paid')) {
    return isSleekTheme
      ? 'bg-teal-950/60 text-teal-300 border border-teal-900/40'
      : 'bg-teal-50 text-teal-800 border border-teal-200';
  } else if (norm.includes('9 ') || norm.includes('production')) {
    return isSleekTheme
      ? 'bg-violet-950/60 text-violet-300 border border-violet-900/40'
      : 'bg-violet-50 text-violet-800 border border-violet-200';
  } else if (norm.includes('10 ') || norm.includes('11 ') || norm.includes('installation')) {
    return isSleekTheme
      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-900/40'
      : 'bg-cyan-50 text-cyan-800 border border-cyan-200';
  } else if (norm.includes('12 ') || norm.includes('complete')) {
    return isSleekTheme
      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-900/40'
      : 'bg-emerald-50 text-emerald-800 border border-emerald-250';
  } else {
    return isSleekTheme
      ? 'bg-slate-900 text-slate-300 border border-slate-800'
      : 'bg-slate-50 text-slate-700 border border-slate-200';
  }
}
