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
  name: 'SC VOLCANOES',
  shortName: 'SC VOLCANOES',
  legalName: 'VOLCANOES SPORTS CLUB', // ⚠️ placeholder — confirm

  nickname: 'The Kabiranyumas',

  shortCode: 'SCV',

  competitionName: 'FUFA Big League',

  tagline: 'Sine Limitibus',

  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.sc-volcanoes.example',

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

  brand: {
    white: '#FFFFFF',
    charcoal: '#18181A',
    accent: '#C8102E',
    cyan: '#0083A3',
    gold: '#C9A227',
    earth: '#4A3524',
  },
} as const;