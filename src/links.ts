// Public site that hosts the legal pages (generated into public/ by scripts/build-legal.mjs).
// Change this when the site moves to its own domain, and update legal.config.json too.
export const SITE_URL = 'https://mirkoori.github.io/waooo';
export const LEGAL_LINKS = [
  { label: 'Privacy Policy', url: `${SITE_URL}/privacy/` },
  { label: 'Terms of Use', url: `${SITE_URL}/terms/` },
  { label: 'Support', url: `${SITE_URL}/support/` },
];
