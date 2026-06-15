import { Job, Task, FinancialRecord, VaultFile, JobNote } from './types';

export const INITIAL_JOBS: Job[] = [
  {
    id: 'OVERHEAD',
    clientName: 'Internal Business Overheads',
    phone: '',
    email: 'admin@kitchenlab.co.za',
    address: 'Kitchen Lab Head Office, South Africa',
    area: 'Internal Operations',
    leadSource: 'Internal',
    status: '12 Complete',
    nextAction: 'Overheads/No Action',
    health: 'On Track',
    statusSince: '2026-05-23T08:00:00Z',
    quoteValue: 0,
    depositReceived: 0,
    comments: 'Internal overhead tracking record for organizational transparency.',
    siteNotes: 'No active production or site visit required.',
    specs: {
      boardType: 'N/A',
      boardSupplier: 'N/A',
      doorType: 'N/A',
      doorSupplier: 'N/A',
      softClose: false,
      ledLighting: false,
      pushToOpen: false,
      glassDoors: false,
      stoneSupplier: 'N/A',
      stoneColour: 'N/A',
      stoneThickness: 'N/A',
      oven: 'N/A',
      hob: 'N/A',
      extractor: 'N/A',
      fridge: 'N/A'
    }
  },
  {
    id: 'KL-002',
    clientName: 'Gerard (Uitsig)',
    phone: '27833465449',
    email: 'gerard.uitsig@gmail.com',
    address: 'Eldoraigne, Centurion, 0157, South Africa',
    area: 'Eldoraigne',
    leadSource: 'Referral',
    status: '10 Installation Scheduled',
    nextAction: 'Installation Date Confirmed',
    health: 'On Track',
    statusSince: '2026-05-23T09:15:00Z',
    quoteValue: 44700,
    depositReceived: 26820, // 60% Deposit Received
    comments: 'Project categories: Scullery, Braai. Soft Close and Ball Bearing hardware features specified.',
    siteNotes: 'Ensure ball bearing runners are loaded in morning batch.',
    specs: {
      boardType: 'Moisture-resistant high-density MDF (18mm)',
      boardSupplier: 'PG Bison',
      doorType: 'SupaWood Frameless',
      doorSupplier: 'Kitchen Lab In-house',
      softClose: true,
      ledLighting: false,
      pushToOpen: false,
      glassDoors: false,
      stoneSupplier: 'N/A',
      stoneColour: 'N/A',
      stoneThickness: 'N/A',
      oven: 'N/A',
      hob: 'N/A',
      extractor: 'N/A',
      fridge: 'N/A'
    }
  },
  {
    id: 'KL-003',
    clientName: 'Charl Coetzer',
    phone: '27790581861',
    email: 'charl.coetzer@outlook.com',
    address: 'Hennopspark, Centurion, 0157, South Africa',
    area: 'Hennopspark',
    leadSource: 'Referral',
    status: '10 Installation Scheduled',
    nextAction: 'Installation Date Confirmed',
    health: 'On Track',
    statusSince: '2026-05-23T11:00:00Z',
    installationDate: '2026-05-25',
    quoteValue: 45000,
    depositReceived: 27000, // 60% Deposit Received
    comments: 'Project category: Kitchen. Fit sink after plumber does first-fix hookup.',
    siteNotes: 'Coordinate with plumber team on site for timing of sink installation.',
    specs: {
      boardType: 'Melamine Faced Board (18mm)',
      boardSupplier: 'PG Bison MelaWood',
      doorType: 'Linear Grain Slab',
      doorSupplier: 'Kitchen Lab stock',
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
    id: 'KL-004',
    clientName: 'Johan De Ru',
    phone: '27834318073',
    email: 'johan.deru@webmail.co.za',
    address: 'Montana, Pretoria, 0182, South Africa',
    area: 'Montana',
    leadSource: 'Referral',
    status: '9 Production',
    nextAction: 'In Production',
    health: 'Needs Attention', // Marked as delayed in CSV, so "Needs Attention" or "At Risk" is suitable
    statusSince: '2026-05-23T12:30:00Z',
    installationDate: '2026-06-01',
    quoteValue: 108240,
    depositReceived: 64944, // 60% Deposit Received
    comments: 'Project categories: Kitchen, Scullery. Caraz finishes, black kicks & handles. LED lights for kicks & display. Bulkhead & 3 pendulum lights. Slats Gelmar Maple. Iceberg white display with clear glass.',
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
    id: 'KL-005',
    clientName: 'Summerhaze',
    phone: '27843040022',
    email: 'projects@summerhaze.co.za',
    address: 'Sandton, Johannesburg, 2196, South Africa',
    area: 'Sandton',
    leadSource: 'Referral',
    status: '7 Awaiting Deposit',
    nextAction: 'Follow Up Deposit',
    health: 'On Track',
    statusSince: '2026-05-23T14:00:00Z',
    installationDate: '2026-06-15',
    quoteValue: 375000,
    depositReceived: 0, // No Deposit Received
    comments: 'Project category: Full House. High priority high value client.',
    siteNotes: 'Extremely detailed build. Awaiting signature and deposit clear before initiating cabinetry cutting lists.',
    specs: {
      boardType: 'Luxury Premium Board',
      boardSupplier: 'Egger South Africa',
      doorType: 'Bespoke Handleless Matte Lacque',
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
    id: 'KL-006',
    clientName: 'Fatima',
    phone: '27732110164',
    email: 'fatima.erasmia@mweb.co.za',
    address: 'Erasmia, Centurion, 0183, South Africa',
    area: 'Erasmia',
    leadSource: 'Referral',
    status: '7 Awaiting Deposit',
    nextAction: 'Follow Up Deposit',
    health: 'Needs Attention', // Delayed in CSV
    statusSince: '2026-05-23T15:10:00Z',
    quoteValue: 90000,
    depositReceived: 0,
    comments: 'Project categories: TV Room, Kitchenette, Main Bedroom Dresser, Walk-in Wardrobe. Special request: Secret Compartment inside walk-in wardrobe cupboard.',
    siteNotes: 'Need subtle hidden touch latch system for secret compartment.',
    specs: {
      boardType: 'MDF Core Supawood',
      boardSupplier: 'PG Bison',
      doorType: 'Shaker Painted Style',
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
    id: 'KL-007',
    clientName: 'Jabu Mahlangu',
    phone: '27824422780',
    email: 'jabu.mahlangu@gov.za',
    address: 'Summerset Estate, Midrand, 1682, South Africa',
    area: 'Summerset Estate',
    leadSource: 'Referral',
    status: '7 Awaiting Deposit',
    nextAction: 'Follow Up Deposit',
    health: 'Needs Attention', // Delayed in CSV
    statusSince: '2026-05-23T16:00:00Z',
    quoteValue: 29400,
    depositReceived: 0,
    comments: 'Project categories: TV Room, Bar, Entrance Hall.',
    siteNotes: 'Floating TV cabinet design with reinforced rear support studs.',
    specs: {
      boardType: 'Veneered Oak MDF',
      boardSupplier: 'PG Bison Wood finishes',
      doorType: 'Solid Oak Edged Slabs',
      doorSupplier: 'Kitchen Lab Workshop',
      softClose: true,
      ledLighting: true,
      pushToOpen: true,
      glassDoors: true,
      stoneSupplier: 'Sigma Quartz',
      stoneColour: 'Nero Marquino',
      stoneThickness: '20mm',
      oven: 'N/A',
      hob: 'N/A',
      extractor: 'N/A',
      fridge: 'Integrated beverage cooler'
    }
  },
  {
    id: 'KL-008',
    clientName: 'Jacqui Monteiro',
    phone: '27658110060',
    email: 'jacqui.m@cge.co.za',
    address: 'CGE Estate, Midrand, South Africa',
    area: 'CGE',
    leadSource: 'Referral',
    status: '8 Deposit Paid',
    nextAction: 'Final Measurements',
    health: 'On Track',
    statusSince: '2026-05-23T16:50:00Z',
    quoteValue: 31300,
    depositReceived: 18780, // 60% Deposit Paid
    comments: 'Project category: BIC (Built-in Cupboards).',
    siteNotes: 'Check ceiling levels across wardobe run during final measurements. Standard height is 2400.',
    specs: {
      boardType: 'MelaWood Linear Finishes',
      boardSupplier: 'PG Bison',
      doorType: 'Flat Slab Driftwood Melawood',
      doorSupplier: 'Kitchen Lab',
      softClose: true,
      ledLighting: false,
      pushToOpen: false,
      glassDoors: false,
      stoneSupplier: 'N/A',
      stoneColour: 'N/A',
      stoneThickness: 'N/A',
      oven: 'N/A',
      hob: 'N/A',
      extractor: 'N/A',
      fridge: 'N/A'
    }
  },
  {
    id: 'KL-009',
    clientName: 'Elaine Reed',
    phone: '27829253393',
    email: 'elaine.reed@gmail.com',
    address: 'CGE Estate, Midrand, South Africa',
    area: 'CGE',
    leadSource: 'Referral',
    status: '1 First Contact',
    nextAction: 'First Contact',
    health: 'On Track',
    statusSince: '2026-05-23T17:15:00Z',
    quoteValue: 140000, // Estimated Quote Value populated here
    depositReceived: 0,
    comments: 'Project category: Kitchen. Initial inquiry from high-value estate owner.',
    siteNotes: 'Standard kitchen layout request. Need scheduling first design consultation.',
    specs: {
      boardType: 'Moisture Resistant Particle Board',
      boardSupplier: 'PG Bison',
      doorType: 'Standard Wrap doors',
      doorSupplier: 'Gelmar / Kitchen Lab',
      softClose: true,
      ledLighting: false,
      pushToOpen: false,
      glassDoors: false,
      stoneSupplier: 'N/A',
      stoneColour: 'N/A',
      stoneThickness: 'N/A',
      oven: 'N/A',
      hob: 'N/A',
      extractor: 'N/A',
      fridge: 'N/A'
    }
  },
  {
    id: 'KL-010',
    clientName: 'Robin Stewart',
    phone: '27828997432',
    email: 'robin.stewart@absamail.co.za',
    address: 'Moreleta Park, Pretoria, 0181, South Africa',
    area: 'Moreletta',
    leadSource: 'Referral',
    status: '5 Design Phase',
    nextAction: 'Design Amendments',
    health: 'On Track',
    statusSince: '2026-05-23T17:45:00Z',
    quoteValue: 180000, // Estimated value used as quote value
    depositReceived: 0,
    comments: 'Project categories: Kitchen, Scullery.',
    siteNotes: 'Client wants classic shaker style painted with modern gold handles.',
    specs: {
      boardType: 'Supawood MDF',
      boardSupplier: 'Sonae Arauco',
      doorType: 'Classic Shaker Routed',
      doorSupplier: 'Kitchen Lab Custom Machinery',
      softClose: true,
      ledLighting: true,
      pushToOpen: false,
      glassDoors: true,
      stoneSupplier: 'Eezi Quartz SA',
      stoneColour: 'Magnolia Gold Quartz',
      stoneThickness: '20mm',
      oven: 'Bosch Series 6',
      hob: 'Bosch 900mm Gas',
      extractor: 'Bosch integrated extractor',
      fridge: 'Samsung Side by side'
    }
  },
  {
    id: 'KL-011',
    clientName: 'Ilse Doyer',
    phone: '27834028224',
    email: 'ilse.doyer@up.ac.za',
    address: 'Irene, Centurion, 0157, South Africa',
    area: 'Irene',
    leadSource: 'Referral',
    status: '1 First Contact',
    nextAction: 'First Contact',
    health: 'On Track',
    statusSince: '2026-05-23T18:00:00Z',
    quoteValue: 0,
    depositReceived: 0,
    comments: 'Project category: BIC. Scheduled call for wardrobe design needs.',
    siteNotes: 'Liaise over standard bedroom wardrobe configurations.',
    specs: {
      boardType: 'PG Bison BisonBord',
      boardSupplier: 'PG Bison',
      doorType: 'Standard white melamine slab doors',
      doorSupplier: 'Gelmar Standard Range',
      softClose: false,
      ledLighting: false,
      pushToOpen: false,
      glassDoors: false,
      stoneSupplier: 'N/A',
      stoneColour: 'N/A',
      stoneThickness: 'N/A',
      oven: 'N/A',
      hob: 'N/A',
      extractor: 'N/A',
      fridge: 'N/A'
    }
  },
  {
    id: 'KL-012',
    clientName: 'Fred Ferreira',
    phone: '27825618660',
    email: 'fred.f@lantic.co.za',
    address: 'Silver Lakes Golf Estate, Pretoria, 0081, South Africa',
    area: 'Silver Lakes',
    leadSource: 'Referral',
    status: '1 First Contact',
    nextAction: 'First Contact',
    health: 'On Track',
    statusSince: '2026-05-23T18:15:00Z',
    quoteValue: 0,
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
    id: 'KL-013',
    clientName: 'Jax Ponquette',
    phone: '27842828308',
    email: 'jax.pon@vodamail.co.za',
    address: 'Eldoraigne, Centurion, 0157, South Africa',
    area: 'Eldoraigne',
    leadSource: 'Referral',
    status: '1 First Contact',
    nextAction: 'First Contact',
    health: 'On Track',
    statusSince: '2026-05-23T18:30:00Z',
    quoteValue: 0,
    depositReceived: 0,
    comments: 'Project category: Bar. Glass shelving detail and new custom color scheme requested for home entertainment bar cupboard.',
    siteNotes: 'Bring glass and lacquer paint swatches to consultation.',
    specs: {
      boardType: 'Melamine Faced',
      boardSupplier: 'PG Bison',
      doorType: 'Glass with Aluminium frame profiles',
      doorSupplier: 'Gelmar Premium Elements',
      softClose: true,
      ledLighting: true,
      pushToOpen: false,
      glassDoors: true,
      stoneSupplier: 'N/A',
      stoneColour: 'N/A',
      stoneThickness: 'N/A',
      oven: 'N/A',
      hob: 'N/A',
      extractor: 'N/A',
      fridge: 'N/A'
    }
  },
  {
    id: 'KL-014',
    clientName: 'Jacques Tredoux',
    phone: '27732458307',
    email: 'jacques.tredoux@gmail.com',
    address: 'Elardus Park, Pretoria, 0181, South Africa',
    area: 'Elardus Park',
    leadSource: 'Referral',
    status: '1 First Contact',
    nextAction: 'First Contact',
    health: 'On Track',
    statusSince: '2026-05-23T19:00:00Z',
    quoteValue: 80000, // Estimated value used
    depositReceived: 0,
    comments: 'Project category: BIC. Standard bedroom storage replacement.',
    siteNotes: 'Determine if dry-wall removal is required first.',
    specs: {
      boardType: 'Melamine Chipboard',
      boardSupplier: 'PG Bison',
      doorType: 'Flat Slab White Melawood',
      doorSupplier: 'Gelmar Standard',
      softClose: false,
      ledLighting: false,
      pushToOpen: false,
      glassDoors: false,
      stoneSupplier: 'N/A',
      stoneColour: 'N/A',
      stoneThickness: 'N/A',
      oven: 'N/A',
      hob: 'N/A',
      extractor: 'N/A',
      fridge: 'N/A'
    }
  },
  {
    id: 'KL-015',
    clientName: 'Mariette Van Heerden',
    phone: '27833240331',
    email: 'mariette.vh@outlook.co.za',
    address: 'Eldoraigne, Centurion, 0157, South Africa',
    area: 'Eldoraigne',
    leadSource: 'Referral',
    status: '1 First Contact',
    nextAction: 'First Contact',
    health: 'On Track',
    statusSince: '2026-05-23T19:20:00Z',
    quoteValue: 50000, // Estimated value
    depositReceived: 0,
    comments: 'Project category: Kitchen Make-Over. Replacing doors & stone surfaces but retaining sturdy carcass frame layout.',
    siteNotes: 'Measure all existing carcasses to verify alignment or hinges condition prior to ordering faces.',
    specs: {
      boardType: 'Melamine Chipboard replacement fronts',
      boardSupplier: 'Sonae Arauco',
      doorType: 'Lacquered Shaker Doors',
      doorSupplier: 'Kitchen Lab In-house',
      softClose: true,
      ledLighting: false,
      pushToOpen: false,
      glassDoors: false,
      stoneSupplier: 'Connection Stones Pretoria',
      stoneColour: 'Absolute Black Granite',
      stoneThickness: '20mm',
      oven: 'Existing Retained',
      hob: 'Existing Retained',
      extractor: 'Existing Retained',
      fridge: 'Existing Retained'
    }
  },
  {
    id: 'KL-016',
    clientName: 'Farhana',
    phone: '27837975117',
    email: 'farhana.estate@lantic.net',
    address: 'Raslouw, Centurion, 0157, South Africa',
    area: 'Raslouw',
    leadSource: 'Referral',
    status: '2 Qualifying Lead',
    nextAction: 'Site Visit',
    health: 'At Risk', // Critical delayed
    statusSince: '2026-05-23T19:40:00Z',
    quoteValue: 2900000, // Estimated R2.9 Million ZAR
    depositReceived: 0,
    comments: 'Project category: Full House. 20 luxury residential apartments full house installation complexes as per Dave\'s detailed site masterplan.',
    siteNotes: 'Critical premium scale project. Requires dedicated site survey with David and Mark to confirm scope bounds.',
    specs: {
      boardType: 'Moisture resistant supreme boards',
      boardSupplier: 'PG Bison & Egger',
      doorType: 'Aesthetic J-Pull Matte Finish & Glass borders',
      doorSupplier: 'Kitchen Lab automated workshop division',
      softClose: true,
      ledLighting: true,
      pushToOpen: true,
      glassDoors: true,
      stoneSupplier: 'Caesarstone SA Partner Premium',
      stoneColour: 'Calacatta Nuvo Quartz',
      stoneThickness: '20mm',
      oven: 'BOSCH Premium integrated packs',
      hob: 'BOSCH Induction packs',
      extractor: 'BOSCH Glass-accented extraction canopy',
      fridge: 'Integrated premium refrigeration'
    }
  }
];

export const INITIAL_TASKS: Task[] = [
  // Setup standard workflow tasks across historical projects
  // KL-002: Gerard (Installation Scheduled)
  { id: 'T201', jobId: 'KL-002', stage: 'Design', taskName: 'Design Outline approved by Gerard', complete: true },
  { id: 'T202', jobId: 'KL-002', stage: 'Design', taskName: 'Detailed laser site survey verified', complete: true },
  { id: 'T203', jobId: 'KL-002', stage: 'Financials', taskName: 'Quote sent R44,700', complete: true },
  { id: 'T204', jobId: 'KL-002', stage: 'Financials', taskName: 'Secure 60% Deposit (R26,820) cleared', complete: true },
  { id: 'T205', jobId: 'KL-002', stage: 'Production', taskName: 'Cutting list and Soft Close / Ball bearing hardware pack sourced', complete: true },
  { id: 'T206', jobId: 'KL-002', stage: 'Production', taskName: 'Assembled in workshop', complete: true },
  { id: 'T207', jobId: 'KL-002', stage: 'Installation', taskName: 'Transport load allocated & scheduled', complete: false },
  { id: 'T208', jobId: 'KL-002', stage: 'Installation', taskName: 'Assemble on site & level carcasses', complete: false },

  // KL-003: Charl Coetzer (Installation Scheduled)
  { id: 'T301', jobId: 'KL-003', stage: 'Design', taskName: 'Client layout design signed off', complete: true },
  { id: 'T302', jobId: 'KL-003', stage: 'Financials', taskName: '60% Deposit (R27,000) cleared', complete: true },
  { id: 'T303', jobId: 'KL-003', stage: 'Production', taskName: 'Carcasses assembled', complete: true },
  { id: 'T304', jobId: 'KL-003', stage: 'Installation', taskName: 'Load and dispatch delivery van', complete: true },
  { id: 'T305', jobId: 'KL-003', stage: 'Installation', taskName: 'Fit sink immediately after plumber completes connection', complete: false },

  // KL-004: Johan De Ru (In Production, Delayed)
  { id: 'T401', jobId: 'KL-004', stage: 'Design', taskName: 'Slab layout Gelmar Maple and Iceberg approved', complete: true },
  { id: 'T402', jobId: 'KL-004', stage: 'Financials', taskName: 'Contract Value R108,240, Deposit R64,944 received', complete: true },
  { id: 'T403', jobId: 'KL-004', stage: 'Production', taskName: 'Produce custom high-gloss kicks with LED profile recess', complete: false },
  { id: 'T404', jobId: 'KL-004', stage: 'Production', taskName: 'Acquire Gelmar Maple slats & clear glass insert panels', complete: false },
  { id: 'T405', jobId: 'KL-004', stage: 'Production', taskName: 'Source 3 pendulum lights and custom bulkhead sheets', complete: false },

  // KL-005: Summerhaze (Awaiting Deposit)
  { id: 'T501', jobId: 'KL-005', stage: 'Design', taskName: '3D high-fidelity layout rendering approved', complete: true },
  { id: 'T502', jobId: 'KL-005', stage: 'Financials', taskName: 'Send comprehensive full-house proposal (R375,000)', complete: true },
  { id: 'T503', jobId: 'KL-005', stage: 'Financials', taskName: 'Clear 60% booking deposit (R225,000) to schedule factory board delivery', complete: false },

  // KL-006: Fatima (Awaiting Deposit)
  { id: 'T601', jobId: 'KL-006', stage: 'Design', taskName: 'TV room & wardrobe design with Secret Compartment signed off', complete: true },
  { id: 'T602', jobId: 'KL-006', stage: 'Financials', taskName: 'SLA agreement dispatched (R90,000)', complete: true },
  { id: 'T603', jobId: 'KL-006', stage: 'Financials', taskName: 'Wait for down-payment to activate cabinetry queue', complete: false },

  // KL-007: Jabu Mahlangu (Awaiting Deposit)
  { id: 'T701', jobId: 'KL-007', stage: 'Design', taskName: 'Bar layout & Entrance floating cabinet 3D mockups complete', complete: true },
  { id: 'T702', jobId: 'KL-007', stage: 'Financials', taskName: 'Quote sent (R29,400)', complete: true },
  { id: 'T703', jobId: 'KL-007', stage: 'Financials', taskName: 'Awaiting deposit', complete: false },

  // KL-008: Jacqui Monteiro (Deposit Paid)
  { id: 'T801', jobId: 'KL-008', stage: 'Design', taskName: 'Wardrobe BIC outline approved', complete: true },
  { id: 'T808', jobId: 'KL-008', stage: 'Financials', taskName: 'Clear R18,780 booking deposit', complete: true },
  { id: 'T803', jobId: 'KL-008', stage: 'Design', taskName: 'Perform final on-site millimetre precision measurements', complete: false },

  // KL-010: Robin Stewart (Design Phase)
  { id: 'T1001', jobId: 'KL-010', stage: 'Design', taskName: 'Capture wishlist and scullery configurations', complete: true },
  { id: 'T1002', jobId: 'KL-010', stage: 'Design', taskName: 'Draft initial floor layouts', complete: true },
  { id: 'T1003', jobId: 'KL-010', stage: 'Design', taskName: 'Implement requested customer design amendments', complete: false },

  // KL-016: Farhana (Qualifying Lead)
  { id: 'T1601', jobId: 'KL-016', stage: 'Design', taskName: 'Analyze Dave\'s 20-unit masterplan notes', complete: true },
  { id: 'T1602', jobId: 'KL-016', stage: 'Design', taskName: 'Schedule complex site visit with David and Mark to verify scope bounds', complete: false }
];

export const INITIAL_FINANCIALS: FinancialRecord[] = [
  // Populate the 60% deposits already received
  {
    id: 'F201',
    jobId: 'KL-002',
    type: 'payment',
    amount: 26820,
    date: '2026-05-23',
    description: 'Received 60% production deposit (Gerard Uitsig)',
    category: 'Booking Deposit Received'
  },
  {
    id: 'F301',
    jobId: 'KL-003',
    type: 'payment',
    amount: 27000,
    date: '2026-05-23',
    description: 'Received 60% booking deposit (Charl Coetzer)',
    category: 'Booking Deposit Received'
  },
  {
    id: 'F401',
    jobId: 'KL-004',
    type: 'payment',
    amount: 64944,
    date: '2026-05-23',
    description: 'Received 60% production deposit (Johan De Ru)',
    category: 'Booking Deposit Received'
  },
  {
    id: 'F801',
    jobId: 'KL-008',
    type: 'payment',
    amount: 18780,
    date: '2026-05-23',
    description: 'Received 60% production deposit (Jacqui Monteiro)',
    category: 'Booking Deposit Received'
  },
  // Add some realistic material and hardware expenses to show project health dynamics
  {
    id: 'F402',
    jobId: 'KL-004',
    type: 'expense',
    amount: 24500,
    date: '2026-05-24',
    description: 'Ordered Gelmar Maple cabinetry slats and handles',
    category: 'Hardware'
  },
  {
    id: 'F403',
    jobId: 'KL-004',
    type: 'expense',
    amount: 18000,
    date: '2026-05-25',
    description: 'Paid initial deposit to Caraz Stone mason',
    category: 'Stones & Solid Surfaces'
  }
];

export const INITIAL_FILES: VaultFile[] = [
  {
    id: 'V101',
    jobId: 'KL-004',
    type: 'render',
    name: 'Montana_Kitchen_Bulkhead_Concept.png',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop',
    uploadedAt: '2026-05-23T11:00:00Z'
  },
  {
    id: 'V102',
    jobId: 'KL-004',
    type: 'photo',
    name: 'Site_Ceiling_Verification_Pre_Assembly.jpg',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop',
    uploadedAt: '2026-05-23T12:00:00Z'
  },
  {
    id: 'V201',
    jobId: 'KL-005',
    type: 'render',
    name: 'Sandton_FullHouse_Panoramic_Draft.png',
    url: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&auto=format&fit=crop',
    uploadedAt: '2026-05-23T14:30:00Z'
  }
];

export const INITIAL_NOTES: JobNote[] = [
  {
    id: 'N201',
    jobId: 'KL-002',
    author: 'David (Creative Director)',
    content: 'Gerard wants to ensure the Scullery integrates smoothly into the Braai entertainment path. Mark must pack standard waterproof trim buffers.',
    createdAt: '2026-05-23T10:00:00Z'
  },
  {
    id: 'N301',
    jobId: 'KL-003',
    author: 'Mark (Installer)',
    content: 'Client specifically requests sink fitted the afternoon of 25th May post plumber first fix. Confirming plumber completes in-line standard before noon.',
    createdAt: '2026-05-23T11:15:00Z'
  },
  {
    id: 'N401',
    jobId: 'KL-004',
    author: 'David (Creative Director)',
    content: 'Bulkhead & 3 pendulum lights must align dead-center over the Gelmar Maple island. Added clear glass shelves on the white display towers.',
    createdAt: '2026-05-23T13:00:00Z'
  },
  {
    id: 'N601',
    jobId: 'KL-006',
    author: 'David (Creative Director)',
    content: 'Fatima requested a highly secure secret compartment inside the wardrobe backing. Keep it concealed behind a push-to-open faux skirt panel.',
    createdAt: '2026-05-23T15:20:00Z'
  }
];
