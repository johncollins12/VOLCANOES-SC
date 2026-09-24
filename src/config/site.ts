/**
 * Site-wide constants.
 *
 * This is the ONE file to edit when the club provides real identity details
 * (architecture doc §7.1). Every component that needs the club name, colors,
 * or contact info should import from here — never hardcode these values
 * inline in a component.
 *
 * ⚠️ = placeholder awaiting real club input. Do not treat these as final.
 */
export const SITE_CONFIG = {
  name: 'Volcanoes FC',
  shortName: 'Volcanoes FC',
  // Standard, non-fabricated expansion of "FC" — confirm exact legal
  // registration name with the club before treating this as official.
  legalName: 'Volcanoes Football Club', // ⚠️ placeholder — confirm

  // "VFC" — used for the crest monogram and anywhere space is tight.
  shortCode: 'VFC',

  // Confirmed: Volcanoes FC competes in the FUFA Big League, Uganda's
  // second tier. Not a placeholder — this is real, given information.
  competitionName: 'FUFA Big League',

  tagline: '', // ⚠️ CLUB INPUT NEEDED: official motto/slogan — none provided, not invented

  // ⚠️ No real domain has been configured for this project yet (see
  // docs/DEPLOYMENT.md). NEXT_PUBLIC_SITE_URL is read first so a real
  // deployment overrides this automatically; the fallback uses the
  // IANA-reserved `.example` TLD specifically so it can never resolve to
  // a real, unrelated site if this ever ships unconfigured — deliberately
  // NOT a plausible invented domain like "volcanoesfc.ug".
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.volcanoes-fc.example',

  foundedYear: null as number | null, // ⚠️ CLUB INPUT NEEDED

  stadium: {
    name: '', // ⚠️ CLUB INPUT NEEDED
    address: '', // ⚠️ CLUB INPUT NEEDED
  },

  contact: {
    email: '', // ⚠️ CLUB INPUT NEEDED
    phone: '', // ⚠️ CLUB INPUT NEEDED
    address: '', // ⚠️ CLUB INPUT NEEDED
  },

  // Official identity, confirmed brand roles: dark charcoal (primary
  // base) / crimson red (primary accent) / bright cyan (secondary
  // accent) / muted gold (warm accent) / white (neutral light) / dark
  // earth brown (neutral dark). Same palette as the CSS variables in
  // globals.css (stored here as hex instead of RGB channels, since
  // non-CSS contexts — generated Open Graph images, PDF exports —
  // usually want a plain hex string). Exact shades are our proposed
  // premium tones for that identity — confirm against an official brand
  // guideline/kit if one exists.
  brand: {
    white: '#FFFFFF',
    charcoal: '#18181A', // primary base
    accent: '#C8102E', // primary accent — crimson red
    cyan: '#0083A3', // secondary accent — bright cyan blue
    gold: '#C9A227', // warm accent — muted gold
    earth: '#4A3524', // neutral dark — dark earth brown
  },
} as const;
