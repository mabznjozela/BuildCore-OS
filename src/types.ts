export type ProjectHealth = 'On Track' | 'Needs Attention' | 'At Risk';

export type JobStatus =
  | '1 First Contact'
  | '2 Qualifying Lead'
  | '3 Site Visit Scheduled'
  | '4 Site Visit Done'
  | '5 Design Phase'
  | '6 Quote Sent'
  | '7 Awaiting Deposit'
  | '8 Deposit Paid'
  | '9 Production'
  | '10 Installation Scheduled'
  | '11 Installation In Progress'
  | '12 Complete';

export interface KitchenSpecs {
  boardType: string;
  boardSupplier: string;
  doorType: string;
  doorSupplier: string;
  softClose: boolean;
  ledLighting: boolean;
  pushToOpen: boolean;
  glassDoors: boolean;
  stoneSupplier: string;
  stoneColour: string;
  stoneThickness: string; // e.g. "20mm", "30mm"
  oven: string;
  hob: string;
  extractor: string;
  fridge: string;
}

export interface Job {
  id: string; // Job ID e.g. KL001
  clientName: string;
  phone: string;
  email: string;
  address: string;
  area: string;
  leadSource: string;
  status: JobStatus;
  nextAction: string;
  health: ProjectHealth;
  statusSince: string; // ISO date string
  createdAt?: string; // ISO date string when job was created
  installationDate?: string; // ISO date or simple string
  quoteValue: number;
  depositReceived: number;
  comments?: string;
  siteNotes?: string;
  specs: KitchenSpecs;
}

export interface Task {
  id: string; // Task ID e.g. T001
  jobId: string;
  stage: string; // e.g. "Design", "Production", "Installation"
  taskName: string;
  complete: boolean;
}

export interface FinancialRecord {
  id: string;
  jobId: string;
  type: 'expense' | 'payment';
  amount: number;
  date: string;
  description: string;
  category: string; // e.g. "Materials", "Hardware", "Laminates", "Factory Deposit", "60% Deposit Paid"
}

export interface VaultFile {
  id: string;
  jobId: string;
  type: 'photo' | 'render' | 'document';
  name: string;
  url: string; // mock image or document file
  uploadedAt: string;
}

export interface JobNote {
  id: string;
  jobId: string;
  author: string; // e.g. "David", "Installer Mark"
  content: string;
  createdAt: string;
}
