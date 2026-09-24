import type { Config } from 'tailwindcss';

/**
 * DESIGN SYSTEM — Volcanoes FC
 * ────────────────────────────
 * Official identity: dark charcoal (primary base) / crimson red (primary
 * accent) / bright cyan (secondary accent) / muted gold (warm accent) /
 * white (neutral light) / dark earth brown (neutral dark).
 * Every color below composes an `R G B` CSS variable (see globals.css)
 * with Tailwind's <alpha-value> placeholder, so opacity modifiers like
 * `bg-accent/10` work. Token NAMES are shared between light and dark
 * mode — only the underlying CSS variable values differ (see the
 * `.dark` block in globals.css) — so components should almost never
 * need a `dark:` prefixed color class.
 *
 * Full rationale, usage rules, and elite-club references: DESIGN_SYSTEM.md
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          muted: 'rgb(var(--color-surface-muted) / <alpha-value>)',
          raised: 'rgb(var(--color-surface-raised) / <alpha-value>)',
        },
        charcoal: {
          DEFAULT: 'rgb(var(--color-charcoal) / <alpha-value>)',
          light: 'rgb(var(--color-charcoal-light) / <alpha-value>)',
        },
        cyan: {
          DEFAULT: 'rgb(var(--color-cyan) / <alpha-value>)',
          dark: 'rgb(var(--color-cyan-dark) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          dark: 'rgb(var(--color-accent-dark) / <alpha-value>)',
        },
        gold: {
          DEFAULT: 'rgb(var(--color-gold) / <alpha-value>)',
          dark: 'rgb(var(--color-gold-dark) / <alpha-value>)',
        },
        earth: {
          DEFAULT: 'rgb(var(--color-earth) / <alpha-value>)',
          light: 'rgb(var(--color-earth-light) / <alpha-value>)',
        },
        ink: 'rgb(var(--color-ink) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        card: '0.875rem',
      },
      maxWidth: {
        content: '1280px',
      },
      boxShadow: {
        card: '0 1px 2px rgb(16 24 43 / 0.04), 0 4px 12px rgb(16 24 43 / 0.06)',
        raised: '0 8px 24px rgb(16 24 43 / 0.10)',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
        fast: '120ms',
        slow: '320ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
