/**
 * Central navigation config for the public site.
 *
 * Both the desktop Navbar and the mobile menu render from this single
 * source, so adding/reordering a nav item never requires touching more
 * than this file. Routes here follow the folder structure defined in the
 * architecture doc §3 — pages will be built out feature-by-feature in
 * later phases, but the paths are final so links won't need to change.
 */
export interface NavLink {
  label: string;
  href: string;
  /** Short supporting copy shown in the desktop mega menu (optional — plain dropdowns omit it). */
  description?: string;
}

export interface NavItem {
  label: string;
  href?: string;
  children?: NavLink[];
  /** Render `children` as a rich multi-column MegaMenu instead of a plain dropdown. */
  mega?: boolean;
  /** Optional promo panel shown alongside the columns in mega mode (e.g. "Buy Tickets"). */
  featured?: {
    title: string;
    description: string;
    href: string;
    ctaLabel?: string;
  };
}

/**
 * Primary nav intentionally kept to the requested 8-item structure
 * (Home / Club / Team / Fixtures & Results / News / Media / Sponsors /
 * Contact) for clarity. Shop, Tickets, and Membership still exist as
 * real pages (Membership is promoted via Club's featured panel below;
 * all three remain reachable from FOOTER_NAV and homepage CTAs) — they
 * were deliberately left out of the primary bar rather than crowding it,
 * not removed from the site.
 */
export const PRIMARY_NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Club',
    mega: true,
    children: [
      { label: 'History', href: '/club/history', description: 'Our story since founding.' },
      { label: 'Vision & Mission', href: '/club/vision-mission', description: 'What we stand for.' },
      { label: 'Management', href: '/club/management', description: 'Board and club leadership.' },
      { label: 'Technical Staff', href: '/club/technical-staff', description: 'Coaching and medical team.' },
    ],
    featured: {
      title: 'Fan Membership',
      description: 'Become a member and back Volcanoes FC all season long.',
      href: '/membership',
      ctaLabel: 'Join now',
    },
  },
  {
    label: 'Team',
    children: [{ label: 'Squad', href: '/team' }],
  },
  {
    label: 'Fixtures & Results',
    mega: true,
    children: [
      { label: 'Fixtures', href: '/fixtures', description: 'Upcoming matches.' },
      { label: 'Results', href: '/results', description: 'Recent match results.' },
      { label: 'League Table', href: '/table', description: 'Current FUFA Big League standings.' },
    ],
    featured: {
      title: 'Next Match',
      description: 'See kickoff time, venue, and how to get tickets.',
      href: '/fixtures',
      ctaLabel: 'View fixture',
    },
  },
  { label: 'News', href: '/news' },
  {
    label: 'Media',
    children: [
      { label: 'Photos', href: '/gallery' },
      { label: 'Videos', href: '/videos' },
      { label: 'Match Reports', href: '/match-reports' },
    ],
  },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'Contact', href: '/contact' },
];

export const FOOTER_NAV: NavLink[] = [
  { label: 'History', href: '/club/history' },
  { label: 'Team', href: '/team' },
  { label: 'Fixtures', href: '/fixtures' },
  { label: 'News', href: '/news' },
  { label: 'Sponsors', href: '/sponsors' },
  { label: 'Shop', href: '/shop' },
  { label: 'Tickets', href: '/tickets' },
  { label: 'Membership', href: '/membership' },
  { label: 'Contact', href: '/contact' },
];

// ⚠️ CLUB INPUT NEEDED: real social media links (architecture doc §7.4).
// Left empty (not fabricated) so the Footer can simply not render an icon
// until a URL is provided here.
export const SOCIAL_LINKS: { platform: string; url: string }[] = [];

export const ADMIN_NAV: NavItem[] = [
  { label: 'Dashboard', href: '/admin' },
  {
    label: 'Content',
    children: [
      { label: 'News & Articles', href: '/admin/news' },
      { label: 'Gallery', href: '/admin/gallery' },
      { label: 'Videos', href: '/admin/videos' },
      { label: 'Media Library', href: '/admin/media' },
    ],
  },
  {
    label: 'Football',
    children: [
      { label: 'Players', href: '/admin/players' },
      { label: 'Fixtures & Results', href: '/admin/fixtures' },
    ],
  },
  {
    label: 'Club',
    children: [
      { label: 'Staff', href: '/admin/staff' },
      { label: 'Sponsors', href: '/admin/sponsors' },
      { label: 'Settings', href: '/admin/settings' },
    ],
  },
  {
    label: 'Engagement',
    children: [
      { label: 'Inbox', href: '/admin/messages' },
      { label: 'Newsletter', href: '/admin/newsletter' },
    ],
  },
  {
    label: 'Administration',
    children: [
      { label: 'Users & Roles', href: '/admin/users' },
      { label: 'Activity Log', href: '/admin/activity-log' },
    ],
  },
];
