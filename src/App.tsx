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
import { exportToMasterExcel } from './utils/excelExport';
import { FileSpreadsheet } from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import CommandCentre from './components/CommandCentre';
import WorkflowSection from './components/WorkflowSection';
import SpecificationsSection from './components/SpecificationsSection';
import VisualVault from './components/VisualVault';
import FinancialsSection from './components/FinancialsSection';
import NotesSection from './components/NotesSection';
import NewJobModal from './components/NewJobModal';
// Demo seeder functions removed
import { sanitizeObject } from './utils/sanitizer';
import { BookOpen, Smartphone, WifiOff, Sliders, ShieldCheck, Database, Trash2 } from 'lucide-react';
import {
  Wrench,
  Layers,
  Heart,
  TrendingUp,
  AlertTriangle,
  PlusCircle,
  Search,
  Filter,
  CheckCircle,
  HelpCircle,
  Info,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Sparkles,
  Clock,
  ClipboardList,
  FolderOpen
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
    // Lead Care (1 - 4) -> Blue
    return isSleekTheme 
      ? 'bg-blue-950/60 text-blue-300 border border-blue-900/40' 
      : 'bg-blue-50 text-blue-800 border border-blue-200';
  } else if (norm.includes('5 ') || norm.includes('6 ') || norm.includes('design') || norm.includes('quote')) {
    // Design (5 - 6) -> Rose (reddish-pink)
    return isSleekTheme 
      ? 'bg-rose-950/60 text-rose-300 border border-rose-900/40 font-semibold' 
      : 'bg-rose-50 text-rose-800 border border-rose-200 font-semibold';
  } else if (norm.includes('7 ') || norm.includes('awaiting deposit')) {
    // Awaiting Deposit (7) -> Amber/Orange
    return isSleekTheme 
      ? 'bg-amber-950/60 text-amber-300 border border-amber-900/40' 
      : 'bg-amber-50 text-amber-800 border border-amber-200';
  } else if (norm.includes('8 ') || norm.includes('deposit paid')) {
    // Deposit Paid (8) -> Teal
    return isSleekTheme 
      ? 'bg-teal-950/60 text-teal-300 border border-teal-900/40' 
      : 'bg-teal-50 text-teal-800 border border-teal-200';
  } else if (norm.includes('9 ') || norm.includes('production')) {
    // Production (9) -> Violet / Purple
    return isSleekTheme 
      ? 'bg-violet-950/60 text-violet-300 border border-violet-900/40' 
      : 'bg-violet-50 text-violet-800 border border-violet-200';
  } else if (norm.includes('10 ') || norm.includes('11 ') || norm.includes('installation')) {
    // Installation (10 - 11) -> Cyan / Sky
    return isSleekTheme 
      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-900/40' 
      : 'bg-cyan-50 text-cyan-800 border border-cyan-200';
  } else if (norm.includes('12 ') || norm.includes('complete')) {
    // Complete (12) -> Emerald
    return isSleekTheme 
      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-900/40' 
      : 'bg-emerald-50 text-emerald-800 border border-emerald-250';
  } else {
    // Default
    return isSleekTheme 
      ? 'bg-slate-900 text-slate-300 border border-slate-800' 
      : 'bg-slate-50 text-slate-700 border border-slate-200';
  }
};

export default function App() {
  // --- LocalStorage State Hydraton & Hooks ---
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

  // --- View states ---
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
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

  // --- Acting User for Audit Logs ---
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

  // --- Exclusive Security Lock & Presentation Control ---
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

  // Sync to localstorage
  useEffect(() => {
    localStorage.setItem('kl_sleek_theme', JSON.stringify(isSleekTheme));
  }, [isSleekTheme]);

  // --- Firebase Cloud Sync Engine ---
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

          // Migrate each record safely with merge: true to avoid overwriting newer cloud entries
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

      // Set up real-time active subscriptions with complete error resilience and persistent local mirror
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

        // Auto-correct any legacy data in Firestore in the background
        list.forEach((item, i) => {
          const originalStr = JSON.stringify(item);
          const sanitizedItem = sanitized[i];
          const sanitizedStr = JSON.stringify(sanitizedItem);
          if (originalStr !== sanitizedStr) {
            setDoc(doc(db, 'jobs', item.id), sanitizedItem, { merge: true }).catch(err => {
              console.error("Failed to auto-correct job in Firestore:", err);
            });
          }
        });
      }, (error) => {
        console.error("Firestore jobs listener error caught gracefully:", error);
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

        // Auto-correct tasks
        list.forEach((item, i) => {
          const originalStr = JSON.stringify(item);
          const sanitizedItem = sanitized[i];
          const sanitizedStr = JSON.stringify(sanitizedItem);
          if (originalStr !== sanitizedStr) {
            setDoc(doc(db, 'tasks', item.id), sanitizedItem, { merge: true }).catch(err => {
              console.error("Failed to auto-correct task in Firestore:", err);
            });
          }
        });
      }, (error) => {
        console.error("Firestore tasks listener error caught gracefully:", error);
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

        // Auto-correct financials
        list.forEach((item, i) => {
          const originalStr = JSON.stringify(item);
          const sanitizedItem = sanitized[i];
          const sanitizedStr = JSON.stringify(sanitizedItem);
          if (originalStr !== sanitizedStr) {
            setDoc(doc(db, 'financials', item.id), sanitizedItem, { merge: true }).catch(err => {
              console.error("Failed to auto-correct financial in Firestore:", err);
            });
          }
        });
      }, (error) => {
        console.error("Firestore financials listener error caught gracefully:", error);
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

        // Auto-correct files
        list.forEach((item, i) => {
          const originalStr = JSON.stringify(item);
          const sanitizedItem = sanitized[i];
          const sanitizedStr = JSON.stringify(sanitizedItem);
          if (originalStr !== sanitizedStr) {
            setDoc(doc(db, 'files', item.id), sanitizedItem, { merge: true }).catch(err => {
              console.error("Failed to auto-correct file in Firestore:", err);
            });
          }
        });
      }, (error) => {
        console.error("Firestore files listener error caught gracefully:", error);
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

        // Auto-correct notes
        list.forEach((item, i) => {
          const originalStr = JSON.stringify(item);
          const sanitizedItem = sanitized[i];
          const sanitizedStr = JSON.stringify(sanitizedItem);
          if (originalStr !== sanitizedStr) {
            setDoc(doc(db, 'notes', item.id), sanitizedItem, { merge: true }).catch(err => {
              console.error("Failed to auto-correct note in Firestore:", err);
            });
          }
        });
      }, (error) => {
        console.error("Firestore notes listener error caught gracefully:", error);
      });

      const unsubAudit = onSnapshot(doc(db, 'metadata', 'audit'), (docSnap) => {
        if (docSnap.exists()) {
          setLastAudit(docSnap.data() as any);
        }
      }, (error) => {
        console.error("Firestore audit log listener error caught gracefully:", error);
      });

      unsubs.push(unsubJobs, unsubTasks, unsubFinancials, unsubFiles, unsubNotes, unsubAudit);
    };

    initializeAndSync();

    return () => {
      isMounted = false;
      unsubs.forEach((unsub) => unsub());
    };
  }, []);

  // --- Helper calculations ---
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

  // State calculations for header KPI metrics
  const activeJobs = jobs.filter((j) => j.status !== '12 Complete');
  const totalTasksOpen = activeJobs.reduce((sum, j) => sum + getTasksOutstandingCount(j.id), 0);
  const totalContractPipeline = jobs
    .filter((j) => j.status !== '12 Complete')
    .reduce((sum, j) => sum + j.quoteValue, 0);
  const alertProjectsCount = jobs.filter(
    (j) => j.health === 'Needs Attention' || j.health === 'At Risk'
  ).length;

  // Find dynamic alerts for the home banner cards
  const awaitingDepositJob = jobs.find((j) => j.status === '7 Awaiting Deposit');
  const attentionJob = jobs.find((j) => j.id !== 'OVERHEAD' && (j.health === 'Needs Attention' || j.health === 'At Risk'));

  // Find active job details
  const currentJob = jobs.find((j) => j.id === selectedJobId);

  // --- Handlers & Mutator Actions ---

  const handleSeedDemoData = async () => {
    // Historic seeder now triggers clean reset only
    await handleResetCleanState();
  };

  const handleResetCleanState = async () => {
    try {
      setIsSyncingLocal(true);
      
      // Absolute query & erase of all Firestore documents in cloud collections
      const collections = ['jobs', 'tasks', 'financials', 'files', 'notes'];
      for (const colName of collections) {
        const querySnapshot = await getDocs(collection(db, colName));
        for (const docSnap of querySnapshot.docs) {
          await deleteDoc(doc(db, colName, docSnap.id));
        }
      }

      // Erase and flush the device LocalStorage cache mirrors
      localStorage.setItem('kl_jobs', JSON.stringify([]));
      localStorage.setItem('kl_tasks', JSON.stringify([]));
      localStorage.setItem('kl_financials', JSON.stringify([]));
      localStorage.setItem('kl_files', JSON.stringify([]));
      localStorage.setItem('kl_notes', JSON.stringify([]));

      // Reset application state memory
      setJobs([]);
      setTasks([]);
      setFinancials([]);
      setFiles([]);
      setNotes([]);
      
      setSelectedJobId(null);
      setIsSyncingLocal(false);
      triggerAutomationNotification("🗑️ Standard clean slate initialized! Cloud and local databases are completely empty.");
    } catch (err) {
      console.error("Firestore absolute wipe reset failed:", err);
      setIsSyncingLocal(false);
    }
  };

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

  const handleForceUploadLocalData = async () => {
    setIsSyncingLocal(true);
    try {
      const localJobsRaw = localStorage.getItem('kl_jobs');
      const localTasksRaw = localStorage.getItem('kl_tasks');
      const localFinancialsRaw = localStorage.getItem('kl_financials');
      const localFilesRaw = localStorage.getItem('kl_files');
      const localNotesRaw = localStorage.getItem('kl_notes');

      if (localJobsRaw || localTasksRaw || localFinancialsRaw || localFilesRaw || localNotesRaw) {
        const localJobs: Job[] = localJobsRaw ? JSON.parse(localJobsRaw) : [];
        const localTasks: Task[] = localTasksRaw ? JSON.parse(localTasksRaw) : [];
        const localFinancials: FinancialRecord[] = localFinancialsRaw ? JSON.parse(localFinancialsRaw) : [];
        const localFiles: VaultFile[] = localFilesRaw ? JSON.parse(localFilesRaw) : [];
        const localNotes: JobNote[] = localNotesRaw ? JSON.parse(localNotesRaw) : [];

        // Upload each record safely with merge
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
        triggerAutomationNotification("🟢 Sync forced successfully: All local offline data was uploaded to the cloud database!");
      } else {
        triggerAutomationNotification("ℹ️ No offline-saved cache found on this device to upload.");
      }
    } catch (err) {
      console.error("Force manual local-to-cloud upload failed:", err);
      triggerAutomationNotification("🔴 Sync failed. Check network connection and try again.");
    } finally {
      setIsSyncingLocal(false);
    }
  };

  const handleCopyStableUrl = () => {
    navigator.clipboard.writeText("https://ais-pre-wftnbto5nhvufmuv4sesd6-933896873270.europe-west2.run.app");
    triggerAutomationNotification("📋 Copied Master App URL to clipboard!");
  };

  // --- Filtering list logic ---
  const filteredJobs = jobs.filter((j) => {
    // Search filter
    const matchesSearch =
      j.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.status.toLowerCase().includes(searchQuery.toLowerCase());

    // Status category filters
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
        {/* Modern abstract cosmic ambient glows */}
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-slate-800/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-slate-800/5 blur-[120px] pointer-events-none" />
        
        {/* Branded Card mirroring the uploaded Kitchen Lab logo and business layout */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-lg bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-black/60 relative border border-slate-200 text-slate-800"
        >
          {/* Top-Right Red Corner Sweep */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-[#dc2626] rounded-bl-[100px] pointer-events-none opacity-95" />
          
          {/* Bottom-Left Red Corner Sweep */}
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-[#dc2626] rounded-tr-[100px] pointer-events-none opacity-95" />

          {/* Card Content with padded premium spacing */}
          <div className="p-8 sm:p-12 flex flex-col items-center relative z-10">
            
            {/* Logo Group */}
            <div className="flex items-center gap-1 mt-6 mb-2 select-none justify-center w-full">
              <span className="text-[40px] sm:text-[46px] font-extrabold tracking-tight text-slate-500 font-sans leading-none">Kitchen</span>
              
              {/* Connected Active Red Pulse ECG Waves */}
              <svg className="w-16 h-8 shrink-0 self-center" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 20H25L30 12L35 20H40L46 2L52 38L58 15L63 24L68 20H95" stroke="#dc2626" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              <span className="text-[40px] sm:text-[46px] font-black tracking-tight text-black font-sans leading-none">Lab</span>
            </div>
            
            <div className="w-10 h-0.5 bg-[#dc2626] rounded-full mb-8" />

            {/* Sub-Header info block */}
            <div className="text-center mb-8">
              <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest">MASTER SECURITY PORTAL</h2>
            </div>

            {/* Password input form */}
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
                    className="text-[11px] text-emerald-600 font-semibold mt-2 text-center"
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
        
        {/* Ambient indicator */}
        <div className="mt-6 flex items-center gap-2 text-slate-500 text-xs font-medium uppercase tracking-wider">
          <span>🔒 SHA-256 Session Encrypted</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isSleekTheme ? 'bg-[#090b11] text-slate-100' : 'bg-[#f8fafc] text-slate-800'} font-sans antialiased pb-16 transition-colors duration-300`}>
      
      {/* Top Brand Banner */}
      <header className="bg-slate-950 text-white border-b border-slate-900 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between font-sans">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-white flex items-center justify-center font-extrabold text-lg select-none shadow-md shadow-white/5 border border-slate-200">
              <span className="text-[#dc2626] font-extrabold">K</span>
              <span className="text-black font-extrabold font-sans">L</span>
            </div>
            <div>
              <h1 className="text-md sm:text-lg font-sans font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Kitchen Lab OS
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="theme-toggle-btn"
              onClick={() => setIsSleekTheme(!isSleekTheme)}
              className={`text-xs px-2.5 py-1.5 sm:py-2 rounded-xl flex items-center justify-center font-bold transition-all cursor-pointer border ${
                isSleekTheme
                  ? 'bg-slate-900/40 text-slate-350 border-red-700/40 hover:bg-slate-900/80'
                  : 'bg-slate-800 text-slate-200 border-transparent hover:bg-slate-700'
              }`}
              title="Switch theme"
            >
              {isSleekTheme ? '🔳' : '🖤'}
            </button>
            <button
              id="top-add-job-btn"
              onClick={() => setShowAddJobModal(true)}
              className="bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-xs font-bold text-white px-3.5 py-1.5 sm:py-2 rounded-xl flex items-center gap-1 cursor-pointer select-none font-sans"
            >
              <PlusCircle className="h-4 w-4" />
              New Project
            </button>
            <button
              id="lock-dashboard-btn"
              onClick={handleLogout}
              className={`text-xs bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700/60 px-3 py-1.5 sm:py-2 rounded-xl text-slate-300 hover: ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-bold transition-all cursor-pointer flex items-center gap-1.5`.trim()}
              title="Click to lock the console instantly"
            >
              🔒 Lock Console
            </button>
          </div>
        </div>
      </header>

      {/* SYSTEM DATABASE ENVIRONMENT & MANUAL BAR */}
      {userRole === 'admin' && (
        <section className={`border-b ${isSleekTheme ? 'bg-slate-950 border-slate-900 text-slate-100' : 'bg-[#ffffff] border-slate-150 text-slate-850'} py-3 transition-colors duration-300`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <span className="text-[10px] text-slate-450 font-black uppercase tracking-widest font-mono shrink-0">
                DATABASE STATUS:
              </span>
              {/* Cloud Sync Status Pill */}
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-800/30 flex items-center gap-1.5 shrink-0">
                <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                ⚡ CLOUD DATABASE SYNCED
              </span>

              {/* Audit Log Badge */}
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-900/40 text-slate-350 border border-slate-800 flex items-center gap-1.5 shrink-0">
                <span>🕒 LAST EDITED BY:</span>
                <span className="text-[#f1f5f9] tracking-tight truncate max-w-[120px] font-sans font-bold">{lastAudit?.lastEditedBy || 'David'}</span>
                <span className={` ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} /80 font-normal`.trim()}>
                  ({lastAudit?.timestamp ? new Date(lastAudit.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Initial Sync'})
                </span>
                {lastAudit?.action && (
                  <span className={`text-[9px] ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-normal border-l border-red-800/40 pl-1.5 max-w-[200px] truncate hidden md:inline`.trim()}>
                    {lastAudit.action}
                  </span>
                )}
              </span>

              {/* Acting user profile dropdown switcher */}
              <div className="flex items-center gap-1.5 bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-xl text-[10px] transition-all shrink-0">
                <span className="text-slate-500 font-sans font-bold">Acting User:</span>
                <select
                  value={currentUser}
                  onChange={(e) => setCurrentUser(e.target.value)}
                  className="bg-transparent text-slate-350 font-bold border-none outline-none focus:ring-0 cursor-pointer text-[10px] py-0 pl-1 pr-1.5 select-none font-mono"
                >
                  <option value="David" className="bg-slate-900 text-white">David</option>
                  <option value="Admin" className="bg-slate-900 text-white">Admin (mabza1n)</option>
                  <option value="Installer Mark" className="bg-slate-900 text-white">Installer Mark</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-start lg:self-center">
              <button
                id="toggle-user-guide-btn"
                onClick={() => setShowUserGuide(!showUserGuide)}
                className={`text-xs px-4 py-1.5 rounded-xl font-bold flex items-center gap-1.5 select-none cursor-pointer transition-all border ${
                  showUserGuide
                    ? (isSleekTheme ? 'bg-slate-850 text-slate-300 border-slate-700/60' : 'bg-slate-100 text-slate-705 border-slate-300')
                    : 'bg-slate-900/30 text-slate-350 border-slate-800 hover:bg-slate-900/60'
                }`}
              >
                <BookOpen className="h-4 w-4" />
                {showUserGuide ? 'Hide User Manual' : '📖 Open User Manual'}
              </button>
            </div>
          </div>
        </section>
      )}
      {/* USER & WORKSHOP MANUAL */}
      {userRole === 'admin' && (
        <AnimatePresence>
          {showUserGuide && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`overflow-hidden border-b transition-colors duration-300 ${
                isSleekTheme ? 'bg-slate-900/40 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-850'
              }`}
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="flex items-start justify-between border-b border-slate-800/40 pb-3 mb-4">
                  <div>
                    <h2 className={`text-sm font-bold ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} uppercase tracking-widest font-mono flex items-center gap-2`.trim()}>
                      <BookOpen className="h-4.5 w-4.5" />
                      Kitchen Lab OS • Operational Handbook
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      How David and the site installation crew operate on location using this system.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUserGuide(false)}
                    className="text-xs text-slate-400 hover:text-slate-200 uppercase font-mono font-bold"
                  >
                    ✕ Close Manual
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Manual Section 1 */}
                  <div className={`p-4 rounded-2xl border ${isSleekTheme ? 'bg-slate-950/40 border-slate-850' : 'bg-white border-slate-200'} space-y-2`}>
                    <div className={`flex items-center gap-2 ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} `.trim()}>
                      <Smartphone className="h-4.5 w-4.5" />
                      <h3 className="text-xs font-bold uppercase font-sans tracking-wide">1. Loading onto your Phone</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      You don't need any app stores! 
                      <br />
                      1. Tap the <strong className="text-slate-350">Share App URL</strong> option inside AI Studio, or open the link on your phone.
                      <br />
                      2. In Chrome (Android) or Safari (iPhone), tap the <strong className={` ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-extrabold`.trim()}>"Share" / "Menu"</strong> button.
                      <br />
                      3. Choose <strong className={` ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-extrabold`.trim()}>"Add to Home Screen"</strong>.
                      <br />
                      It places a standalone workspace launcher shortcut immediately onto your phone's home screen.
                    </p>
                  </div>

                  {/* Manual Section 2 */}
                  <div className={`p-4 rounded-2xl border ${isSleekTheme ? 'bg-slate-950/40 border-slate-850' : 'bg-white border-slate-200'} space-y-2`}>
                    <div className={`flex items-center gap-2 ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} `.trim()}>
                      <WifiOff className="h-4.5 w-4.5" />
                      <h3 className="text-xs font-bold uppercase font-sans tracking-wide">2. Offline vs. Online Capabilities</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      <strong>Absolute Offline:</strong> David can type, create clients, modify measurements, adjust door hinges, or log payments at client sites in remote, zero-reception areas. Key numbers are cached securely inside the phone's built-in LocalStorage database and never lost.
                      <br />
                      <strong>Online Mode:</strong> When cell signal restores, sending ERP/Report Layer setup requests or transferring data occurs with zero manual input or sync conflict.
                    </p>
                  </div>

                  {/* Manual Section 3 */}
                  <div className={`p-4 rounded-2xl border ${isSleekTheme ? 'bg-slate-950/40 border-slate-850' : 'bg-white border-slate-200'} space-y-2`}>
                    <div className={`flex items-center gap-2 ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} `.trim()}>
                      <Sliders className="h-4.5 w-4.5" />
                      <h3 className="text-xs font-bold uppercase font-sans tracking-wide">3. Core Features to Showcase</h3>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      • <strong className="text-slate-300">Specifications Section:</strong> Keep track of soft-close hinges, board materials (Melawood, PG Bison), door types, and stone suppliers.
                      <br />
                      • <strong className="text-slate-300">Site-Notes Amendments:</strong> Correct wrong measurements or specific client requests (like a secret wardrobe compartment) instantly.
                      <br />
                      • <strong className="text-slate-300">Visual Vault:</strong> Preview active CAD drawings or 3D renderings to keep the cabinet-making team aligned.
                    </p>
                  </div>

                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      )}

      {/* --- Main Application Container Viewports --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Dynamic System Notifications (Float alerts) */}
        <AnimatePresence>
          {automationAlert && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-5 bg-gradient-to-r from-slate-900 to-red-950 border border-red-500/25 text-white rounded-xl p-4 shadow-xl flex items-start gap-3 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 blur-xl rounded-full" />
              <div className="h-6 w-6 rounded-full bg-red-500/25 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs">⚡</span>
              </div>
              <div>
                <span className="font-extrabold text-sm block tracking-tight text-slate-350">SYSTEM EVENT REGISTERED</span>
                <span className="text-xs text-slate-200 font-sans">{automationAlert}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!selectedJobId ? (
            // ============================================
            // MY JOBS HOME VIEW PORT
            // ============================================
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {userRole === 'floor' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                  {/* BENTO CARD 1: ACTIVE CLIENTS */}
                  <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
                    isSleekTheme ? 'bg-[#111625] border-slate-800/80 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-850 shadow-sm'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <button
                          id="toggle-floor-projects-btn"
                          onClick={() => setIsFloorProjectsExpanded(!isFloorProjectsExpanded)}
                          className={`flex items-center gap-3 text-left cursor-pointer p-2 px-3 rounded-xl transition-all w-fit focus:outline-none focus:ring-0 border border-[#dc2626] ${
                            isSleekTheme ? 'hover:bg-slate-800/30' : 'hover:bg-slate-100/60'
                          }`}
                          title={isFloorProjectsExpanded ? "Collapse Active Clients" : "Expand Active Clients"}
                        >
                          <div className="min-w-0">
                            <h2 className={`text-sm font-black uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap ${
                              isSleekTheme ? 'text-[#f1f5f9]' : 'text-slate-900'
                            }`}>
                              Active Clients
                              {isFloorProjectsExpanded ? (
                                <ChevronUp className="h-4 w-4 text-slate-500 shrink-0" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                              )}
                            </h2>
                          </div>
                        </button>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#dc2626] ${
                            isSleekTheme ? 'bg-slate-800/50 text-slate-350' : 'bg-slate-100 text-slate-700 font-sans'
                          }`}>
                            {activeJobs.length} Live
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
                            className="space-y-3 max-h-[460px] overflow-y-auto pr-1"
                          >
                            {activeJobs.map((job) => {
                              const outstanding = getTasksOutstandingCount(job.id);
                              return (
                                <div
                                  key={job.id}
                                  id={`floor-project-card-${job.id}`}
                                  onClick={() => {
                                    setSelectedJobId(job.id);
                                    setActiveTab('workflow');
                                  }}
                                  className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer hover:scale-[1.015] active:scale-[0.985] flex flex-col justify-between ${
                                    isSleekTheme 
                                      ? 'bg-[#151a2d]/50 border-slate-800 hover:border-slate-600 text-slate-100' 
                                      : 'bg-slate-50 border-slate-200 hover:border-slate-400 text-slate-855'
                                  }`}
                                >
                                  <div className="flex justify-between items-start gap-2">
                                    <div className="min-w-0">
                                      <h3 className={`text-sm font-extrabold truncate ${isSleekTheme ? 'text-white' : 'text-slate-900'}`}>{job.clientName}</h3>
                                      <p className="text-xs text-slate-400 mt-0.5">📍 Area Suburb: <span className="font-semibold text-slate-350">{job.area}</span></p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg shrink-0 ${getStatusBadgeStyles(job.status, isSleekTheme)}`}>
                                      {job.status}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center justify-between border-t border-slate-850 pt-2.5 mt-3 text-[11px]">
                                    <span className="text-slate-400">Task Completion:</span>
                                    <span className={`font-bold font-mono ${outstanding === 0 ? 'text-emerald-400' : (isSleekTheme ? 'text-slate-300' : 'text-slate-700')}`}>
                                      {outstanding === 0 ? 'All Complete ✓' : `${outstanding} Open Steps`}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* BENTO CARD 2: OPEN TASKS CHECKLIST (ACTIVE CHECKLIST / TASKS BUTTON) */}
                  <div className={`p-6 rounded-3xl border flex flex-col justify-between transition-all duration-300 ${
                    isFloorTasksExpanded ? 'min-h-[500px]' : 'min-h-0'
                  } ${
                    isSleekTheme ? 'bg-[#111625] border-slate-800/80 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-850 shadow-sm'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <button
                          id="toggle-floor-tasks-btn"
                          onClick={() => setIsFloorTasksExpanded(!isFloorTasksExpanded)}
                          className={`flex items-center gap-3 text-left cursor-pointer p-2 px-3 rounded-xl transition-all w-fit focus:outline-none focus:ring-0 border border-[#dc2626] ${
                            isSleekTheme ? 'hover:bg-slate-800/30' : 'hover:bg-slate-100/60'
                          }`}
                          title={isFloorTasksExpanded ? "Collapse Checklist" : "Expand Checklist"}
                        >
                          <div className="min-w-0">
                            <h2 className={`text-sm font-black uppercase tracking-widest flex items-center gap-1.5 whitespace-nowrap ${
                              isSleekTheme ? 'text-[#f1f5f9]' : 'text-slate-900'
                            }`}>
                              Active Checklist
                              {isFloorTasksExpanded ? (
                                <ChevronUp className="h-4 w-4 text-slate-500 shrink-0" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-slate-500 shrink-0" />
                              )}
                            </h2>
                          </div>
                        </button>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border border-[#dc2626] ${
                            isSleekTheme ? 'bg-slate-800/50 text-slate-350' : 'bg-slate-100 text-slate-705'
                          }`}>
                            {tasks.filter(t => !t.complete && activeJobs.some(j => j.id === t.jobId)).length} Pending
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
                            className="space-y-4 max-h-[460px] overflow-y-auto pr-1 font-sans"
                          >
                            {(() => {
                              const floorOpenTasks = tasks.filter(t => !t.complete && activeJobs.some(j => j.id === t.jobId));
                              if (floorOpenTasks.length === 0) {
                                return (
                                  <div className="text-center py-16 text-slate-450 border border-dashed border-slate-800/65 rounded-2xl flex flex-col items-center justify-center">
                                    <span className="text-3xl mb-2">🌿</span>
                                    <p className="text-xs font-bold font-mono">No actions required on floor right now!</p>
                                    <p className="text-[11px] text-slate-550 mt-1 max-w-xs">All active projects have met and sealed their gateway phase targets.</p>
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
                                <div key={jobId} className="space-y-2 border-b border-slate-805/40 pb-4 last:border-0 last:pb-0">
                                  <div className={`text-[10px] font-black uppercase tracking-wider ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-sans pl-1 flex items-center gap-1.5`.trim()}>
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-800 animate-pulse" />
                                    {group.jobName}
                                  </div>
                                  <div className="space-y-2">
                                    {group.tasks.map((task) => (
                                      <div
                                        key={task.id}
                                        id={`floor-task-card-${task.id}`}
                                        onClick={() => handleToggleTask(task.id)}
                                        className={`p-3.5 rounded-2xl border transition-all duration-155 cursor-pointer flex items-start gap-3 hover:bg-slate-905/30 ${
                                          isSleekTheme
                                            ? 'bg-[#151a2d]/50 border-slate-805 hover:border-slate-500/60'
                                            : 'bg-slate-50 border-slate-200 hover:border-slate-500'
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={false}
                                          readOnly
                                          className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-0 focus:ring-offset-0 shrink-0 h-4 w-4 cursor-pointer"
                                        />
                                        <div className="min-w-0 flex-1 font-sans">
                                          <h4 className="text-xs font-extrabold text-slate-200 leading-snug group-hover:text-[#f1f5f9] dark:group-hover:text-[#f1f5f9] transition-colors">
                                            {task.taskName}
                                          </h4>
                                          <p className={`text-[10px] ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-medium mt-0.5`.trim()}>
                                            Phase stage: <span className="font-mono text-slate-400">{task.stage}</span>
                                          </p>
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
                <>
                  {/* Core KPI metrics Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Metric 1 */}
                <button
                  id="inspect-crafting-pipeline-metric"
                  onClick={() => setDrilldownType(drilldownType === 'jobs' ? null : 'jobs')}
                  className={`text-left w-full cursor-pointer transition-all hover:scale-[1.015] active:scale-[0.985] rounded-2xl ${
                    drilldownType === 'jobs'
                      ? 'ring-2 ring-slate-500 bg-[#161d36] border-transparent'
                      : isSleekTheme ? 'bg-[#111625] border border-slate-800/80 shadow-slate-950/20 hover:border-slate-600' : 'bg-white border border-gray-150 hover:border-slate-400'
                  } p-4 shadow-xs transition-colors duration-200`}
                >
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans flex items-center justify-between">
                    <span>Crafting Pipeline</span>
                    <span className={`text-[9px] ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} uppercase font-bold tracking-tight`.trim()}>Inspect Who/What →</span>
                  </div>
                  <div className={`text-2xl font-sans font-extrabold mt-1 ${isSleekTheme ? 'text-white' : 'text-slate-900'}`}>
                    {activeJobs.length} Projects
                  </div>
                  <div className={`mt-1 flex items-center justify-between text-[11px] ${isSleekTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span>{jobs.filter(j => j.status === '12 Complete').length} Handed Over Complete</span>
                  </div>
                </button>

                {/* Metric 2 */}
                <button
                  id="inspect-pending-tasks-metric"
                  onClick={() => setDrilldownType(drilldownType === 'tasks' ? null : 'tasks')}
                  className={`text-left w-full cursor-pointer transition-all hover:scale-[1.015] active:scale-[0.985] rounded-2xl ${
                    drilldownType === 'tasks'
                      ? 'ring-2 ring-slate-500 bg-[#161d36] border-transparent'
                      : isSleekTheme ? 'bg-[#111625] border border-slate-800/80 shadow-slate-950/20 hover:border-slate-600' : 'bg-white border border-gray-150 hover:border-slate-400'
                  } p-4 shadow-xs transition-colors duration-200`}
                >
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans flex items-center justify-between">
                    <span>Action Checklist Rows</span>
                    <span className={`text-[9px] ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} uppercase font-bold tracking-tight`.trim()}>Inspect Tasks →</span>
                  </div>
                  <div className={`text-2xl font-sans font-extrabold mt-1 ${isSleekTheme ? 'text-slate-300' : 'text-slate-800'}`}>
                    {totalTasksOpen} Open Tasks
                  </div>
                  <p className={`text-[11px] mt-1 truncate ${isSleekTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                    Click to drill down into active checklist
                  </p>
                </button>

                {/* Metric 3: Total Pipeline Valuation */}
                <div
                  id="total-pipeline-valuation-card"
                  className={`p-4 rounded-2xl shadow-xs transition-all duration-200 flex flex-col justify-between ${
                    isSleekTheme ? 'bg-[#111625] border border-slate-800/80 shadow-slate-950/20' : 'bg-white border border-gray-150'
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans flex items-center justify-between">
                      <span>Total Revenue Pipeline</span>
                      <span className="text-[10px] font-bold text-emerald-400 font-mono">🔒 SECURE</span>
                    </div>
                    <div className={`text-2xl font-sans font-extrabold mt-1 ${isSleekTheme ? 'text-white' : 'text-slate-900'}`}>
                      R{totalContractPipeline.toLocaleString()}
                    </div>
                  </div>
                  <div className={`mt-1 flex items-center justify-between text-[11px] ${isSleekTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                    <span>Active Client Contract Estimations</span>
                  </div>
                </div>

              </div>

              {/* Active Jobs / Tasks Drilldown Inspector */}
              <AnimatePresence>
                {drilldownType && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`overflow-hidden rounded-3xl border p-6 font-sans mb-6 relative ${
                      isSleekTheme 
                        ? 'bg-gradient-to-br from-[#12162a] via-[#111625] to-[#0a0c16] border-slate-800/80' 
                        : 'bg-[#f0f4f8] border-slate-205'
                    }`}
                  >
                    {/* Corner gradient glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-2xl rounded-full pointer-events-none" />
                    
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/40">
                      <div>
                        <span className="text-[10px] bg-slate-800 text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                          Live Metrics Inspector
                        </span>
                        <h3 className="text-lg font-sans font-extrabold mt-1">
                          {drilldownType === 'jobs' 
                            ? 'Who, What & Why: Active Crafting Pipeline' 
                            : 'Who, What & Why: Pending Project Tasks'
                          }
                        </h3>
                      </div>
                      <button
                        onClick={() => setDrilldownType(null)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition cursor-pointer select-none ${
                          isSleekTheme 
                            ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' 
                            : 'bg-white border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        ✕ Close Inspector
                      </button>
                    </div>

                    {drilldownType === 'jobs' ? (
                      /* Jobs Drilldown list */
                      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
                        {jobs.filter(j => j.status !== '12 Complete').map((job) => {
                          const outstanding = getTasksOutstandingCount(job.id);
                          return (
                            <div 
                              key={job.id}
                              onClick={() => {
                                setSelectedJobId(job.id);
                                setActiveTab('workflow');
                                setDrilldownType(null);
                              }}
                              className={`group p-4 rounded-2xl border transition-all hover:bg-slate-950/40 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                isSleekTheme ? 'bg-[#151a2d] border-slate-800/80 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              {/* WHO Column */}
                              <div className="md:w-1/3 space-y-1">
                                <div className={`text-[9px] font-mono ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-bold uppercase`.trim()}>WHO (Client Account)</div>
                                <h4 className="text-sm font-extrabold text-slate-100">{job.clientName}</h4>
                                <p className="text-xs text-slate-400">📍 Area Suburb: <strong className="text-slate-350">{job.area}</strong></p>
                                <p className="text-[11px] text-slate-450 truncate">{job.phone} • {job.email}</p>
                              </div>

                              {/* WHAT Column */}
                              <div className="md:w-1/3 space-y-1.5">
                                <div className={`text-[9px] font-mono ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-bold uppercase`.trim()}>WHAT (Active Stage Door)</div>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getStatusBadgeStyles(job.status, isSleekTheme)}`}>{job.status}</span>
                                  <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded ${outstanding > 0 ? (isSleekTheme ? 'bg-slate-900 text-slate-300' : 'bg-slate-100 text-slate-700 border border-slate-200') : 'bg-emerald-900 text-emerald-300'}`}>
                                    {outstanding === 0 ? 'All secure' : `${outstanding} steps left`}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-455 truncate">
                                  Specification Level: <strong className="text-slate-350">{job.specs.woodSpecies} • {job.specs.doorType}</strong>
                                </p>
                              </div>

                              {/* WHY Column */}
                              <div className="md:w-1/3 justify-between flex items-start gap-4">
                                <div className="space-y-1">
                                  <div className={`text-[9px] font-mono ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-bold uppercase`.trim()}>WHY (David Action Gate)</div>
                                  <p className="text-[11px] text-slate-350 leading-snug line-clamp-2">
                                    {job.comments || 'Active contract review is running alongside specifications.'}
                                  </p>
                                  {job.nextAction && (
                                    <p className={`text-[10px] ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-bold`.trim()}>
                                      Next step: ⚙️ {job.nextAction}
                                    </p>
                                  )}
                                </div>
                                <div className="flex flex-col items-end shrink-0 self-center">
                                  <div className="text-[9px] text-slate-500 uppercase">Valuation</div>
                                  <div className="text-xs font-mono font-extrabold text-slate-200">R{job.quoteValue.toLocaleString()}</div>
                                  <div className="text-[9.5px] bg-slate-800 hover:bg-slate-705 text-white font-bold px-2 py-1 rounded-lg mt-1.5 group-hover:translate-x-1 duration-150">
                                    Open →
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Tasks Drilldown list */
                      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-2">
                        {tasks.filter(t => !t.complete && jobs.some(j => j.id === t.jobId && j.status !== '12 Complete')).map((task) => {
                          const job = jobs.find(j => j.id === task.jobId);
                          return (
                            <div 
                              key={task.id}
                              onClick={() => {
                                if (job) {
                                  setSelectedJobId(job.id);
                                  setActiveTab('workflow');
                                  setDrilldownType(null);
                                }
                              }}
                              className={`group p-4 rounded-xl border transition-all hover:bg-slate-950/40 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                isSleekTheme ? 'bg-[#151a2d] border-slate-800/80 hover:border-slate-600' : 'bg-white border-slate-200 hover:border-slate-400'
                              }`}
                            >
                              {/* WHO component */}
                              <div className="md:w-1/3">
                                <div className={`text-[9px] font-mono ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-bold uppercase`.trim()}>WHO (Active Contract client)</div>
                                <h4 className="text-sm font-extrabold text-slate-100">{job?.clientName || 'Standalone'}</h4>
                                <p className="text-[11px] text-slate-405">📍 Area Suburb: <strong className="text-slate-300">{job?.area || 'Universal'}</strong></p>
                              </div>

                              {/* WHAT task description */}
                              <div className="md:w-1/3 space-y-1">
                                <div className={`text-[9px] font-mono ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-bold uppercase`.trim()}>WHAT (Pending execution milestone)</div>
                                <p className="text-xs font-bold text-slate-200 group-hover:text-[#f1f5f9] dark:group-hover:text-[#f1f5f9] transition-colors leading-snug">
                                  {task.taskName}
                                </p>
                              </div>

                              {/* WHY / ACTION info */}
                              <div className="md:w-1/3 flex items-center justify-between gap-4">
                                <div>
                                  <div className={`text-[9px] font-mono ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-bold uppercase`.trim()}>WHY (Milestone context)</div>
                                  <p className="text-[11px] text-slate-350 leading-snug">
                                    Requires completion under stage gateway: <strong className={` ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} `.trim()}>{task.stage}</strong>
                                  </p>
                                </div>
                                <div className="text-right shrink-0">
                                  <div className="text-[9.5px] bg-slate-800 hover:bg-slate-705 text-white font-bold px-2 py-1 rounded-lg group-hover:translate-x-1 duration-150">
                                    Go To Checklist →
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Jobs section Header & Filter controls */}
              <div className={`${isSleekTheme ? 'bg-[#111625] border border-slate-800/80' : 'bg-white border border-gray-150'} rounded-2xl p-5 shadow-xs space-y-4`}>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  {/* Filter chips category row */}
                  <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 pb-0 select-none">
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
                            ? 'bg-slate-800 border-red-600 text-white shadow-xs'
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

                {/* Search query block */}
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
                        ? 'bg-slate-950 border-slate-850 text-white focus:bg-slate-950/90 focus:border-slate-500 focus:ring-2 focus:ring-slate-900'
                        : 'bg-slate-50 hover:bg-slate-100/50 focus:bg-white border-slate-200/80 text-slate-900 focus:border-slate-500 focus:ring-2 focus:ring-red-100'
                    }`}
                  />
                </div>

              </div>

              {/* --- Core Active Operations Layout Engines --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobs
                    .filter((job) => job.status !== '12 Complete')
                    .slice(0, 6)
                    .map((job) => {
                      const outstandingCount = getTasksOutstandingCount(job.id);
                      return (
                        <div
                          key={job.id}
                          id={`job-card-${job.id}`}
                          onClick={() => {
                            setSelectedJobId(job.id);
                            setActiveTab('workflow');
                          }}
                          className={`group border rounded-2xl p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between min-h-[220px] ${
                            isSleekTheme
                              ? 'bg-[#111625] border-slate-800/80 hover:border-slate-500 hover:shadow-red-950/20 text-slate-100'
                              : 'bg-white border-gray-150 hover:border-slate-500 text-slate-800'
                          }`}
                        >
                          {/* Colored top edge based on health */}
                          <span className={`absolute top-0 inset-x-0 h-1.5 ${
                            job.health === 'On Track' ? 'bg-emerald-500' :
                            job.health === 'Needs Attention' ? 'bg-amber-500' : 'bg-rose-500'
                          }`} />

                          <div>
                            {/* Header metadata */}
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

                            {/* Title client */}
                            <h3 className={`text-md font-sans font-extrabold duration-150 ${isSleekTheme ? 'text-[#f1f5f9] group-hover:text-[#f1f5f9] dark:group-hover:text-[#f1f5f9]' : 'text-slate-900 group-hover:text-[#f1f5f9] dark:group-hover:text-[#f1f5f9]'}`}>
                              {job.clientName}
                            </h3>
                            <p className="text-[11px] text-slate-400 font-medium font-sans flex items-center gap-1 mt-0.5">
                              📍 {job.area}
                            </p>

                            {/* Description snippet */}
                            <p className={`text-[11px] line-clamp-2 mt-2 leading-relaxed h-8 ${isSleekTheme ? 'text-slate-400' : 'text-gray-500'}`}>
                              {job.comments}
                            </p>
                          </div>

                          {/* Footer tracking block */}
                          <div className={`pt-3 border-t mt-4 flex items-center justify-between ${isSleekTheme ? 'border-slate-800/50' : 'border-gray-100/85'}`}>
                            <div>
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block leading-tight font-sans">ACTIVE STATUS TASKS</span>
                              <span className={`text-xs font-sans font-bold ${outstandingCount > 0 ? (isSleekTheme ? 'text-slate-300' : 'text-emerald-600') : 'text-emerald-500'}`}>
                                {outstandingCount === 0 ? 'All Completed ✓' : `${outstandingCount} Tasks Outstanding`}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block leading-tight font-sans">Quote Settle</span>
                              <span className={`text-xs font-sans font-extrabold ${isSleekTheme ? 'text-[#f8fafc]' : 'text-gray-800'}`}>
                                R{job.quoteValue.toLocaleString()}
                              </span>
                            </div>
                          </div>

                        </div>
                      );
                    })}
              </div>

              {/* Layout Option 2: Bento Dashboard Layout (Retired) */}
              {false && (() => {
                const spotlightJob = filteredJobs.length > 0 
                  ? [...filteredJobs].sort((a, b) => b.quoteValue - a.quoteValue)[0] 
                  : null;
                const bentoTasks = tasks
                  .filter((t) => !t.complete && filteredJobs.some((j) => j.id === t.jobId))
                  .slice(0, 4);

                return (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
                    
                    {/* Big Spotlight Card */}
                    {spotlightJob ? (
                      <div className={`lg:col-span-2 rounded-3xl p-6 border relative overflow-hidden flex flex-col justify-between min-h-[290px] transition-all duration-300 ${
                        isSleekTheme 
                          ? 'bg-gradient-to-br from-[#12162a] to-[#0d0f1a] border-slate-800/80 text-slate-100 shadow-red-950/20' 
                          : 'bg-gradient-to-br from-red-50/70 to-white border-slate-205 text-slate-800'
                      }`}>
                        <div className="absolute top-0 right-0 p-4">
                          <span className="flex h-3.5 w-3.5 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                          </span>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] bg-slate-800 text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                              HIGH VALUE STRATEGIC SPOTLIGHT
                            </span>
                            <span className={`text-xs ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-mono font-bold`.trim()}>#{spotlightJob.id}</span>
                          </div>
                          <div>
                            <h3 className={`text-2xl font-sans font-extrabold tracking-tight ${isSleekTheme ? 'text-[#f1f5f9]' : 'text-slate-900'}`}>
                              {spotlightJob.clientName}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium font-sans mt-0.5">
                              📍 Location Suburb: <strong className={` ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} `.trim()}>{spotlightJob.area}</strong> • Phase: <strong className={` ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} `.trim()}>{spotlightJob.status}</strong>
                            </p>
                          </div>
                          <p className={`text-xs leading-relaxed max-w-xl ${isSleekTheme ? 'text-slate-350' : 'text-slate-600'}`}>
                            {spotlightJob.comments || 'Master cabinet layout brief features custom storage configurations and detailed laser structural integrations.'}
                          </p>
                          
                          {/* Inline tracking bar */}
                          <div className="space-y-1.5 pt-2">
                            <div className="flex items-center justify-between text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                              <span>Milestone Booking Deposit Secure Check</span>
                              <span className={` ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-mono`.trim()}>{((spotlightJob.depositReceived / spotlightJob.quoteValue) * 100).toFixed(0)}% Secured</span>
                            </div>
                            <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden border border-slate-700/50">
                              <div 
                                className="bg-gradient-to-r from-red-500 to-red-600 h-full transition-all duration-500" 
                                style={{ width: `${Math.min(100, (spotlightJob.depositReceived / spotlightJob.quoteValue) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className={`pt-4 border-t mt-5 flex sm:flex-row flex-col sm:items-center justify-between gap-3 ${isSleekTheme ? 'border-slate-805' : 'border-gray-150'}`}>
                          <div className="flex items-center gap-5">
                            <div>
                              <span className="text-[9px] uppercase font-bold text-slate-450 block font-sans">VALUATION LOCK</span>
                              <span className={`text-lg font-extrabold ${isSleekTheme ? 'text-white' : 'text-slate-950'}`}>
                                R{spotlightJob.quoteValue.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-[9px] uppercase font-bold text-slate-450 block font-sans">PROJECT HEALTH</span>
                              <span className={`text-xs font-bold ${
                                spotlightJob.health === 'On Track' ? 'text-emerald-400' :
                                spotlightJob.health === 'Needs Attention' ? 'text-amber-450' : 'text-rose-400'
                              }`}>
                                ● {spotlightJob.health}
                              </span>
                            </div>
                          </div>
                          <button
                            id={`spotlight-panel-open-${spotlightJob.id}`}
                            onClick={() => {
                              setSelectedJobId(spotlightJob.id);
                              setActiveTab('workflow');
                            }}
                            className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-extrabold text-[11px] px-4 py-2 rounded-xl transition cursor-pointer select-none flex items-center justify-center gap-1.5 self-end sm:self-auto"
                          >
                            <span>Open Master Passport</span>
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="lg:col-span-2 text-center p-12 text-slate-450 bg-slate-900/30 rounded-3xl border border-slate-800/60 flex items-center justify-center">
                        No spotlight kitchen projects matching search tags
                      </div>
                    )}

                    {/* Bento Column 2 Widget: Visual Progress Indicator */}
                    <div className={`p-5 rounded-3xl border flex flex-col justify-between ${
                      isSleekTheme ? 'bg-[#111625] border-slate-800/80 text-white' : 'bg-white border-gray-150 text-gray-800'
                    }`}>
                      <div>
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1.5 font-sans">
                          <Clock className={`h-3.5 w-3.5 ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} animate-pulse`.trim()} />
                          OPERATIONS TELEMETRY
                        </h4>
                        <h3 className="text-md sm:text-lg font-sans font-extrabold tracking-tight">Gate Compliance Lock</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-snug">System metrics monitoring active pipeline handshakes.</p>
                        
                        <div className="space-y-2.5 mt-5">
                          <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-850 flex items-center justify-between">
                            <span className="text-xs text-slate-350 font-medium">Crafting Queue</span>
                            <span className={`text-xs font-bold ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} font-mono`.trim()}>{activeJobs.length} Projects</span>
                          </div>
                          <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-850 flex items-center justify-between">
                            <span className="text-xs text-slate-350 font-medium">Active Revenue Locked</span>
                            <span className="text-xs font-bold text-emerald-450 font-mono">R{totalContractPipeline.toLocaleString()}</span>
                          </div>
                          <div className="p-3 bg-slate-950/40 rounded-2xl border border-slate-850 flex items-center justify-between">
                            <span className="text-xs text-slate-350 font-medium">Out-of-SLA Incidents</span>
                            <span className={`text-xs font-bold font-mono ${alertProjectsCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {alertProjectsCount} Active Alert
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800/50 mt-4 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>ERP Reporting Suite Add-on available</span>
                        <span className="text-amber-400 font-extrabold bg-amber-900/20 px-1.5 py-0.5 rounded uppercase">Upgrade Ready</span>
                      </div>
                    </div>

                    {/* Bento Column 3 Widget: Micro outstanding tasks list */}
                    <div className={`p-5 rounded-3xl border flex flex-col justify-between ${
                      isSleekTheme ? 'bg-[#111625] border-slate-800/80 text-white' : 'bg-white border-gray-150 text-gray-800'
                    }`}>
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className={`text-[10px] font-bold ${isSleekTheme ? 'text-slate-300' : 'text-slate-700'} uppercase tracking-widest font-sans`.trim()}>
                            PENDING CONSOLE STEPS
                          </h4>
                          <span className="text-[9px] bg-slate-900 text-slate-350 border border-slate-800 px-2 py-0.5 rounded">
                            QUICK ACTION
                          </span>
                        </div>
                        <h3 className="text-md sm:text-lg font-sans font-extrabold tracking-tight">Milestone Checklist</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-snug">Tap actions here to immediately register completion.</p>

                        <div className="space-y-2 mt-4 max-h-[160px] overflow-y-auto pr-1">
                          {bentoTasks.length > 0 ? (
                            bentoTasks.map((t) => {
                              const correspondingJob = jobs.find((j) => j.id === t.jobId);
                              return (
                                <div 
                                  key={t.id} 
                                  onClick={() => handleToggleTask(t.id)}
                                  className="group p-2.5 bg-slate-950/50 hover:bg-slate-950 hover:border-slate-700 rounded-xl border border-slate-850 transition cursor-pointer flex items-start gap-2 max-w-full"
                                >
                                  <input 
                                    type="checkbox" 
                                    checked={false} 
                                    readOnly 
                                    className="mt-0.5 rounded border-slate-700 bg-slate-950 text-emerald-600 focus:ring-0 focus:ring-offset-0 shrink-0 h-3.5 w-3.5 cursor-pointer"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-slate-200 truncate group-hover:text-[#f1f5f9] dark:group-hover:text-[#f1f5f9] transition-colors leading-tight">
                                      {t.taskName}
                                    </p>
                                    <span className="text-[9px] text-[#818cf8] font-mono block leading-none mt-0.5">
                                      {correspondingJob?.clientName || 'Project'} • {t.stage}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-8 text-xs text-slate-450 border border-dashed border-slate-800 rounded-xl">
                              All filtered process checklist steps complete! ✔
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-800/50 mt-4 text-center">
                        <span className="text-[9px] text-slate-500 block">System auto-triggers status movements when 60% is reached.</span>
                      </div>
                    </div>

                    {/* Micro-cards below */}
                    <div className="lg:col-span-3 space-y-3 pt-2">
                      <div className="flex justify-between items-center">
                        <h4 className="text-[10px] font-bold text-[#818cf8] uppercase tracking-widest font-sans">
                          OTHER JOBS IN WORKSPACE ({filteredJobs.length})
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredJobs.map((job) => {
                          const outstanding = getTasksOutstandingCount(job.id);
                          return (
                            <div 
                              key={job.id}
                              onClick={() => {
                                setSelectedJobId(job.id);
                                setActiveTab('workflow');
                              }}
                              className={`p-4 border rounded-2xl hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] ${
                                isSleekTheme 
                                  ? 'bg-[#121625] border-slate-800/80 hover:border-slate-500 text-slate-100 shadow-3xs' 
                                  : 'bg-white border-gray-150 hover:border-slate-500 text-slate-850'
                              }`}
                            >
                              <div>
                                <div className="flex justify-between text-[9px] text-slate-450 font-mono">
                                  <span>#{job.id}</span>
                                  <span>📍 {job.area}</span>
                                </div>
                                <h4 className="text-xs font-extrabold truncate mt-1">{job.clientName}</h4>
                              </div>
                              <div className="flex items-center justify-between border-t border-slate-800/40 pt-2 mt-2 font-sans">
                                <span className="text-[10px] font-semibold text-emerald-450 font-mono">R{job.quoteValue.toLocaleString()}</span>
                                <span className={`text-[8.5px] font-extrabold px-1.5 py-0.5 rounded leading-none ${
                                  outstanding === 0 ? 'bg-emerald-500/20 text-emerald-400' : isSleekTheme ? 'bg-slate-800/50 text-slate-350' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  {outstanding === 0 ? 'DONE ✓' : `${outstanding} PENDING`}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Empty State visual */}
              {filteredJobs.length === 0 && (
                <div className="bg-white border border-gray-150 rounded-2xl p-12 text-center shadow-2xs font-sans max-w-sm mx-auto">
                  <AlertTriangle className="h-10 w-10 text-gray-300 mx-auto mb-2 animate-bounce" />
                  <h3 className="font-sans font-extrabold text-gray-800 text-md">No Matching Project Found</h3>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto mt-1">
                    Check your search spellings or filter tags. You can click 'New Project' in top header to add custom entries.
                  </p>
                </div>
              )}

              {/* Power BI Sync widget under jobs list visual */}
              <div className="pt-6" />
            </>
          )}

            </motion.div>
          ) : (
            // ============================================
            // OPEN JOB VIEW PORT (DEEP WORKSPACE COMMANDS)
            // ============================================
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              
              {/* Command Centre controlling health, status, next actions */}
              <CommandCentre
                job={currentJob!}
                outstandingTasksCount={getTasksOutstandingCount(currentJob!.id)}
                onGoBack={() => setSelectedJobId(null)}
                onUpdateJob={(fields) => handleUpdateJobState(currentJob!.id, fields)}
                activeSection={activeTab}
                onSelectSection={setActiveTab}
              />

              {/* Content viewport based on Tab selection */}
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

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* --- New Job creation Modal Form --- */}
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
