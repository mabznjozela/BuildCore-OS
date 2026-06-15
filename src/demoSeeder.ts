import { Job, Task, FinancialRecord, VaultFile, JobNote } from './types';

export function getSevenDemoClients(): Job[] {
  return [
    {
      id: 'KL-DEMO-01',
      clientName: 'Gerard (Uitsig)',
      phone: '27833465449',
      email: 'gerard.uitsig@gmail.com',
      address: 'Eldoraigne, Centurion, 0157, South Africa',
      area: 'Eldoraigne',
      leadSource: 'Referral',
      status: '10 Installation Scheduled',
      nextAction: 'Final Quality Check & Load Batch',
      health: 'On Track',
      statusSince: new Date().toISOString(),
      installationDate: '2026-06-25',
      quoteValue: 44700,
      depositReceived: 26820, // 60% Deposit Paid
      comments: 'Project categories: Scullery, Braai. Soft Close and Ball Bearing hardware features specified.',
      siteNotes: 'Ensure heavy duty ball bearing runners are loaded in morning batch.',
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
      clientName: 'Charl Coetzer',
      phone: '27790581861',
      email: 'charl.coetzer@outlook.com',
      address: 'Hennopspark, Centurion, 0157, South Africa',
      area: 'Hennopspark',
      leadSource: 'Referral',
      status: '11 Installation In Progress',
      nextAction: 'Fit sink after plumber does first-fix hookup',
      health: 'On Track',
      statusSince: new Date().toISOString(),
      installationDate: '2026-06-18',
      quoteValue: 45000,
      depositReceived: 27000, // 60% Deposit
      comments: 'Project category: Kitchen. Fit sink after plumber does first-fix hookup.',
      siteNotes: 'Coordinate with plumber team on site for timing of sink installation.',
      specs: {
        boardType: 'Melamine Faced Board (18mm)',
        boardSupplier: 'PG Bison MelaWood',
        doorType: 'Linear Grain Slab Driftwood',
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
      clientName: 'Johan De Ru',
      phone: '27834318073',
      email: 'johan.deru@webmail.co.za',
      address: 'Montana, Pretoria, 0182, South Africa',
      area: 'Montana',
      leadSource: 'Referral',
      status: '9 Production',
      nextAction: 'Finish spraying Iceberg White cabinet trims',
      health: 'Needs Attention',
      statusSince: new Date().toISOString(),
      installationDate: '2026-07-02',
      quoteValue: 108240,
      depositReceived: 64944, // 60% Deposit
      comments: 'Project categories: Kitchen, Scullery. Caraz finishes, black kicks & handles. LED lights for kicks & display. Bulkhead & 3 pendulum lights.',
      siteNotes: 'Ceiling height 2600mm. Top cabinet height 2450mm. Bring pendant light mounting brackets.',
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
      clientName: 'Summerhaze Premium Estate',
      phone: '27843040022',
      email: 'projects@summerhaze.co.za',
      address: 'Sandton, Johannesburg, 2196, South Africa',
      area: 'Sandton',
      leadSource: 'Referral',
      status: '7 Awaiting Deposit',
      nextAction: 'Follow up with David to verify receipt of 60% deposit clear',
      health: 'On Track',
      statusSince: new Date().toISOString(),
      installationDate: '2026-07-15',
      quoteValue: 375000,
      depositReceived: 0,
      comments: 'Project category: Full House. High priority high value client.',
      siteNotes: 'Extremely detailed build. Awaiting signature and deposit clear before initiating cabinetry cutting lists.',
      specs: {
        boardType: 'Luxury Premium Board',
        boardSupplier: 'Egger South Africa',
        doorType: 'Bespoke Handleless Matte Lacque Accent',
        doorSupplier: 'Kitchen Lab premium division',
        softClose: true,
        ledLighting: true,
        pushToOpen: true,
        glassDoors: true,
        stoneSupplier: 'Caesarstone SA',
        stoneColour: 'Empira White',
        stoneThickness: '30mm',
        oven: 'Siemens Integrated Series',
        hob: 'Siemens Induction Hob',
        extractor: 'Siemens Integrated Downdraft',
        fridge: 'Liebherr Built-in Units'
      }
    },
    {
      id: 'KL-DEMO-05',
      clientName: 'Fatima (Erasmia)',
      phone: '27732110164',
      email: 'fatima.erasmia@mweb.co.za',
      address: 'Erasmia, Centurion, 0183, South Africa',
      area: 'Erasmia',
      leadSource: 'Referral',
      status: '5 Design Phase',
      nextAction: 'Incorporate secret interior latch compartment feedback',
      health: 'On Track',
      statusSince: new Date().toISOString(),
      quoteValue: 90000,
      depositReceived: 0,
      comments: 'Project categories: TV Room, Kitchenette, Main Bedroom Dresser, Walk-in Wardrobe. Special request: Secret Compartment inside walk-in wardrobe cupboard.',
      siteNotes: 'Need subtle hidden touch latch system for secret compartment.',
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
      clientName: 'Fred Ferreira',
      phone: '27825618660',
      email: 'fred.f@lantic.co.za',
      address: 'Silver Lakes Golf Estate, Pretoria, 0081, South Africa',
      area: 'Silver Lakes',
      leadSource: 'Referral',
      status: '3 Site Visit Scheduled',
      nextAction: 'Confirm morning measurement window with client',
      health: 'On Track',
      statusSince: new Date().toISOString(),
      quoteValue: 125000,
      depositReceived: 0,
      comments: 'Project category: Bar. Elite client in security golf estate. Requires high-end wood panel styling.',
      siteNotes: 'Requires premium custom timber craftsmanship matching existing solid mahogany lounge style.',
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
      clientName: 'Sipho Dlamini',
      phone: '27614059032',
      email: 'sipho.dlamini@outlook.com',
      address: 'Umhlanga Ridge, Durban, 4319, South Africa',
      area: 'Umhlanga Ridge',
      leadSource: 'Google Search',
      status: '12 Complete',
      nextAction: 'Project archive and client feedback collection finished',
      health: 'On Track',
      statusSince: new Date().toISOString(),
      installationDate: '2026-06-01',
      quoteValue: 180000,
      depositReceived: 180000, // Fully paid 100%
      comments: 'Project category: Executive kitchen. Handleless design. Signed off perfectly with no complaints.',
      siteNotes: 'Verify zero door rub. Installed dual electric fan with Blum soft close drawers.',
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
      description: '60% Deposit payment cleared',
      category: '60% Deposit Paid'
    },
    {
      id: 'FIN-DEMO-02',
      jobId: 'KL-DEMO-01',
      type: 'expense',
      amount: 12000,
      date: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString().split('T')[0],
      description: 'MDF board stock from PG Bison',
      category: 'Materials'
    },
    {
      id: 'FIN-DEMO-03',
      jobId: 'KL-DEMO-02',
      type: 'payment',
      amount: 27000,
      date: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString().split('T')[0],
      description: '60% Deposit on kitchen build',
      category: '60% Deposit Paid'
    },
    {
      id: 'FIN-DEMO-04',
      jobId: 'KL-DEMO-02',
      type: 'expense',
      amount: 3500,
      date: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString().split('T')[0],
      description: 'Blum soft close cabinet hinges and runners',
      category: 'Hardware'
    },
    {
      id: 'FIN-DEMO-05',
      jobId: 'KL-DEMO-03',
      type: 'payment',
      amount: 64944,
      date: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString().split('T')[0],
      description: '60% Material deposit wire received',
      category: '60% Deposit Paid'
    },
    {
      id: 'FIN-DEMO-06',
      jobId: 'KL-DEMO-07',
      type: 'payment',
      amount: 108000,
      date: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString().split('T')[0],
      description: '60% Deposit on high-end kitchen setup',
      category: '60% Deposit Paid'
    },
    {
      id: 'FIN-DEMO-07',
      jobId: 'KL-DEMO-07',
      type: 'payment',
      amount: 72056,
      date: new Date().toISOString().split('T')[0],
      description: 'Final 40% handover payment signed off',
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
      name: 'Kitchen Render Plan.png',
      url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80',
      uploadedAt: new Date(Date.now() - 4 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'FILE-DEMO-02',
      jobId: 'KL-DEMO-05',
      type: 'document',
      name: 'Cupboard Measurements Wardrobe.pdf',
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
      content: 'Johan wants a high-contrast black handle styling. Ground lighting strip should be recessed underneath bottom cabinet kicks.',
      createdAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString()
    },
    {
      id: 'NOTE-DEMO-02',
      jobId: 'KL-DEMO-05',
      author: 'David',
      content: 'Make sure wardrobe features have deep recesses. Client Fatima asked for hidden magnetic push-latch secret jewelry compartment behind drawer 4.',
      createdAt: new Date().toISOString()
    }
  ];
}
