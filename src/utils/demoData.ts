export function isDemoRecord(data: any): boolean {
  if (!data) return false;

  if (data.id && typeof data.id === 'string') {
    const idLow = data.id.toLowerCase();
    if (
      idLow.startsWith('job-') ||
      idLow.startsWith('task-') ||
      idLow.startsWith('fin-') ||
      idLow.startsWith('file-') ||
      idLow.startsWith('note-')
    ) {
      const suffix = idLow.split('-')[1];
      if (suffix && /^\d+$/.test(suffix) && parseInt(suffix, 10) <= 25) {
        return true;
      }
    }
  }

  return false;
}

export function isDemoJobId(jobId: string): boolean {
  if (!jobId) return false;
  const idLow = jobId.toLowerCase();
  if (idLow.startsWith('job-')) {
    const suffix = idLow.split('-')[1];
    if (suffix && /^\d+$/.test(suffix) && parseInt(suffix, 10) <= 20) {
      return true;
    }
  }
  return false;
}
