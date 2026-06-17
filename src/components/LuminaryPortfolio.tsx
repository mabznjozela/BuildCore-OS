import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, 
  Settings, 
  TrendingUp, 
  HeartHandshake, 
  HelpCircle, 
  Search, 
  CheckCircle, 
  X, 
  Sparkles, 
  ArrowRight, 
  Sliders, 
  Clock, 
  Bell, 
  FileText, 
  UserCheck, 
  ShieldAlert, 
  Copy, 
  Dribbble, 
  Compass, 
  Layout, 
  Layers, 
  Plus, 
  AlertTriangle,
  Database,
  Trash2,
  BookOpen,
  Smartphone,
  WifiOff
} from 'lucide-react';
// Demo seeder removed for production build


interface NicheDetail {
  id: string;
  name: string;
  icon: any;
  tagline: string;
  pains: string[];
  competitors: string[];
  operationalPattern: {
    lead: string;
    process: string;
    delivery: string;
    reporting: string;
  };
  sampleSolution: string;
  quoteTemplate: string;
}

interface LuminaryPortfolioProps {
  onSeedDemoData?: (jobs: any[], tasks: any[], financials: any[], files: any[], notes: any[]) => void;
  onResetCleanState?: () => void;
  currentJobsCount?: number;
}

export default function LuminaryPortfolio({ onSeedDemoData, onResetCleanState, currentJobsCount = 0 }: LuminaryPortfolioProps) {
  const [activeNiche, setActiveNiche] = useState<string>('manufacturing');
  const [activePackage, setActivePackage] = useState<number>(1);
  const [customClientName, setCustomClientName] = useState<string>('');
  const [customNiche, setCustomNiche] = useState<string>('manufacturing');
  const [includedAddons, setIncludedAddons] = useState<string[]>(['bos']);
  const [copiedProposal, setCopiedProposal] = useState<boolean>(false);
  const [setupDiscount, setSetupDiscount] = useState<number>(0);
  const [monthlyDiscount, setMonthlyDiscount] = useState<number>(0);
  const [dbFeedback, setDbFeedback] = useState<'demo' | 'clean' | null>(null);

  // South African Rand Formatting helper
  const formatRand = (num: number) => {
    return `R${num.toLocaleString('en-ZA')}`;
  };

  const niches: NicheDetail[] = [
    {
      id: 'manufacturing',
      name: 'Custom Manufacturing & Joinery',
      icon: Layers,
      tagline: 'Precision order flows for premium physical craftsmanship',
      pains: [
        'Lost job details sliding between chat histories',
        'Staff using outdated dimension sheets on the factory floor',
        'No cash flow visibility while material deposits are locked',
        'Foremen operating off memory instead of live milestones',
        'Working weekends to rebuild wrong board cuts'
      ],
      competitors: [
        'Six static Excel spreadsheets updated "whenever"',
        'Three separate WhatsApp groups with client flood',
        'Handwritten paper cut lists scattered on main benches',
        'The foreman David’s memory'
      ],
      operationalPattern: {
        lead: 'Quote Request & Site Measurement (Gateway 1-4)',
        process: 'Production Phase, Hardware Sizing & Component Prep (Gateway 5-8)',
        delivery: 'On-Site Spray, Quality Assurance & Board Assembly (Gateway 9-11)',
        reporting: 'Handover & Audit Verification of Material Costing (Gateway 12)'
      },
      sampleSolution: 'A localized Board-Cut & Project Stage OS tracking specific board textures, edge bands, and active hardware specs from entry to delivery, with quick-check status alerts.',
      quoteTemplate: 'Hey [Client Name],\n\nWe love what you guys do. Instead of trying to force you into messy, expensive enterprise ERP software, we want to set up an elegant, custom-mapped Business Operating System tailored for your joinery floor.\n\nIn our initial process mapping, we noticed your team is managing details over multiple spreadsheets and memory. This leads to lost jobs and painful weekend stress.\n\nWe will build a simple, offline-first dashboard for your company, connect your workshop staff, automate your client notifications, and track your active cash flow. Let me know if we can do a 15-minute review next week!'
    },
    {
      id: 'medical',
      name: 'Medical & Wellness Practices',
      icon: Compass,
      tagline: 'Frictionless patient journeys with tight compliance gates',
      pains: [
        'Missed consultation appointments stalling daily clinic velocity',
        'Stitching patient intake sheets and consent forms manually',
        'Zero tracking on referrals and patient progression feedback',
        'Staff burning hours calling patient reminders manually',
        'Strict POPIA privacy boundaries and storage liability'
      ],
      competitors: [
        'Paper contact sheets filled in on clipboards in front rooms',
        'SMS reminders sent manually from a shared practice phone',
        'Google Sheets storing medical identifiers with poor security access',
        'The receptionist\'s memory of regular clients'
      ],
      operationalPattern: {
        lead: 'Online Patient Booking & Automated Consent Form Intake',
        process: 'Clinical Consultation, Treatment Plan Allocation & Session Tracking',
        delivery: 'Follow-Up Checklists, Care Feedback Survey & Automated Recall Gates',
        reporting: 'Practice Utilization Dashboards & Medical Aid Invoicing Sync'
      },
      sampleSolution: 'A secure, POPIA-compliant Practice OS featuring digital consent captures, automated WhatsApp reminder sequences, treatment plan checklist workflows, and a sleek clinic performance layout.',
      quoteTemplate: 'Hey [Client Name],\n\nRunning a physical health practice shouldn\'t mean wasting half your day stitching booking forms and chasing manual SMS reminders.\n\nWe specialize in setting up secure, POPIA-compliant Practice Operating Systems that handle patient booking, digital consent forms, and automated reminders automatically—without forcing you to license complex, corporate medical portals.\n\nLet’s chat about reclaiming 8 hours of administrative headspace a week!'
    },
    {
      id: 'professional',
      name: 'Professional Services Firms',
      icon: Briefcase,
      tagline: 'Structured delivery systems for knowledge experts',
      pains: [
        'Missing deadlocked client compliance deadlines',
        'Recruitment / audits stalling inside email threads',
        'No clear visibility on partner hours vs invoice retainer limits',
        'Incompetent document flows causing duplicate admin requests',
        'Partners feeling forced to manage routine check-ins on weekends'
      ],
      competitors: [
        'Color-coded desktop sticky notes and calendar blocks',
        'Endless internal team emails checking "is this client audit complete?"',
        'Google Sheets holding hundreds of unsorted legal task rows',
        'The primary partner’s personal checklist memory'
      ],
      operationalPattern: {
        lead: 'Lead Capture, Proposal Builder & Custom Scope Confirmation',
        process: 'Compliance Checklist Gates & Sub-task Document Requests',
        delivery: 'Final Verification Audits, Document Sign-Off & Transfer',
        reporting: 'Retainer Burn Rates, Team Velocity & Profit Margin Audits'
      },
      sampleSolution: 'An active Pipeline Partner OS managing live compliance checklists in a simple, compact spread view, sending automated emails for missing user documents, and tracking partner assignment speed.',
      quoteTemplate: 'Hey [Client Name],\n\nWe know how much admin goes into managing client compliance grids and document tracking. Most teams manage this via Excel, WhatsApp, and endless follow-up emails.\n\nWe want to set up an elegant, custom-designed delivery workspace for your firm. It connects your forms directly to client tasks, automates client reminders for missing invoices, and gives you a single screen showing what project is stuck where.\n\nWould you be open to seeing a sandbox concept next week?'
    }
  ];

  const packagesData = [
    {
      id: 'bos',
      level: 1,
      name: 'Business Operating System',
      description5Min: 'The core digital foundation that replaces paper and memory with structure.',
      setupRange: 'R15,000 – R40,000',
      setupVal: 25000,
      monthlyVal: 0,
      monthlyRange: 'R0',
      specs: [
        'Complete business process mapping & custom milestones design',
        'Compact mobile-responsive operator forms (AppSheet / Web)',
        'Centralized operational status board (Who/What/Why)',
        'Customized specifications vault for file uploads',
        'Single-user local system training session'
      ],
      outcome: 'No more lost jobs. Total team alignment. David steps off the workbench.'
    },
    {
      id: 'automation',
      level: 2,
      name: 'Automation Layer',
      description5Min: 'Connects your core dashboard directly into your communication channels.',
      setupRange: 'R2,500 – R8,000',
      setupVal: 5000,
      monthlyVal: 1200,
      monthlyRange: 'R500 – R2,000 / month',
      specs: [
        'Automated instant WhatsApp status alerts for clients',
        'Automatic transactional email follow-up templates',
        'Automated PDF quote & job card drafting on form submit',
        'Client onboarding appointment auto-reminders',
        'Follow-up retention routines for old/archived accounts'
      ],
      outcome: 'David stops manually answering "Where is my job?". Admins spend zero time on reminders.'
    },
    {
      id: 'bi',
      level: 3,
      name: 'Executive Intelligence',
      description5Min: 'Shows you where the money leaks are after 3–6 months of healthy data capture.',
      setupRange: 'R10,000 – R30,000',
      setupVal: 18000,
      monthlyVal: 2500,
      monthlyRange: 'R1,500 – R5,000 / month',
      specs: [
        'Executive financial leak mapping & margin monitoring',
        'Automated data pipeline extraction (Google Sheets to Power BI)',
        'Interactive gross profit & costing variance models',
        'Productivity visualizers (Average gate transition velocity)',
        'Strategic quarterly review session for growth planning'
      ],
      outcome: 'Clear operational profit trends. Perfect visibility into bottlenecks & expensive leakages.'
    }
  ];

  const currentNiche = niches.find(n => n.id === activeNiche) || niches[0];

  // Pricing Engine calculations based on checked additions
  const calculateFees = () => {
    let setup = 0;
    let monthly = 0;

    includedAddons.forEach(id => {
      const p = packagesData.find(item => item.id === id);
      if (p) {
        setup += p.setupVal;
        monthly += p.monthlyVal;
      }
    });

    const netSetup = Math.max(0, setup - setupDiscount);
    const netMonthly = Math.max(0, monthly - monthlyDiscount);

    return { setup, monthly, netSetup, netMonthly };
  };

  const fees = calculateFees();

  const handleToggleAddon = (id: string) => {
    if (includedAddons.includes(id)) {
      if (id === 'bos') return; // Core package must remain selected
      setIncludedAddons(includedAddons.filter(item => item !== id));
    } else {
      setIncludedAddons([...includedAddons, id]);
    }
  };

  const activeNicheDetails = niches.find(n => n.id === customNiche) || niches[0];

  const generatedProposalText = () => {
    const name = customClientName.trim() || 'Valued Partner';
    const draft = activeNicheDetails.quoteTemplate.replace('[Client Name]', name);
    
    let servicesBlock = '\n\n=== CHOSEN OPERATIONS MAP ===\n';
    if (includedAddons.includes('bos')) {
      servicesBlock += `* Package 1: Custom SME Operating System (Secure setup structure)\n`;
    }
    if (includedAddons.includes('automation')) {
      servicesBlock += `* Package 2: Real-time Communication & Messaging Automation Layer\n`;
    }
    if (includedAddons.includes('bi')) {
      servicesBlock += `* Package 3: Premium reporting & Executive Costing Leakage Analysis (Scheduled Layer)\n`;
    }

    const priceBlock = `\n=== ESTIMATED PROPOSAL OUTLINE (South Africa) ===\n* Bespoke System Design: ${formatRand(fees.netSetup)}${setupDiscount > 0 ? ` (R${setupDiscount} discount applied)` : ''} (Setup Fee)\n* Monthly System Support Retainer: ${formatRand(fees.netMonthly)}${monthlyDiscount > 0 ? ` (R${monthlyDiscount} discount applied)` : ''}${fees.netMonthly > 0 ? ' / month' : ' (No monthly fee)'}\n\n* Note: No enterprise platform license requirements. All infrastructure runs locally and server-side. Built by Luminary Data.`;

    return draft + servicesBlock + priceBlock;
  };

  const handleCopyProposal = () => {
    navigator.clipboard.writeText(generatedProposalText());
    setCopiedProposal(true);
    setTimeout(() => setCopiedProposal(false), 2000);
  };

  return (
    <div id="luminary-portfolio-root" className="space-y-8 font-sans pb-12">
      {/* Hero consulting header */}
      <div className="bg-gradient-to-r from-slate-950 via-[#0a0c16] to-[#120f26] border border-indigo-900/30 rounded-3xl p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-purple-500/5 blur-2xl rounded-full pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500" />
              </span>
              <span className="text-xs bg-indigo-500/10 border border-indigo-550/20 text-indigo-400 font-extrabold px-3 py-1 rounded-full uppercase tracking-widest">
                Operations Intelligence System
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans">
              Luminary Data
            </h2>
            <p className="text-sm md:text-md text-slate-300 max-w-2xl font-medium leading-relaxed font-sans">
              "We digitise and automate your business operations without forcing you to buy expensive, frustrating enterprise software."
            </p>
          </div>
          <div className="shrink-0 bg-slate-900/80 border border-slate-800/80 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">Operations Mastery</span>
            <span className="text-2xl font-bold font-sans text-indigo-400 mt-1">SME OS</span>
            <p className="text-[11px] text-slate-400 mt-1">Cape Town, South Africa</p>
          </div>
        </div>
      </div>

      {/* Segment 2: Interactive Sandbox & Operations Blueprints */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Niche Selector on Left */}
        <div className="space-y-4">
          <div className="p-1">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest font-mono">Select SME Target Niche</h3>
            <p className="text-xs text-slate-400 mt-1">Choose a sector to visualize operations mapping & actual business pain areas.</p>
          </div>

          <div className="space-y-2.5">
            {niches.map((n) => {
              const IconComp = n.icon;
              return (
                <button
                  key={n.id}
                  id={`niche-selector-${n.id}`}
                  onClick={() => {
                    setActiveNiche(n.id);
                    setCustomNiche(n.id);
                  }}
                  className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-start gap-4 ${
                    activeNiche === n.id
                      ? 'bg-gradient-to-r from-[#171a30] to-[#121626] border-indigo-500/60 shadow-md ring-1 ring-indigo-550/20'
                      : 'bg-[#111625] border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-700/80'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    activeNiche === n.id 
                      ? 'bg-indigo-900/30 border-indigo-500/30 text-indigo-400' 
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}>
                    <IconComp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className={`text-sm font-extrabold transition-colors ${activeNiche === n.id ? 'text-white' : 'text-slate-300'}`}>
                      {n.name}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 leading-snug line-clamp-1">{n.tagline}</p>
                    <span className="text-[10px] text-indigo-450 font-bold block mt-1.5 uppercase font-mono">Review Blueprint →</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Real Competitors War Room */}
          <div className="bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl space-y-3 relative">
            <div className="absolute top-0 right-0 p-3 text-amber-500/20 pointer-events-none">
              <AlertTriangle className="h-10 w-10 text-slate-800" />
            </div>
            <div className="text-[10px] font-bold text-slate-450 uppercase tracking-wider font-mono">The Real Enemy (David’s Reality)</div>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              When David says <em className="text-indigo-400 font-bold">"We already have a system"</em>, he doesn't mean SAP or Salesforce. He is stitch-running your competitors, raising massive weekend stress:
            </p>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>The shared client WhatsApp thread (flooded with notifications)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>Active physical whiteboards (easily rubbed off)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>The owner’s fragile, over-stretched memories.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Niche Details Visualizer on Right (2 Columns span) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111625] border border-slate-800/80 rounded-3xl p-6 relative">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/40">
              <div>
                <span className="text-[9.5px] font-bold bg-[#0d0f19] border border-slate-800 text-indigo-400 font-mono px-2 py-0.5 rounded tracking-widest uppercase">
                  ACTIVE CASE STUDY Blueprints
                </span>
                <h3 className="text-md sm:text-lg font-sans font-extrabold mt-1 text-slate-100">
                  {currentNiche.name} Hub
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-semibold italic">{currentNiche.tagline}</span>
            </div>

            {/* Core Pains vs Old Way */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-850">
                <span className="text-[9px] font-bold text-amber-500 tracking-wider font-mono uppercase block mb-2.5">
                  ⚠️ Core SME Pain Areas (We Solve This)
                </span>
                <ul className="space-y-2">
                  {currentNiche.pains.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-350">
                      <span className="text-amber-500 shrink-0 text-sm font-bold">✕</span>
                      <span className="leading-snug">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-950/30 p-4 rounded-2xl border border-slate-850/60">
                <span className="text-[9px] font-bold text-slate-450 tracking-wider font-mono uppercase block mb-2.5">
                  📦 The Fragile Reality (Active Competitors)
                </span>
                <ul className="space-y-2">
                  {currentNiche.competitors.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-slate-450 font-sans italic">
                      <span className="text-slate-600 shrink-0 select-none">•</span>
                      <span className="leading-snug">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* SME Logical Flowchart: Lead -> Process -> Delivery -> Reporting */}
            <div className="mt-6 pt-5 border-t border-slate-800/40">
              <span className="text-[9px] font-bold text-indigo-400 tracking-wider font-mono uppercase block mb-3">
                Identical Logical Pattern Map: Lead ➜ Process ➜ Delivery ➜ Reporting
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2.5">
                
                <div className="bg-[#141829] p-3 rounded-xl border border-indigo-950/40 text-center relative group">
                  <span className="text-[9px] block text-indigo-400 font-mono tracking-tight font-bold uppercase mb-1">1. LEAD</span>
                  <p className="text-xs text-slate-200 leading-snug font-sans font-bold py-1.5 min-h-[50px] flex items-center justify-center">
                    {currentNiche.operationalPattern.lead}
                  </p>
                  <span className="text-[9px] block text-slate-550 border-t border-slate-800/40 mt-1 pt-1 italic">Customer Gate</span>
                </div>

                <div className="bg-[#141829] p-3 rounded-xl border border-indigo-950/40 text-center relative group">
                  <span className="text-[9px] block text-indigo-400 font-mono tracking-tight font-bold uppercase mb-1">2. PROCESS</span>
                  <p className="text-xs text-slate-200 leading-snug font-sans font-bold py-1.5 min-h-[50px] flex items-center justify-center">
                    {currentNiche.operationalPattern.process}
                  </p>
                  <span className="text-[9px] block text-slate-550 border-t border-slate-800/40 mt-1 pt-1 italic">Workshop Track</span>
                </div>

                <div className="bg-[#141829] p-3 rounded-xl border border-indigo-950/40 text-center relative group">
                  <span className="text-[9px] block text-indigo-400 font-mono tracking-tight font-bold uppercase mb-1">3. DELIVERY</span>
                  <p className="text-xs text-slate-200 leading-snug font-sans font-bold py-1.5 min-h-[50px] flex items-center justify-center">
                    {currentNiche.operationalPattern.delivery}
                  </p>
                  <span className="text-[9px] block text-slate-550 border-t border-slate-800/40 mt-1 pt-1 italic">Verification Handover</span>
                </div>

                <div className="bg-[#18112b] p-3 rounded-xl border border-purple-950/40 text-center relative group">
                  <span className="text-[9px] block text-purple-400 font-mono tracking-tight font-bold uppercase mb-1">4. REPORT LAYER</span>
                  <p className="text-xs text-slate-200 leading-snug font-sans font-bold py-1.5 min-h-[50px] flex items-center justify-center">
                    {currentNiche.operationalPattern.reporting}
                  </p>
                  <span className="text-[9px] text-amber-450 font-bold bg-amber-950/30 border border-amber-950/40 rounded px-1.5 py-0.2 mt-1 inline-block text-[8px] uppercase">
                    BI Premium Gate
                  </span>
                </div>

              </div>
            </div>

            {/* Live Solution Delivery summary */}
            <div className="mt-5 p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-2xl flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-indigo-900/40 border border-indigo-550/30 text-indigo-450 mt-0.5 shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Bespoke Design Setup Strategy</span>
                <p className="text-xs text-slate-200 leading-relaxed font-sans font-semibold mt-0.5">
                  {currentNiche.sampleSolution}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Segment 3: Custom Business Operating System & Packaged Layers */}
      <div className="p-1">
        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest font-mono">Modular Operational Packages (The SA SME Pitch)</h3>
        <p className="text-xs text-slate-400 mt-1">
          Stop selling complex software terms like database, ERP, and CRM. Sell setup solutions paired with transparent retained values.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packagesData.map((p, idx) => {
          const isSelected = includedAddons.includes(p.id);
          return (
            <div 
              key={p.id}
              onClick={() => handleToggleAddon(p.id)}
              className={`p-6 rounded-3xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between min-h-[400px] ${
                isSelected
                  ? 'bg-gradient-to-br from-[#12162a] to-[#0f121d] border-indigo-550 ring-2 ring-indigo-500/10'
                  : 'bg-[#111625] border-slate-800/80 hover:bg-slate-900/50 hover:border-slate-800'
              }`}
            >
              <div>
                {/* Top header & Selector */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 font-mono">
                    Package {p.level} {p.level === 3 ? '• Growth Gate' : ''}
                  </span>
                  <div className={`h-5 w-5 rounded-md flex items-center justify-center border transition-colors ${
                    isSelected ? 'bg-indigo-600 border-indigo-400 text-white' : 'border-slate-800 bg-slate-900'
                  }`}>
                    {isSelected && <span className="text-xs font-bold font-sans">✓</span>}
                  </div>
                </div>

                <h4 className="text-lg font-sans font-extrabold text-slate-100">{p.name}</h4>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed min-h-[40px] font-medium">
                  {p.description5Min}
                </p>

                {/* Scope items checklist */}
                <div className="mt-5 pt-4 border-t border-slate-800/60 space-y-2.5">
                  {p.specs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300 leading-snug">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Setup pricing and retained revenue info */}
              <div className="mt-6 pt-4 border-t border-slate-800/60 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 uppercase font-mono">Setup Guide</span>
                  <span className="font-extrabold text-slate-100 font-sans">{p.setupRange}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 uppercase font-mono">Monthly Retainer</span>
                  <span className="font-extrabold text-indigo-400 font-sans">{p.monthlyRange}</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-900 text-[10.5px] text-slate-405 leading-snug">
                  <strong className="text-slate-200">Outcome:</strong> {p.outcome}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Segment 4: Proposal Workspace & Custom Quote Generator */}
      <div className="bg-slate-950/40 border border-indigo-950/60 rounded-3xl p-6 relative">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-505/5 blur-3xl rounded-full pointer-events-none" />

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Custom adjustments Left Panel */}
          <div className="lg:w-1/3 space-y-5 shrink-0">
            <div>
              <span className="text-[10px] bg-slate-900 border border-slate-850 text-indigo-400 font-bold px-2 py-0.5 rounded uppercase tracking-wider font-mono">
                Proposal Tailoring Suite
              </span>
              <h3 className="text-lg font-sans font-extrabold mt-1 text-slate-100">
                Cost Estimator & proposal Writer
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Interactively design real system proposals for South African SMEs in your funnel. Turn off jargon on the fly.
              </p>
            </div>

            {/* Client input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-450 uppercase font-mono">Client Owner / Company Name</label>
              <input
                type="text"
                value={customClientName}
                onChange={(e) => setCustomClientName(e.target.value)}
                placeholder="e.g., David / Kitchen Lab"
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Niche Template selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-450 uppercase font-mono">Target Blueprint Template</label>
              <select
                value={customNiche}
                onChange={(e) => setCustomNiche(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-850 text-slate-300 focus:outline-none"
              >
                {niches.map(n => (
                  <option key={n.id} value={n.id}>{n.name}</option>
                ))}
              </select>
            </div>

            {/* Scope inclusions list checks */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-450 uppercase font-mono">Tailor Scope Inclusion</label>
              <div className="space-y-2 text-xs">
                {packagesData.map(p => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={includedAddons.includes(p.id)}
                      disabled={p.id === 'bos'} // Core cannot be deleted
                      onChange={() => handleToggleAddon(p.id)}
                      className="rounded border-slate-800 text-indigo-600 bg-slate-900 focus:ring-indigo-500"
                    />
                    <span className={p.id === 'bos' ? 'text-slate-500 font-semibold' : 'text-slate-300'}>
                      {p.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Pricing Adjustments sliders for local discounts */}
            <div className="space-y-3 pt-3 border-t border-slate-900">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-450 font-semibold uppercase font-mono">Bespoke Setup Adjustment</span>
                  <span className="text-indigo-400 font-bold">-{formatRand(setupDiscount)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15000"
                  step="1000"
                  value={setupDiscount}
                  onChange={(e) => setSetupDiscount(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-450 font-semibold uppercase font-mono">Retainer Adjustment (Monthly)</span>
                  <span className="text-indigo-400 font-bold">-{formatRand(monthlyDiscount)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1500"
                  step="100"
                  value={monthlyDiscount}
                  onChange={(e) => setMonthlyDiscount(parseInt(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>

            {/* Price outputs */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-900 flex justify-between gap-4 mt-3">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono">Estimated Setup</span>
                <div className="text-md sm:text-lg font-bold font-sans text-slate-100">{formatRand(fees.netSetup)}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase font-mono">Monthly Retainer</span>
                <div className="text-md sm:text-lg font-bold font-sans text-indigo-400">{formatRand(fees.netMonthly)}</div>
              </div>
            </div>

          </div>

          {/* Generated Text Right Panel */}
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center bg-[#111625] px-4 py-2 rounded-xl border border-slate-850">
              <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-bold font-sans">
                <Sliders className="h-3.5 w-3.5" />
                <span>Generated Non-Jargony SME Proposal Draft</span>
              </div>
              <button
                id="copy-proposal-text-btn"
                onClick={handleCopyProposal}
                className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg select-none cursor-pointer transition-colors ${
                  copiedProposal
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/40'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                <Copy className="h-3 w-3" />
                {copiedProposal ? 'Copied' : 'Copy Pitch Text'}
              </button>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-900 min-h-[360px] relative">
              <pre className="text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed select-all">
                {generatedProposalText()}
              </pre>
            </div>

            <div className="text-xs text-slate-500 italic flex items-start gap-1.5 leading-snug">
              <HelpCircle className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
              <span>
                Tip: Copy and message this formatted, humble proposal right into David’s consultation or WhatsApp chat. It completely bypasses CRM/ERP enterprise barriers and addresses South Africa SME realities.
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Segment 5: Workspace Maintenance Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-8 border-t border-slate-900 mt-8">
        
        {/* Left column: Maintenance tools */}
        <div className="space-y-4">
          <div className="p-1">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest font-mono">Workspace Maintenance</h3>
            <p className="text-xs text-slate-400 mt-1">Manage active workspace status, or flush local caches for pristine operations.</p>
          </div>

          <div className="bg-[#111625] border border-slate-800/80 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/40 pb-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200">Local Database Engine</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-450 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-555"></span>
                </span>
                <span className="text-[10px] text-emerald-400 font-mono font-bold">ONLINE STATUS</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Active Record Count:</span>
                <span className="font-extrabold text-[#7c3aed] bg-[#7c3aed]/10 border border-[#7c3aed]/20 px-2.5 py-0.5 rounded-lg font-mono">{currentJobsCount} Clients</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                This applet implements offline-first data serialization. All client specifications, financial legers, and notes reside securely inside your browser's persistent storage.
              </p>
            </div>

            {/* Maintenance triggers */}
            <div className="space-y-2.5 pt-3 border-t border-[#111625]">
              <button
                id="reset-buildcore-btn"
                onClick={() => {
                  if (onResetCleanState) {
                    onResetCleanState();
                    setDbFeedback('clean');
                    setTimeout(() => setDbFeedback(null), 3000);
                  }
                }}
                className="w-full flex items-center justify-center gap-2 text-xs bg-slate-900 override:text-rose-400 hover:bg-slate-850 border border-slate-800 text-slate-350 py-2.5 px-4 rounded-xl cursor-pointer font-extrabold transition-all active:scale-95 select-none"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                Wipe Local & Cloud Database (Reset to Empty State)
              </button>
            </div>

            {/* Alerts Feedback */}
            <AnimatePresence>
              {dbFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3 rounded-xl border text-xs leading-normal flex items-start gap-2 bg-emerald-950/45 border-emerald-900/40 text-emerald-200"
                >
                  <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <span className="font-extrabold block">
                      ✓ Workspace Reset Complete
                    </span>
                    <p className="text-[10px] text-slate-350 mt-0.5 leading-snug font-sans">
                      All local caches and collections flushed successfully. Your workspace is 100% fresh and ready.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Columns: Interactive App User Guide */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-1">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              Kitchen Lab OS • Developer & User Manual
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Instructions for David, the workshop foreman, and consulting installers operating in South Africa suburbs.
            </p>
          </div>

          <div className="bg-[#111625] border border-slate-800/80 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-950/60 border border-indigo-900/40 rounded-lg text-indigo-400">
                  <Smartphone className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono">Mobile App Setup & Shortcut</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                You do not need an App Store or Play Store account to source or load this software on client sites. 
                Simply open the <strong className="text-slate-250">Shared URL</strong> on your iPhone Safari or Android Chrome browser, tap <strong className="text-indigo-400">"Add to Home Screen"</strong> (or "Install"), and it will pin a full-screen standalone application shortcut directly onto your home screen menu.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-950/60 border border-indigo-900/40 rounded-lg text-indigo-400">
                  <WifiOff className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono font-mono">Offline-First Design Engine</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                <strong className="text-emerald-400">Absolute Offline:</strong> All client entries, door profiles, hinges configurations, photos, and financial ledger logs are cached immediately in the device browser storage. David will never lose measurement cuts on rural South Africa farms with zero network.
                <br />
                <strong className="text-indigo-400">Online Sync:</strong> When cell signal restores, backing up or sending ERP Setup requests (Power BI Synced ledger audits, PDF report logs) activates transparently inside the network thread.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800/40">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-950/60 border border-indigo-900/40 rounded-lg text-indigo-400">
                  <Sliders className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono">Hardware & Cabinet Specs</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Installers can review specific hardware attributes under each client card:
                <br />
                • <strong className="text-slate-350">Soft-Close Hinges:</strong> Select Blum/Hettich style soft closes to prevent cabinet wear.
                <br />
                • <strong className="text-slate-350">Push-To-Open:</strong> Slick handleless mechanisms.
                <br />
                • <strong className="text-slate-350">Amended Site notes:</strong> David can register site dimensions adaptations on the fly to prevent wrong board slices.
              </p>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800/40">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-950/60 border border-indigo-900/40 rounded-lg text-indigo-400">
                  <Layout className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-xs font-bold text-slate-200 uppercase font-mono">Visual Layout Previews</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Inside each active client’s viewport, check the <strong className="text-slate-300">Visual Vault Layout</strong>. Installers can view uploaded layout sketches, 3D renders, and snapshot elevations on site. 
                <br />
                This keeps the entire crew (plumbers, spray painters, carpenters, stone suppliers) linked to a single version of reality, eliminating duplicate board errors and back-and-forth WhatsApp inquiries.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
