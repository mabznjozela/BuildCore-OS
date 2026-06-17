import { Job, Task, FinancialRecord, VaultFile, JobNote } from './types';

export function getSevenDemoClients(): Job[] {
  return [
    {
      id: 'KL-DEMO-01',
      clientName: 'Alpha Estate Luxury Scullery',
      phone: '27105550190',
      email: 'projects@alphaestatescullery.co.za',
      address: 'Plot 104, Oakwood Manor, Centurion, 0157, South Africa',
      area: 'Centurion',
      leadSource: 'Referral',
      status: '10 Installation Scheduled',
      nextAction: 'Final Quality Check & Load Batch',
      health: 'On Track',
      statusSince: new Date().toISOString(),
      installationDate: '2026-06-25',
      quoteValue: 44700,
      depositReceived: 26820, // 60% Deposit Paid
      comments: 'Project categories: Premium Scullery, Braai room prep. Soft Close and Heavy Duty Ball Bearing hardware features specified.',
      siteNotes: 'Ensure heavy duty ball bearing runners are loaded in morning batch for deep pantry slide drawers.',
      specs: {
        boardType: 'Moisture-resistant high-density MDF (18mm)',
        boardSupplier: 'PG Bison',
        doorType: 'SupaWood Frameless Matte Charcoal',
        doorSupplier: 'Kitchen Lab Workshop',
        softClose: true,
        ledLighting: false,
        pushToOpen: false,
        glassDoors: false,
        stoneSupplier: 'N/A',
        stoneColour: 'N/A',
        stoneThickness: 'N/A',
        oven: 'Extractor only integrated',
        hob: 'N/A',
        extractor: 'Defy Under-counter extractor',
        fridge: 'N/A'
      }
    },
    {
      id: 'KL-DEMO-02',
      clientName: 'Coastal Driftwood Townhouse',
      phone: '27105550244',
      email: 'coastal.driftwood@fictional.com',
      address: 'Unit 42, Riverview Close, Centurion, 0157, South Africa',
      area: 'Hennopspark',
      leadSource: 'Referral',
      status: '11 Installation In Progress',
      nextAction: 'Fit heavy double sink after plumber does first-fix hookup',
      health: 'On Track',
      statusSince: new Date().toISOString(),
      installationDate: '2026-06-18',
      quoteValue: 45000,
      depositReceived: 27000, // 60% Deposit
      comments: 'Project category: Modern Duplex Kitchen. Linear grain slab drift wood look with matte finishes.',
      siteNotes: 'Coordinate with plumber team on site for timing of sink installation to avoid scratching quartz.',
      specs: {
        boardType: 'Melamine Faced Board (18mm)',
        boardSupplier: 'PG Bison MelaWood',
        doorType: 'Linear Grain Slab Driftwood Look',
        doorSupplier: 'Kitchen Lab Stock',
        softClose: true,
        ledLighting: false,
        pushToOpen: false,
        glassDoors: false,
        stoneSupplier: 'Sigma Quartz',
        stoneColour: 'Clean White Quartz',
        stoneThickness: '20mm',
        oven: 'Defy Under-counter Oven',
        hob: 'Defy Slimline Hob',
        extractor: 'Defy Extractor Fan',
        fridge: 'Samsung Upright'
      }
    },
    {
      id: 'KL-DEMO-03',
      clientName: 'Prestige Obsidian Kitchen & Scullery',
      phone: '27105550388',
      email: 'prestige.obsidian@fictional.com',
      address: '77 Montana Peak, Pretoria, 0182, South Africa',
      area: 'Montana',
      leadSource: 'Referral',
      status: '9 Production',
      nextAction: 'Finish spraying Iceberg White cabinet trims',
      health: 'Needs Attention',
      statusSince: new Date().toISOString(),
      installationDate: '2026-07-02',
      quoteValue: 108240,
      depositReceived: 64944, // 60% Deposit
      comments: 'Project categories: Open-plan Kitchen, Scullery. Caraz obsidian finishes, black kickboards and premium handles. LED track light strips for kicks & displays. Custom Bulkhead structure.',
      siteNotes: 'Ceiling height is 2600mm. Top cabinet height is 2450mm. Remember to bring heavy-duty pendant light mounting brackets.',
      specs: {
        boardType: 'Moisture-resistant MDF',
        boardSupplier: 'Sonae Arauco',
        doorType: 'Iceberg White High Gloss with Clear Glass inserts',
        doorSupplier: 'Gelmar Maple Slats / In-house',
        softClose: true,
        ledLighting: true,
        pushToOpen: false,
        glassDoors: true,
        stoneSupplier: 'Caraz Stone Supplier',
        stoneColour: 'Caraz Obsidian Quartz',
        stoneThickness: '20mm',
        oven: 'SMEG Classici Aesthetic',
        hob: 'SMEG Gas Hob 900mm',
        extractor: 'SMEG Wall Mounted Canopy',
        fridge: 'LG Side-by-Side black steel'
      }
    },
    {
      id: 'KL-DEMO-04',
      clientName: 'Grandview Heights Luxury Penthouse',
      phone: '27105550410',
      email: 'penthouses@grandviewheights.co.za',
      address: 'Tower A Penthouse, Sandton Skylines, Sandton, 2196, South Africa',
      area: 'Sandton',
      leadSource: 'Referral',
      status: '7 Awaiting Deposit',
      nextAction: 'Follow up with manager to verify receipt of 60% contract booking deposit',
      health: 'On Track',
      statusSince: new Date().toISOString(),
      installationDate: '2026-07-15',
      quoteValue: 375000,
      depositReceived: 0,
      comments: 'Project category: Full House Premium Cabinetry. Ultra-high modern value client. Demands highest level craftsmanship.',
      siteNotes: 'Extremely detailed build specs. Awaiting signed final CAD prints and deposit clearance to schedule board cutting program.',
      specs: {
        boardType: 'Luxury Premium Board',
        boardSupplier: 'Egger South Africa',
        doorType: 'Bespoke Handleless Matte Lacquer Accent',
        doorSupplier: 'Kitchen Lab premium division',
        softClose: true,
        ledLighting: true,
        pushToOpen: true,
        glassDoors: true,
        stoneSupplier: 'Caesarstone SA',
        stoneColour: 'Empira White Duo',
        stoneThickness: '30mm',
        oven: 'Siemens Integrated Series',
        hob: 'Siemens Induction Hob',
        extractor: 'Siemens Integrated Downdraft',
        fridge: 'Liebherr Built-in Units'
      }
    },
    {
      id: 'KL-DEMO-05',
      clientName: 'Secret Latch Wardrobe Suite',
      phone: '27105550577',
      email: 'wardrobesuite@secretlatch.com',
      address: 'Block E, Erasmia Ridge Estate, Centurion, 0183, South Africa',
      area: 'Erasmia',
      leadSource: 'Referral',
      status: '5 Design Phase',
      nextAction: 'Incorporate hidden-compartment mechanism into interactive 3D layout',
      health: 'On Track',
      statusSince: new Date().toISOString(),
      quoteValue: 90000,
      depositReceived: 0,
      comments: 'Project categories: Custom TV Console, Kitchenette, Master Dresser, Walk-in Wardrobe. Special request: Concealed document drawer built inside Wardrobe 4.',
      siteNotes: 'Requires a sleek magnetic touch latch system for the concealed jewelry and documents shelf.',
      specs: {
        boardType: 'MDF Core Supawood',
        boardSupplier: 'PG Bison',
        doorType: 'Shaker Painted Clean Style',
        doorSupplier: 'Kitchen Lab Workshop',
        softClose: true,
        ledLighting: true,
        pushToOpen: true,
        glassDoors: false,
        stoneSupplier: 'Sigma Quartz',
        stoneColour: 'Premium Grey Sparkle',
        stoneThickness: '20mm',
        oven: 'N/A',
        hob: 'Defy compact hob',
        extractor: 'N/A',
        fridge: 'Bar Fridge integrated'
      }
    },
    {
      id: 'KL-DEMO-06',
      clientName: 'Legacy Solid Mahogany Home Bar',
      phone: '27105550611',
      email: 'entertainment@legacygolfestate.co.za',
      address: 'Villa 12, Silver Lakes Golf Estate, Pretoria, 0081, South Africa',
      area: 'Silver Lakes',
      leadSource: 'Referral',
      status: '3 Site Visit Scheduled',
      nextAction: 'Verify exact morning dimensions for mahogany wall paneling trims',
      health: 'On Track',
      statusSince: new Date().toISOString(),
      quoteValue: 125000,
      depositReceived: 0,
      comments: 'Project category: Luxury Home Bar and Entertainment Unit. Tailored solid wood frame design matching existing luxury lounge finishes.',
      siteNotes: 'Requires premium custom timber joints and staining matching solid mahogany interior bar styling.',
      specs: {
        boardType: 'Veneer Faced Moisture Board',
        boardSupplier: 'PG Bison',
        doorType: 'Solid Mahogany Raised Panel',
        doorSupplier: 'Kitchen Lab Custom Workshop',
        softClose: true,
        ledLighting: true,
        pushToOpen: false,
        glassDoors: true,
        stoneSupplier: 'ProQuartz',
        stoneColour: 'Starlight Noir Quartz',
        stoneThickness: '30mm',
        oven: 'N/A',
        hob: 'N/A',
        extractor: 'N/A',
        fridge: 'SMEG retro bar cabinet'
      }
    },
    {
      id: 'KL-DEMO-07',
      clientName: 'Zen Matte Acrylic Minimalist Kitchen',
      phone: '27105550731',
      email: 'minimalist@zenacrylic.com',
      address: '99 Ridge Boulevard, Umhlanga Ridge, Durban, 4319, South Africa',
      area: 'Umhlanga Ridge',
      leadSource: 'Google Search',
      status: '12 Complete',
      nextAction: 'Final checklist signed off; archives synced and customer feedback positive',
      health: 'On Track',
      statusSince: new Date().toISOString(),
      installationDate: '2026-06-01',
      quoteValue: 180000,
      depositReceived: 180000, // Fully paid 100%
      comments: 'Project category: High-grade executive kitchen. Fully handleless J-Pull styling. Successfully signed off with zero snag items.',
      siteNotes: 'Precision edge banding verified. Fits dual Siemens multi-fan set and custom integrated water dispensers.',
      specs: {
        boardType: 'High Gloss Acrylic board',
        boardSupplier: 'Sonae Arauco',
        doorType: 'Handleless J-Pull Painted High-Gloss',
        doorSupplier: 'Kitchen Lab premium division',
        softClose: true,
        ledLighting: true,
        pushToOpen: false,
        glassDoors: false,
        stoneSupplier: 'Sigma Quartz',
        stoneColour: 'Premium White Sparkle Quartz',
        stoneThickness: '20mm',
        oven: 'Siemens Twin Oven set',
        hob: 'Siemens Gas hob 5-burner',
        extractor: 'Siemens Canopy Extractor',
        fridge: 'Samsung Double Door steel'
      }
    }
  ];
}

export function getSevenDemoTasks(): Task[] {
  const result: Task[] = [];
  const demoIds = ['KL-DEMO-01', 'KL-DEMO-02', 'KL-DEMO-03', 'KL-DEMO-04', 'KL-DEMO-05', 'KL-DEMO-06', 'KL-DEMO-07'];
  
  demoIds.forEach((jobId) => {
    // Lead tasks
    result.push(
      { id: `T-${jobId}-1`, jobId, stage: 'Lead Care', taskName: 'Site Measurement Capture', complete: true },
      { id: `T-${jobId}-2`, jobId, stage: 'Lead Care', taskName: 'Quote Generation & Pricing Block', complete: true },
      { id: `T-${jobId}-3`, jobId, stage: 'Lead Care', taskName: 'Drawing Approval Signed Off', complete: jobId !== 'KL-DEMO-05' && jobId !== 'KL-DEMO-06' }
    );
    // Design tasks
    result.push(
      { id: `T-${jobId}-4`, jobId, stage: 'Design', taskName: '3D CAD Render Drafted', complete: jobId !== 'KL-DEMO-06' },
      { id: `T-${jobId}-5`, jobId, stage: 'Design', taskName: 'Hardware Specs Approved (Soft-close / Drawers)', complete: jobId !== 'KL-DEMO-05' && jobId !== 'KL-DEMO-06' }
    );
    // Production tasks
    const isPastProd = ['KL-DEMO-01', 'KL-DEMO-02', 'KL-DEMO-07'].includes(jobId);
    result.push(
      { id: `T-${jobId}-6`, jobId, stage: 'Production', taskName: 'Cutting Sheet Generated & Dispatched', complete: isPastProd },
      { id: `T-${jobId}-7`, jobId, stage: 'Production', taskName: 'Board Slicing & Edge Banding Finished', complete: isPastProd },
      { id: `T-${jobId}-8`, jobId, stage: 'Production', taskName: 'Paint/Spray Coating cured & hardened', complete: isPastProd }
    );
    // Installation tasks
    result.push(
      { id: `T-${jobId}-9`, jobId, stage: 'Installation', taskName: 'Van Loaded with Carcasses & Hardware', complete: jobId === 'KL-DEMO-07' || jobId === 'KL-DEMO-01' },
      { id: `T-${jobId}-10`, jobId, stage: 'Installation', taskName: 'On-site Leveling & Anchor Screws Secured', complete: jobId === 'KL-DEMO-07' },
      { id: `T-${jobId}-11`, jobId, stage: 'Installation', taskName: 'Stone Countertops Seamed & Glued', complete: jobId === 'KL-DEMO-07' },
      { id: `T-${jobId}-12`, jobId, stage: 'Installation', taskName: 'Dual Appliance Connections Verified', complete: jobId === 'KL-DEMO-07' }
    );
  });

  return result;
}

export function getSevenDemoFinancials(): FinancialRecord[] {
  return [
    {
      id: 'FIN-DEMO-01',
      jobId: 'KL-DEMO-01',
      type: 'payment',
      amount: 26820,
      date: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString().split('T')[0],
      description: '60% Deposit payment cleared for Alpha Estate Scullery',
      category: '60% Deposit Paid'
    },
    {
      id: 'FIN-DEMO-02',
      jobId: 'KL-DEMO-01',
      type: 'expense',
      amount: 12000,
      date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      description: 'Moisture-resistant MDF premium board stock from PG Bison',
      category: 'Materials'
    },
    {
      id: 'FIN-DEMO-03',
      jobId: 'KL-DEMO-02',
      type: 'payment',
      amount: 27000,
      date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
      description: '60% Deposit cleared on coastal townhouses modern kitchen',
      category: '60% Deposit Paid'
    },
    {
      id: 'FIN-DEMO-04',
      jobId: 'KL-DEMO-02',
      type: 'expense',
      amount: 3500,
      date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString().split('T')[0],
      description: 'Blum soft close cabinet hinges and runners pack',
      category: 'Hardware'
    },
    {
      id: 'FIN-DEMO-05',
      jobId: 'KL-DEMO-03',
      type: 'payment',
      amount: 64944,
      date: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString().split('T')[0],
      description: '60% Obsidian Prestige Kitchen deposit wire received',
      category: '60% Deposit Paid'
    },
    {
      id: 'FIN-DEMO-06',
      jobId: 'KL-DEMO-07',
      type: 'payment',
      amount: 108000,
      date: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString().split('T')[0],
      description: '60% Initial deposit on high-grade executive acrylic setup',
      category: '60% Deposit Paid'
    },
    {
      id: 'FIN-DEMO-07',
      jobId: 'KL-DEMO-07',
      type: 'payment',
      amount: 72056,
      date: new Date().toISOString().split('T')[0],
      description: 'Final 40% handover payment cleared on acrylic minimalist kitchen',
      category: 'Balance Cleared'
    }
  ];
}

export function getSevenDemoFiles(): VaultFile[] {
  return [
    {
      id: 'FILE-DEMO-01',
      jobId: 'KL-DEMO-03',
      type: 'render',
      name: 'Prestige Obsidian Render Plan.png',
      url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      uploadedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'FILE-DEMO-02',
      jobId: 'KL-DEMO-05',
      type: 'document',
      name: 'Custom Dresser Compartment Measurements.pdf',
      url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      uploadedAt: new Date().toISOString()
    }
  ];
}

export function getSevenDemoNotes(): JobNote[] {
  return [
    {
      id: 'NOTE-DEMO-01',
      jobId: 'KL-DEMO-03',
      author: 'David',
      content: 'Client requested high-contrast obsidian black styling frame. Ground lighting strip should be recessed underneath bottom cabinet kickboards.',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'NOTE-DEMO-02',
      jobId: 'KL-DEMO-05',
      author: 'David',
      content: 'Make sure wardrobe cabinets have deep recesses. Secret compartment should use active hidden magnetic push-latch secure jewelry boxes hidden inside Drawer Unit 4.',
      createdAt: new Date().toISOString()
    }
  ];
}
