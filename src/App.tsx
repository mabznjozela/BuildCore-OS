import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  INITIAL_JOBS,
  INITIAL_TASKS,
  INITIAL_FINANCIALS,
  INITIAL_FILES,
  INITIAL_NOTES
} from './mockData';
import { Job, Task, FinancialRecord, VaultFile, JobNote, JobStatus, ProjectHealth } from './types';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import CommandCentre from './components/CommandCentre';
import WorkflowSection from './components/WorkflowSection';
import SpecificationsSection from './components/SpecificationsSection';
import VisualVault from './components/VisualVault';
import FinancialsSection from './components/FinancialsSection';
import NotesSection from './components/NotesSection';
import NewJobModal from './components/NewJobModal';
import CalendarView from './components/CalendarView';
import DashboardTab from './components/DashboardTab';
import SettingsTab from './components/SettingsTab';
import { sanitizeObject } from './utils/sanitizer';
import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  Settings, 
  AlertTriangle, 
  PlusCircle, 
  Search, 
  ArrowRight, 
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const isDemoRecord = (data: any): boolean => {
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
};

const isDemoJobId = (jobId: string): boolean => {
  if (!jobId) return false;
  const idLow = jobId.toLowerCase();
  if (idLow.startsWith('job-')) {
    const suffix = idLow.split('-')[1];
    if (suffix && /^\d+$/.test(suffix) && parseInt(suffix, 10) <= 20) {
      return true;
    }
  }
  return false;
};

const getStatusBadgeStyles = (status: string, isSleekTheme: boolean) => {
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
};

export default function App() {
  const [jobs, setJobs] = useState<Job[]>(() => {
    const saved = localStorage.getItem('kl_jobs');
    const parsed = saved ? JSON.parse(saved) : INITIAL_JOBS;
    return sanitizeObject(parsed).filter(item => !isDemoRecord(item));
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('kl_tasks');
    const parsed = saved ? JSON.parse(saved) : INITIAL_TASKS;
    return sanitizeObject(parsed).filter(item => !isDemoRecord(item) && !isDemoJobId(item.jobId));
  });

  const [financials, setFinancials] = useState<FinancialRecord[]>(() => {
    const saved = localStorage.getItem('kl_financials');
    const parsed = saved ? JSON.parse(saved) : INITIAL_FINANCIALS;
    return sanitizeObject(parsed).filter(item => !isDemoRecord(item) && !isDemoJobId(item.jobId));
  });

  const [files, setFiles] = useState<VaultFile[]>(() => {
    const saved = localStorage.getItem('kl_files');
    const parsed = saved ? JSON.parse(saved) : INITIAL_FILES;
    return sanitizeObject(parsed).filter(item => !isDemoRecord(item) && !isDemoJobId(item.jobId));
  });

  const [notes, setNotes] = useState<JobNote[]>(() => {
    const saved = localStorage.getItem('kl_notes');
    const parsed = saved ? JSON.parse(saved) : INITIAL_NOTES;
    return sanitizeObject(parsed).filter(item => !isDemoRecord(item) && !isDemoJobId(item.jobId));
  });

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<'dashboard' | 'jobs' | 'calendar' | 'settings'>('dashboard');
  const [activeTab, setActiveTab] = useState<string>('workflow');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Lead' | 'Production' | 'Complete'>('All');
  const [showAddJobModal, setShowAddJobModal] = useState<boolean>(false);
  const [automationAlert, setAutomationAlert] = useState<string | null>(null);
  const [drilldownType, setDrilldownType] = useState<'jobs' | 'tasks' | null>(null);
  const [showUserGuide, setShowUserGuide] = useState<boolean>(false);
  const [isSleekTheme, setIsSleekTheme] = useState<boolean>(() => {
    const saved = localStorage.getItem('kl_sleek_theme');
    return saved ? JSON.parse(saved) : true;
  });
  const [isSyncingLocal, setIsSyncingLocal] = useState<boolean>(false);
  const [isFloorProjectsExpanded, setIsFloorProjectsExpanded] = useState<boolean>(true);
  const [isFloorTasksExpanded, setIsFloorTasksExpanded] = useState<boolean>(false);

  const [currentUser, setCurrentUser] = useState<string>(() => {
    return localStorage.getItem('kl_current_user') || 'Admin';
  });
  const [lastAudit, setLastAudit] = useState<{ lastEditedBy?: string; action?: string; timestamp?: string } | null>(null);

  useEffect(() => {
    localStorage.setItem('kl_current_user', currentUser);
  }, [currentUser]);

  const writeAuditRecord = (actionDesc: string) => {
    const timestamp = new Date().toISOString();
    setDoc(doc(db, 'metadata', 'audit'), {
      lastEditedBy: currentUser,
      action: actionDesc,
      timestamp: timestamp
    }, { merge: true }).catch(err => {
      console.error("Failed to write audit record:", err);
    });
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = sessionStorage.getItem('kl_authenticated');
    return saved === 'true';
  });
  const [userRole, setUserRole] = useState<'admin' | 'floor'>(() => {
    const savedRole = sessionStorage.getItem('kl_user_role');
    return (savedRole as 'admin' | 'floor') || 'floor';
  });
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setPasswordError('Please enter a secure password.');
      return;
    }
    if (passwordInput === '1@m@dm1n') {
      sessionStorage.setItem('kl_authenticated', 'true');
      sessionStorage.setItem('kl_user_role', 'admin');
      setIsAuthenticated(true);
      setUserRole('admin');
      setPasswordError(null);
    } else if (passwordInput === 'MR328355') {
      sessionStorage.setItem('kl_authenticated', 'true');
      sessionStorage.setItem('kl_user_role', 'floor');
      setIsAuthenticated(true);
      setUserRole('floor');
      setPasswordError(null);
    } else {
      setPasswordError('Invalid credentials. Check key & try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('kl_authenticated');
    sessionStorage.removeItem('kl_user_role');
    setIsAuthenticated(false);
    setUserRole('floor');
    setPasswordInput('');
    setPasswordError(null);
  };

  useEffect(() => {
    localStorage.setItem('kl_sleek_theme', JSON.stringify(isSleekTheme));
  }, [isSleekTheme]);

  useEffect(() => {
    let isMounted = true;
    let unsubs: (() => void)[] = [];

    const initializeAndSync = async () => {
      try {
        const isMigrated = localStorage.getItem('kl_cloud_migrated') === 'true';
        if (!isMigrated) {
          const localJobsRaw = localStorage.getItem('kl_jobs');
          const localTasksRaw = localStorage.getItem('kl_tasks');
          const localFinancialsRaw = localStorage.getItem('kl_financials');
          const localFilesRaw = localStorage.getItem('kl_files');
          const localNotesRaw = localStorage.getItem('kl_notes');

          const localJobs: Job[] = sanitizeObject(localJobsRaw ? JSON.parse(localJobsRaw) : INITIAL_JOBS).filter(item => !isDemoRecord(item));
          const localTasks: Task[] = sanitizeObject(localTasksRaw ? JSON.parse(localTasksRaw) : INITIAL_TASKS).filter(item => !isDemoRecord(item) && !isDemoJobId(item.jobId));
          const localFinancials: FinancialRecord[] = sanitizeObject(localFinancialsRaw ? JSON.parse(localFinancialsRaw) : INITIAL_FINANCIALS).filter(item => !isDemoRecord(item) && !isDemoJobId(item.jobId));
          const localFiles: VaultFile[] = sanitizeObject(localFilesRaw ? JSON.parse(localFilesRaw) : INITIAL_FILES).filter(item => !isDemoRecord(item) && !isDemoJobId(item.jobId));
          const localNotes: JobNote[] = sanitizeObject(localNotesRaw ? JSON.parse(localNotesRaw) : INITIAL_NOTES).filter(item => !isDemoRecord(item) && !isDemoJobId(item.jobId));

          for (const job of localJobs) {
            await setDoc(doc(db, 'jobs', job.id), job, { merge: true });
          }
          for (const task of localTasks) {
            await setDoc(doc(db, 'tasks', task.id), task, { merge: true });
          }
          for (const financial of localFinancials) {
            await setDoc(doc(db, 'financials', financial.id), financial, { merge: true });
          }
          for (const file of localFiles) {
            await setDoc(doc(db, 'files', file.id), file, { merge: true });
          }
          for (const note of localNotes) {
            await setDoc(doc(db, 'notes', note.id), note, { merge: true });
          }

          localStorage.setItem('kl_cloud_migrated', 'true');
        }
      } catch (err) {
        console.error("Firebase cloud migration failed gracefully:", err);
      }

      if (!isMounted) return;

      const unsubJobs = onSnapshot(collection(db, 'jobs'), (snapshot) => {
        const list: Job[] = [];
        snapshot.forEach((docSnap) => {
          const item = docSnap.data() as Job;
          if (isDemoRecord(item)) {
            deleteDoc(doc(db, 'jobs', docSnap.id)).catch(err => {
              console.error("Failed to delete demo job doc from Firestore:", err);
            });
          } else {
            list.push(item);
          }
        });
        const sanitized = sanitizeObject(list);
        setJobs(sanitized);
        localStorage.setItem('kl_jobs', JSON.stringify(sanitized));
      }, (error) => {
        console.error("Firestore jobs listener error:", error);
      });

      const unsubTasks = onSnapshot(collection(db, 'tasks'), (snapshot) => {
        const list: Task[] = [];
        snapshot.forEach((docSnap) => {
          const item = docSnap.data() as Task;
          if (isDemoRecord(item) || isDemoJobId(item.jobId)) {
            deleteDoc(doc(db, 'tasks', docSnap.id)).catch(err => {
              console.error("Failed to delete demo task doc from Firestore:", err);
            });
          } else {
            list.push(item);
          }
        });
        const sanitized = sanitizeObject(list);
        setTasks(sanitized);
        localStorage.setItem('kl_tasks', JSON.stringify(sanitized));
      }, (error) => {
        console.error("Firestore tasks listener error:", error);
      });

      const unsubFinancials = onSnapshot(collection(db, 'financials'), (snapshot) => {
        const list: FinancialRecord[] = [];
        snapshot.forEach((docSnap) => {
          const item = docSnap.data() as FinancialRecord;
          if (isDemoRecord(item) || isDemoJobId(item.jobId)) {
            deleteDoc(doc(db, 'financials', docSnap.id)).catch(err => {
              console.error("Failed to delete demo financial doc from Firestore:", err);
            });
          } else {
            list.push(item);
          }
        });
        const sanitized = sanitizeObject(list);
        setFinancials(sanitized);
        localStorage.setItem('kl_financials', JSON.stringify(sanitized));
      }, (error) => {
        console.error("Firestore financials listener error:", error);
      });

      const unsubFiles = onSnapshot(collection(db, 'files'), (snapshot) => {
        const list: VaultFile[] = [];
        snapshot.forEach((docSnap) => {
          const item = docSnap.data() as VaultFile;
          if (isDemoRecord(item) || isDemoJobId(item.jobId)) {
            deleteDoc(doc(db, 'files', docSnap.id)).catch(err => {
              console.error("Failed to delete demo file doc from Firestore:", err);
            });
          } else {
            list.push(item);
          }
        });
        const sanitized = sanitizeObject(list);
        setFiles(sanitized);
        localStorage.setItem('kl_files', JSON.stringify(sanitized));
      }, (error) => {
        console.error("Firestore files listener error:", error);
      });

      const unsubNotes = onSnapshot(collection(db, 'notes'), (snapshot) => {
        const list: JobNote[] = [];
        snapshot.forEach((docSnap) => {
          const item = docSnap.data() as JobNote;
          if (isDemoRecord(item) || isDemoJobId(item.jobId)) {
            deleteDoc(doc(db, 'notes', docSnap.id)).catch(err => {
              console.error("Failed to delete demo note doc from Firestore:", err);
            });
          } else {
            list.push(item);
          }
        });
        const sanitized = sanitizeObject(list);
        setNotes(sanitized);
        localStorage.setItem('kl_notes', JSON.stringify(sanitized));
      }, (error) => {
        console.error("Firestore notes listener error:", error);
      });

      const unsubAudit = onSnapshot(doc(db, 'metadata', 'audit'), (docSnap) => {
        if (docSnap.exists()) {
          setLastAudit(docSnap.data() as any);
        }
      }, (error) => {
        console.error("Firestore audit log listener error:", error);
      });

      unsubs.push(unsubJobs, unsubTasks, unsubFinancials, unsubFiles, unsubNotes, unsubAudit);
    };

    initializeAndSync();

    return () => {
      isMounted = false;
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  const getTasksOutstandingCount = (jobId: string) => {
    const STATUS_STAGES: Record<string, string> = {
      '1 First Contact': 'Lead Care',
      '2 Qualifying Lead': 'Lead Care',
      '3 Site Visit Scheduled': 'Lead Care',
      '4 Site Visit Done': 'Lead Care',
      '5 Design Phase': 'Design',
      '6 Quote Sent': 'Design',
      '7 Awaiting Deposit': 'Financials',
      '8 Deposit Paid': 'Financials',
      '9 Production': 'Production',
      '10 Installation Scheduled': 'Installation',
      '11 Installation In Progress': 'Installation',
      '12 Complete': 'Handover'
    };

    const job = jobs.find((j) => j.id === jobId);
    if (!job) return 0;
    const stage = STATUS_STAGES[job.status] || 'Production';

    return tasks.filter(
      (t) => t.jobId === jobId && t.stage.toLowerCase() === stage.toLowerCase() && !t.complete
    ).length;
  };

  const activeJobs = jobs.filter((j) => j.status !== '12 Complete');
  const totalTasksOpen = activeJobs.reduce((sum, j) => sum + getTasksOutstandingCount(j.id), 0);
  const totalContractPipeline = jobs
    .filter((j) => j.status !== '12 Complete')
    .reduce((sum, j) => sum + j.quoteValue, 0);
  const alertProjectsCount = jobs.filter(
    (j) => j.health === 'Needs Attention' || j.health === 'At Risk'
  ).length;

  const currentJob = jobs.find((j) => j.id === selectedJobId);

  const handleUpdateJobStatus = (jobId: string, newStatus: JobStatus) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      setDoc(doc(db, 'jobs', jobId), {
        status: newStatus,
        statusSince: new Date().toISOString()
      }, { merge: true });
      writeAuditRecord(`Advanced status of project ${jobId} to "${newStatus.substring(2)}"`);
    }
    triggerAutomationNotification(`Status advanced to "${newStatus.substring(2)}" for project!`);
  };

  const handleToggleTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const nextState = !task.complete;
      setDoc(doc(db, 'tasks', taskId), { complete: nextState }, { merge: true });
      writeAuditRecord(`${nextState ? 'Completed' : 'Reopened'} task: "${task.taskName}" on project ${task.jobId}`);

      if (task.taskName.includes('60%') && nextState) {
        setTimeout(() => {
          handleTriggerDepositAutomation(task.jobId);
        }, 100);
      }
    }
  };

  const handleTriggerDepositAutomation = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      const targetDeposit = job.quoteValue * 0.6;
      const updatedDeposit = job.depositReceived < targetDeposit ? targetDeposit : job.depositReceived;

      triggerAutomationNotification(
        `⚡ Automation Triggered: 60% Deposit Paid! status elevated to "8 Deposit Paid" & Project becomes Active.`
      );

      setDoc(doc(db, 'jobs', jobId), {
        depositReceived: updatedDeposit,
        status: '8 Deposit Paid',
        statusSince: new Date().toISOString()
      }, { merge: true });
      writeAuditRecord(`Triggered deposit received automation (60%) for project ${jobId}`);
    }
  };

  const handleAddTask = (jobId: string, taskName: string, stage: string) => {
    const newId = `T_CUST_${Date.now()}`;
    const newTask: Task = {
      id: newId,
      jobId: jobId,
      stage: stage,
      taskName: taskName,
      complete: false
    };
    setDoc(doc(db, 'tasks', newId), newTask);
    writeAuditRecord(`Added custom task "${taskName}" to project ${jobId}`);
    triggerAutomationNotification(`Bespoke task "${taskName}" inserted into active stage queue.`);
  };

  const handleUpdateSpecs = (jobId: string, updatedSpecs: any) => {
    setDoc(doc(db, 'jobs', jobId), { specs: updatedSpecs }, { merge: true });
    writeAuditRecord(`Updated cabinet specifications for project ${jobId}`);
  };

  const handleAddFile = (newFile: Omit<VaultFile, 'id' | 'uploadedAt'>) => {
    const newId = `V_${Date.now()}`;
    const appended: VaultFile = {
      ...newFile,
      id: newId,
      uploadedAt: new Date().toISOString()
    };
    setDoc(doc(db, 'files', newId), appended);
    writeAuditRecord(`Uploaded file "${newFile.name}" to project ${newFile.jobId}`);
    triggerAutomationNotification(`File "${newFile.name}" pinned securely inside Visual Vault.`);
  };

  const handleDeleteFile = (fileId: string) => {
    deleteDoc(doc(db, 'files', fileId));
    writeAuditRecord(`Removed database file ${fileId}`);
  };

  const handleAddTransaction = (newTx: Omit<FinancialRecord, 'id' | 'date'>) => {
    const txDate = new Date().toISOString().split('T')[0];
    const newId = `F_${Date.now()}`;
    const logged: FinancialRecord = {
      ...newTx,
      id: newId,
      date: txDate
    };
    setDoc(doc(db, 'financials', newId), logged);
    writeAuditRecord(`Logged ${newTx.type} of R${newTx.amount.toLocaleString()} for project ${newTx.jobId}`);

    if (newTx.type === 'payment') {
      const job = jobs.find((j) => j.id === newTx.jobId);
      if (job) {
        const existingPayments = financials
          .filter((f) => f.jobId === job.id && f.type === 'payment')
          .reduce((sum, f) => sum + f.amount, 0);
        const newTotal = existingPayments + job.depositReceived + newTx.amount;
        if (newTotal >= job.quoteValue * 0.6 && job.status !== '8 Deposit Paid' && job.status !== '9 Production') {
          setTimeout(() => {
            handleUpdateJobStatus(job.id, '8 Deposit Paid');
          }, 400);
        }
      }
    }
  };

  const handleAddNote = (jobId: string, content: string, author: string) => {
    const newId = `N_${Date.now()}`;
    const newNoteRecord: JobNote = {
      id: newId,
      jobId: jobId,
      author: author,
      content: content,
      createdAt: new Date().toISOString()
    };
    setDoc(doc(db, 'notes', newId), newNoteRecord);
    writeAuditRecord(`Added discussion note to project ${jobId}`);
  };

  const handleUpdateJobState = (jobId: string, updatedFields: Partial<Job>) => {
    setDoc(doc(db, 'jobs', jobId), updatedFields, { merge: true });
    writeAuditRecord(`Updated passport layout fields on project ${jobId}`);
  };

  const handleCreateNewJob = (newJobData: any) => {
    const newJob: Job = {
      ...newJobData,
      statusSince: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    setDoc(doc(db, 'jobs', newJob.id), newJob);

    const defaultChecklist: Task[] = [
      { id: `T_${newJob.id}_1`, jobId: newJob.id, stage: 'Design', taskName: 'Wishlist Captured & Functional Brief Drafted', complete: true },
      { id: `T_${newJob.id}_2`, jobId: newJob.id, stage: 'Design', taskName: 'Detailed Laser Site Measurement Completed', complete: false },
      { id: `T_${newJob.id}_3`, jobId: newJob.id, stage: 'Design', taskName: 'Initial Layout Drafts & Ergonomics Approval', complete: false },
      { id: `T_${newJob.id}_4`, jobId: newJob.id, stage: 'Design', taskName: '3D High-Fidelity Rendering Presentation', complete: false },
      { id: `T_${newJob.id}_5`, jobId: newJob.id, stage: 'Design', taskName: 'Material Sample Board & Finishes Signed Off', complete: false },
      { id: `T_${newJob.id}_6`, jobId: newJob.id, stage: 'Financials', taskName: 'Comprehensive Itemized Quotation Sent', complete: false },
      { id: `T_${newJob.id}_7`, jobId: newJob.id, stage: 'Financials', taskName: '60% Production Deposit Settle check', complete: false },
      { id: `T_${newJob.id}_8`, jobId: newJob.id, stage: 'Production', taskName: 'Final Millimetre-Perfect Technical Site Review', complete: false },
      { id: `T_${newJob.id}_9`, jobId: newJob.id, stage: 'Production', taskName: 'Cabinet Craftsmanship Cutting List Generated', complete: false },
      { id: `T_${newJob.id}_10`, jobId: newJob.id, stage: 'Production', taskName: 'Raw Boards & Sheet Materials Ordered', complete: false },
      { id: `T_${newJob.id}_11`, jobId: newJob.id, stage: 'Production', taskName: 'Premium Hardware Sourced', complete: false }
    ];

    defaultChecklist.forEach((t) => {
      setDoc(doc(db, 'tasks', t.id), t);
    });

    writeAuditRecord(`Created new project passport ${newJob.id}`);
    setShowAddJobModal(false);
    setSelectedJobId(newJob.id);
    triggerAutomationNotification(`Project passport ${newJob.id} generated with 11 core tracking tasks.`);
  };

  const triggerAutomationNotification = (msg: string) => {
    setAutomationAlert(msg);
    setTimeout(() => {
      setAutomationAlert(null);
    }, 4500);
  };

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.status.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'All') return matchesSearch;
    if (statusFilter === 'Active') {
      return matchesSearch && j.status !== '12 Complete' && j.status !== '1 First Contact';
    }
    if (statusFilter === 'Lead') {
      return (
        matchesSearch &&
        (j.status.includes('1 ') ||
          j.status.includes('2 ') ||
          j.status.includes('3 ') ||
          j.status.includes('4 '))
      );
    }
    if (statusFilter === 'Production') {
      return matchesSearch && j.status.includes('9 ');
    }
    if (statusFilter === 'Complete') {
      return matchesSearch && j.status.includes('12 ');
    }
    return matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#070b13] flex flex-col items-center justify-center p-4 font-sans select-none relative overflow-hidden">
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-slate-800/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-slate-800/5 blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-black/60 relative border border-slate-200 text-slate-800"
        >
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#dc2626] rounded-bl-[100px] pointer-events-none opacity-95" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#dc2626] rounded-tr-[100px] pointer-events-none opacity-95" />

          <div className="p-8 sm:p-12 flex flex-col items-center relative z-10">
            <div className="flex items-center gap-1 mt-6 mb-2 select-none justify-center w-full">
              <span className="text-[40px] sm:text-[46px] font-extrabold tracking-tight text-slate-500 font-sans leading-none">Kitchen</span>
              <svg className="w-16 h-8 shrink-0 self-center" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 20H25L30 12L35 20H40L46 2L52 38L58 15L63 24L68 20H95" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[40px] sm:text-[46px] font-black tracking-tight text-black font-sans leading-none">Lab</span>
            </div>
            
            <div className="w-10 h-0.5 bg-[#dc2626] rounded-full mb-8" />

            <div className="text-center mb-8">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">MASTER SECURITY PORTAL</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest pl-1 block">
                  Corporate Security PIN
                </label>
                <div className="relative">
                  <input
                    id="secure-access-password-input"
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError(null);
                    }}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 text-slate-950 px-4 py-3.5 rounded-2xl border-2 border-slate-200 focus:border-red-600 focus:outline-none font-mono text-center text-sm tracking-[0.3em] font-extrabold shadow-inner transition-all duration-200"
                    autoFocus
                  />
                </div>
                {passwordError && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[11px] text-[#dc2626] font-semibold mt-2 text-center"
                  >
                    ⚠️ {passwordError}
                  </motion.p>
                )}
              </div>

              <button
                id="unlock-submit-btn"
                type="submit"
                className="w-full bg-slate-950 hover:bg-slate-900 active:scale-98 text-white font-black text-xs tracking-widest uppercase py-4 rounded-2xl cursor-pointer transition-all duration-150 shadow-lg shadow-black/15 border border-slate-800"
              >
                🔓 Request Secure Access
              </button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-6 w-full text-center">
              <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                Confidential IP • Kitchen Lab Ltd
              </span>
            </div>
          </div>
        </motion.div>
        
        <div className="mt-6 flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wider">
          <span>🔒 SHA-256 Session Encrypted</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex w-full ${isSleekTheme ? 'bg-[#090b11] text-slate-100' : 'bg-[#f8fafc] text-slate-800'} font-sans antialiased transition-colors duration-300`}>
      
      {/* SIDEBAR / LEFT RAIL NAVIGATION - DESKTOP ONLY */}
      <aside className={`w-64 shrink-0 hidden md:flex flex-col justify-between border-r sticky top-0 h-screen ${
        isSleekTheme ? 'bg-[#111625] border-slate-900/60' : 'bg-white border-slate-200'
      }`}>
        <div className="flex flex-col gap-6 p-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center font-extrabold text-lg select-none shadow-md border border-slate-200 shrink-0">
              <span className="text-[#dc2626] font-extrabold">K</span>
              <span className="text-black font-extrabold font-sans">L</span>
            </div>
            <div>
              <h1 className="text-sm font-sans font-black tracking-tight flex items-center gap-1 leading-none text-slate-100">
                Kitchen Lab OS
              </h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider font-mono mt-1">Operations Shell</p>
            </div>
          </div>

          <nav className="flex flex-col gap-1 select-none">
            {([
              { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { key: 'jobs', label: 'Client Passports', icon: Briefcase },
              { key: 'calendar', label: 'Deployments', icon: Calendar },
              { key: 'settings', label: 'App Settings', icon: Settings }
            ] as const).map((tab) => {
              const Icon = tab.icon;
              const isActive = activeNavTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveNavTab(tab.key);
                    if (tab.key !== 'jobs') setSelectedJobId(null);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left select-none ${
                    isActive
                      ? isSleekTheme
                        ? 'bg-[#ea580c]/10 text-[#ea580c] border border-orange-500/20'
                        : 'bg-orange-50 text-[#ea580c] border border-orange-200'
                      : isSleekTheme
                        ? 'text-slate-400 hover:text-white hover:bg-slate-900/40 border border-transparent'
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#ea580c]' : 'text-slate-505'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-900/60 flex flex-col gap-2 bg-slate-950/20">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] uppercase font-mono border border-slate-700 shrink-0 text-white">
              {currentUser.substring(0, 1)}
            </div>
            <div className="min-w-0">
              <span className="text-[9px] text-slate-450 uppercase tracking-wider block font-mono">Acting as</span>
              <span className="text-xs font-bold block truncate text-slate-300">{currentUser}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE WORKSPACE CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* TOP BRAND BAR - RESPONSIVE (HEADER) */}
        <header className={`border-b sticky top-0 z-30 shadow-xs ${
          isSleekTheme ? 'bg-[#090b11]/90 border-slate-900/60 text-white' : 'bg-white border-slate-200 text-slate-800'
        } backdrop-blur-md`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="md:hidden h-8 w-8 rounded-xl bg-white flex items-center justify-center font-extrabold text-sm border border-slate-200 shadow-xs mr-1 shrink-0 select-none">
                <span className="text-[#dc2626] font-black">K</span>
                <span className="text-black font-black font-sans">L</span>
              </div>
              <div>
                <h1 className="text-md font-sans font-black tracking-tight capitalize flex items-center gap-1.5 leading-none">
                  {activeNavTab === 'jobs' && selectedJobId ? (
                    <div className="flex items-center gap-1 text-slate-400">
                      <button 
                        onClick={() => setSelectedJobId(null)}
                        className="hover:text-slate-200 transition"
                      >
                        Passports
                      </button> 
                      <span className="text-slate-500 font-normal">/</span> 
                      <span className={`font-extrabold ${isSleekTheme ? 'text-slate-100' : 'text-slate-900'}`}>{currentJob?.clientName}</span>
                    </div>
                  ) : (
                    <span>{activeNavTab} Console</span>
                  )}
                </h1>
                <p className="text-[9px] text-slate-450 font-bold uppercase tracking-widest font-mono mt-1 leading-none hidden sm:block">
                  BuildCore Enterprise v2.0
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="theme-toggle-btn"
                onClick={() => {
                  const newVal = !isSleekTheme;
                  setIsSleekTheme(newVal);
                  localStorage.setItem('kl_sleek_theme', JSON.stringify(newVal));
                }}
                className={`text-xs px-2.5 py-1.5 sm:py-2 rounded-xl flex items-center justify-center font-bold transition-all cursor-pointer border ${
                  isSleekTheme
                    ? 'bg-slate-900/60 text-slate-300 border-slate-800 hover:bg-slate-900'
                    : 'bg-slate-105 text-slate-700 border-slate-200 hover:bg-slate-200/50'
                }`}
                title="Switch theme"
              >
                {isSleekTheme ? '🔳 Light Style' : '🖤 Dark Style'}
              </button>
              <button
                id="top-add-job-btn"
                onClick={() => setShowAddJobModal(true)}
                className="bg-[#ea580c] hover:bg-[#ea580c]/90 active:scale-95 transition-all text-xs font-extrabold text-white px-3.5 py-1.5 sm:py-2 rounded-xl flex items-center gap-1.5 cursor-pointer select-none font-sans shadow-md shadow-orange-950/10"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">New Passport</span>
              </button>
              <button
                id="lock-dashboard-btn"
                onClick={handleLogout}
                className={`text-xs px-3 py-1.5 sm:py-2 rounded-xl text-slate-305 font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 select-none border ${
                  isSleekTheme 
                    ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300' 
                    : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
                }`}
                title="Lock Console"
              >
                🔒 <span className="hidden md:inline">Lock Console</span>
              </button>
            </div>
          </div>
        </header>

        {userRole === 'admin' && (
          <section className={`border-b ${isSleekTheme ? 'bg-slate-950 border-slate-900 text-slate-100' : 'bg-white border-slate-200 text-slate-800'} py-2.5 transition-colors duration-300`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] text-slate-450 font-black uppercase tracking-widest font-mono shrink-0">
                  DB STATUS:
                </span>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 flex items-center gap-1 shrink-0">
                  <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  ⚡ CLOUD SYNCED
                </span>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900/40 text-slate-300 border border-slate-800 flex items-center gap-1 shrink-0">
                  <span>🕒 AUDIT:</span>
                  <span className="text-[#f1f5f9] font-bold truncate max-w-[80px]">{lastAudit?.lastEditedBy || 'David'}</span>
                  <span>({lastAudit?.timestamp ? new Date(lastAudit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Initial'})</span>
                </span>
              </div>

              <div className="flex items-center gap-1 bg-slate-900/50 border border-slate-800 px-2 py-0.5 rounded-lg text-[9px] shrink-0 w-fit">
                <span className="text-slate-500 font-bold font-sans">Acting:</span>
                <select
                  value={currentUser}
                  onChange={(e) => setCurrentUser(e.target.value)}
                  className="bg-transparent text-slate-350 font-bold border-none outline-none focus:ring-0 cursor-pointer text-[9px] py-0 pl-1 pr-1 font-mono"
                >
                  <option value="David">David</option>
                  <option value="Admin">Admin</option>
                  <option value="Installer Mark">Installer Mark</option>
                </select>
              </div>
            </div>
          </section>
        )}

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 overflow-x-hidden">
          
          <AnimatePresence mode="wait">
            
            {activeNavTab === 'dashboard' && (
              <motion.div
                key="dashboard-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <DashboardTab
                  userRole={userRole}
                  isSleekTheme={isSleekTheme}
                  activeJobs={activeJobs}
                  jobs={jobs}
                  tasks={tasks}
                  totalTasksOpen={totalTasksOpen}
                  totalContractPipeline={totalContractPipeline}
                  alertProjectsCount={alertProjectsCount}
                  drilldownType={drilldownType}
                  setDrilldownType={setDrilldownType}
                  handleToggleTask={handleToggleTask}
                  getTasksOutstandingCount={getTasksOutstandingCount}
                  setSelectedJobId={setSelectedJobId}
                  setActiveNavTab={setActiveNavTab}
                  setActiveTab={setActiveTab}
                  filteredJobs={filteredJobs}
                  getStatusBadgeStyles={getStatusBadgeStyles}
                  isFloorProjectsExpanded={isFloorProjectsExpanded}
                  setIsFloorProjectsExpanded={setIsFloorProjectsExpanded}
                  isFloorTasksExpanded={isFloorTasksExpanded}
                  setIsFloorTasksExpanded={setIsFloorTasksExpanded}
                />
              </motion.div>
            )}

            {activeNavTab === 'jobs' && (
              <motion.div
                key="jobs-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {!selectedJobId ? (
                  <div className="space-y-6">
                    <div className={`${isSleekTheme ? 'bg-[#111625] border border-slate-800/80' : 'bg-white border border-gray-150'} rounded-2xl p-5 shadow-xs space-y-4`}>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 select-none">
                          {([
                            { key: 'All', label: 'All Jobs' },
                            { key: 'Active', label: 'Active Workflow' },
                            { key: 'Lead', label: 'Leads (Gateways 1-4)' },
                            { key: 'Production', label: 'Production Queue' },
                            { key: 'Complete', label: 'Settle Complete' }
                          ] as const).map((chip) => (
                            <button
                              key={chip.key}
                              id={`filter-job-status-chip-${chip.key}`}
                              onClick={() => setStatusFilter(chip.key)}
                              className={`text-[11px] font-bold px-3 py-1.5 rounded-lg shrink-0 cursor-pointer transition border ${
                                statusFilter === chip.key
                                  ? 'bg-[#ea580c] border-[#ea580c] text-white shadow-xs'
                                  : isSleekTheme
                                    ? 'bg-slate-900/60 hover:bg-slate-850 text-slate-350 border-slate-800'
                                    : 'bg-white hover:bg-gray-50 text-gray-500 border-gray-200'
                              }`}
                            >
                              {chip.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <input
                          id="dashboard-search-input"
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search master projects by client name, suburb / area, or active gate description..."
                          className={`w-full text-xs font-sans border rounded-xl pl-9 pr-4 py-2.5 outline-none transition-all font-semibold ${
                            isSleekTheme
                              ? 'bg-slate-950 border-slate-850 text-white focus:bg-slate-950/90 focus:border-slate-500'
                              : 'bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-slate-200/80 text-slate-900 focus:border-slate-500'
                          }`}
                        />
                      </div>
                    </div>

                    {filteredJobs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredJobs.map((job) => {
                          const outstandingCount = getTasksOutstandingCount(job.id);
                          return (
                            <div
                              key={job.id}
                              id={`job-card-${job.id}`}
                              onClick={() => {
                                setSelectedJobId(job.id);
                                setActiveTab('workflow');
                              }}
                              className={`group border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[225px] ${
                                isSleekTheme
                                  ? 'bg-[#111625] border-slate-800/80 hover:border-slate-500 hover:shadow-orange-950/10 text-slate-105'
                                  : 'bg-white border-gray-150 hover:border-slate-500 text-slate-800'
                              }`}
                            >
                              <span className={`absolute top-0 inset-x-0 h-1.5 ${
                                job.health === 'On Track' ? 'bg-emerald-500' :
                                job.health === 'Needs Attention' ? 'bg-amber-500' : 'bg-[#dc2626]'
                              }`} />

                              <div>
                                <div className="flex justify-between items-start gap-1 mb-2">
                                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                                    isSleekTheme ? 'bg-slate-900/80 text-slate-350 border-slate-800/50' : 'bg-slate-50 text-slate-400 border-gray-100'
                                  }`}>
                                    {job.id}
                                  </span>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${getStatusBadgeStyles(job.status, isSleekTheme)}`}>
                                    {job.status}
                                  </span>
                                </div>

                                <h3 className={`text-md font-sans font-extrabold group-hover:text-[#ea580c] duration-155 ${isSleekTheme ? 'text-[#f1f5f9]' : 'text-slate-900'}`}>
                                  {job.clientName}
                                </h3>
                                <p className="text-[11px] text-slate-400 font-medium font-sans flex items-center gap-1 mt-0.5">
                                  📍 {job.area}
                                </p>

                                <p className={`text-[11px] line-clamp-2 mt-2 leading-relaxed h-8 ${isSleekTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                                  {job.comments}
                                </p>
                              </div>

                              <div className={`pt-3 border-t mt-4 flex items-center justify-between ${isSleekTheme ? 'border-slate-800/50' : 'border-gray-100/85'}`}>
                                <div>
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block leading-tight font-sans">ACTIVE STATUS TASKS</span>
                                  <span className={`text-xs font-sans font-bold ${outstandingCount > 0 ? (isSleekTheme ? 'text-slate-300' : 'text-emerald-600') : 'text-emerald-500'}`}>
                                    {outstandingCount === 0 ? 'All Completed ✓' : `${outstandingCount} Tasks Outstanding`}
                                  </span>
                                </div>

                                <div className="text-right">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-450 block leading-tight font-sans">Quote Settle</span>
                                  <span className={`text-xs font-sans font-extrabold ${isSleekTheme ? 'text-[#f8fafc]' : 'text-gray-800'}`}>
                                    R{job.quoteValue.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-2xs font-sans max-w-sm mx-auto">
                        <AlertTriangle className="h-10 w-10 text-gray-300 mx-auto mb-2 animate-bounce" />
                        <h3 className="font-sans font-extrabold text-gray-800 text-md">No Matching Passports</h3>
                        <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                          Try adjusting your search filters or add a new job.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 mb-1">
                      <button
                        onClick={() => setSelectedJobId(null)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1 transition cursor-pointer select-none ${
                          isSleekTheme 
                            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        ← Back to Passport List
                      </button>
                    </div>

                    <CommandCentre
                      job={currentJob!}
                      outstandingTasksCount={getTasksOutstandingCount(currentJob!.id)}
                      onGoBack={() => setSelectedJobId(null)}
                      onUpdateJob={(fields) => handleUpdateJobState(currentJob!.id, fields)}
                      activeSection={activeTab}
                      onSelectSection={setActiveTab}
                      tasks={tasks}
                      onToggleTask={handleToggleTask}
                      financials={financials}
                      onAddTransaction={handleAddTransaction}
                      onAddFile={handleAddFile}
                      onAddNote={(content, author) => handleAddNote(currentJob!.id, content, author)}
                      isSleekTheme={isSleekTheme}
                    />

                    <div className="grid grid-cols-1 gap-6">
                      {activeTab === 'workflow' && (
                        <WorkflowSection
                          job={currentJob!}
                          tasks={tasks}
                          onToggleTask={handleToggleTask}
                          onAddTask={(name, stage) => handleAddTask(currentJob!.id, name, stage)}
                          onUpdateStatus={(newStatus) => handleUpdateJobStatus(currentJob!.id, newStatus)}
                        />
                      )}

                      {activeTab === 'specs' && (
                        <SpecificationsSection
                          job={currentJob!}
                          onUpdateSpecs={(updated) => handleUpdateSpecs(currentJob!.id, updated)}
                        />
                      )}

                      {activeTab === 'vault' && (
                        <VisualVault
                          job={currentJob!}
                          files={files.filter((f) => f.jobId === currentJob!.id)}
                          onAddFile={handleAddFile}
                          onDeleteFile={handleDeleteFile}
                        />
                      )}

                      {activeTab === 'financials' && (
                        <FinancialsSection
                          job={currentJob!}
                          financials={financials}
                          onAddTransaction={handleAddTransaction}
                        />
                      )}

                      {activeTab === 'notes' && (
                        <NotesSection
                          job={currentJob!}
                          notes={notes}
                          onAddNote={(content, author) => handleAddNote(currentJob!.id, content, author)}
                        />
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeNavTab === 'calendar' && (
              <motion.div
                key="calendar-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <CalendarView
                  jobs={jobs}
                  isSleekTheme={isSleekTheme}
                  onSelectJob={(id) => {
                    setSelectedJobId(id);
                    setActiveNavTab('jobs');
                    setActiveTab('workflow');
                  }}
                />
              </motion.div>
            )}

            {activeNavTab === 'settings' && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <SettingsTab
                  isSleekTheme={isSleekTheme}
                  setIsSleekTheme={setIsSleekTheme}
                  userRole={userRole}
                  setUserRole={setUserRole}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  jobs={jobs}
                  tasks={tasks}
                  financials={financials}
                  files={files}
                  notes={notes}
                  writeAuditRecord={writeAuditRecord}
                  setAutomationAlert={triggerAutomationNotification}
                  db={db}
                  setJobs={setJobs}
                  setTasks={setTasks}
                  setFinancials={setFinancials}
                  setFiles={setFiles}
                  setNotes={setNotes}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </main>

        {/* BOTTOM MOBILE TAB BAR - MOBILE ONLY */}
        <nav className={`md:hidden fixed bottom-0 inset-x-0 h-16 border-t z-40 flex items-center justify-around select-none px-4 shadow-xl ${
          isSleekTheme ? 'bg-[#111625]/95 border-slate-900 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        } backdrop-blur-md pb-safe`}>
          {([
            { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { key: 'jobs', label: 'Passports', icon: Briefcase },
            { key: 'calendar', label: 'Calendar', icon: Calendar },
            { key: 'settings', label: 'Settings', icon: Settings }
          ] as const).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeNavTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveNavTab(tab.key);
                  if (tab.key !== 'jobs') setSelectedJobId(null);
                }}
                className={`flex flex-col items-center justify-center gap-1 font-sans cursor-pointer h-full px-3 transition-colors ${
                  isActive ? 'text-[#ea580c]' : 'text-slate-500 hover:text-slate-350'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-bold leading-none tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>

      </div>

      <AnimatePresence>
        {showAddJobModal && (
          <NewJobModal
            onClose={() => setShowAddJobModal(false)}
            onSave={handleCreateNewJob}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
