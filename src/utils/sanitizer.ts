const REPLACEMENTS: { lookup: RegExp; replace: string }[] = [
  // Full names + descriptions
  { lookup: /Gerard \(Uitsig\)/gi, replace: 'Alpha Estates Scullery' },
  { lookup: /Gerard Uitsig/gi, replace: 'Alpha Estates Scullery' },
  { lookup: /Charl Coetzer/gi, replace: 'Coastal Driftwood Townhouse' },
  { lookup: /Johan De Ru/gi, replace: 'Prestige Obsidian Kitchen & Scullery' },
  { lookup: /Johan de Ru/gi, replace: 'Prestige Obsidian Kitchen & Scullery' },
  { lookup: /Fred Ferreira/gi, replace: 'Legacy Solid Mahogany Home Bar' },
  { lookup: /Sipho Dlamini/gi, replace: 'Eldoraigne Entertainment Bar' },
  { lookup: /Fatima \(Erasmia\)/gi, replace: 'Secret Latch Wardrobe Suite' },

  // Emails
  { lookup: /gerard\.uitsig@gmail\.com/gi, replace: 'projects@alphaestatescullery.co.za' },
  { lookup: /charl\.coetzer@outlook\.com/gi, replace: 'coastal.driftwood@fictional.com' },
  { lookup: /johan\.deru@webmail\.co\.za/gi, replace: 'prestige.obsidian@fictional.com' },
  { lookup: /fred\.f@lantic\.co\.za/gi, replace: 'entertainment@legacygolfestate.co.za' },
  { lookup: /sipho\.dlamini@outlook\.com/gi, replace: 'entertainment.bar@fictional.com' },
  { lookup: /fatima\.erasmia@mweb\.co\.za/gi, replace: 'wardrobesuite@secretlatch.com' },

  // Single names in specific contexts / word bounds
  { lookup: /\bGerard\b/gi, replace: 'Alpha Estates' },
  { lookup: /\bCharl\b/gi, replace: 'Coastal Driftwood' },
  { lookup: /\bJohan\b/gi, replace: 'Prestige Obsidian' },
  { lookup: /\bFred\b/gi, replace: 'Legacy' },
  { lookup: /\bSipho\b/gi, replace: 'Eldoraigne' },
  { lookup: /\bFatima\b/gi, replace: 'Secret Latch' },
];

export function sanitizeString(val: string): string {
  if (!val || typeof val !== 'string') return val;
  let result = val;
  for (const r of REPLACEMENTS) {
    result = result.replace(r.lookup, r.replace);
  }
  return result;
}

export function sanitizeObject<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') {
    return sanitizeString(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const newObj = {} as any;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = sanitizeObject((obj as any)[key]);
      }
    }
    return newObj as T;
  }
  return obj;
}
